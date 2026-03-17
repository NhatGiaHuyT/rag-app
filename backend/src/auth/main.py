from contextlib import asynccontextmanager
import logging
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

from common.api_utils import create_api
from common.auth_utils import get_current_user
from .models import Base, User, Conversation, Message, Document, DocumentPermission, SystemStats
from .service import authenticate_user, create_user, create_access_token, get_user

# Database setup
DATABASE_URL = "sqlite:///./data/auth.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create default admin user if it doesn't exist
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            from .service import create_user
            create_user(db, "admin", "admin@ragapp.com", "admin", "admin")
            logger.info("Default admin user created (username: admin, password: admin)")
    except Exception as e:
        logger.error(f"Error creating default admin user: {e}")
    finally:
        db.close()
    
    logger.info("Auth service started")
    yield
    logger.info("Auth service shutting down")

app = create_api(title="RAG Auth Service", lifespan=lifespan)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "user"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class ConversationCreate(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    rating: Optional[int]
    feedback: Optional[str]
    is_manual: bool

class MessageFeedback(BaseModel):
    rating: int
    feedback: Optional[str] = None

class DocumentCreate(BaseModel):
    filename: str
    file_path: str
    file_size: int

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    uploaded_by: int
    uploaded_at: datetime
    is_active: bool

class DocumentPermissionCreate(BaseModel):
    user_id: int
    can_read: bool = True

class DocumentPermissionResponse(BaseModel):
    id: int
    document_id: int
    user_id: int
    can_read: bool
    granted_by: int
    granted_at: datetime

class SystemStatsResponse(BaseModel):
    total_users: int
    total_documents: int
    total_conversations: int
    total_questions: int
    average_rating: float

class ManualAnswerRequest(BaseModel):
    content: str

# Helper function to check admin role
def require_admin(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=403, detail="User not found")
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user.username

@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    db_user = create_user(db, user.username, user.email, user.password)
    access_token = create_access_token(data={"sub": db_user.username, "user_id": db_user.id})
    return Token(access_token=access_token, token_type="bearer")

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
    return Token(access_token=access_token, token_type="bearer")

@app.get("/me", response_model=UserResponse)
def get_me(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=user.id, username=user.username, email=user.email, role=user.role, is_active=user.is_active, created_at=user.created_at)

# Conversation endpoints
@app.post("/conversations", response_model=ConversationResponse)
def create_conversation(conv: ConversationCreate, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_conv = Conversation(user_id=user.id, title=conv.title)
    db.add(db_conv)
    db.commit()
    db.refresh(db_conv)
    return ConversationResponse(id=db_conv.id, title=db_conv.title, created_at=db_conv.created_at, updated_at=db_conv.updated_at)

@app.get("/conversations", response_model=list[ConversationResponse])
def get_conversations(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conversations = db.query(Conversation).filter(Conversation.user_id == user.id).order_by(Conversation.updated_at.desc()).all()
    return [ConversationResponse(id=c.id, title=c.title, created_at=c.created_at, updated_at=c.updated_at) for c in conversations]

@app.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_conversation_messages(conversation_id: int, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return [MessageResponse(id=m.id, role=m.role, content=m.content, created_at=m.created_at) for m in messages]

@app.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
def add_message(conversation_id: int, message: MessageCreate, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db_message = Message(conversation_id=conversation_id, role="user", content=message.content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()
    db.commit()
    
    return MessageResponse(id=db_message.id, role=db_message.role, content=db_message.content, created_at=db_message.created_at, rating=None, feedback=None, is_manual=False)

@app.put("/messages/{message_id}/feedback")
def add_message_feedback(message_id: int, feedback: MessageFeedback, current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    message = db.query(Message).join(Conversation).filter(
        Message.id == message_id,
        Conversation.user_id == user.id,
        Message.role == "assistant"
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found or not authorized")
    
    message.rating = feedback.rating
    message.feedback = feedback.feedback
    db.commit()
    
    return {"message": "Feedback submitted successfully"}

# Admin endpoints
@app.get("/admin/users", response_model=List[UserResponse])
def get_all_users(admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserResponse(
        id=u.id, username=u.username, email=u.email, 
        role=u.role, is_active=u.is_active, created_at=u.created_at
    ) for u in users]

@app.post("/admin/users", response_model=UserResponse)
def create_user_admin(user: UserCreate, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = get_user(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    admin = db.query(User).filter(User.username == admin_user).first()
    db_user = create_user(db, user.username, user.email, user.password, user.role)
    return UserResponse(
        id=db_user.id, username=db_user.username, email=db_user.email,
        role=db_user.role, is_active=db_user.is_active, created_at=db_user.created_at
    )

@app.put("/admin/users/{user_id}", response_model=UserResponse)
def update_user_admin(user_id: int, user_update: UserCreate, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if username is taken by another user
    existing_user = db.query(User).filter(User.username == user_update.username, User.id != user_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    db_user.username = user_update.username
    db_user.email = user_update.email
    if user_update.password:
        from .service import get_password_hash
        db_user.hashed_password = get_password_hash(user_update.password)
    db_user.role = user_update.role
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id, username=db_user.username, email=db_user.email,
        role=db_user.role, is_active=db_user.is_active, created_at=db_user.created_at
    )

@app.delete("/admin/users/{user_id}")
def delete_user_admin(user_id: int, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

# Document management endpoints
@app.post("/admin/documents", response_model=DocumentResponse)
def create_document(doc: DocumentCreate, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    admin = db.query(User).filter(User.username == admin_user).first()
    
    db_doc = Document(
        filename=doc.filename,
        file_path=doc.file_path,
        file_size=doc.file_size,
        uploaded_by=admin.id
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    return DocumentResponse(
        id=db_doc.id, filename=db_doc.filename, file_size=db_doc.file_size,
        uploaded_by=db_doc.uploaded_by, uploaded_at=db_doc.uploaded_at, is_active=db_doc.is_active
    )

@app.get("/admin/documents", response_model=List[DocumentResponse])
def get_all_documents(admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return [DocumentResponse(
        id=d.id, filename=d.filename, file_size=d.file_size,
        uploaded_by=d.uploaded_by, uploaded_at=d.uploaded_at, is_active=d.is_active
    ) for d in documents]

@app.delete("/admin/documents/{document_id}")
def delete_document(document_id: int, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(db_doc)
    db.commit()
    return {"message": "Document deleted successfully"}

# Document permissions
@app.post("/admin/documents/{document_id}/permissions", response_model=DocumentPermissionResponse)
def grant_document_permission(document_id: int, perm: DocumentPermissionCreate, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    # Check if document exists
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if user exists
    user = db.query(User).filter(User.id == perm.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    admin = db.query(User).filter(User.username == admin_user).first()
    
    # Check if permission already exists
    existing_perm = db.query(DocumentPermission).filter(
        DocumentPermission.document_id == document_id,
        DocumentPermission.user_id == perm.user_id
    ).first()
    
    if existing_perm:
        existing_perm.can_read = perm.can_read
        db.commit()
        db.refresh(existing_perm)
        return DocumentPermissionResponse(
            id=existing_perm.id, document_id=existing_perm.document_id,
            user_id=existing_perm.user_id, can_read=existing_perm.can_read,
            granted_by=existing_perm.granted_by, granted_at=existing_perm.granted_at
        )
    
    db_perm = DocumentPermission(
        document_id=document_id,
        user_id=perm.user_id,
        can_read=perm.can_read,
        granted_by=admin.id
    )
    db.add(db_perm)
    db.commit()
    db.refresh(db_perm)
    
    return DocumentPermissionResponse(
        id=db_perm.id, document_id=db_perm.document_id,
        user_id=db_perm.user_id, can_read=db_perm.can_read,
        granted_by=db_perm.granted_by, granted_at=db_perm.granted_at
    )

@app.get("/documents", response_model=List[DocumentResponse])
def get_user_documents(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get documents user has permission to access
    permissions = db.query(DocumentPermission).filter(DocumentPermission.user_id == user.id).all()
    doc_ids = [p.document_id for p in permissions]
    
    documents = db.query(Document).filter(Document.id.in_(doc_ids), Document.is_active == True).all()
    return [DocumentResponse(
        id=d.id, filename=d.filename, file_size=d.file_size,
        uploaded_by=d.uploaded_by, uploaded_at=d.uploaded_at, is_active=d.is_active
    ) for d in documents]

@app.get("/documents/ids", response_model=List[int])
def get_user_document_ids(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get documents user has permission to access
    permissions = db.query(DocumentPermission).filter(DocumentPermission.user_id == user.id).all()
    doc_ids = [p.document_id for p in permissions]
    
    return doc_ids

# Manual answer endpoint (for experts)
@app.post("/admin/messages/{message_id}/manual-answer", response_model=MessageResponse)
def provide_manual_answer(message_id: int, answer: ManualAnswerRequest, admin_user: int = Depends(require_admin), db: Session = Depends(get_db)):
    # Find the original message
    message = db.query(Message).filter(Message.id == message_id, Message.role == "user").first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Create manual answer
    manual_answer = Message(
        conversation_id=message.conversation_id,
        role="expert",
        content=answer.content,
        is_manual=True
    )
    db.add(manual_answer)
    db.commit()
    db.refresh(manual_answer)
    
    # Update conversation timestamp
    conversation = db.query(Conversation).filter(Conversation.id == message.conversation_id).first()
    conversation.updated_at = datetime.utcnow()
    db.commit()
    
    return MessageResponse(
        id=manual_answer.id, role=manual_answer.role, content=manual_answer.content,
        created_at=manual_answer.created_at, rating=None, feedback=None, is_manual=True
    )

@app.get("/admin/conversations", response_model=List[ConversationResponse])
def get_all_conversations(admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    conversations = db.query(Conversation).order_by(Conversation.updated_at.desc()).all()
    return [ConversationResponse(id=c.id, title=c.title, created_at=c.created_at, updated_at=c.updated_at) for c in conversations]

@app.get("/admin/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages_admin(conversation_id: int, admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return [MessageResponse(id=m.id, role=m.role, content=m.content, created_at=m.created_at, rating=m.rating, feedback=m.feedback, is_manual=m.is_manual) for m in messages]
@app.get("/admin/stats", response_model=SystemStatsResponse)
def get_system_stats(admin_user: str = Depends(require_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_documents = db.query(Document).filter(Document.is_active == True).count()
    total_conversations = db.query(Conversation).count()
    total_questions = db.query(Message).filter(Message.role == "user").count()
    
    # Calculate average rating
    avg_rating_result = db.query(func.avg(Message.rating)).filter(Message.rating.isnot(None)).first()
    average_rating = float(avg_rating_result[0]) if avg_rating_result[0] else 0.0
    
    return SystemStatsResponse(
        total_users=total_users,
        total_documents=total_documents,
        total_conversations=total_conversations,
        total_questions=total_questions,
        average_rating=round(average_rating, 2)
    )

@app.get("/health")
def health():
    return {"status": "healthy"}
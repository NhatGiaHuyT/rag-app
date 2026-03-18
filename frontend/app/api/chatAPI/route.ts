import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Redirect chatAPI to RAG search endpoint for proper backend integration
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const searchResponse = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({
        query: body.inputCode || body.query || body.message || '',
        conversation_history: body.conversation_history || [],
      }),
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.text();
      return NextResponse.json({ error: errorData || 'Search service unavailable' }, { status: searchResponse.status });
    }

    const data = await searchResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('ChatAPI proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const runtime = 'edge';

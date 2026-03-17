import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversation_id: string }> }) {
  try {
    const { conversation_id } = await params;
    const authHeader = request.headers.get('authorization');
    const response = await fetch(`http://auth_service:8003/admin/conversations/${conversation_id}/messages`, {
      headers: {
        'Authorization': authHeader || '',
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
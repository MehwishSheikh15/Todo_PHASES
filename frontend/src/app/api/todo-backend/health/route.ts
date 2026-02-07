import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test connection to the TodoApp backend
    const response = await fetch('http://127.0.0.1:8001/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return Response.json({
        status: 'healthy',
        message: 'Connected to TodoApp backend successfully',
        backendUrl: 'http://127.0.0.1:8001',
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({
        status: 'unhealthy',
        message: 'TodoApp backend responded but with an error',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({
      status: 'unhealthy',
      message: 'Cannot connect to TodoApp backend',
      details: (error as Error).message,
      backendUrl: 'http://127.0.0.1:8001',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
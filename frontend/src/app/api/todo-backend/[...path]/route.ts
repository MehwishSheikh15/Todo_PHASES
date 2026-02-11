import { NextRequest, NextResponse } from 'next/server';

// Utility to safely convert headers to plain object
function headersToObject(headers: Headers) {
  return Object.fromEntries(headers.entries());
}

// Helper to build subpath
async function getSubpath(params: Promise<{ path?: string[] }>) {
  const { path } = await params;
  return path ? '/' + path.join('/') : '';
}

// Function to decode JWT token and extract user ID
function getUserIdFromToken(token: string): string | null {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');

    // Split the JWT token (header.payload.signature)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    // Extract user ID from 'sub' field
    return parsedPayload.sub || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

async function forwardRequest(
  request: NextRequest,
  method: string,
  params: Promise<{ path?: string[] }>
) {
  try {
    const subpath = await getSubpath(params);
    const url = new URL(request.url);

    // Extract Authorization header to get user ID
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    // Use environment variable for backend URL if available
    let backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:8000`;

    // Ensure backendUrl doesn't end with /api if we're adding it later
    backendUrl = backendUrl.replace(/\/api$/, '');

    // Modify path for routes that require user ID
    if (subpath.startsWith('/frontend/')) {
      // Frontend-compatible routes that don't require user ID in path
      backendUrl += `/api${subpath}${url.search}`;
    } else if (subpath.startsWith('/tasks') && !subpath.startsWith('/frontend/')) {
      // Regular tasks route that requires user ID in path (e.g., /api/{user_id}/tasks)
      if (authHeader) {
        const userId = getUserIdFromToken(authHeader);
        if (userId) {
          backendUrl += `/api/${userId}/tasks${url.search}`;
        } else {
          // If we can't extract user ID, return an error
          return NextResponse.json(
            {
              error: 'Invalid or missing token',
              details: 'Could not extract user ID from authorization token',
            },
            { status: 401 }
          );
        }
      } else {
        // If no auth header for protected route, return 401
        return NextResponse.json(
          {
            error: 'Unauthorized',
            details: 'Authorization header required for this endpoint',
          },
          { status: 401 }
        );
      }
    } else if (subpath === '/chat') {
      // Chat endpoint doesn't require user ID in path but still needs auth
      backendUrl += `/chat${url.search}`;
    } else {
      // For other routes, keep the original path
      backendUrl += subpath + url.search;
    }

    // Log the constructed URL for debugging
    console.log(`Forwarding request to: ${backendUrl}`);

    const headers = headersToObject(request.headers);
    // Don't override Content-Type if it's already set by the client
    if (!headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }

    const options: RequestInit = { method, headers };

    // Include body for methods that need it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const body = await request.json();
        options.body = JSON.stringify(body);
      } catch (e) {
        // If parsing fails, it might be because there's no body
        console.warn('Could not parse request body, proceeding without it');
      }
    }

    const response = await fetch(backendUrl, options);

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
      return NextResponse.json(
        {
          error: 'Invalid response from backend',
          details: 'Backend returned non-JSON response',
          rawResponse: responseText.substring(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding request to TodoApp backend:', error);
    return NextResponse.json(
      {
        error: 'Failed to connect to TodoApp backend',
        details: (error as Error).message,
        message: 'Make sure the TodoApp backend is running on http://127.0.0.1:8001',
      },
      { status: 500 }
    );
  }
}

// Export handlers
export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return forwardRequest(request, 'GET', params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return forwardRequest(request, 'POST', params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return forwardRequest(request, 'PUT', params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return forwardRequest(request, 'DELETE', params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return forwardRequest(request, 'PATCH', params);
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// import { NextRequest } from 'next/server';

// export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     // Extract the subpath from the URL (e.g., /api/todo-backend/tasks -> /tasks)
//     const subpath = params.path ? '/' + params.path.join('/') : '';
//     const url = new URL(request.url);

//     // Construct the target URL for the TodoApp backend
//     const todoBackendUrl = `http://localhost:8001${subpath}${url.search}`;

//     // Forward the request to the TodoApp backend
//     const response = await fetch(todoBackendUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...request.headers.toJSON(),
//       },
//     });

//     // Get response text first to check if it's JSON
//     const responseText = await response.text();

//     // Check if response is valid JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       // If not valid JSON, return error
//       console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
//       return Response.json(
//         {
//           error: 'Invalid response from backend',
//           details: 'Backend returned non-JSON response',
//           rawResponse: responseText.substring(0, 500)
//         },
//         { status: 502 }
//       );
//     }

//     // Return the response from the TodoApp backend
//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error forwarding request to TodoApp backend:', error);
//     return Response.json(
//       {
//         error: 'Failed to connect to TodoApp backend',
//         details: (error as Error).message,
//         message: 'Make sure the TodoApp backend is running on http://localhost:8001'
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     const subpath = params.path ? '/' + params.path.join('/') : '';
//     const todoBackendUrl = `http://localhost:8001${subpath}`;

//     // Get the request body
//     const body = await request.json();

//     // Forward the request to the TodoApp backend
//     const response = await fetch(todoBackendUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...request.headers.toJSON(),
//       },
//       body: JSON.stringify(body),
//     });

//     // Get response text first to check if it's JSON
//     const responseText = await response.text();

//     // Check if response is valid JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       // If not valid JSON, return error
//       console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
//       return Response.json(
//         {
//           error: 'Invalid response from backend',
//           details: 'Backend returned non-JSON response',
//           rawResponse: responseText.substring(0, 500)
//         },
//         { status: 502 }
//       );
//     }

//     // Return the response from the TodoApp backend
//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error forwarding request to TodoApp backend:', error);
//     return Response.json(
//       {
//         error: 'Failed to connect to TodoApp backend',
//         details: (error as Error).message,
//         message: 'Make sure the TodoApp backend is running on http://localhost:8001'
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     const subpath = params.path ? '/' + params.path.join('/') : '';
//     const todoBackendUrl = `http://localhost:8001${subpath}`;

//     const body = await request.json();

//     const response = await fetch(todoBackendUrl, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         ...request.headers.toJSON(),
//       },
//       body: JSON.stringify(body),
//     });

//     // Get response text first to check if it's JSON
//     const responseText = await response.text();

//     // Check if response is valid JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       // If not valid JSON, return error
//       console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
//       return Response.json(
//         {
//           error: 'Invalid response from backend',
//           details: 'Backend returned non-JSON response',
//           rawResponse: responseText.substring(0, 500)
//         },
//         { status: 502 }
//       );
//     }

//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error forwarding request to TodoApp backend:', error);
//     return Response.json(
//       {
//         error: 'Failed to connect to TodoApp backend',
//         details: (error as Error).message,
//         message: 'Make sure the TodoApp backend is running on http://localhost:8001'
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     const subpath = params.path ? '/' + params.path.join('/') : '';
//     const todoBackendUrl = `http://localhost:8001${subpath}`;

//     const response = await fetch(todoBackendUrl, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         ...request.headers.toJSON(),
//       },
//     });

//     // Get response text first to check if it's JSON
//     const responseText = await response.text();

//     // Check if response is valid JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       // If not valid JSON, return error
//       console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
//       return Response.json(
//         {
//           error: 'Invalid response from backend',
//           details: 'Backend returned non-JSON response',
//           rawResponse: responseText.substring(0, 500)
//         },
//         { status: 502 }
//       );
//     }

//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error forwarding request to TodoApp backend:', error);
//     return Response.json(
//       {
//         error: 'Failed to connect to TodoApp backend',
//         details: (error as Error).message,
//         message: 'Make sure the TodoApp backend is running on http://localhost:8001'
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     const subpath = params.path ? '/' + params.path.join('/') : '';
//     const todoBackendUrl = `http://localhost:8001${subpath}`;

//     const body = await request.json();

//     const response = await fetch(todoBackendUrl, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         ...request.headers.toJSON(),
//       },
//       body: JSON.stringify(body),
//     });

//     // Get response text first to check if it's JSON
//     const responseText = await response.text();

//     // Check if response is valid JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       // If not valid JSON, return error
//       console.error('Invalid JSON response from backend:', responseText.substring(0, 200));
//       return Response.json(
//         {
//           error: 'Invalid response from backend',
//           details: 'Backend returned non-JSON response',
//           rawResponse: responseText.substring(0, 500)
//         },
//         { status: 502 }
//       );
//     }

//     return Response.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error forwarding request to TodoApp backend:', error);
//     return Response.json(
//       {
//         error: 'Failed to connect to TodoApp backend',
//         details: (error as Error).message,
//         message: 'Make sure the TodoApp backend is running on http://localhost:8001'
//       },
//       { status: 500 }
//     );
//   }
// }

// // Allow all methods
// export const dynamic = 'force-dynamic';
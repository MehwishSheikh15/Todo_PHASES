'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ListTodo } from 'lucide-react';
import API_CONFIG from '@/lib/api-config';
import { useRouter } from 'next/navigation';

export default function TodoChatbotPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'bot', timestamp: Date }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Define helper functions before hooks that use them
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { text, sender: 'bot', timestamp: new Date() }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { text, sender: 'user', timestamp: new Date() }]);
  };

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_CONFIG.TASKS_ENDPOINT, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (typeof errorData === 'string') {
            errorMessage += ` - ${errorData}`;
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          } else if (errorData.detail) {
            errorMessage += ` - ${errorData.detail}`;
          } else if (typeof errorData === 'object') {
            errorMessage += ` - ${JSON.stringify(errorData)}`;
          }
        } catch (e) {
          // If we can't parse error JSON, just use the status
          errorMessage += ` - Unable to parse error response`;
        }
        console.error('Error loading tasks:', errorMessage);
        return; // Don't throw to prevent breaking the UI
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, read as text to see what we got
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse);

        // Check if it's an error response from our proxy
        if (textResponse.includes('error') && textResponse.includes('backend')) {
          console.error('Backend connection error. Please make sure the TodoApp backend is running on http://localhost:8001');
          return;
        }

        console.error('Backend returned non-JSON response. Is the TodoApp backend running?');
        return;
      }

      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      // Don't add bot message here as it would spam on every load failure
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if this is an add task command before sending to backend
      const addTaskRegex = /(add|create|make|new)\s+(a\s+)?(task|todo)/i;
      if (addTaskRegex.test(userMessage.toLowerCase())) {
        // Extract the task title from the message
        const titleMatch = userMessage.match(/(?:add|create|make|new)\s+(?:a\s+)?(?:task|todo)\s+(?:to|for|about|that|which|will)?\s*(.+?)(?:\.|$)/i);
        if (titleMatch && titleMatch[1]) {
          const taskTitle = titleMatch[1].trim();

          // Check if a task with the same title already exists
          const existingTask = tasks.find(task =>
            task.title.toLowerCase() === taskTitle.toLowerCase()
          );

          if (existingTask) {
            addBotMessage(`A task with the title "${taskTitle}" already exists. Please choose a different title.`);
            setIsLoading(false);
            return;
          }
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch(API_CONFIG.CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Received non-JSON response:', textResponse);
        throw new Error('Backend returned non-JSON response. Please check backend connectivity.');
      }

      const data = await response.json();

      if (response.ok) {
        // Handle different response types
        if (data.action === 'TASK_SEARCH') {
          if (data.tasks && data.tasks.length > 0) {
            const taskList = data.tasks.map((t: any) => `- ${t.title} (${t.status})`).join('\n');
            addBotMessage(`${data.message}\n${taskList}`);
          } else {
            addBotMessage(data.message);
          }
        } else if (data.action === 'TASK_VIEW_PLAN' || data.action === 'TASK_VIEW_ALL') {
          if (data.summary) {
            const summaryText = `Total: ${data.summary.total}, Pending: ${data.summary.pending}, Completed: ${data.summary.completed}`;
            addBotMessage(`${data.message}\nSummary: ${summaryText}`);

            // Display tasks if available
            if (data.pendingTasks && data.pendingTasks.length > 0) {
              addBotMessage(`Pending tasks:\n${data.pendingTasks.map((t: any) => `- ${t.title}`).join('\n')}`);
            }
            if (data.completedTasks && data.completedTasks.length > 0) {
              addBotMessage(`Completed tasks:\n${data.completedTasks.map((t: any) => `- ${t.title}`).join('\n')}`);
            }
          } else {
            addBotMessage(data.message);
          }
        } else {
          addBotMessage(data.message || 'Command processed successfully');
        }

        // Reload tasks to reflect changes
        setTimeout(loadTasks, 500);
      } else {
        // Handle specific error cases from our proxy
        if (data.error && data.message) {
          addBotMessage(`Error: ${data.message}`);
        } else {
          addBotMessage(`Error: ${data.error || 'Unknown error occurred'}`);
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.message.includes('fetch failed') || error.message.includes('network')) {
        addBotMessage('Error: Cannot connect to the backend server. Please check your connection.');
      } else if (error.message.includes('backend connection')) {
        addBotMessage(`Error: ${error.message}`);
      } else if (error.message.includes('non-JSON')) {
        addBotMessage(`Error: ${error.message}`);
      } else {
        addBotMessage(`Error: ${error.message || 'Unable to connect to the chatbot service. Please check your connection.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom of messages - this must come before any conditional returns
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/register');
    }
  }, [isAuthenticated, loading, router]);

  // Use a ref to prevent double execution in Strict Mode
  const welcomeSentRef = useRef(false);

  // Always run the backend check effect, but conditionally process based on auth status
  useEffect(() => {
    if (loading || !isAuthenticated) {
      // Don't run backend check if still loading or not authenticated
      return;
    }

    const checkBackend = async () => {
      // If already sent, don't check/send again
      if (welcomeSentRef.current) return;

      try {
        // Load tasks to verify backend connectivity
        await loadTasks();

        // If we got here, backend is accessible
        welcomeSentRef.current = true;
        addBotMessage("Hello! Welcome to the Todo Chatbot. I'm here to help you manage your tasks. You can ask me to add, edit, delete, search, or manage your tasks. Try saying 'Add a task to buy groceries' or 'Show me tasks for this week'.");
      } catch (error: any) {
        console.error('Backend connectivity check failed:', error);
        addBotMessage(`⚠️ Warning: Cannot connect to the backend. Please check your connection.`);
      }
    };

    checkBackend();
  }, [isAuthenticated, loading]); // Add dependencies to the effect

  // Load chat history on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_CONFIG.BASE_URL}/chat/history`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          }
        });

        if (response.ok) {
          const history = await response.json();
          if (history && history.length > 0) {
            setMessages(history.map((msg: any) => ({
              text: msg.text,
              sender: msg.sender,
              timestamp: new Date(msg.timestamp)
            })));
            setTimeout(scrollToBottom, 100);
          }
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadHistory();
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the page content (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 custom-scrollbar">
      <Head>
        <title>Todo Chatbot - Phase II</title>
        <meta name="description" content="AI-powered Todo Chatbot" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <span className="mr-3">🤖</span> Todo Chatbot
              <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">AI Assistant</span>
            </h1>
            <p className="text-gray-600 text-lg">Manage your tasks with natural language commands</p>
          </div>

          <div className="flex justify-center mb-6 space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center">
                <span className="mr-2">📊</span> Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/tasks">
              <Button variant="outline" className="flex items-center">
                <span className="mr-2">✅</span> My Tasks
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg max-h-[400px] custom-scrollbar border border-gray-200">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl max-w-[85%] shadow-sm ${msg.sender === 'user'
                      ? 'ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'mr-auto bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className={`text-xs mt-2 flex justify-end ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mr-auto bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl rounded-bl-none p-4 max-w-[85%] shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      <span>Processing your request...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a command (e.g., 'Add a task to buy groceries', 'Show me tasks for this week')..."
                  className="flex-1 border border-gray-300 rounded-xl p-4 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Command Examples */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-bold text-blue-800">Try these commands:</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• Add:</span> <span className="text-blue-600">"Add a task to buy groceries"</span></div>
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• Complete:</span> <span className="text-blue-600">"Mark task 1 as complete"</span></div>
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• Delete:</span> <span className="text-blue-600">"Delete task 2"</span></div>
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• Search:</span> <span className="text-blue-600">"Find tasks about shopping"</span></div>
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• View:</span> <span className="text-blue-600">"Show me tasks for this week"</span></div>
                <div className="flex items-start"><span className="font-medium text-blue-700 mr-2">• Schedule:</span> <span className="text-blue-600">"What's my schedule for today"</span></div>
              </div>
            </div>
          </div>

          {/* Tasks Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📋</span> Your Tasks
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-3">📭</div>
                <p className="text-gray-500 italic">No tasks yet. Add one using the chat!</p>
                <p className="text-sm text-gray-400 mt-2">Start by typing "Add a task to..." in the chat</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${task.status === 'done'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : 'bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:border-blue-300'
                      }`}
                    onClick={() => router.push(`/dashboard/tasks?id=${task.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${task.status === 'done'
                          ? 'line-through text-gray-600'
                          : 'text-gray-800'
                          }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1 truncate" title={task.description}>
                            {task.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                          <span>Status: <span className="font-medium">{task.status}</span></span>
                          <span>Priority: <span className="font-medium">{task.priority}</span></span>
                          <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'done'
                        ? 'bg-green-100 text-green-800'
                        : task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {task.status === 'done' ? '✓ Done' : task.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
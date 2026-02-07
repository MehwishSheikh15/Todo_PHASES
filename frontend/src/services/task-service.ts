import ApiClient from '@/lib/api-client';
import { Task } from '@/types/task';
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

class TaskService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(API_BASE_URL);
  }

  async getTasks(userId: string): Promise<Task[]> {
    const response = await this.apiClient.get(`frontend/tasks`);
    return response.data;
  }

  async getTaskById(userId: string, taskId: string): Promise<Task> {
    const response = await this.apiClient.get(`frontend/tasks/${taskId}`);
    return response.data;
  }

  async createTask(
    userId: string,
    taskData: Partial<Task>
  ): Promise<Task> {
    try {
      if (!taskData.title || taskData.title.trim() === '') {
        throw new Error('Task title is required');
      }

      // ✅ STRICT, BACKEND-SAFE PAYLOAD
      const payload = {
        title: taskData.title.trim(),
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null
      };

      console.log('Sending Create Task Payload:', payload);

      const response = await this.apiClient.post(
        `frontend/tasks`,
        payload
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Create task failed');
        console.error('STATUS:', error.response?.status);
        console.error('DATA:', typeof error.response?.data === 'object' ? JSON.stringify(error.response?.data, null, 2) : error.response?.data);
      }
      throw error;
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    taskData: Partial<Task>
  ): Promise<Task> {
    const payload = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      due_date: taskData.due_date,
    };

    const response = await this.apiClient.put(
      `frontend/tasks/${taskId}`,
      payload
    );

    return response.data;
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.apiClient.delete(`frontend/tasks/${taskId}`);
  }

  async completeTask(userId: string, taskId: string): Promise<Task> {
    const response = await this.apiClient.patch(
      `frontend/tasks/${taskId}/complete`
    );
    return response.data;
  }
}

export default TaskService;

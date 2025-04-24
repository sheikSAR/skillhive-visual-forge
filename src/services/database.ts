
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  is_freelancer: boolean;
  is_admin: boolean;
}

export interface ProjectData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  skills: string[];
  client_id: string;
}

export interface ApplicationData {
  project_id: string;
  user_id: string;
  cover_letter: string;
}

export const database = {
  // Auth methods
  signUp: async (email: string, password: string, fullName: string, accountType = "client") => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        fullName,
        accountType
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'An error occurred during signup' 
      };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'An error occurred during login' 
      };
    }
  },
  
  // Project methods
  getProjects: async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch projects' 
      };
    }
  },
  
  createProject: async (projectData: ProjectData) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to create project' 
      };
    }
  },
  
  // Application methods
  submitApplication: async (applicationData: ApplicationData) => {
    try {
      const response = await axios.post(`${API_URL}/applications`, applicationData);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to submit application' 
      };
    }
  },
  
  getApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/applications`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch applications' 
      };
    }
  },
  
  updateApplicationStatus: async (id: string, status: string) => {
    try {
      const response = await axios.put(`${API_URL}/applications/${id}`, { status });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to update application' 
      };
    }
  },
  
  // User management methods
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch users' 
      };
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to delete user' 
      };
    }
  }
};

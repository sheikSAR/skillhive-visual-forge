
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
  
  getClientProjects: async (clientId: string) => {
    try {
      const response = await axios.get(`${API_URL}/projects/client/${clientId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch client projects' 
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

  updateProjectStatus: async (projectId: string, status: string) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}/status`, { status });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.error || 'Failed to update project status'
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
  
  getProjectApplications: async (projectIds: string[]) => {
    try {
      const queryString = projectIds.map(id => `projectId=${id}`).join('&');
      const response = await axios.get(`${API_URL}/applications/projects?${queryString}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch project applications' 
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
  
  // Freelancer management methods
  getFreelancerApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/freelancers`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch freelancer applications' 
      };
    }
  },

  updateFreelancerStatus: async (userId: string, isFreelancer: boolean) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/freelancer-status`, { 
        is_freelancer: isFreelancer 
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to update freelancer status' 
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
  },

  // User profile methods
  updateUserProfile: async (userId: string, profileData: any) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/profile`, profileData);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to update profile' 
      };
    }
  }
};

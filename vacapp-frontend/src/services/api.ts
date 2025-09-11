import axios from 'axios';

const API_BASE_URL = 'https://moobile.azurewebsites.net/api/v1';
//const API_BASE_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

export interface SignInRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userName: string;
  email: string;
}

export interface UserProfile {
  username: string;
  email: string;
  emailConfirmed: boolean;
}

export interface UserInfo {
  name: string;
  totalBovines: number;
  totalVaccinations: number;
  totalStables: number;
}

export interface Bovine {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  breed: string;
  location: string;
  bovineImg: string;
  stableId: number;
}

export interface CreateBovineRequest {
  name: string;
  gender: string;
  birthDate: string;
  breed: string;
  location: string;
  bovineImg?: File;
  stableId: number;
}

export interface UpdateBovineRequest {
  name: string;
  gender: string;
  birthDate: string;
  breed: string;
  location: string;
  stableId: number;
}

export interface UpdateProfileRequest {
  username: string;
  email: string;
}

export interface Stable {
  id: number;
  name: string;
  limit: number;
}

export interface CreateStableRequest {
  name: string;
  limit: number;
}

export interface UpdateStableRequest {
  name: string;
  limit: number;
}

// Voice Command Interfaces
export interface VoiceCommandResponse {
  success: boolean;
  message: string;
  originalText: string;
  voiceCommandId: number;
  redirectUrl?: string;
  data?: {
    username: string;
    totalBovines: number;
    totalVaccinations: number;
    totalStables: number;
  };
}

export interface ParseTextRequest {
  text: string;
}

export interface VoiceCommandRecord {
  id: number;
  originalText: string;
  commandType: string;
  parameters: string | null;
  isValid: boolean;
  wasExecuted: boolean;
  responseMessage: string | null;
  errorMessage: string | null;
  createdDate: string;
  executedDate: string | null;
  userId: number;
}

export interface VoiceCommandStats {
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  successRate: number;
  mostUsedCommandType: string;
  commandsByType: Record<string, number>;
}

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await api.post('/user/sign-up', data);
    return response.data;
  },

  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await api.post('/user/sign-in', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get('/user/get-info');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
    const response = await api.put('/user/update-profile', data);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    const response = await api.delete('/user/delete-account');
    return response.data;
  },
};

export const bovinesApi = {
  getAllBovines: async (): Promise<Bovine[]> => {
    const response = await api.get('/bovines');
    return response.data;
  },

  createBovine: async (data: CreateBovineRequest): Promise<Bovine> => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Gender', data.gender);
    formData.append('BirthDate', data.birthDate);
    formData.append('Breed', data.breed);
    formData.append('Location', data.location);
    formData.append('StableId', data.stableId.toString());
    
    if (data.bovineImg) {
      formData.append('FileData', data.bovineImg);
    }

    const response = await api.post('/bovines', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getBovineById: async (id: number): Promise<Bovine> => {
    const response = await api.get(`/bovines/${id}`);
    return response.data;
  },

  updateBovine: async (id: number, data: UpdateBovineRequest): Promise<Bovine> => {
    const response = await api.put(`/bovines/${id}`, {
      Name: data.name,
      Gender: data.gender,
      BirthDate: data.birthDate,
      Breed: data.breed,
      Location: data.location,
      StableId: data.stableId
    });
    return response.data;
  },

  deleteBovine: async (id: number): Promise<void> => {
    const response = await api.delete(`/bovines/${id}`);
    return response.data;
  },
};

export const stablesApi = {
  getAllStables: async (): Promise<Stable[]> => {
    const response = await api.get('/stables');
    return response.data;
  },

  createStable: async (data: CreateStableRequest): Promise<Stable> => {
    const response = await api.post('/stables', data);
    return response.data;
  },

  getStableById: async (id: number): Promise<Stable> => {
    const response = await api.get(`/stables/${id}`);
    return response.data;
  },

  updateStable: async (id: number, data: UpdateStableRequest): Promise<Stable> => {
    const response = await api.put(`/stables/${id}`, data);
    return response.data;
  },

  deleteStable: async (id: number): Promise<void> => {
    const response = await api.delete(`/stables/${id}`);
    return response.data;
  },
};

export const voiceCommandApi = {
  processAudio: async (audioFile: File): Promise<VoiceCommandResponse> => {
    const formData = new FormData();
    formData.append('audioFile', audioFile);

    const response = await api.post('/voice-command/process-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  parseText: async (data: ParseTextRequest): Promise<any> => {
    const response = await api.post('/voice-command/parse-text', data);
    return response.data;
  },

  getVoiceCommands: async (): Promise<{ success: boolean; data: VoiceCommandRecord[]; count: number }> => {
    const response = await api.get('/voice-command');
    return response.data;
  },

  getVoiceCommandsPaginated: async (page: number = 0, size: number = 10): Promise<{ success: boolean; data: VoiceCommandRecord[]; page: number; size: number; count: number }> => {
    const response = await api.get(`/voice-command/paginated?page=${page}&size=${size}`);
    return response.data;
  },

  getVoiceCommandById: async (id: number): Promise<{ success: boolean; data: VoiceCommandRecord }> => {
    const response = await api.get(`/voice-command/${id}`);
    return response.data;
  },

  getVoiceCommandStatistics: async (fromDate?: Date, toDate?: Date): Promise<{ success: boolean; data: VoiceCommandStats }> => {
    let url = '/voice-command/statistics';
    const params = new URLSearchParams();

    if (fromDate) {
      params.append('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params.append('toDate', toDate.toISOString());
    }

    if (params.toString()) {
      url += '?' + params.toString();
    }

    const response = await api.get(url);
    return response.data;
  },
};

export default api;
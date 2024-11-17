// src/api/auth.ts
export interface ApiResponse {
  data: {
    message: string;
  };
}

export const loginAPI = (email: string, password: string): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    if (email && password) {
      resolve({
        data: { message: 'Login successful' }, // Simulated successful response
      });
    } else {
      reject({
        response: { data: { message: 'Login failed, please check your input' } },
      });
    }
  });
};

export const signupAPI = (username: string, password: string): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    if (username && password) {
      resolve({
        data: { message: 'Signup successful' },
      });
    } else {
      reject({
        response: { data: { message: 'Signup failed, please check your input' } },
      });
    }
  });
};

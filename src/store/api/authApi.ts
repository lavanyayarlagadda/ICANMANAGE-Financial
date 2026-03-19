import { baseApi } from './baseApi';
import { User } from '../slices/authSlice';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshExpiresInSeconds: number;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Pass extraOptions to specify the service
      extraOptions: { service: 'auth' },
    }),
  }),
});

export const { useLoginMutation } = authApi;

import { createApi } from '@reduxjs/toolkit/query/react';
import { IUser } from '../models/IUser';
import { axiosBaseQuery } from './api';


interface FetchUserParams {
  role?: string|undefined;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    fetchUser: builder.query<IUser[], FetchUserParams>({
      query: ({ role }: FetchUserParams = {}) => {
        const params: Record<string, string | undefined> = {};
        if (role !== undefined) {
          params['role'] = role;
        }
        return {
          url: '/user',
          params,
        };
      },
    }),
  }),
});

export const { useFetchUserQuery } = userApi;
import { createApi } from '@reduxjs/toolkit/query/react';
import { IUser } from '../models/IUser';
import { axiosBaseQuery } from './api';


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    fetchUser: builder.query<IUser[], any>({
      query: ({role}) => ({
        url: '/user',
        params: {role: role},

      })
    }),
  }),
});

export const { useFetchUserQuery } = userApi;

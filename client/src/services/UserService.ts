import { createApi } from '@reduxjs/toolkit/query/react';
import { IUser } from '../models/IUser';
import { axiosBaseQuery } from './api';


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    fetchUser: builder.query<IUser[], void>({
      query: () => ({url: '/user'})
    }),
  }),
});

export const { useFetchUserQuery } = userApi;

import { createApi } from '@reduxjs/toolkit/query/react';
import { IProvider } from '../models/IProvider';
import { axiosBaseQuery } from './api';


export const providerApi = createApi({
    reducerPath: 'providerApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchProviders: builder.query<IProvider[], void>({
            query: () => ({
                url: '/provider'
            }),
        }),
    }),
});

export const { useFetchProvidersQuery } = providerApi;

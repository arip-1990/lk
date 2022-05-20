import { createApi } from '@reduxjs/toolkit/query/react';
import { IStore } from '../models/IStore';
import { axiosBaseQuery } from './api';


export const storeApi = createApi({
    reducerPath: 'storeApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchStores: builder.query<IStore[], void>({
            query: () => ({
                url: '/store'
            }),
        }),
    }),
});

export const { useFetchStoresQuery } = storeApi;

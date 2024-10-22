import { createApi } from '@reduxjs/toolkit/query/react';
import { IStore } from '../models/IStore';
import { axiosBaseQuery } from './api';


export const storeApi = createApi({
    reducerPath: 'storeApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchStores: builder.query<IStore[], void | {all: boolean, CaspianPharma:boolean}>({
            query: (arg) => ({
                url: '/store' + (arg?.CaspianPharma ? '?CaspianPharma=3' : (arg?.all ? '?all=1' : ''))
            }),
        }),
    }),
});

export const { useFetchStoresQuery } = storeApi;

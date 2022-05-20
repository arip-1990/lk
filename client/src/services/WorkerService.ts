import { createApi } from '@reduxjs/toolkit/query/react';
import { IWorkers } from '../models/IWorker';
import { axiosBaseQuery } from './api';


export const workerApi = createApi({
    reducerPath: 'workerApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchWorkers: builder.query<IWorkers[], void>({
            query: () => ({
                url: '/user/worker'
            }),
        }),
    }),
});

export const { useFetchWorkersQuery } = workerApi;

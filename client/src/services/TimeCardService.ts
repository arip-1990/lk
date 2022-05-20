import { createApi } from '@reduxjs/toolkit/query/react';
import { ITimeCard } from '../models/ITimeCard';
import moment from 'moment';
import { axiosBaseQuery } from './api';


export const timeCardApi = createApi({
    reducerPath: 'timeCardApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['TimeCard'],
    endpoints: (builder) => ({
        fetchTimeCards: builder.query<ITimeCard[], {storeId?: string, period?: moment.Moment}>({
            query: (args) => ({
                url: `/time-card/${args.storeId}`,
                params: {period: args.period?.format("YYYY-MM")}
            }),
            providesTags: ['TimeCard'],
        }),
        storeTimeCards: builder.mutation<void, any[]>({
            query: (data) => ({
                url: '/time-card',
                method: 'post',
                data,
            }),
            invalidatesTags: ['TimeCard'],
        }),
    }),
});

export const { useFetchTimeCardsQuery, useStoreTimeCardsMutation } = timeCardApi;

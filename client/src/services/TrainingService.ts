import { createApi } from '@reduxjs/toolkit/query/react';
import { ITraining } from '../models/ITraining';
import { axiosBaseQuery } from './api';


export const trainingApi = createApi({
    reducerPath: 'trainingApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['ITraining'],
    endpoints: (builder) => ({
        fetchTraining: builder.query<ITraining[], {id: string, type: string}>({
            query: (args) => ({
                url: `/training/${args.id}/${args.type}`
            }),
            providesTags: ['ITraining'],
        }),
        addTraining: builder.mutation<ITraining[], {id: string, data: FormData}>({
            query: (args) => ({
              url: `/training/${args.id}`,
              method: 'post',
              data: args.data,
            }),
            invalidatesTags: ['ITraining'],
        }),
        deleteTraining: builder.mutation<ITraining[], string>({
            query: (id) => ({
              url: `/training/${id}`,
              method: 'delete'
            }),
            invalidatesTags: ['ITraining'],
        })
    }),
});

export const { useFetchTrainingQuery, useAddTrainingMutation, useDeleteTrainingMutation } = trainingApi;

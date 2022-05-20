import { createApi } from '@reduxjs/toolkit/query/react';
import moment from 'moment';
import { IMedia } from '../models/IMedia';
import { axiosBaseQuery } from './api';

export const mediaApi = createApi({
    reducerPath: 'mediaApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['IMedia'],
    endpoints: (builder) => ({
        fetchMedia: builder.query<IMedia[], {category: string, store: string | null}>({
            query: (args) => ({
                url: `/media/${args.category}` + (args.store ? `/${args.store}` : '')
            }),
            transformResponse: (response: IMedia[]) => response?.map((item) => ({
                ...item,
                createdAt: moment(item.createdAt),
            })),
            providesTags: ['IMedia'],
        }),
        addMedia: builder.mutation<IMedia[], {category: string, store: string | null, data: FormData}>({
            query: (args) => ({
                url: `/media/${args.category}` + (args.store ? `/${args.store}` : ''),
                method: 'post',
                data: args.data,
            }),
            invalidatesTags: ['IMedia'],
        }),
        deleteMedia: builder.mutation<IMedia[], string>({
            query: (id) => ({
                url: `/media/${id}`,
                method: 'delete'
            }),
            invalidatesTags: ['IMedia'],
        })
    }),
});

export const { useFetchMediaQuery, useAddMediaMutation, useDeleteMediaMutation } = mediaApi;

import { createApi } from '@reduxjs/toolkit/query/react';
import { IContact } from '../models/IContact';
import { axiosBaseQuery } from './api';


export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['IContact'],
    endpoints: (builder) => ({
        fetchContacts: builder.query<IContact[], void>({
            query: () => ({
                url: '/operation-department/contact'
            }),
            transformResponse: (response: IContact[]) => response?.map((item) => ({
                ...item,
                editable: false,
            })),
            providesTags: ['IContact'],
        }),
        addContact: builder.mutation<void, FormData>({
            query: (data) => ({
              url: '/operation-department/contact',
              method: 'post',
              data: data,
            }),
            invalidatesTags: ['IContact'],
        }),
        updateContact: builder.mutation<void, {id: string, data: any}>({
            query: (args) => ({
              url: `/operation-department/contact/${args.id}`,
              method: 'put',
              data: args.data
            }),
            invalidatesTags: ['IContact'],
        }),
        deleteContact: builder.mutation<void, string>({
            query: (id) => ({
              url: `/operation-department/contact/${id}`,
              method: 'delete'
            }),
            invalidatesTags: ['IContact'],
        })
    }),
});

export const { useFetchContactsQuery, useAddContactMutation, useUpdateContactMutation, useDeleteContactMutation } = contactApi;

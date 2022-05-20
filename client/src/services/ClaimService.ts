import { createApi } from '@reduxjs/toolkit/query/react';
import { IClaim } from '../models/IClaim';
import { axiosBaseQuery } from './api';
import moment from 'moment';


export const claimApi = createApi({
    reducerPath: 'claimApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['IClaim'],
    endpoints: (builder) => ({
        fetchClaims: builder.query<IClaim[], moment.Moment>({
            query: (period) => ({
                url: '/claim',
                params: {period: period.format('Y-MM-DD')}
            }),
            transformResponse: (response: IClaim[]) => response?.map((item) => ({
                ...item,
                shortShelfLife: item.shortShelfLife ? moment(item.shortShelfLife) : undefined,
                deliveryAt: item.deliveryAt ? moment(item.deliveryAt) : undefined,
                createdAt: moment(item.createdAt),
                editable: false,
            })),
            providesTags: ['IClaim'],
        }),
        fetchClaimsByStore: builder.query<Pagination<IClaim>, {storeId: string, pagination: {current: number, pageSize: number}}>({
            query: (args) => ({
                url: `/claim/${args.storeId}`,
                params: {
                    page: args.pagination.current,
                    pageSize: args.pagination.pageSize
                }
            }),
            transformResponse: (response: Pagination<IClaim>) => ({
                ...response,
                data: response.data.map((item) => ({
                    ...item,
                    shortShelfLife: item.shortShelfLife ? moment(item.shortShelfLife) : undefined,
                    deliveryAt: item.deliveryAt ? moment(item.deliveryAt) : undefined,
                    createdAt: moment(item.createdAt),
                    editable: false,
                }))
            }),
            providesTags: ['IClaim'],
        }),
        addClaim: builder.mutation<void, FormData>({
            query: (data) => ({
              url: '/claim',
              method: 'post',
              data: data,
            }),
            invalidatesTags: ['IClaim'],
        }),
        updateClaim: builder.mutation<void, {id: string, data: FormData}>({
            query: (args) => ({
              url: `/claim/${args.id}`,
              method: 'put',
              data: args.data
            }),
            invalidatesTags: ['IClaim'],
        }),
        deleteClaim: builder.mutation<void, string>({
            query: (id) => ({
              url: `/claim/${id}`,
              method: 'delete'
            }),
            invalidatesTags: ['IClaim'],
        })
    }),
});

export const { useFetchClaimsQuery, useFetchClaimsByStoreQuery, useUpdateClaimMutation, useAddClaimMutation } = claimApi;

import { createApi } from '@reduxjs/toolkit/query/react';
import { ITest } from '../models/ITest';
import { axiosBaseQuery } from './api';
import moment from 'moment';

export const testApi = createApi({
    reducerPath: 'testApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchTests: builder.query<ITest[], string>({
            query: (slug) => ({
                url: '/test/' + slug
            }),
            transformResponse: (response: ITest[]) => response.map(
                item => ({ ...item, start: moment(item.start), finish: moment(item.finish) })
            )
        }),
        fetchTestsByUser: builder.query<Pagination<ITest>, {
            user: string,
            type: string,
            pagination: { current: number, pageSize: number }
        }>({
            query: (args) => ({
                url: `/user/test/${args.user}`,
                params: {
                    type: args.type,
                    page: args.pagination.current,
                    pageSize: args.pagination.pageSize
                }
            }),
            transformResponse: (response: Pagination<ITest>) => ({
                ...response,
                data: response.data.map(
                    item => ({ ...item, start: moment(item.start), finish: moment(item.finish) })
                )
            })
        }),
    }),
});

export const { useFetchTestsQuery, useFetchTestsByUserQuery } = testApi;

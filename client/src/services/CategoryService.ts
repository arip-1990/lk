import { createApi } from '@reduxjs/toolkit/query/react';
import { ICategory } from '../models/ICategory';
import { axiosBaseQuery } from './api';


export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchCategories: builder.query<ICategory[], void>({
            query: () => ({
                url: '/category'
            }),
        }),
    }),
});

export const { useFetchCategoriesQuery } = categoryApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import moment from "moment";
import { IStatement } from "../models/IStatement";
import { axiosBaseQuery } from "./api";

export const statementApi = createApi({
  reducerPath: "statementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IStatement"],
  endpoints: (builder) => ({
    fetchStatements: builder.query<
      Pagination<IStatement>,
      { categoryId: number; pagination: {current: number; pageSize: number},
        filter?: {applications: string; data?: any; address?: string; performer?: string}}
    >({
      query: ({categoryId, pagination, filter}) => ({
        url: `/operation-department/statement/${categoryId}`,
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          filterApplication: filter?.applications,
          filterPerformer: filter?.data,
          filterAddress: filter?.address,
          filterData: filter?.performer
        },
      }),
      transformResponse: (response: Pagination<IStatement>) => ({
        ...response,
        data: response.data.map((item) => ({
          ...item,
          createdAt: moment(item.createdAt),
          doneAt: item.doneAt ? moment(item.doneAt) : undefined,
          editable: false,
        })),
      }),
      providesTags: ["IStatement"],
    }),
    addStatement: builder.mutation<void, { id: string; data: FormData }>({
      query: ({id, data}) => ({
        url: `/operation-department/statement/${id}`,
        method: "post",
        data,
      }),
      invalidatesTags: ["IStatement"],
    }),
    updateStatement: builder.mutation<void, { id: string; data: FormData }>({
      query: ({id, data}) => ({
        url: `/operation-department/statement/${id}/update`,
        method: "post",
        data,
      }),
      invalidatesTags: ["IStatement"],
    }),
    deleteStatement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/operation-department/statement/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["IStatement"],
    }),

    addPerformer: builder.mutation<void, string>( {
      query: (id) => ({
        url: `/operation-department/statement/${id}/add-performer`,
        method: "post"
      }),
      invalidatesTags: ["IStatement"],
    })

  }),
});

export const {
  useFetchStatementsQuery,
  useAddStatementMutation,
  useUpdateStatementMutation,
  useDeleteStatementMutation,
  useAddPerformerMutation,
} = statementApi;

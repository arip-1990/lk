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
      { categoryId: number; pagination: { current: number; pageSize: number } }
    >({
      query: (args) => ({
        url: `/operation-department/statement/${args.categoryId}`,
        params: {
          page: args.pagination.current,
          pageSize: args.pagination.pageSize,
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
      query: (args) => ({
        url: `/operation-department/statement/${args.id}`,
        method: "post",
        data: args.data,
      }),
      invalidatesTags: ["IStatement"],
    }),
    updateStatement: builder.mutation<void, { id: string; data: FormData }>({
      query: (args) => ({
        url: `/operation-department/statement/${args.id}/update`,
        method: "post",
        data: args.data,
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
  }),
});

export const {
  useFetchStatementsQuery,
  useAddStatementMutation,
  useUpdateStatementMutation,
  useDeleteStatementMutation,
} = statementApi;

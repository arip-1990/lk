import { createApi } from '@reduxjs/toolkit/query/react';
import {InventData} from  '../models/Inventory';
import { axiosBaseQuery } from './api';

interface FetchInventParams {
    id?: string|undefined;
    store_id?: string|undefined
}

export interface CreateInventParams {
    description : string | null,
    inventory_number : string | null,
    line1 : string | null,
    line2 : string | null,
    barcode : string | null,
    sheet : string | null,
    category_id : number | null,
    store_id : null | string,
}

export interface DeleteInventParams {
    id: string | any;
}

export const inventoryApi= createApi({
    reducerPath: 'inventoryApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        fetchInventories: builder.query<InventData[], FetchInventParams>({
            query: ({id, store_id}: FetchInventParams={}) => ({
                url: `/inventory/${id}`,
                params: {
                    id: id,
                    store_id:store_id
                }
            }),
        }),
        addInventory: builder.mutation<InventData, CreateInventParams>({
            query: (newInventory) => ({
                url: '/inventory',
                method: 'POST',
                data: newInventory,
            }),
        }),
        deleteInventory: builder.mutation<void, DeleteInventParams>({
            query: ({ id }) => ({
                url: `/inventory/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useFetchInventoriesQuery,
    useAddInventoryMutation,
    useDeleteInventoryMutation
} = inventoryApi;


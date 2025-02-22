// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
    }),
    getCategories: builder.query({
      query: () => `categories`,
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `orders`,
        method: "POST",
        body,
      }),
    }),
    createCheckoutSession: builder.mutation({
      query: () => ({
        url: `/payment/create-checkout-session`,
        method: "POST",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useCreateCheckoutSessionMutation,
} = Api;

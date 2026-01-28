import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Game } from "../../types/Game";
import type { Category } from "../../types/Category";
import type { Author, AuthorResponse } from "../../types/Author";
import type { Client } from "../../types/Client";
export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game","Client","Prestamo"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
    }),
    getAuthors: builder.query<
      AuthorResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) => {
        return {
          url: "author",
          method: "POST",
          body: {
            pageable: {
              pageNumber,
              pageSize,
            },
          },
        };
      },
      providesTags: ["Author"],
    }),
    createAuthor: builder.mutation({
      query: (payload) => ({
        url: "/author",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation({
      query: (id: string) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
    updateAuthor: builder.mutation({
      query: (payload: Author) => ({
        url: `author/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Author", "Game"],
    }),
    getGames: builder.query<Game[], { title: string; idCategory: string }>({
      query: ({ title, idCategory }) => {
        return {
          url: "game/",
          params: { title, idCategory },
        };
      },
      providesTags: ["Game"],
    }),
    createGame: builder.mutation({
      query: (payload: Game) => ({
        url: "/game",
        method: "PUT",
        body: { ...payload },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),

    getClients:builder.query<Client[],void>({
      query:()=> "/client",
      providesTags: ["Client"],
    }),
    createClient:builder.mutation<void,Client>({
      query:(payload)=>({
        url:"/client", 
        method:"PUT",
        body:payload,
      }),
      invalidatesTags:["Client"],
    }),
    updateClient:builder.mutation<void,Client>({
      query:(payload)=> ({
        url:`/client/${payload._id}`,
        method:"PUT",
        body:payload,
      }),
      invalidatesTags:["Client"],
    }),
    deleteClient:builder.mutation<void,string>({
      query:(id)=> ({
        url:`/client/${id}`,
        method:"DELETE",
      }),
      invalidatesTags:["Client"],
    }),

    getPrestamo:builder.query<any,any>({
      query: ({ gameId, clientId, date, pageable }) => {
        return {
        url: '/prestamo', // O '/prestamo/filter' si creaste ruta nueva
        method: 'GET', // O 'POST' si tu backend espera un body
        params: { // Si es GET, se envían como ?gameId=...
        gameId,
        clientId,
        date,
        pageNumber: pageable?.pageNumber,
        pageSize: pageable?.pageSize
              }
        };
      },
        providesTags: ['Prestamo'],
    }),
      createPrestamo:builder.mutation({
      query:(prestamo)=>({
        url:'/prestamo',
        method:'POST',
        body:prestamo,
      }),
      invalidatesTags:['Prestamo'],
    }),

    deletePrestamo:builder.mutation({
      query:(id)=> ({
        url:`/prestamo/${id}`,
        method:"DELETE",
      }),
      invalidatesTags:["Prestamo"],
    }),
    updatePrestamo:builder.mutation({
      query:(payload)=>({
        url:`/prestamo/${payload._id}`,
          method:'PUT',
          body:payload,
    }),
    invalidatesTags:["Prestamo"],
      })
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useUpdateAuthorMutation,
  useCreateGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useGetPrestamoQuery,
  useCreatePrestamoMutation,
  useDeletePrestamoMutation,
  useUpdatePrestamoMutation
} = ludotecaAPI;

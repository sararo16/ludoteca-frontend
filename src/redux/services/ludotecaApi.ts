import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Game } from "../../types/Game";
import type { Category } from "../../types/Category";
import type { Author, AuthorResponse } from "../../types/Author";
import type { Client } from "../../types/Client";

//definimos el API slice para la ludoteca
export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    //url base del back
    baseUrl: "http://localhost:8080",
  }),

  //tipos de tags que vamos a usar para cachear e invalidar
  tagTypes: ["Category", "Author", "Game","Client","Prestamo"],
    
  //definicion de todos los endpoints
  endpoints: (builder) => ({

    //CATEGORY
    //obtiene todas las categorias
    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"], //permite refercar cache al modificar
    }),

    //crear categoria
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"], //obliga a recargar categorias
    }),
    //eliminar categoria
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    //actualizar categoria
    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),

    //AUTHOR
    //obtener autores sin paginar
    getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
    }),
    //obtener autores paginados por POST
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
    //crear autor
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
    //eliminar autor
    deleteAuthor: builder.mutation({
      query: (id: string) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
    //actualizar autor
    updateAuthor: builder.mutation({
      query: (payload: Author) => ({
        url: `author/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      //refresca tambien juegos, porque cambian los autores asociados 
      invalidatesTags: ["Author", "Game"],
    }),

    //GAME
    //listar juegos con filtros opcionales
    getGames: builder.query<Game[], { title: string; idCategory: string }>({
      query: ({ title, idCategory }) => {
        return {
          url: "game/",
          params: { title, idCategory },
        };
      },
      providesTags: ["Game"],
    }),
    //crear juego
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
    //actualizar juego
    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),

    //CLIENT
    //obtener cliente
    getClients:builder.query<Client[],void>({
      query:()=> "/client",
      providesTags: ["Client"],
    }),
    //crear cliente
    createClient:builder.mutation<void,Client>({
      query:(payload)=>({
        url:"/client", 
        method:"PUT",
        body:payload,
      }),
      invalidatesTags:["Client"],
    }),
    //actualizar cliente
    updateClient:builder.mutation<void,Client>({
      query:(payload)=> ({
        url:`/client/${payload._id}`,
        method:"PUT",
        body:payload,
      }),
      invalidatesTags:["Client"],
    }),
    //eliminar cliente
    deleteClient:builder.mutation<void,string>({
      query:(id)=> ({
        url:`/client/${id}`,
        method:"DELETE",
      }),
      invalidatesTags:["Client"],
    }),

    //PRESTAMO
    //filtrar prestamo con query params
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
    //crear prestamo
      createPrestamo:builder.mutation({
      query:(prestamo)=>({
        url:'/prestamo',
        method:'POST',
        body:prestamo,
      }),
      invalidatesTags:['Prestamo'],
    }),
    //eliminar prestamo
    deletePrestamo:builder.mutation({
      query:(id)=> ({
        url:`/prestamo/${id}`,
        method:"DELETE",
      }),
      invalidatesTags:["Prestamo"],
    }),
    //actualizar prestamo
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

//Hooks para usar en componentes
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

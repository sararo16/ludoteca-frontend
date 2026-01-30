import { createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from "@reduxjs/toolkit"

//Creamos un slice "message", para almacenar un mensaje global
export const messageSlice = createSlice({
  name: 'message',
  //estado inicial del slice
  initialState: {
    text: '',
    type: ''
  },
  //funciones que actualizan el estado
  reducers: {
    //elimina el mensaje, lo deja vacio
    deleteMessage: (state) => {
        state.text = ''
        state.type = ''
    },
    //establece un mensaje y su tipo
    setMessage: (state, action : PayloadAction<{text: string; type: string}>) => {
        state.text = action.payload.text;
        state.type = action.payload.type;
    },
  },
})
//exportamos las acciones
export const { deleteMessage, setMessage } = messageSlice.actions;
export default messageSlice.reducer;

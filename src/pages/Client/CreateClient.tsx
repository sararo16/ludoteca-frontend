import  { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useCreateClientMutation, useUpdateClientMutation } from "../../redux/services/ludotecaApi";
import type { Client } from "../../types/Client";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";

interface Props {
open: boolean; //controla visibilidad del dialogo
onClose: () => void;
client: Client | null; //si viene -->edicion, si es null-->creacion
}

const CreateClient = ({ open, onClose, client }: Props) => {
const [name, setName] = useState("");

//mutaciones crear y actualizar
const [createClient] = useCreateClientMutation();
const [updateClient] = useUpdateClientMutation();

//mostrar mensajes globales
const dispatch = useAppDispatch();

//cuando cambia client o el modal se abre, sincroniza el input name
useEffect(() => {
    setName(client ? client.name : "" );
}, [client, open]);

//guarda cambios, valida,crear o actualizar,muestra datos y cierra
const handleSave = async () => {

    if (!name.trim()) {
        dispatch(setMessage({ text: "El nombre no puede estar vacío", type: "error" }));
      return;
    }

    try {
      if (client) {
        // actualiza
        await updateClient({ ...client, name }).unwrap();
        dispatch(setMessage({ text: "Cliente actualizado", type: "ok" }));
      } else {
        // crea
        await createClient({ name }as any).unwrap();
        dispatch(setMessage({ text: "Cliente creado", type: "ok" }));
      }

      onClose();
    } catch (error: any) {
      dispatch(
        setMessage({
          text: error?.data?.msg || "Error al guardar",
          type: "error"
        })
      );
    }
  };

return (
<Dialog open={open} onClose={onClose}>

{/* Título del modal. Cambia editando o creando */}
<DialogTitle>{client ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
<DialogContent>
<TextField
autoFocus
margin="dense"
label="Nombre del cliente"
fullWidth
value={name}
onChange={(e) => setName(e.target.value)}
/>
</DialogContent>
<DialogActions>
{/* boton para cerrar sin guardar*/}
<Button onClick={onClose}>Cancelar</Button>

{/* boton principal */}
<Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
</DialogActions>
</Dialog>
);
};

export default CreateClient;
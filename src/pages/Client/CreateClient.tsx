import  { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useCreateClientMutation, useUpdateClientMutation } from "../../redux/services/ludotecaApi";
import type { Client } from "../../types/Client";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";

interface Props {
open: boolean;
onClose: () => void;
client: Client | null;
}

const CreateClient = ({ open, onClose, client }: Props) => {
const [name, setName] = useState("");
const [createClient] = useCreateClientMutation();
const [updateClient] = useUpdateClientMutation();
const dispatch = useAppDispatch();

useEffect(() => {
setName(client ? client.name : "");
}, [client, open]);

const handleSave = async () => {
if (!name || !name.trim()) {
dispatch(setMessage({ text: "El nombre no puede estar vacío", type: "error" }));
return;
}

try {
if (client) {
await updateClient({ ...client, name }).unwrap();
} else {
await createClient({name
}as any).unwrap();
}
onClose();
} catch (error: any) {
dispatch(setMessage({ text: error.data?.msg || "Error al guardar", type: "error" }));
}
};

return (
<Dialog open={open} onClose={onClose}>
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
<Button onClick={onClose}>Cancelar</Button>
<Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
</DialogActions>
</Dialog>
);
};

export default CreateClient;
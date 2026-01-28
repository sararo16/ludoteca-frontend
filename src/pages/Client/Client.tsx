import  {useState } from "react";
import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetClientsQuery,useDeleteClientMutation } from "../../redux/services/ludotecaApi";
import type { Client as ClientModel } from "../../types/Client";
import CreateClient from "./CreateClient";
import { ConfirmDialog } from   "../../components/ConfirmDialog";

const Client  = () => {
const { data: clients } = useGetClientsQuery();
const [deleteClient] = useDeleteClientMutation();

const [openCreate, setOpenCreate] = useState(false);
const [clientToUpdate, setClientToUpdate] = useState<ClientModel | null>(null);
const [openConfirm, setOpenConfirm] = useState(false);
const [idToDelete, setIdToDelete] = useState("");

const handleEdit = (client: ClientModel) => {
setClientToUpdate(client);
setOpenCreate(true);
};

const handleDelete = (id: string) => {
setIdToDelete(id);
setOpenConfirm(true);
};

return (
<div style={{ margin: '20px' }}>
<h1>Gestión de Clientes</h1>
<TableContainer component={Paper}>
<Table>
<TableHead>
<TableRow>
<TableCell>Identificador</TableCell>
<TableCell>Nombre Cliente</TableCell>
<TableCell align="right">Acciones</TableCell>
</TableRow>
</TableHead>
<TableBody>
{clients?.map((client,index) => (
<TableRow key={client._id}>
<TableCell>{index + 1}</TableCell>
<TableCell>{client.name}</TableCell>
<TableCell align="right">
<IconButton onClick={() => handleEdit(client)}><EditIcon /></IconButton>
<IconButton onClick={() => handleDelete(client._id)}><ClearIcon color="error" /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>

<div style={{ marginTop: '20px', textAlign: 'right' }}>
<Button variant="contained" color="primary" onClick={() => { setClientToUpdate(null); setOpenCreate(true); }}>
Nuevo cliente
</Button>
</div>

<CreateClient
open={openCreate}
onClose={() => setOpenCreate(false)}
client={clientToUpdate}
/>

<ConfirmDialog
open={openConfirm}
title="Eliminar cliente"
content="¿Estás seguro de que deseas eliminar este cliente?"
onClose={() => setOpenConfirm(false)}
onConfirm={() => { deleteClient(idToDelete); setOpenConfirm(false); }}
/>
</div>
);
};

export default Client;



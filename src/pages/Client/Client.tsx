//este archivo contiene la gestion de clientes: listado, edicion, eliminacion y creacion
import  {useState } from "react";
import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetClientsQuery,useDeleteClientMutation } from "../../redux/services/ludotecaApi";
import type { Client as ClientModel } from "../../types/Client";
import CreateClient from "./CreateClient";
import { ConfirmDialog } from   "../../components/ConfirmDialog";


const Client  = () => {
//obtiene la lista de clientes 
const { data: clients } = useGetClientsQuery();
//funcion mutadora eliminar cliente
const [deleteClient] = useDeleteClientMutation();

//abre/Cierra para crear o editar
const [openCreate, setOpenCreate] = useState(false);
const [clientToUpdate, setClientToUpdate] = useState<ClientModel | null>(null);
//controla confirm dialog al eliminar
const [openConfirm, setOpenConfirm] = useState(false);
//id cliente al eliminar
const [idToDelete, setIdToDelete] = useState("");

//guardamos el cliente que se quiere editar
const handleEdit = (client: ClientModel) => {
setClientToUpdate(client);
setOpenCreate(true);
};

const handleDelete = (id: string) => {
setIdToDelete(id); //se almacena el id a borrar
setOpenConfirm(true); //mostramos dialogo de confirmacion
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
    {/* Listado de clientes */}
{clients?.map((client,index) => (
<TableRow key={client._id}>
<TableCell>{index + 1}</TableCell>
<TableCell>{client.name}</TableCell>
<TableCell align="right">

{/* Botones de acciones editar o eliminar */}
<IconButton onClick={() => handleEdit(client)}><EditIcon /></IconButton>
<IconButton onClick={() => handleDelete(client._id)}><ClearIcon color="error" /></IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>

{/* Boton de nuevo cliente */}
<div style={{ marginTop: '20px', textAlign: 'right' }}>
<Button variant="contained" color="primary" onClick={() => { setClientToUpdate(null); setOpenCreate(true); }}>
Nuevo cliente
</Button>
</div>

{/*Modal para crear o editar cliente, null si es nuevo */}
<CreateClient
open={openCreate}
onClose={() => setOpenCreate(false)}
client={clientToUpdate}
/>

{/* mensaje para evitar eliminaciones accidentales si es true */}
<ConfirmDialog
open={openConfirm}
title="Eliminar cliente"
content="¿Estás seguro de que deseas eliminar este cliente?"
onClose={() => setOpenConfirm(false)}
onConfirm={() => { deleteClient(idToDelete); 
                setOpenConfirm(false); }}
/>
</div>
);
};

export default Client;



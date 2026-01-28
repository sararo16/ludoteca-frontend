import { useState } from 'react';
import {
Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
Button, IconButton, CircularProgress, TextField, MenuItem, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { CreatePrestamo } from './CreatePrestamo';
import {
useGetPrestamoQuery,
useDeletePrestamoMutation,
useGetGamesQuery,
useGetClientsQuery
} from "../../redux/services/ludotecaApi";

export const PrestamoList = () => {
const [openModal, setOpenModal] = useState(false);
const [selectedPrestamo, setSelectedPrestamo] = useState<any | null>(null);

const [filterGame, setFilterGame] = useState('');
const [filterClient, setFilterClient] = useState('');
const [filterDate, setFilterDate] = useState('');
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(5);

const { data: games = [] } = useGetGamesQuery({ title: '', idCategory: '' });
const { data: clients = [] } = useGetClientsQuery();

const [deletePrestamo] = useDeletePrestamoMutation();

const { data: prestamoData, isLoading } = useGetPrestamoQuery({
gameId: filterGame,
clientId: filterClient,
date: filterDate,
pageable: {
pageNumber: page,
pageSize: pageSize
}
});

const prestamoList = prestamoData?.content || prestamoData || [];
const totalElements = prestamoData?.totalElements || 0;


const handleCreate = () => {
setSelectedPrestamo(null);
setOpenModal(true);
};

const handleEdit = (item: any) => {
setSelectedPrestamo(item);
setOpenModal(true);
};

const handleDelete = async (id: string) => {
if (window.confirm("¿Seguro que quieres borrar este préstamo?")) {
await deletePrestamo(id);
}
};

const formatDate = (dateString: string) => {
if (!dateString) return "";
return new Date(dateString).toLocaleDateString();
};

if (isLoading) return <CircularProgress />;

return (
<div style={{ padding: '20px' }}>
<h1>Gestión de Préstamos</h1>

<div style={{
display: 'flex', gap: '10px', marginBottom: '20px',
backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px'
}}>
<TextField
select
label="Filtrar por Juego"
value={filterGame}
onChange={(e) => setFilterGame(e.target.value)}
style={{ width: '200px' }}
size="small"
>
<MenuItem value=""><em>Todos</em></MenuItem>
{games.map((g: any) => (
<MenuItem key={g.id} value={g.id}>{g.title}</MenuItem>
))}
</TextField>

<TextField
select
label="Filtrar por Cliente"
value={filterClient}
onChange={(e) => setFilterClient(e.target.value)}
style={{ width: '200px' }}
size="small"
>
<MenuItem value=""><em>Todos</em></MenuItem>
{clients.map((c: any) => (
<MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
))}
</TextField>

<TextField
type="date"
label="Filtrar por Fecha"
InputLabelProps={{ shrink: true }}
value={filterDate}
onChange={(e) => setFilterDate(e.target.value)}
size="small"
/>

<Button variant="outlined" onClick={() => {
setFilterGame('');
setFilterClient('');
setFilterDate('');
}}>
Limpiar
</Button>
</div>

<div style={{ marginBottom: '20px', textAlign: 'right' }}>
<Button variant="contained" color="primary" onClick={handleCreate}>
Nuevo Préstamo
</Button>
</div>

<TableContainer component={Paper}>
<Table>
<TableHead>
<TableRow>
<TableCell>Identificador</TableCell>
<TableCell>Nombre del Juego</TableCell>
<TableCell>Nombre del Cliente</TableCell>
<TableCell>Fecha Inicio</TableCell>
<TableCell>Fecha Fin</TableCell>
<TableCell align="right">Acciones</TableCell>
</TableRow>
</TableHead>
<TableBody>
{prestamoList.map((item: any, index: number) => (
<TableRow key={item._id || index}>
<TableCell>{index + 1}</TableCell>
<TableCell>{item.game?.title || "Juego borrado"}</TableCell>
<TableCell>{item.client?.name || "Cliente borrado"}</TableCell>
<TableCell>{formatDate(item.startDate)}</TableCell>
<TableCell>{formatDate(item.endDate)}</TableCell>
<TableCell align="right">
<IconButton onClick={() => handleEdit(item)}>
<EditIcon />
</IconButton>
<IconButton onClick={() => handleDelete(item._id)}>
<ClearIcon color="error" />
</IconButton>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>

<TablePagination
component="div"
count={totalElements}
page={page}
onPageChange={(_event, newPage) => setPage(newPage)}
rowsPerPage={pageSize}
onRowsPerPageChange={(event) => {
setPageSize(parseInt(event.target.value, 10));
setPage(0);
}}
/>

<CreatePrestamo
open={openModal}
onClose={() => setOpenModal(false)}
prestamo={selectedPrestamo}
/>
</div>
);
};

export default PrestamoList;
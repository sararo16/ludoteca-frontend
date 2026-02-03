
//Este archivo contiene el componente para crear o editar un préstamo de juego
import { useState, useEffect } from 'react';
import {
Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
MenuItem, FormControl, InputLabel, Select, FormHelperText
} from '@mui/material';
import {
useGetClientsQuery,
useGetGamesQuery,
useCreatePrestamoMutation,
useUpdatePrestamoMutation
} from "../../redux/services/ludotecaApi";

//Definicion de las props del componente
interface Props {
open: boolean;
onClose: () => void;
prestamo?:any;
}

export const CreatePrestamo = ({ open, onClose,prestamo }: Props) => {
//estado local del formulario
const [clientId, setClientId] = useState("");
const [gameId,setGameId] = useState("");
const [startDate,setStartDate] = useState("");
const [endDate,setEndDate] = useState("");
const [errorMsg,setErrorMsg] = useState("");

//queries: clientes y juegos
const {data:clients=[]} = useGetClientsQuery();
const { data: games = [] } = useGetGamesQuery({ title: '', idCategory: '' });
//mutations:crear y actualizar prestamo
const [createPrestamo] = useCreatePrestamoMutation();
const [updatePrestamo]=useUpdatePrestamoMutation();

//cargar datos cuando abrimos modal en modo edicion, o limpiarlos en modo crear
useEffect(() => {
    if (prestamo){
        setClientId(prestamo.client?._id || prestamo.client);
        setGameId(prestamo.game?._id || prestamo.game?._id||prestamo.game);
        setStartDate(prestamo.startDate?.split('T')[0]|| "");
        setEndDate(prestamo.endDate?.split('T')[0]|| "");
    }else{
        setClientId('');
        setGameId('');
        setStartDate('');
        setEndDate('');
    }
    setErrorMsg('');
}, [prestamo,open]);

const handleSave = async () => {
    //validacion basica
    if (!clientId || !gameId || !startDate || !endDate) {
setErrorMsg("Todos los campos son obligatorios");
return;
}

const start=new Date(startDate);
const end=new Date(endDate);
if (end <=start ) {
setErrorMsg("La fecha de fin debe ser posterior a la de inicio");
return;
}
    //calcular dias de prestamo
const diffTime = Math.abs(end.getTime() - start.getTime());
const diffDays=Math.ceil(diffTime/(1000*60*60*24));

if (diffDays > 14) {
setErrorMsg("El préstamo no puede durar más de 14 días");
return;
}

try {
    if (prestamo) {
        //actualizamos si existe el prestamo
    await updatePrestamo({
    _id: prestamo._id, 
    game: gameId,
    client: clientId,
    startDate,
    endDate
    }).unwrap();
    } else {
        //crear si no existe
    await createPrestamo({
    game: gameId,
    client: clientId,
    startDate,
    endDate
    }).unwrap();
    }

    //cerrar y limpiar
    onClose();
    setClientId('');
    setGameId('');
    setStartDate('');
    setEndDate('');
    setErrorMsg('');
    } catch (error) {
    setErrorMsg("Error al guardar el préstamo");
    }
    };

return (
<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
<DialogTitle>Nuevo Préstamo</DialogTitle>
<DialogContent>
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>

{/* Cliente */}
<FormControl fullWidth>
<InputLabel>Cliente</InputLabel>
<Select
value={clientId}
label="Cliente"
onChange={(e) => setClientId(e.target.value)}
>
{clients.map((client) => (
<MenuItem key={client._id} value={client._id}>
{client.name}
</MenuItem>
))}
</Select>
</FormControl>

  {/* Juego */}
<FormControl fullWidth>
<InputLabel>Juego</InputLabel>
<Select
value={gameId}
label="Juego"
onChange={(e) => setGameId(e.target.value)}
>
{games.map((game) => (
<MenuItem key={game.id} value={game.id}>
{game.title}
</MenuItem>
))}
</Select>
</FormControl>

 {/* Fechas */}
<TextField
label="Fecha Inicio"
type="date"
InputLabelProps={{ shrink: true }}
value={startDate}
onChange={(e) => setStartDate(e.target.value)}
fullWidth
/>
<TextField
label="Fecha Fin"
type="date"
InputLabelProps={{ shrink: true }}
value={endDate}
onChange={(e) => setEndDate(e.target.value)}
fullWidth
/>

{/* Errores */}
{errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
</div>
</DialogContent>
<DialogActions>
<Button onClick={onClose}>Cancelar</Button>
<Button onClick={handleSave} variant="contained" color="primary">
Guardar
</Button>
</DialogActions>
</Dialog>
);
};

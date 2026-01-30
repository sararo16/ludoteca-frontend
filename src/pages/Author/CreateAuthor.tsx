import { type ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Author } from "../../types/Author";

interface Props {
  author: Author | null; //edicion / creacion
  closeModal: () => void;
  create: (author: Author) => void;
}

//estado inicial , para modo creacion
const initialState = {
  name: "",
  nationality: "",
};

export default function CreateAuthor(props: Props) {
  //name, nacionality
  const [form, setForm] = useState(initialState);

  //cuando cambie props.author , abrir modal en modo edicion, se cargan los datos
  useEffect(() => {
    setForm(props?.author || initialState);
  }, [props?.author]);

  //handle generico, usa id del TextField como clave del estado
  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <div>
   {/* Dialog siempre abierto,
    onClose cierra con closeModal */}   
      <Dialog open={true} onClose={props.closeModal}>
         {/* Título cambia según modo crear o actualizar */}
        <DialogTitle>
          {props.author ? "Actualizar Autor" : "Crear Autor"}
        </DialogTitle>

         {/* Si es edición, muestra el ID en un campo bloqueado */}
        <DialogContent>
          {props.author && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.author.id}
              variant="standard"
            />
          )}
        {/* Campo Nombre */}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.name}
          />

           {/* Campo Nacionalidad*/}
          <TextField
            margin="dense"
            id="nationality"
            label="Nacionalidad"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.nationality}
          />
        </DialogContent>

        <DialogActions>
          {/* Botón cancelar*/}
          <Button onClick={props.closeModal}>Cancelar</Button>
          
          {/* Botón crear/actualizar: llama a props.create con los datos.
              Si es edición, usa el id del autor
              si es creación, envía id vacío  */}
          <Button
            onClick={() =>
              props.create({
                id: props.author ? props.author.id : "",
                name: form.name,
                nationality: form.nationality,
              })
            }
            disabled={!form.name || !form.nationality} //deshabilita si faltan campos
          >
            {props.author ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

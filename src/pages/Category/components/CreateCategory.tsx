import { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Category } from "../../../types/Category";

interface Props {
  category: Category | null; //si viene --> edicion, si es null--> creacion
  closeModal: () => void;
  create: (name: string) => void;
}

export default function CreateCategory(props: Props) {
    //se inicializa con el nombre de la categoria si existe o en vacio si se crea
  const [name, setName] = useState(props?.category?.name || "");
 
  //sincronizar formulario cuando cambia category
    useEffect(() => {
    setName(props.category?.name?? "");
  }, [props.category]);

// Validación mínima 
  const nameError = !name.trim() ? "El nombre es obligatorio" : "";
  const isInvalid = Boolean(nameError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;
    props.create(name.trim());
  };
  return (
    <div>
      {/* Dialog  abierto  */}
      <Dialog open={true} onClose={props.closeModal}>
        <form onSubmit={handleSubmit} noValidate>
        {/* Título dinámico según sea crear o editar */}
        <DialogTitle>
          {props.category ? "Actualizar Categoría" : "Crear Categoría"}
        </DialogTitle>
        <DialogContent>
          {/* Si es edición, muestra el ID en un campo deshabilitado */}
          {props.category && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.category.id}
              variant="standard"
            />
          )}
          {/* Campo de texto para el nombre */}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          {/*Si name esta vacio se deshabilita*/ }
        
          <Button type="submit" disabled={!name.trim()}>
          {props.category ? "Actualizar" : "Crear"}

          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

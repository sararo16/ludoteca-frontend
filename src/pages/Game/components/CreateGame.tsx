import { type ChangeEvent, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useGetAllAuthorsQuery,
  useGetCategoriesQuery,
} from "../../../redux/services/ludotecaApi";
import { LoaderContext } from "../../../context/LoaderProvider";
import type { Game } from "../../../types/Game";
import type { Category } from "../../../types/Category";
import type { Author } from "../../../types/Author";

//props que recibe el componente 
interface Props {
  game: Game | null;
  closeModal: () => void;
  create: (game: Game) => void;
}

//estado inicial del formulario
const initialState = {
  id: "",
  title: "",
  age: 0,
  category: undefined,
  author: undefined,
};

export default function CreateGame(props: Props) {

  //formulario del juego
  const [form, setForm] = useState<Game>(initialState);

  //usamos el contexto del loader para mostrar/cerrar carga
  const loader = useContext(LoaderContext);

  //peticiones
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery(null);
  const { data: authors, isLoading: isLoadingAuthors } =
    useGetAllAuthorsQuery(null);

    //si recibimos un juego por prots(editar) rellenamos el formulario
  useEffect(() => {
    setForm({
      id: props.game?.id || "",
      title: props.game?.title || "",
      age: props.game?.age || 0,
      category: props.game?.category,
      author: props.game?.author,
    });
  }, [props?.game]);

  //cuando categorias o autores estan cargando, mostramos loader
  useEffect(() => {
    loader.showLoading(isLoadingCategories || isLoadingAuthors);
  }, [isLoadingCategories, isLoadingAuthors]);

  //maneja cambios en inputs de texto
  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,

      //se actualiza dinamicamente la propiedad con el id del input
      [event.target.id]: event.target.value,
    });
  };


  //maneja cambios en los selects (categoria y autor)
  const handleChangeSelect = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //segun el name del select, obtenemos categorias o autores
    const values = event.target.name === "category" ? categories : authors;
    setForm({
      ...form,
      //buscamos el objeto completo por id 
      [event.target.name]: values?.find((val) => val.id === event.target.value),
    });
  };

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          
        {/* Título del modal cambia según editar/crear */}
          {props.game ? "Actualizar Juego" : "Crear Juego"}
        </DialogTitle>

        <DialogContent>
          {/* Campo ID solo se muestra si estamos editando */}
          {props.game && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.game.id}
              variant="standard"
            />
          )}
          
          {/* Campo Título */}
          <TextField
            margin="dense"
            id="title"
            label="Titulo"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.title}
          />
          
          {/* Campo Edad */}
          <TextField
            margin="dense"
            id="age"
            label="Edad Recomendada"
            fullWidth
            type="number"
            variant="standard"
            onChange={handleChangeForm}
            value={form.age}
          />
          
          {/* Campo Categoría (Select) */}
          <TextField
            id="category"
            select
            label="Categoría"
            defaultValue="''"
            fullWidth
            variant="standard"
            name="category"
            value={form.category ? form.category.id : ""}
            onChange={handleChangeSelect}
          >
            
            {/* Listado de opciones */}
            {categories &&
              categories.map((option: Category) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
          
          {/* Campo Autor (Select) */}
          <TextField
            id="author"
            select
            label="Autor"
            defaultValue="''"
            fullWidth
            variant="standard"
            name="author"
            value={form.author ? form.author.id : ""}
            onChange={handleChangeSelect}
          >
            {authors &&
              authors.map((option: Author) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
        
          {/* Botón cancelar */}
          <Button onClick={props.closeModal}>Cancelar</Button>
         
          {/* Botón Crear/Actualizar */}
          <Button
            onClick={() =>
              props.create({
                id: "",
                title: form.title,
                age: form.age,
                category: form.category,
                author: form.author,
              })
            }
            
            // Desactivado si faltan campos obligatorios
            disabled={
              !form.title || !form.age || !form.category || !form.author
            }
          >
            {props.game ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

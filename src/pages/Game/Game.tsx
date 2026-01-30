import { useState, useContext, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GameCard from "./components/GameCard";
import styles from "./Game.module.css";
import {
  useCreateGameMutation,
  useGetCategoriesQuery,
  useGetGamesQuery,
  useUpdateGameMutation,
} from "../../redux/services/ludotecaApi";
import CreateGame from "./components/CreateGame";
import { LoaderContext } from "../../context/LoaderProvider";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";
import type { Game as GameModel } from "../../types/Game";
import type { Category } from "../../types/Category";

export const Game = () => {
  //control del modal de crear/Editar
  const [openCreate, setOpenCreate] = useState(false);
  //Filtros del listadp titulo y categoria
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  //si no es null, estamos en modo edicion
  const [gameToUpdate, setGameToUpdate] = useState<GameModel | null>(null);
  
  //loader global y dispatcher de mensajes
  const loader = useContext(LoaderContext);
  const dispatch = useAppDispatch();

  //query de juegos con filtros, is fetching-->esta recargando por cambios de filtros
  const { data, error, isLoading, isFetching } = useGetGamesQuery({
    title: filterTitle,
    idCategory: filterCategory,
  });

  //mutacion para actualizar juegos 
  const [updateGameApi, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateGameMutation();

  //query de categorias para el select de filtro 
  const { data: categories } = useGetCategoriesQuery(null);

  //mutacion para crear juegos 
  const [createGameApi, { isLoading: isLoadingCreate, error: errorCreate }] =
    useCreateGameMutation();

  //enciende el loader si cualquiera de las operaciones esta cargando
  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoadingUpdate || isLoading || isFetching
    );
  }, [isLoadingCreate, isLoadingUpdate, isLoading, isFetching]);

  //si falla crear o actualizar, lanza mensaje de error
  useEffect(() => {
    if (errorCreate || errorUpdate) {
      dispatch(setMessage({
        text: "Se ha producido un error al realizar la operación",
        type: "error",
      }));
    }
  }, [errorUpdate, errorCreate,dispatch]);

  //si falla el listado se renderiza un mensaje de error simple
  if (error) return <p>Error cargando!!!</p>;

  //crear o actualizar juego 
  const createGame = async (game: GameModel) => {
    setOpenCreate(false);
    try{
    if (gameToUpdate) {
      //actualizar- manda el juego con el id que se esta editando
      await updateGameApi({
        ...game,
        id: gameToUpdate.id,
      }).unwrap();
          dispatch(
            setMessage({
              text: "Juego actualizado correctamente",
              type: "ok",
            })
          );
          setGameToUpdate(null);
        }else{
        //crear
        await createGameApi(game).unwrap();
          dispatch(
            setMessage({
              text: "Juego creado correctamente",
              type: "ok",
            })
          );
          setGameToUpdate(null);
          }
        }
          catch (e: any) {
      const msg = e?.data?.msg ?? "No se pudo guardar el juego. Inténtalo de nuevo.";
    dispatch(setMessage({ text: msg, type: "error" }));
  }
};


  return (
    <div className="container">
      <h1>Catálogo de juegos</h1>

    {/* Barra de filtros (por título y por categoría) */}   
      <div className={styles.filter}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            margin="dense"
            id="title"
            label="Titulo"
            fullWidth
            value={filterTitle}
            variant="standard"
            onChange={(event) => setFilterTitle(event.target.value)}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="category-select"
            name="category"
            select
            label="Categoría"
            fullWidth
            variant="standard"
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            <MenuItem value="">
            <em>Todas</em>
            </MenuItem>
            {categories &&
              categories.map((option: Category) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => {
            setFilterCategory("");
            setFilterTitle("");
          }}
        >
          Limpiar
        </Button>
      </div>

      {/* Grid de tarjetas de juegos; 
      cada card abre el modal en modo edición */}
      <div className={styles.cards}>

     {/* Mensaje si no hay juegos según los filtros */}
      {data && data.length === 0 && (
        <p style={{ padding: 16, color: "#666" }}>
          No hay juegos que coincidan con los filtros.
        </p>
      )}

    {/* Renderizado de las tarjetas de juegos */}
    {data?.map((card) => (
      <div
      key={card.id}
      className={styles.card}
      onClick={() => {
        setGameToUpdate(card);
        setOpenCreate(true);
      }}
      >
      <GameCard game={card} />
    </div>
      ))}

</div>
      {/* Botón para crear un nuevo juego */}
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo juego
        </Button>
      </div>
      
      {/* Modal para crear/editar  juego */}
      {openCreate && (
        <CreateGame
          create={createGame}
          game={gameToUpdate}
          closeModal={() => {
            setGameToUpdate(null);
            setOpenCreate(false);
          }}
        />
      )}
    </div>
  );
};

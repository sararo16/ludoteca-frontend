import { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import styles from "./Category.module.css";
import type { Category as CategoryModel } from "../../types/Category";
import CreateCategory from "./components/CreateCategory";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/services/ludotecaApi";
import { setMessage } from "../../redux/features/messageSlice";
import type { BackError } from "../../types/appTypes";
import { LoaderContext } from "../../context/LoaderProvider";


//Página de Categorías: listar, crear/editar (modal) y eliminar 
export const Category = () => {
  const [openCreate, setOpenCreate] = useState(false); //control modal de crear/editar
  
  //si no es null, modo edicion
  const [categoryToUpdate, setCategoryToUpdate] =
    useState<CategoryModel | null>(null);

  //redux dispach para mensajes
  const dispatch = useAppDispatch();

  //listamos las categorias sin paginacion
  const { data, isLoading } = useGetCategoriesQuery(null);

  //eliminar categoria
  const [
    deleteCategoryApi,
    { isLoading: isLoadingDelete },
  ] = useDeleteCategoryMutation();
  const [createCategoryApi, { isLoading: isLoadingCreate }] =
    useCreateCategoryMutation();

  //crear y actualizar
  const [updateCategoryApi, { isLoading: isLoadingUpdate }] =
    useUpdateCategoryMutation();
   
    const loader = useContext(LoaderContext);

  //operacion en curso--> mostrar/ocultar loader global
 useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);

  //crear o actualizar una categoria a partir de su nombre
const createCategory = async (categoryName:string) => {
  setOpenCreate(false);
    //actualizar si hay categoria seleccionada
    try{
    if (categoryToUpdate) {
     await updateCategoryApi({ id: categoryToUpdate.id, name: categoryName })
        .unwrap();
          dispatch(
            setMessage({
              text: "Categoría actualizada correctamente",
              type: "ok",
            })
          );
    } else {
      await createCategoryApi({ name: categoryName }).unwrap();
        dispatch (setMessage({ text: "Categoría creada correctamente", type: "ok" }));
      } 
      setCategoryToUpdate(null);
    }
    catch (e) {
      const msg =
        (e as BackError)?.msg ?? "No se pudo guardar la categoría. Inténtalo de nuevo.";
      dispatch(setMessage({ text: msg, type: "error" }));
    }
  };


  //Cierra el modal y limpia el estado de edicion
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setCategoryToUpdate(null);

  };
  //controla el id a eliminar 
const [idToDelete, setIdToDelete] = useState("");

const deleteCategory = async () => {
    try {
      await deleteCategoryApi(idToDelete).unwrap();
      dispatch(setMessage({ text: "Categoría borrada correctamente", type: "ok" }));
      setIdToDelete("");
    } catch (e) {
      const msg =
        (e as BackError)?.msg ?? "No se pudo borrar la categoría. Inténtalo de nuevo.";
      dispatch(setMessage({ text: msg, type: "error" }));
    }
  };



  return (
    <div className="container">
      <h1>Listado de Categorías</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre categoría</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {/* Si data existe, pintamos las filas */}
            {data && data.map((category: CategoryModel,index:number) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index+1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>
                  <div className={styles.tableActions}>
                     {/* Editar ,abre modal y carga la categoría */}
                    <IconButton aria-label="update" color="primary" onClick ={() => {
                        setCategoryToUpdate(category);
                        setOpenCreate(true);
                      }}>
                      <EditIcon />
                    </IconButton>
                    {/* Eliminar: abre confirm dialog  */}
                    <IconButton aria-label="delete" color="error" onClick={() => {
                          setIdToDelete(category.id);
                        }}>
                      <ClearIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Botón para crear nueva categoría */}
            <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nueva categoría
        </Button>
      </div>
      
      {/* Modal crear/editar categoría */}
      {openCreate && (
        <CreateCategory
          create={createCategory}
          category={categoryToUpdate} //si existe --> edicion
          closeModal={handleCloseCreate} //cierra y limpia
        />
      )}

        {/* ConfirmDialog para eliminar*/}
            {!!idToDelete && (
        <ConfirmDialog
        open={!!idToDelete} 
        onClose={() => setIdToDelete('')} 
        onConfirm={deleteCategory} 
        title="Eliminar categoría"
        content="Atención si borra la categoría se perderán sus datos. ¿Desea eliminar la categoría?"
        />
      )}

  

      </div>
  );
};

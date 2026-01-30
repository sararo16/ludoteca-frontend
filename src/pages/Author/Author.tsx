import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "../../components/Author/Author.module.css";
import CreateAuthor from "./CreateAuthor";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";
import type { BackError } from "../../types/appTypes";
import type { Author as AuthorModel } from "../../types/Author";
import {
  useDeleteAuthorMutation,
  useGetAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
} from "../../redux/services/ludotecaApi";
import { LoaderContext } from "../../context/LoaderProvider";


export const Author = () => {
  //paginacion
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [authors, setAuthors] = useState<AuthorModel[]>([]);
  
  const [openCreate, setOpenCreate] = useState(false);  //creacion edicion

  const [idToDelete, setIdToDelete] = useState("");  //si tiene valor eliminar

  const [authorToUpdate, setAuthorToUpdate] = useState<AuthorModel | null>(
    null
  ); //si tiene autor ,modo edicion

  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  //handlers de paginacion
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  //consulta principal, obtener listado paginado autores
  const { data, error, isLoading } = useGetAuthorsQuery({
    pageNumber,
    pageSize,
  });

  //mutacion eliminar autor
  const [deleteAuthorApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteAuthorMutation();

  //mutacion crear autor
  const [createAuthorApi, { isLoading: isLoadingCreate }] =
    useCreateAuthorMutation();
  //mutacion actualizar autor
  const [updateAuthorApi, { isLoading: isLoadingUpdate }] =
    useUpdateAuthorMutation();

  //loader global , estados de carga
  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);

  //set tabla y total cuando llega data
  useEffect(() => {
    if (data) {
      setAuthors(data.content);
      setTotal(data.totalElements);
    }
  }, [data]);

  //error en delete, saca mensaje
  useEffect(() => {
    if (errorDelete && "status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          })
        );
      }
  }, [errorDelete, dispatch]);

  //error en listado
  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [error,dispatch]);

  //crear / editar autores
  const createAuthor = async (author: AuthorModel) => {
    setOpenCreate(false); //cierra el modal
    
    try{
      //si hay id actualiza
      if (author.id) {
        await updateAuthorApi(author).unwrap();
        dispatch(
          setMessage({ text: "Autor actualizado correctamente", type: "ok" })
        );
        //si no crea
      } else {
        await createAuthorApi(author).unwrap();
        dispatch(
          setMessage({ text: "Autor creado correctamente", type: "ok" })
        );
      }
      setAuthorToUpdate(null); //se resetea

    } catch (e) {
      const msg =
        (e as BackError)?.msg ?? "No se pudo guardar el autor. Inténtalo de nuevo.";
      dispatch(setMessage({ text: msg, type: "error" }));
    }
  };

  //eliminar autor
  const deleteAuthor = async () => {
    try {
      await deleteAuthorApi(idToDelete).unwrap();
      dispatch(
        setMessage({ text: "Autor eliminado correctamente", type: "ok" })
      );
      setIdToDelete("");
    } catch (e) {
      const msg =
        (e as BackError)?.msg ?? "No se pudo eliminar el autor. Inténtalo de nuevo.";
      dispatch(setMessage({ text: msg, type: "error" }));
    }
  };


  return (
    //tabla
    <div className="container">
      <h1>Listado de Autores</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre Autor</TableCell>
              <TableCell>Nacionalidad</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author,index) => (
              <TableRow key={author.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell style={{ width: 160 }}>{author.name}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {author.nationality}
                </TableCell>
                <TableCell align="right">
                  <div className={styles.tableActions}>
                    <IconButton
                      aria-label="update"
                      color="primary"
                      onClick={() => {
                        setAuthorToUpdate(author);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        setIdToDelete(author.id);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
                count={total}
                rowsPerPage={pageSize}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo autor
        </Button>
      </div>

      {/* Modal crear/editar */}
      {openCreate && (
        <CreateAuthor
          create={createAuthor}
          author={authorToUpdate}
          closeModal={() => {
            setAuthorToUpdate(null);
            setOpenCreate(false);
          }}
        />
      )}
       {/*Diálogo confirmación */}
      {!!idToDelete && (
        <ConfirmDialog
          open={!!idToDelete}
          onClose={()=>setIdToDelete("")}
          onConfirm={deleteAuthor}
          title="Eliminar Autor"
          content="Atención si borra el autor se perderán sus datos. ¿Desea eliminar el autor?"
        />
      )}
    </div>
  );
};

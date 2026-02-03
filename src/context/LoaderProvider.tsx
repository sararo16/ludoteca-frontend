
//Provider global de loader
//expone un contexto para mostrar / ocultar
//spinner de pantalla completa
//envolver la app
import { createContext, useState, type ReactNode } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//crear contexto con valores por defecto
export const LoaderContext = createContext({
  loading: false, //si el loader esta activo
  showLoading: (_show: boolean) => {}, //activar/desactivar loader
});

//tipado de las props del provider, children para envolver app
type Props = {
  children: ReactNode;
};

//funcion de control que actualiza el estado loading
export const LoaderProvider = ({ children }: Props) => {
  const showLoading = (show: boolean) => {
    setState((prev) => ({
      ...prev,
      loading: show,
    }));
  };

  //estado unico que guarda el flag y show loading
  const [state, setState] = useState({
    loading: false,
    showLoading,
  });

  return (
    <LoaderContext.Provider value={state}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {children}
    </LoaderContext.Provider>
  );
};

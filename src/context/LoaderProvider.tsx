import { createContext, useState, type ReactNode } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


export const LoaderContext = createContext({
  loading: false,
  showLoading: (_show: boolean) => {},
});

type Props = {
  children: ReactNode;
};

export const LoaderProvider = ({ children }: Props) => {
  const showLoading = (show: boolean) => {
    setState((prev) => ({
      ...prev,
      loading: show,
    }));
  };

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

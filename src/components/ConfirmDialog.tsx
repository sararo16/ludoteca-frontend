//dialogo de confirmacion 
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open:boolean; //dialogo visible
  onClose: () => void; //cerrar
  onConfirm: () => void; //confirmar
  title: string;
  content: string;
}

export const ConfirmDialog = (props: Props) => {
  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button onClick={() => props.onConfirm()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

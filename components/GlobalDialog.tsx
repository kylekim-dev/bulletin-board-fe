import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { DialogTitle, Divider, IconButton, Icon, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { openDialog, closeDialog } from "@/slices/globalSlice";

export default function GlobalDialog() {
  const dialogStatus = useSelector(
    (state: RootState) => state.global.dialogStatus
  );
  const dispatch = useDispatch();
  return (
    <>
      <Dialog
        open={dialogStatus.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ maxWidth: 500, borderRadius: 2, boxShadow: 0, mx: "auto" }}
        fullWidth
        disableEnforceFocus
      >
        <DialogTitle sx={{ m:0, p: 0 }} textAlign={'right'}>
          <IconButton onClick={() => dispatch(closeDialog())}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign={"center"}>
            <Icon sx={{ fontSize: 100 }} color={dialogStatus.status}>
              <CheckCircleIcon sx={{ fontSize: 100, py: 1 }} />
            </Icon>
          </Box>
          <DialogContentText
            sx={{ fontWeight: "bold", my: 1 }}
            variant="h5"
            textAlign={"center"}
          >
            {dialogStatus.status == "success"
              ? "Successful"
              : dialogStatus.status == "error"
              ? "Error"
              : "Something went wrong"}
          </DialogContentText>
          <DialogContentText sx={{ my: 1 }} textAlign={"center"}>
          <div
  dangerouslySetInnerHTML={{
    __html: dialogStatus.message ?? ""
  }}></div>
          </DialogContentText>
          <Divider sx={{ borderBottomWidth: 3 }}></Divider>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mx: "auto", borderRadius: 28, maxWidth: 220, boxShadow: 0 }}
            variant="contained"
            fullWidth
            color={dialogStatus.status}
            onClick={() => dispatch(closeDialog())}
            autoFocus
          >
            {dialogStatus.status == "success"
              ? "Ok"
              : dialogStatus.status == "error"
              ? "Try again"
              : "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

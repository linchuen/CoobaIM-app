import type React from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectErrorMessage, selectErrorDialogOpen, setErrorDialogOpen } from "../features/globalSlice"

export const ErrorDialog: React.FC = () => {
  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector(selectErrorMessage)
  const errorDialogOpen = useAppSelector(selectErrorDialogOpen)

  return (
    <Dialog open={errorDialogOpen} onClose={() => dispatch(setErrorDialogOpen(false))
    }>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>{errorMessage}</DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(setErrorDialogOpen(false))} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

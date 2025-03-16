import type React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { addAgentThunk } from "../../AgentSlice";
import { useAppDispatch } from "../../../../app/hooks";

const AddCustomerSupport: React.FC = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        dispatch(addAgentThunk(formData))
        handleClose();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen} variant="contained" color="primary" sx={{ minWidth: 120 }}>
                建立客服人員
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>建立客服人員</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="名稱" name="name" fullWidth onChange={handleChange} />
                    <TextField margin="dense" label="部門" name="department" fullWidth onChange={handleChange} />
                    <TextField margin="dense" label="Email" name="email" type="email" fullWidth onChange={handleChange} />
                    <TextField margin="dense" label="密碼" name="password" type="password" fullWidth onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">取消</Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">送出</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddCustomerSupport;

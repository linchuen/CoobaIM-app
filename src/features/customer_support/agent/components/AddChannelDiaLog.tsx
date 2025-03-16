import type React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Switch, FormControlLabel } from "@mui/material";
import { useAppDispatch } from "../../../../app/hooks";
import { addChannelThunk } from "../../ChannelSlice";

const AddChannelDialog: React.FC = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        isPublic: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = () => {
        dispatch(addChannelThunk(formData));
        handleClose();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen} variant="contained" color="primary" sx={{ minWidth: 120 }}>
                建立頻道
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>建立客服頻道</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="名稱" name="name" fullWidth onChange={handleChange} />
                    <FormControlLabel
                        control={<Switch checked={formData.isPublic} onChange={handleChange} name="isPublic" />}
                        label="是否為公開"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">取消</Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">送出</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddChannelDialog;

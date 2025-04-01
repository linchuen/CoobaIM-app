import type React from "react";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Avatar,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";

const UserDetailDialog: React.FC = () => {
    const user = {
        id: 1,
        userId: 1,
        email: "string",
        name: "string",
        tags: "string",
        remark: "string",
        createdTime: "string",
        avatarUrl: "string",
    }
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const [open, setOpen] = useState(false)
    const [avatar, setAvatar] = useState<string | null>(user.avatarUrl || null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Typography variant="h6">{tokenInfo?.name}</Typography>
            <Box display="flex" alignItems="center">
                <Avatar src={tokenInfo?.avatar} sx={{ width: 40, height: 40 }} />
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                        <Avatar src={avatar || "/default-avatar.png"} sx={{ width: 80, height: 80 }} />
                        <input
                            accept="image/*"
                            id="avatar-upload"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload">
                            <IconButton color="primary" component="span">
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </div>
                    <TextField label="User ID" fullWidth margin="dense" value={user.userId} disabled />
                    <TextField label="Email" fullWidth margin="dense" value={user.email} disabled />
                    <TextField label="Name" fullWidth margin="dense" value={user.name} disabled />
                    <TextField label="Tags" fullWidth margin="dense" value={user.tags || ""} disabled />
                    <TextField label="Remark" fullWidth margin="dense" value={user.remark || ""} disabled />
                    <TextField label="Created Time" fullWidth margin="dense" value={user.createdTime} disabled />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserDetailDialog;

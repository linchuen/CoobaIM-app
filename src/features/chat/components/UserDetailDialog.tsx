import type React from "react";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Avatar,
    IconButton,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
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
                <Avatar src={tokenInfo?.avatar} sx={{ width: 40, height: 40 }} onClick={() => setOpen(true)} />
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Avatar src={avatar || "/default-avatar.png"} sx={{ width: 100, height: 100 }} />
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
                        <Typography variant="h6">{user.name}</Typography>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell variant="head">Email</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">User ID</TableCell>
                                    <TableCell>{user.userId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Tags</TableCell>
                                    <TableCell>{user.tags || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Remark</TableCell>
                                    <TableCell>{user.remark || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Joined</TableCell>
                                    <TableCell>{user.createdTime}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserDetailDialog;

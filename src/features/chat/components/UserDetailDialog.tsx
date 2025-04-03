import type React from "react";
import { useEffect, useState } from "react";
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
import { t } from "i18next";
import { handleFetch } from "../../../services/common";
import type { UploadFileResponse, UserDetail, UserDetailResponse } from "../../../services/ResponseInterface";
import { fetchUserDetail } from "../../../services/UserAPI";
import { fetchAvatarUpload } from "../../../services/FileApi";

const UserDetailDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const [open, setOpen] = useState(false)
    const [detail, setDetail] = useState<UserDetail | undefined>();
    const [avatar, setAvatar] = useState<string | undefined>(tokenInfo?.avatar);

    useEffect(() => {
        if (!tokenInfo) return

        handleFetch<UserDetailResponse>(
            dispatch,
            fetchUserDetail(tokenInfo.token),
            data => {
                setDetail(data.userDetail)
            },
        )
    }, [dispatch, tokenInfo])

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!tokenInfo) return

        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            handleFetch<UploadFileResponse>(
                dispatch,
                fetchAvatarUpload(selectedFile, tokenInfo.token),
                data => {
                    setAvatar(data.url)
                },
            )
        }
    };

    return (
        <>
            <Typography variant="h6">{tokenInfo?.name}</Typography>
            <Box display="flex" alignItems="center">
                <Avatar src={avatar} sx={{ width: 40, height: 40 }} onClick={() => setOpen(true)} />
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{t("userDetail")}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
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
                            <Typography variant="caption">{t("uploadAvatar")}</Typography>
                        </label>
                        <Typography variant="h6">{tokenInfo?.name}</Typography>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell variant="head">Email</TableCell>
                                    <TableCell>{detail?.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">User ID</TableCell>
                                    <TableCell>{detail?.userId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Tags</TableCell>
                                    <TableCell>{detail?.tags || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Remark</TableCell>
                                    <TableCell>{detail?.remark || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head">Joined</TableCell>
                                    <TableCell>{detail?.createdTime}</TableCell>
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

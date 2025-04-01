import type React from "react";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import {
    Image,
} from "@mui/icons-material"
import { v4 as uuidv4 } from 'uuid';
import { CloudUpload, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId, sendMessage } from "../ChatPageSlice";
import { handleFetch } from "../../../services/common";
import type { UploadFileResponse } from "../../../services/ResponseInterface";
import { fetchFileUpload } from "../../../services/FileApi";
import { t } from "i18next";

const UploadImageDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [image, setImage] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [pictureOpen, setPictureOpen] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setImage(URL.createObjectURL(droppedFile));
        }
    };

    const handleUpload = async () => {
        if (!tokenInfo || !file) return;

        handleFetch<UploadFileResponse>(
            dispatch,
            fetchFileUpload(currentRoomId, file, tokenInfo.token),
            data => {
                dispatch(
                    sendMessage({
                        uuid: uuidv4(),
                        roomId: currentRoomId,
                        message: data.fileName,
                        userId: tokenInfo.userId,
                        url: data.url,
                        type: "IMAGE"
                    }),
                )
            },
        )
        onClose()
    };

    const onClose = () => setPictureOpen(false)

    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setPictureOpen(true)}>
                <Image />
            </IconButton>
            <Dialog open={pictureOpen} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {t("uploadPicture")}
                    <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            border: "2px dashed gray",
                            borderRadius: 2,
                            padding: 4,
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {image ? (
                            <img src={image} alt="Preview" style={{ width: "100%", borderRadius: 8 }} />
                        ) : (
                            <Typography>
                                拖放圖片到這裡或
                                <label htmlFor="file-upload" style={{ color: "blue", cursor: "pointer" }}>
                                    點擊選擇文件
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">{t("cancel")}</Button>
                    <Button onClick={handleUpload} color="primary" disabled={!file} startIcon={<CloudUpload />}>{t("upload")}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadImageDialog;

import type React from "react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogTitle, DialogActions, Button, LinearProgress, Typography, IconButton, Box, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchFileUpload } from "../../../services/FileApi";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId, sendMessage } from "../ChatPageSlice";
import { AttachFile } from "@mui/icons-material";
import { handleFetch } from "../../../services/common";
import type { UploadFileResponse } from "../../../services/ResponseInterface";
import { t } from "i18next";
import { MessageType } from "../../../services/constant";

const UploadDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
    const [fileOpen, setFileOpen] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
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
                        message: descriptionRef.current?.value || "",
                        userId: tokenInfo.userId,
                        url: data.url,
                        type: MessageType.FILE
                    }),
                )
                setUploadedFileName(data.fileName ?? "")
                setFile(null)
            },
        )
        onClose()
    };

    const onClose = () => setFileOpen(false)

    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setFileOpen(true)}>
                <AttachFile />
            </IconButton>
            <Dialog open={fileOpen} onClose={onClose}>
                <DialogTitle>{t("uploadFile")}</DialogTitle>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <input type="file" onChange={handleFileChange} />
                    {file && <Typography>{t("selectedFile")}: {file.name}</Typography>}

                    {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} style={{ marginTop: 10 }} />}

                    {uploadedFileName && <Typography color="green">{t("uploadScuuess")}:{uploadedFileName}</Typography>}
                    <Box mt={2}>
                        <TextField
                            fullWidth
                            label={t("fileDescription")}
                            multiline
                            inputRef={descriptionRef}
                        />
                    </Box>
                </div>
                <DialogActions>
                    <Button onClick={onClose}>{t("cancel")}</Button>
                    <Button onClick={handleUpload} color="primary" disabled={!file}>
                        {t("upload")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadDialog;

import type React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button, LinearProgress, Typography, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchFileUpload } from "../../../services/FileApi";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import { AttachFile } from "@mui/icons-material";

const UploadDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
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

        const uploadResponse = await fetchFileUpload(currentRoomId, file, tokenInfo.token)
        setUploadedFileName(uploadResponse.data?.fileName ?? "")

    };

    const onClose = () => setFileOpen(false)

    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setFileOpen(true)}>
                <AttachFile />
            </IconButton>
            <Dialog open={fileOpen} onClose={onClose}>
                <DialogTitle>上傳檔案</DialogTitle>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <input type="file" onChange={handleFileChange} />
                    {file && <Typography>已選擇檔案: {file.name}</Typography>}

                    {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} style={{ marginTop: 10 }} />}

                    {uploadedFileName && <Typography color="green">上傳成功: {uploadedFileName}</Typography>}
                </div>
                <DialogActions>
                    <Button onClick={onClose}>取消</Button>
                    <Button onClick={handleUpload} color="primary" disabled={!file}>
                        上傳
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadDialog;

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
import { CloudUpload, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchFileUpload } from "../../../services/FileApi";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";

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

        const uploadResponse = await fetchFileUpload(currentRoomId, file, tokenInfo.token)
        
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
                    上傳圖片
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
                    <Button onClick={onClose} color="secondary">取消</Button>
                    <Button onClick={handleUpload} color="primary" disabled={!file} startIcon={<CloudUpload />}>上傳</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadImageDialog;

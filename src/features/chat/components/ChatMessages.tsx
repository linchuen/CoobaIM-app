import { Box, Paper, Typography, Link, ImageList, ImageListItem } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useAppSelector } from "../../../app/hooks";
import { selectChatInfoList } from "../ChatPageSlice";
import { selectTokenInfo } from "../../globalSlice";

const ChatMessages: React.FC = () => {
    const chatInfos = useAppSelector(selectChatInfoList)
    const tokenInfo = useAppSelector(selectTokenInfo)
    const userId = tokenInfo?.userId
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            {chatInfos.map((chat) => {
                const isSelf = chat.userId === userId;
                const fileUrls = [chat.url];
                return (
                    <Box
                        key={chat.id}
                        display="flex"
                        flexDirection="column"
                        alignItems={isSelf ? "flex-end" : "flex-start"}
                        sx={{ gap: 0.5 }}
                    >
                        <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
                            {chat.success === false && isSelf && (
                                <ErrorOutlineIcon sx={{ color: "red", fontSize: 18 }} />
                            )}
                            <Paper
                                sx={{
                                    padding: 1.5,
                                    borderRadius: 2,
                                    maxWidth: "300px",
                                    bgcolor: isSelf ? "#282c34" : "#3f51b5",
                                    color: isSelf ? "#b9bbbe" : "white",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    boxShadow: 2,
                                }}
                            >
                                {(chat.type === "TEXT" || chat.type === undefined) && (
                                    <Typography variant="body2">{chat.message}</Typography>
                                )}

                                {chat.type === "IMAGE" && fileUrls && fileUrls.length > 0 && (
                                    <ImageList cols={fileUrls.length > 1 ? 2 : 1} gap={8}>
                                        {fileUrls.map((url, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    src={url}
                                                    alt={`image-${index}`}
                                                    loading="lazy"
                                                    style={{ borderRadius: 8, width: "100%" }}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                )}

                                {chat.type === "FILE" && chat.url && chat.message && (
                                    <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
                                        <AttachFileIcon sx={{ fontSize: 23, color: "white" }} />
                                        <Link
                                            href={chat.url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="inherit"
                                            sx={{ textDecoration: "underline" }}
                                        >
                                            {chat.message}
                                        </Link>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};


export default ChatMessages;

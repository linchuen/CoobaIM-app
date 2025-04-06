import type React from 'react';
import { useState, useRef } from 'react';
import {
    TextField,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    InputBase,
    IconButton,
    Alert,
    Snackbar,
    Box,
    Typography,
    ClickAwayListener,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { handleFetch } from '../../../services/common';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { ChatInfo, ChatLoadResponse } from '../../../services/ResponseInterface';
import { fetchSearchChat } from '../../../services/MessageApi';
import { loadPastChats, selectCurrentRoomId } from '../ChatPageSlice';
import { selectTokenInfo } from '../../globalSlice';
import dayjs from 'dayjs';
import { t } from 'i18next';

const ChatSearchBox: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [results, setResults] = useState<ChatInfo[]>([]);
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const anchorRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    const handleSendSearch = async () => {
        if (!anchorRef.current || !tokenInfo || currentRoomId === 0) return
        const value = anchorRef.current.value
        if (value.length < 2) {
            setAlertOpen(true)
            return
        }

        await handleFetch<ChatLoadResponse>(
            dispatch,
            fetchSearchChat({
                roomId: currentRoomId,
                word: value
            }, tokenInfo.token),
            data => {
                setResults(data.chats)
                setOpen(true)
            },
        )

    };
    const handleSelect = (chat: ChatInfo) => {
        dispatch(loadPastChats({ roomId: currentRoomId, date: dayjs(chat.createdTime).format("YYYY-MM-DD") }))
        setOpen(false)
    };
    return (
        <>
            <InputBase
                placeholder={t("searchMessage")}
                fullWidth
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        handleSendSearch()
                    }
                }}
                inputRef={anchorRef}
                sx={{
                    bgcolor: "#0d1117",
                    borderRadius: 2,
                    paddingX: 2,
                    color: "white",
                }}
            />
            <IconButton ref={iconRef} sx={{ color: "white" }} onClick={() => handleSendSearch()}>
                <Search />
            </IconButton>
            <ClickAwayListener onClickAway={(event) => {
                const target = event.target as Node;
                if (
                    anchorRef.current?.contains(target) ||
                    iconRef.current?.contains(target)
                ) {
                    return; // 點到 Input 或 IconButton 就不要關閉
                }
                setOpen(false);
            }}>
                <Popper
                    open={open && results.length > 0}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            backgroundColor: "#161b22", // 主背景色
                            color: "white",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <List>
                            {results.map((item: ChatInfo) => (
                                <ListItem key={item.id} disablePadding divider>
                                    <ListItemButton
                                        onClick={() => handleSelect(item)}
                                        sx={{
                                            alignItems: "flex-start",
                                            paddingY: 1.5,
                                            paddingX: 2,
                                            "&:hover": {
                                                backgroundColor: "#21262d",
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="subtitle2" color="gray">
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="gray">
                                                        {new Date(item.createdTime).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="white">
                                                    {item.message}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Popper>
            </ClickAwayListener >
            {/* Snackbar 提示 */}
            < Snackbar
                open={alertOpen}
                autoHideDuration={1000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setAlertOpen(false)} severity="warning">
                    {t("alertWord")}
                </Alert>
            </Snackbar >
        </>
    );
};
export default ChatSearchBox;
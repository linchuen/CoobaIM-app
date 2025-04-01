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
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { handleFetch } from '../../../services/common';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { ChatInfo, ChatLoadResponse } from '../../../services/ResponseInterface';
import { fetchSearchChat } from '../../../services/MessageApi';
import { loadPastChats, selectCurrentRoomId } from '../ChatPageSlice';
import { selectTokenInfo } from '../../globalSlice';
import dayjs from 'dayjs';

const ChatSearchBox: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [results, setResults] = useState<ChatInfo[]>([]);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLInputElement>(null);

    const handleSendSearch = async () => {
        if (!anchorRef.current || !tokenInfo || currentRoomId === 0) return
        const value = anchorRef.current.value
        if (value.length < 2) {
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
        dispatch(loadPastChats({ roomId: currentRoomId, date: dayjs(chat.createdTime).format("YYYY/MM/DD") }))
        setOpen(false)
    };
    return (
        <>
            <InputBase
                placeholder="Search messages..."
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
            <IconButton sx={{ color: "white" }} onClick={() => handleSendSearch()}>
                <Search />
            </IconButton>
            <Popper
                open={open && results.length > 0}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
            >
                <Paper elevation={3}>
                    <List>
                        {results.map((item) => (
                            <ListItem key={item.id} disablePadding>
                                <ListItemButton onClick={() => handleSelect(item)}>
                                    <ListItemText primary={item.message} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Popper>
        </>
    );
};
export default ChatSearchBox;
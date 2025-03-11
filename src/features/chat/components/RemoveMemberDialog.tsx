import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    Typography,
    Alert,
    Snackbar,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import { handleFetch } from "../../../services/common";
import { fetchEvictUser, fetchSearchRoomUsers } from "../../../services/RoomApi";
import type { RoomMemberResponse, RoomUser } from "../../../services/ResponseInterface";


const RemoveMemberDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [openCreateAlert, setOpenCreateAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<number | null>(null)
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([])

    const onOpen = () => {
        if (!tokenInfo) return

        handleFetch<RoomMemberResponse>(
            dispatch,
            fetchSearchRoomUsers({
                roomId: currentRoomId,
            }, tokenInfo.token),
            data => {
                const roomUsers = data.roomUsers
                console.log(roomUsers)
                setRoomUsers(roomUsers)
            })
        setOpen(true)
    }

    const onClose = () => setOpen(false)

    const handleRemove = () => {
        if (!tokenInfo || !selectedMember) return

        handleFetch<boolean>(
            dispatch,
            fetchEvictUser({
                roomId: currentRoomId,
                userId: selectedMember
            }, tokenInfo.token),
            data => {
                setOpenCreateAlert(true)
                onClose()
            })
    }

    const handleToggle = (userId: number) => {
        setSelectedMember(prev => (prev === userId ? null : userId)); // 點選相同的則取消
    };

    return (
        <>
            <IconButton onClick={onOpen} sx={{ color: "white" }}>
                <PersonRemoveIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                {/* 標題區 (含關閉按鈕) */}
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    移除聊天室成員
                    <IconButton
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* 內容區 */}
                <DialogContent dividers>
                    {/* 好友列表 */}
                    <Typography variant="h6">選擇聊天室成員：</Typography>
                    <List sx={{ columns: { xs: 1, sm: 2, md: 3 }, gap: 1 }}>
                        {roomUsers.filter(info => info.userId !== tokenInfo?.userId).map(info => (
                            <ListItem key={info.id} onClick={() => handleToggle(info.userId)}>
                                <Checkbox checked={selectedMember === info.userId} />
                                <ListItemText primary={info.showName} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">取消</Button>
                    <Button onClick={handleRemove} color="primary" variant="contained">新增</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openCreateAlert}
                autoHideDuration={3000}
                onClose={() => setOpenCreateAlert(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenCreateAlert(false)}
                    severity={"success"}
                    variant="filled"
                >
                    {"移除成員成功！"}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RemoveMemberDialog;

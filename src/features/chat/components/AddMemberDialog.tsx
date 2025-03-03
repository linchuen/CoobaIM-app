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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId, selectFriendInfoList } from "../ChatPageSlice";
import { handleFetch } from "../../../services/common";
import { fetchInviteUser } from "../../../services/RoomApi";


const AddMemberDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const friendInfoList = useAppSelector(selectFriendInfoList)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [openCreateAlert, setOpenCreateAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState<number | null>(null); // 單選存一個

    const onClose = () => setOpen(false)

    const handleAdd = () => {
        if (!tokenInfo || !selectedFriend) return

        handleFetch<boolean>(
            dispatch,
            fetchInviteUser({
                roomId: currentRoomId,
                userId: selectedFriend
            }, tokenInfo.token),
            data => {
                onClose()
            })
    }

    const handleToggle = (friendUserId: number) => {
        setSelectedFriend(prev => (prev === friendUserId ? null : friendUserId)); // 點選相同的則取消
    };

    return (
        <>
            <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
                <PersonAddIcon />
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
                    新增聊天室成員
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
                    <Typography variant="h6">選擇好友：</Typography>
                    <List sx={{ columns: { xs: 1, sm: 2, md: 3 }, gap: 1 }}>
                        {friendInfoList.map(info => (
                            <ListItem key={info.friendUserId} onClick={() => handleToggle(info.friendUserId)}>
                                <Checkbox checked={selectedFriend === info.friendUserId} />
                                <ListItemText primary={info.showName} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">取消</Button>
                    <Button onClick={handleAdd} color="primary" variant="contained">新增</Button>
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
                    {"新增成員成功！"}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddMemberDialog;

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
    Avatar,
    ListItemAvatar,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import { handleFetch } from "../../../services/common";
import { fetchInviteUser, fetchSearchRoomUsers } from "../../../services/RoomApi";
import type { RoomMemberResponse } from "../../../services/ResponseInterface";
import { selectFriendInfoList } from "../FriendSlice";
import { t } from "i18next";


const AddMemberDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const friendInfoList = useAppSelector(selectFriendInfoList)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [openCreateAlert, setOpenCreateAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState<number | null>(null)
    const [userIds, setUserIds] = useState<number[]>([])

    const onOpen = () => {
        if (!tokenInfo || currentRoomId === 0) return

        handleFetch<RoomMemberResponse>(
            dispatch,
            fetchSearchRoomUsers({
                roomId: currentRoomId,
            }, tokenInfo.token),
            data => {
                const roomUsers = data.roomUsers
                console.log(friendInfoList)
                console.log(roomUsers)
                setUserIds(roomUsers.map(info => info.userId))
            })
        setOpen(true)
    }

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
                setOpenCreateAlert(true)
                onClose()
            })
    }

    const handleToggle = (friendUserId: number) => {
        setSelectedFriend(prev => (prev === friendUserId ? null : friendUserId)); // 點選相同的則取消
    };

    return (
        <>
            <IconButton onClick={onOpen} sx={{ color: "white" }}>
                <PersonAddIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {t("addMember")}
                    <IconButton
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* 內容區 */}
                <DialogContent dividers>
                    <Typography variant="h6" gutterBottom>
                        {t("chooseFriend")}：
                    </Typography>
                    <List
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: 1,
                        }}
                    >
                        {friendInfoList
                            .filter(info => !userIds.includes(info.friendUserId))
                            .map(info => (
                                <ListItem
                                    key={info.friendUserId}
                                    onClick={() => handleToggle(info.friendUserId)}
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        backgroundColor: selectedFriend === info.friendUserId ? 'action.selected' : 'inherit',
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedFriend === info.friendUserId}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemAvatar>
                                        <Avatar src={info.avatar} alt={info.showName}>
                                            {info.showName[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={info.showName} />
                                </ListItem>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">{t("cancel")}</Button>
                    <Button onClick={handleAdd} color="primary" variant="contained">{t("add")}</Button>
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
                    {t("addMemberSuccessfully")}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddMemberDialog;

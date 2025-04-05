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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import { handleFetch } from "../../../services/common";
import { fetchEvictUser, fetchSearchRoomUsers } from "../../../services/RoomApi";
import type { RoomMemberResponse, RoomUser } from "../../../services/ResponseInterface";
import { t } from "i18next";


const RemoveMemberDialog: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [openCreateAlert, setOpenCreateAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<number | null>(null)
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([])

    const onOpen = () => {
        if (!tokenInfo || currentRoomId === 0) return

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
                    {t("removeMember")}
                    <IconButton
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Typography variant="h6" gutterBottom>
                        {t("chooseMember")}：
                    </Typography>
                    <List
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: 1,
                        }}
                    >
                        {roomUsers
                            .filter(info => info.userId !== tokenInfo?.userId)
                            .map(info => (
                                <ListItem
                                    key={info.id}
                                    onClick={() => handleToggle(info.userId)}
                                    sx={{
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        backgroundColor: selectedMember === info.userId ? 'action.selected' : 'inherit',
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedMember === info.userId}
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
                    <Button onClick={handleRemove} color="primary" variant="contained">{t("remove")}</Button>
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
                    {t("removeMemberSuccessfully")}!
                </Alert>
            </Snackbar>
        </>
    );
};

export default RemoveMemberDialog;

import { ListItem, Avatar, ListItemText, Button, Typography, Box, Paper, List } from "@mui/material"
import { t } from "i18next"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { handleFetch } from "../../../services/common"
import { fetchPermitFriend } from "../../../services/FriendApi"
import type { PermitFriendResponse } from "../../../services/ResponseInterface"
import { selectTokenInfo } from "../../globalSlice"
import { selectFriendApplyInfoList, removeFriendApply, addFriend } from "../FriendSlice"


const FriendApplyPaper: React.FC = () => {
    const dispatch = useAppDispatch()
    const friendApplyInfos = useAppSelector(selectFriendApplyInfoList)
    const tokenInfo = useAppSelector(selectTokenInfo)

    const handleFriendApply = async (
        applyUserId: number,
        isPermit: boolean,
        name: string,
    ) => {
        if (!tokenInfo) return

        await handleFetch<PermitFriendResponse>(
            dispatch,
            fetchPermitFriend({
                applyUserId: applyUserId,
                permitUserId: tokenInfo.userId,
                isPermit: isPermit,
            }, tokenInfo.token),
            data => {
                dispatch(removeFriendApply(applyUserId))
                if (isPermit) {
                    dispatch(addFriend({
                        userId: tokenInfo.userId,
                        friendUserId: applyUserId,
                        showName: name,
                        roomId: data.roomId,
                    }),
                    )
                }
            },
        )
    }

    const friendApplyList = friendApplyInfos.map(info => {
        return (
            <ListItem sx={{ marginBottom: 1 }} key={"friend_" + info.id}>
                <Avatar sx={{ marginRight: 2 }}>{info.name.charAt(0)}</Avatar>
                <ListItemText primary={info.name} secondary={
                    <>
                        <Button
                            sx={{ bgcolor: "green", color: "white", marginRight: 1 }}
                            onClick={() => handleFriendApply(info.applyId, true, info.name)}
                        >
                            {t("accept")}
                        </Button>
                        <Button
                            sx={{ bgcolor: "red", color: "white" }}
                            onClick={() => handleFriendApply(info.applyId, false, info.name)}
                        >
                            {t("reject")}
                        </Button>
                    </>} />
            </ListItem>
        )
    })

    return (
        <>
            <Paper
                sx={{
                    width: 280,
                    padding: 2,
                    overflow: "auto",
                    bgcolor: "#161b22",
                    color: "white",
                    boxShadow: 3,
                    margin: 2,
                    borderRadius: 2,
                }}
            >
                <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="h6" sx={{ pl: 1 }}>{t("friendApply")}</Typography>
                </Box>
                <List>{friendApplyList}</List>
            </Paper>
        </>
    )

}

export default FriendApplyPaper

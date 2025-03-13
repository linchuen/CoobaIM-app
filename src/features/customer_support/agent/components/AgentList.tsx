import type React from "react";
import { useEffect, useState } from "react";
import { Box, Drawer, List, ListItem, ListItemText, Typography, Divider, IconButton } from "@mui/material";
import { ChevronRight, ChevronLeft, Business } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setAgentList } from "../../AgentSlice";
import { selectFriendInfoList } from "../../../chat/FriendSlice";
import { handleLoadChat } from "../../../../services/common";
import { ChatType } from "../../../../services/constant";
import { switchPage, PageType } from "../../PageSlice";

const AgentList: React.FC = () => {
    const dispatch = useAppDispatch()
    const friendInfos = useAppSelector(selectFriendInfoList)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const onOpen = () => setOpenDrawer(true)
    const onClose = () => setOpenDrawer(false)

    useEffect(() => {
        dispatch(setAgentList({ agentIds: [] }))
    }, [dispatch])

    const loadChat = (roomId: number, name: string, type: ChatType) => {
        handleLoadChat(dispatch, roomId, name, type)
        dispatch(switchPage(PageType.chat))
    }

    const agents = friendInfos.map(info => (
        <ListItem key={info.friendUserId} sx={{ pl: 4 }} onClick={() => loadChat(info.roomId, info.showName, ChatType.ToRoom)}>
            <ListItemText primary={info.showName} />
        </ListItem>
    ))
    return (
        <>
            {/* 同事列表 */}
            <ListItem onClick={onOpen}>
                <Business sx={{ mr: 1 }} />
                <ListItemText primary="同事列表" />
                <IconButton>
                    <ChevronRight />
                </IconButton>
            </ListItem>
            <Divider />

            {/* Dynamic Right Drawer with Close Button */}
            <Drawer anchor="left" open={openDrawer} onClose={onClose} sx={{ width: 260 }}>
                <Box sx={{ width: 260, height: "100%", p: 2, bgcolor: "#333", color: "#fff" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                            同事列表
                        </Typography>
                    </Box>
                    <List>
                        {agents}
                    </List>
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
            </Drawer>
        </>

    );
};

export default AgentList;

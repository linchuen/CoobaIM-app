import type React from "react";
import { useEffect, useState } from "react";
import { Box, Drawer, List, ListItem, ListItemText, Typography, Divider, IconButton } from "@mui/material";
import { ChevronRight, ChevronLeft, SupervisedUserCircle } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectCustomerList, setCustomerList } from "../../CustomerSlice";
import { handleLoadChat } from "../../../../services/common";
import { ChatType } from "../../../../services/constant";
import { switchPage, PageType } from "../../PageSlice";

const CustomerList: React.FC = () => {
    const dispatch = useAppDispatch()
    const customerInfos = useAppSelector(selectCustomerList)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const onOpen = () => setOpenDrawer(true)
    const onClose = () => setOpenDrawer(false)

    useEffect(() => {
        dispatch(setCustomerList())
    }, [dispatch])

    const loadChat = (roomId: number, name: string, type: ChatType) => {
        handleLoadChat(dispatch, roomId, name, type)
        dispatch(switchPage(PageType.chat))
    }

    const customers = customerInfos.map(info => (
        <ListItem key={info.customerUserId} sx={{ pl: 4 }} onClick={() => loadChat(info.roomId, info.name, ChatType.ToRoom)}>
            <ListItemText primary={info.name} />
        </ListItem>
    ))
    return (
        <>
            {/* 用戶列表 */}
            <ListItem onClick={onOpen}>
                <SupervisedUserCircle sx={{ mr: 1 }} />
                <ListItemText primary="用戶列表" />
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
                            用戶列表
                        </Typography>
                    </Box>
                    <List>
                        {customers}
                    </List>
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
            </Drawer>
        </>

    );
};

export default CustomerList;

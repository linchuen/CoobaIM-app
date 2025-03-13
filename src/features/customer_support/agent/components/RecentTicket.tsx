import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, Assignment } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectRecentTicketLsit, setRecentTicket } from "../../TicketSlice";
import { switchPage, PageType } from "../../PageSlice";
import { ChatType } from "../../../../services/constant";
import { handleLoadChat } from "../../../../services/common";
import { setCustomerUserId } from "../../CustomerSlice";

const RecentTicket: React.FC = () => {
    const dispatch = useAppDispatch()
    const ticketInfos = useAppSelector(selectRecentTicketLsit)
    const [openTickets, setOpenTickets] = useState(true);

    useEffect(() => {
        dispatch(setRecentTicket())
    }, [dispatch])

    const loadChat = (roomId: number, name: string, type: ChatType, userId: number) => {
        handleLoadChat(dispatch, roomId, name, type)
        dispatch(switchPage(PageType.chat))
        dispatch(setCustomerUserId(userId))
    }

    const tickets = ticketInfos.map(info => (
        <ListItem key={info.id} sx={{ pl: 4 }} onClick={() => loadChat(info.roomId, info.name, ChatType.ToRoom, info.customerUserId)}>
            <ListItemText primary={info.name} />
        </ListItem>
    ))
    return (
        <>
            {/* 最近工單 - 可收合 */}
            <ListItem onClick={() => setOpenTickets(!openTickets)}>
                <Assignment sx={{ mr: 1 }} />
                <ListItemText primary="最近工單" />
                {openTickets ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openTickets} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {tickets}
                </List>
            </Collapse>
        </>
    );
};

export default RecentTicket;

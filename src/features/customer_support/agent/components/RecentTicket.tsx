import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, Assignment } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectRecentTicketLsit, setRecentTicket } from "../../TicketSlice";

const RecentTicket: React.FC = () => {
    const dispatch = useAppDispatch()
    const ticketInfos = useAppSelector(selectRecentTicketLsit)
    const [openTickets, setOpenTickets] = useState(true);

    useEffect(() => {
        dispatch(setRecentTicket())
    }, [dispatch])

    const tickets = ticketInfos.map(info => (
        <ListItem key={info.id} sx={{ pl: 4 }}>
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

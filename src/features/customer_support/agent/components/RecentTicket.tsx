import type React from "react";
import { useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, Assignment } from "@mui/icons-material";

const RecentTicket: React.FC = () => {
    const [openTickets, setOpenTickets] = useState(true);


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
                    {["工單 #12345", "工單 #12346", "工單 #12347"].map((text) => (
                        <ListItem key={text} sx={{ pl: 4 }}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </>
    );
};

export default RecentTicket;

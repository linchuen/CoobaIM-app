import type React from "react";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    TablePagination,
    Typography,
    Container,
} from "@mui/material";

interface Ticket {
    id: number;
    name: string;
    roomId: number;
    agentUserId: number;
    customerUserId: number;
    isOpen: boolean;
    createdTime: string;
}

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        // 模擬 API 請求獲取工單數據
        const fetchTickets = async () => {
            const mockData: Ticket[] = Array.from({ length: 20 }, (_, index) => ({
                id: index + 1,
                name: `工單 ${index + 1}`,
                roomId: Math.floor(Math.random() * 100),
                agentUserId: Math.floor(Math.random() * 10),
                customerUserId: Math.floor(Math.random() * 50),
                isOpen: Math.random() > 0.5,
                createdTime: new Date().toISOString(),
            }));
            setTickets(mockData);
        };
        fetchTickets();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleTicketStatus = (id: number) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === id ? { ...ticket, isOpen: !ticket.isOpen } : ticket
            )
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                工單管理
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>名稱</TableCell>
                            <TableCell>房間 ID</TableCell>
                            <TableCell>客服 ID</TableCell>
                            <TableCell>客戶 ID</TableCell>
                            <TableCell>創建時間</TableCell>
                            <TableCell>狀態</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.id}</TableCell>
                                    <TableCell>{ticket.name}</TableCell>
                                    <TableCell>{ticket.roomId}</TableCell>
                                    <TableCell>{ticket.agentUserId}</TableCell>
                                    <TableCell>{ticket.customerUserId}</TableCell>
                                    <TableCell>{new Date(ticket.createdTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={ticket.isOpen}
                                            onChange={() => toggleTicketStatus(ticket.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={tickets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

        </Container>
    );
};

export default TicketManagement;

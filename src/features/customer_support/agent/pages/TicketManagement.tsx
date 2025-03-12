import type React from "react";
import { useState } from "react";
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
import { useAppSelector } from "../../../../app/hooks";
import { selectRecentTicketLsit } from "../../TicketSlice";

const TicketManagement: React.FC = () => {
    const tickets = useAppSelector(selectRecentTicketLsit)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={tickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container>
    );
};

export default TicketManagement;

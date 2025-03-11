import type React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const TicketManagement: React.FC = () => {
  const tickets = [
    { id: "12345", title: "登入問題", status: "待處理" },
    { id: "12346", title: "付款失敗", status: "已解決" },
    { id: "12347", title: "帳號被鎖定", status: "處理中" },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        工單管理
      </Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>工單編號</TableCell>
                <TableCell>標題</TableCell>
                <TableCell>狀態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TicketManagement;

import type React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: "用戶 A", email: "usera@example.com" },
    { id: 2, name: "用戶 B", email: "userb@example.com" },
    { id: 3, name: "用戶 C", email: "userc@example.com" },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        會員管理
      </Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名稱</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserManagement;

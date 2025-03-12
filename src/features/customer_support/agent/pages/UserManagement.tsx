import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const initialUsers: User[] = [
  { id: "1", name: "用戶 A", email: "usera@example.com", role: "管理員", status: "啟用" },
  { id: "2", name: "用戶 B", email: "userb@example.com", role: "會員", status: "停用" },
  { id: "3", name: "用戶 C", email: "userc@example.com", role: "會員", status: "啟用" },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({ id: "", name: "", email: "", role: "會員", status: "啟用" });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewUser({ id: "", name: "", email: "", role: "會員", status: "啟用" });
  };

  const handleAddUser = () => {
    setUsers([...users, { ...newUser, id: uuidv4() }]);
    handleCloseDialog();
  };

  const filteredUsers = users.filter(
    (user) => user.name.includes(search) || user.email.includes(search)
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        會員管理
      </Typography>

      <TableContainer component={Paper}>
        <Box mb={2} display="flex" gap={2}>
          <TextField label="搜尋用戶" variant="outlined" fullWidth onChange={handleSearch} sx={{ backgroundColor: "white" }} />
          <Button variant="contained" onClick={handleOpenDialog}>建立用戶</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名稱</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>狀態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>新增用戶</DialogTitle>
        <DialogContent>
          <TextField label="名稱" fullWidth margin="dense" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleAddUser} variant="contained">新增</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;

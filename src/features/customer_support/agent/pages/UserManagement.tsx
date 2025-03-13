import type React from "react";
import { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectCustomerDetailList, setCustomerDetailList } from "../../CustomerSlice";
import type { RegisterResponse } from "../../../../services/ResponseInterface";
import { handleFetch } from "../../../../services/common";
import { fetchCreateUser } from "../../../../services/cs/CustomerApi";
import type { RegisterRequest } from "../../../../services/RequestInterface";


const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector(selectCustomerDetailList)
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<RegisterRequest>({ name: "", email: "", password: "" });

  useEffect(() => {
    dispatch(setCustomerDetailList({ userIds: [] }));
  }, [dispatch]);

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
    setNewUser({ name: "", email: "", password: "" });
  };

  const handleAddUser = () => {
    handleFetch<RegisterResponse>(
      dispatch,
      fetchCreateUser(newUser),
      data => { },
    )
    handleCloseDialog();
  };

  const filteredUsers = userDetails.filter(
    (user) => user.name.includes(search) || user.email.includes(search)
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        會員管理
      </Typography>

      <TableContainer component={Paper}>
        <Box display="flex" gap={2} mb={2} p={2}>
          <TextField label="搜尋用戶" variant="outlined" fullWidth onChange={handleSearch} />
          <Button onClick={handleOpenDialog} variant="contained" color="primary" sx={{ minWidth: 120 }}>
            建立用戶
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名稱</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>標記</TableCell>
              <TableCell>備註</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.tags ?? ""}</TableCell>
                <TableCell>{user.remark ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>


      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>新增用戶</DialogTitle>
        <DialogContent>
          <TextField label="名稱" fullWidth margin="dense" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <TextField label="Password" fullWidth margin="dense" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
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

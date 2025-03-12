import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type React from "react";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { bindCustomer, selectCustomerList, unbindCustomer } from "../../CustomerSlice";


const BindCustomer: React.FC = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector(selectCustomerList);
    const userIdRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const handleBind = () => {
        if (!userIdRef.current) return
        dispatch(bindCustomer({ userIds: [Number(userIdRef.current.value)] }));
        handleClose();
    };

    const handleUnbind = () => {
        if (!userIdRef.current) return
        dispatch(unbindCustomer({ userIds: [Number(userIdRef.current.value)] }));
        handleClose();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen} color="secondary">綁定</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>綁定用戶</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>名稱</TableCell>
                                    <TableCell>用戶id</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={"customer_" + customer.customerUserId}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>
                                            {customer.customerUserId}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <TextField
                        label="用戶ID"
                        inputRef={userIdRef}
                        fullWidth
                        variant="outlined"
                    />
                    <Button onClick={handleUnbind} color="secondary">解綁</Button>
                    <Button onClick={handleBind} color="primary" variant="contained">綁定</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BindCustomer;

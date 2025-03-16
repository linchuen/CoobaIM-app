import type React from "react";
import { Box, Typography, Paper, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Switch, Container, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import AddCustomerSupport from "../components/AddCustomerSupportDiaLog";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { diableAgentThunk, selectAgentList, setAgentList } from "../../AgentSlice";
import BindCustomer from "../components/BindCustomerDialog";

const CustomerSupport: React.FC = () => {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgentList);
  const [newAgentName, setNewAgentName] = useState("");

  useEffect(() => {
    dispatch(setAgentList({ agentIds: [] }));
  }, [dispatch]);

  const handleDisable = (agentUserId: number) => {
    dispatch(diableAgentThunk({ agentUserId: agentUserId }));
  };

  return (
    <Container >
      <Typography variant="h4" gutterBottom>
        客服管理
      </Typography>
      <TableContainer component={Paper}>
        <Box display="flex" gap={2} mb={2} p={2}>
          <TextField
            label="客服名稱"
            value={newAgentName}
            onChange={(e) => setNewAgentName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <AddCustomerSupport />
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名稱</TableCell>
              <TableCell>部門</TableCell>
              <TableCell>預設</TableCell>
              <TableCell>建立時間</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={"agent_"+agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.department}</TableCell>
                <TableCell>
                  <Switch checked={agent.isDefault} disabled />
                </TableCell>
                <TableCell>{new Date(agent.createdTime).toLocaleString()}</TableCell>
                <TableCell>
                  <BindCustomer />
                  <Button onClick={() => handleDisable(agent.userId)} color="secondary">停用</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CustomerSupport;
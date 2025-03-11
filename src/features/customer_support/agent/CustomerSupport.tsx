import type React from "react";
import { Box, Typography, Paper, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Container } from "@mui/material";
import { useState } from "react";

const fakeAgents = [
  { id: 1, name: "Agent A", department: "Sales", isDefault: true, createdTime: new Date().toISOString() },
  { id: 2, name: "Agent B", department: "Support", isDefault: false, createdTime: new Date().toISOString() },
  { id: 3, name: "Agent C", department: "IT", isDefault: true, createdTime: new Date().toISOString() },
];

const CustomerSupport: React.FC = () => {
  const [agents, setAgents] = useState(fakeAgents);
  const [newAgentName, setNewAgentName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");

  const handleCreate = () => {
    if (newAgentName) {
      setAgents([...agents, { id: agents.length + 1, name: newAgentName, department: "General", isDefault: true, createdTime: new Date().toISOString() }]);
      setNewAgentName("");
    }
  };

  const handleDisable = (id: number) => {
    setAgents(agents.map((agent) => (agent.id === id ? { ...agent, department: "Disabled" } : agent)));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        客服管理
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Container>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="客服名稱"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button onClick={handleCreate} variant="contained" color="primary" sx={{ minWidth: 120 }}>
              建立客服
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>名稱</TableCell>
                <TableCell>部門</TableCell>
                <TableCell>預設</TableCell>
                <TableCell>建立時間</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.id}</TableCell>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.department}</TableCell>
                  <TableCell>
                    <Switch checked={agent.isDefault} disabled />
                  </TableCell>
                  <TableCell>{new Date(agent.createdTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDisable(agent.id)} color="secondary">綁定</Button>
                    <Button onClick={() => handleDisable(agent.id)} color="secondary">停用</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </Paper>
    </Box>
  );
};

export default CustomerSupport;
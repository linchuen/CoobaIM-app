import type React from "react";
import { useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";

interface RoutingRule {
  name: string;
  priority: number;
  enabled: boolean;
}

const initialRules: RoutingRule[] = [
  { name: "可用客服分配", priority: 50, enabled: true },
  { name: "最閒客服分配", priority: 80, enabled: true },
  { name: "VIP 客戶優先", priority: 90, enabled: false },
  { name: "隨機客服分配", priority: 30, enabled: true },
];

const RoutingManagement: React.FC = () => {
  const [rules, setRules] = useState<RoutingRule[]>(initialRules);

  const handlePriorityChange = (index: number, priority: number) => {
    const updatedRules = [...rules];
    updatedRules[index].priority = priority;
    setRules(updatedRules);
  };

  const handleToggleEnabled = (index: number) => {
    const updatedRules = [...rules];
    updatedRules[index].enabled = !updatedRules[index].enabled;
    setRules(updatedRules);
  };

  const handleSave = () => {
    console.log("已保存路由規則:", rules);
  };

  const handleCancel = () => {
    setRules(initialRules);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        客服路由管理
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>路由規則</TableCell>
              <TableCell>優先級 (1-99)</TableCell>
              <TableCell>啟用</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule, index) => (
              <TableRow key={rule.name}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      inputProps={{ min: 1, max: 99 }}
                      value={rule.priority}
                      onChange={(e) => handlePriorityChange(index, parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={rule.enabled}
                    onChange={() => handleToggleEnabled(index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          保存
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          取消
        </Button>
      </Box>
    </Container>
  );
};

export default RoutingManagement;
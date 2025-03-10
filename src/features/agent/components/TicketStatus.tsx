import type React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// 顏色列表
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface TicketStatusProps {
  data: { status: string; value: number }[];
}

const TicketStatus: React.FC<TicketStatusProps> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">工單狀態</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TicketStatus;

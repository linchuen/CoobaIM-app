import type React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// 顏色列表
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface TicketCategoriesProps {
  data: { category: string; value: number }[];
}

const TicketCategories: React.FC<TicketCategoriesProps> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">工單分類</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
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

export default TicketCategories;

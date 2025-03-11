import type React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FAQStatisticsProps {
  data: { question: string; count: number }[];
}

const FAQStatistics: React.FC<FAQStatisticsProps> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">常見問題統計</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="question" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default FAQStatistics;

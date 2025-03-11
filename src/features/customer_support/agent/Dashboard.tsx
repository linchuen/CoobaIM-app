import type React from "react";
import { useState } from "react";
import {  Container, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import MUI Grid v2
import TicketStatus from "./components/TicketStatus";
import FAQStatistics from "./components/FAQStatistics";
import TicketCategories from "./components/TicketCategories";
import AgentSchedule from "./components/AgentSchedule";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Dashboard: React.FC = () => {
  // 假數據
  const [data] = useState({
    activeCustomers: 120,
    totalTickets: 350,
    ticketStatus: [
      { status: "未處理", value: 120 },
      { status: "處理中", value: 150 },
      { status: "已解決", value: 80 },
    ],
    faqStats: [
      { question: "如何重設密碼？", count: 90 },
      { question: "如何取消訂單？", count: 70 },
      { question: "如何聯絡客服？", count: 50 },
    ],
    ticketCategories: [
      { category: "技術支援", value: 200 },
      { category: "帳戶問題", value: 100 },
      { category: "付款問題", value: 50 },
    ],
    agentSchedule: [
      { name: "Alice", shift: "9 AM - 5 PM" },
      { name: "Bob", shift: "12 PM - 8 PM" },
      { name: "Charlie", shift: "3 PM - 11 PM" },
    ],
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* 活躍客戶數 & 總工單數 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <Typography variant="h6">活躍客戶數</Typography>
            <Typography variant="h4">{data.activeCustomers}</Typography>
          </Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <Typography variant="h6">總工單數</Typography>
            <Typography variant="h4">{data.totalTickets}</Typography>
          </Item>
        </Grid>

        {/* 工單狀態 & 常見問題統計 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <TicketStatus data={data.ticketStatus} />
          </Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <FAQStatistics data={data.faqStats} />
          </Item>
        </Grid>

        {/* 工單分類 & 客服排班 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <TicketCategories data={data.ticketCategories} />
          </Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <AgentSchedule data={data.agentSchedule} />
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
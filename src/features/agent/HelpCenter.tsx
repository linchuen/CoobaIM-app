import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

const HelpCenter: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        幫助中心
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>常見問題與使用指南，幫助用戶解決基本問題。</Typography>
      </Paper>
    </Box>
  );
};

export default HelpCenter;

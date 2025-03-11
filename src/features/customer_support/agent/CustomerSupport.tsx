import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

const CustomerSupport: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        客服管理
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>管理客服人員的資訊，包括權限設置與支援範圍。</Typography>
      </Paper>
    </Box>
  );
};

export default CustomerSupport;

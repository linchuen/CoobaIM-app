import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ChannelManagement: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        頻道管理
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>這裡是頻道管理頁面，您可以新增、刪除或管理客戶支援頻道。</Typography>
      </Paper>
    </Box>
  );
};

export default ChannelManagement;

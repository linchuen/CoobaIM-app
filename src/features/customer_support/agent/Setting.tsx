import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Setting: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        系統設定
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>管理系統的各種設定，包括權限、通知與一般設定。</Typography>
      </Paper>
    </Box>
  );
};

export default Setting;

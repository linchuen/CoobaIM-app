import type React from "react";
import { useState } from "react";
import { Container, Typography, TextField, Switch, FormControlLabel, Button, MenuItem, Select, Card, CardContent, Box } from "@mui/material";
import { Save } from "@mui/icons-material";

const Setting: React.FC = () => {
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [supportEmail, setSupportEmail] = useState<string>("support@example.com");
  const [language, setLanguage] = useState<string>("zh-TW");

  const handleSave = () => {
    console.log({ autoReply, supportEmail, language });
    alert("設定已保存！");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        後台設定
      </Typography>
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <FormControlLabel
              control={<Switch checked={autoReply} onChange={() => setAutoReply(!autoReply)} />}
              label="自動回覆開啟"
            />
            <TextField
              fullWidth
              label="客服電子郵件"
              variant="outlined"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
            <Typography variant="subtitle1">語系</Typography>
            <Select
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="zh-TW">繁體中文</MenuItem>
              <MenuItem value="en-US">English</MenuItem>
              <MenuItem value="ja-JP">日本語</MenuItem>
            </Select>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave}>
              儲存設定
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Setting;
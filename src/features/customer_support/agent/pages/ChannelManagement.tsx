import { Container, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Switch, Box, Paper, Typography, Toolbar, TableContainer } from "@mui/material";
import type React from "react";
import { useState } from "react";

interface Channel {
  id: number;
  name: string;
  isPublic: boolean;
  createdTime: string;
}

const mockChannels: Channel[] = [
  { id: 1, name: "頻道 A", isPublic: true, createdTime: "2024-03-11T10:00:00" },
  { id: 2, name: "頻道 B", isPublic: false, createdTime: "2024-03-10T15:30:00" },
  { id: 3, name: "頻道 C", isPublic: true, createdTime: "2024-03-09T08:45:00" },
];

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [channelName, setChannelName] = useState("");

  const createChannel = () => {
    if (!channelName) return;
    const newChannel: Channel = {
      id: channels.length + 1,
      name: channelName,
      isPublic: false,
      createdTime: new Date().toISOString(),
    };
    setChannels([...channels, newChannel]);
    setChannelName("");
  };

  const deleteChannel = (id: number) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        頻道管理</Typography>
      <TableContainer component={Paper}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="頻道名稱"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Button onClick={createChannel} variant="contained" color="primary" sx={{ minWidth: 120 }}>
            建立頻道
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名稱</TableCell>
              <TableCell>公開</TableCell>
              <TableCell>建立時間</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>{channel.id}</TableCell>
                <TableCell>{channel.name}</TableCell>
                <TableCell>
                  <Switch checked={channel.isPublic} disabled />
                </TableCell>
                <TableCell>{new Date(channel.createdTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => deleteChannel(channel.id)} color="secondary">刪除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ChannelManagement;

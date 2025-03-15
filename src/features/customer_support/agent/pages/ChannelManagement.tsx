import { Container, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Switch, Box, Paper, Typography, TableContainer } from "@mui/material";
import type React from "react";
import { useEffect, useRef } from "react";
import { addChannelThunk, deleteChannelThunk, loadChannels, selectChannelList, updateChannelThunk } from "../../ChannelSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";


const ChannelManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectChannelList);
  const channelNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(loadChannels());
  }, [dispatch]);

  const createChannel = () => {
    if (!channelNameRef.current?.value) return;

    dispatch(addChannelThunk({
      name: channelNameRef.current.value,
      isPublic: false
    }));
    channelNameRef.current.value = "";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        頻道管理
      </Typography>
      <TableContainer component={Paper}>
        <Box display="flex" gap={2} mb={2} p={2}>
          <TextField
            label="頻道名稱"
            inputRef={channelNameRef}
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
              <TableCell>名稱</TableCell>
              <TableCell>公開</TableCell>
              <TableCell>建立時間</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={"channel_" + channel.id}>
                <TableCell>{channel.name}</TableCell>
                <TableCell>
                  <Switch checked={channel.isPublic} onChange={(event) => dispatch(updateChannelThunk({
                    channelId: channel.id,
                    name: channel.name,
                    isPublic: event.target.checked
                  }))
                  } />
                </TableCell>
                <TableCell>{new Date(channel.createdTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => dispatch(deleteChannelThunk({ channelId: channel.id }))} color="secondary">刪除</Button>
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

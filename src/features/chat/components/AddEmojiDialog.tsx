import type React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton } from "@mui/material";
import type { EmojiClickData } from "emoji-picker-react";
import Picker from "emoji-picker-react";
import { useAppDispatch } from "../../../app/hooks";
import { setEmoji } from "../ChatPageSlice";
import { InsertEmoticon } from "@mui/icons-material";
import { useState } from "react";

const EmojiChatDialog: React.FC = () => {
  const dispatch = useAppDispatch()
  const [emojiOpen, setEmojiOpen] = useState(false)

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    dispatch(setEmoji(emojiObject.emoji))
    setEmojiOpen(false)
  };

  const onClose = () => setEmojiOpen(false)

  return (
    <>
      <IconButton sx={{ color: "white" }} onClick={() => setEmojiOpen(true)}>
        <InsertEmoticon />
      </IconButton>
      <Dialog open={emojiOpen} onClose={onClose}>
        <DialogTitle>選擇表情</DialogTitle>
        <DialogContent>
          <Picker onEmojiClick={onEmojiClick} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmojiChatDialog;

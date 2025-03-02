import type React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import type { EmojiClickData } from "emoji-picker-react";
import Picker from "emoji-picker-react";
import { useAppDispatch } from "../../../app/hooks";
import { setEmoji } from "../ChatPageSlice";

interface EmojiProps {
  open: boolean;
  onClose: () => void;
}

const EmojiChatDialog: React.FC<EmojiProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch()

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    dispatch(setEmoji(emojiObject.emoji))
    onClose()
  };

  return (

    <Dialog open={open} onClose={onClose}>
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
  );
};

export default EmojiChatDialog;

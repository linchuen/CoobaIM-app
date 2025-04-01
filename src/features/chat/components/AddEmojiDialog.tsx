import type React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import type { EmojiClickData } from "emoji-picker-react";
import Picker from "emoji-picker-react";
import { useAppDispatch } from "../../../app/hooks";
import { setEmoji } from "../ChatPageSlice";
import { InsertEmoticon } from "@mui/icons-material";
import { useState } from "react";
import { t } from "i18next";

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
        <DialogTitle>{t("chooseEmoji")}</DialogTitle>
        <DialogContent>
          <Picker onEmojiClick={onEmojiClick} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmojiChatDialog;

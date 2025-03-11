import type React from "react";
import { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

const HelpCenter: React.FC = () => {
  const [faqs, setFaqs] = useState([
    { question: "如何重置密碼？", answer: "請前往設置頁面，點擊'忘記密碼'，然後按照步驟操作。" },
    { question: "如何聯繫客服？", answer: "您可以通過郵件 support@example.com 或撥打 123-456-7890 聯繫我們。" },
    { question: "如何更改個人信息？", answer: "進入'個人資料'頁面後，即可修改您的信息。" }
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFaq = () => {
    if (newQuestion && newAnswer) {
      setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        幫助中心
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          常見問題管理
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
              <IconButton color="error" onClick={() => handleDeleteFaq(index)}>
                <DeleteIcon />
              </IconButton>
            </AccordionDetails>
          </Accordion>
        ))}
        <Box mt={2}>
          <TextField
            fullWidth
            label="新問題"
            variant="outlined"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="答案"
            variant="outlined"
            multiline
            rows={2}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddFaq} fullWidth>
            新增問題
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default HelpCenter;


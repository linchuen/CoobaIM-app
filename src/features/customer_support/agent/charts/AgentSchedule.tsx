import type React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Agent {
  name: string;
  shift: string;
}

interface AgentScheduleProps {
  data: Agent[];
}

const AgentSchedule: React.FC<AgentScheduleProps> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">客服排班</Typography>
      {data.map((agent, index) => (
        <Typography key={index}>
          {agent.name} - {agent.shift}
        </Typography>
      ))}
    </CardContent>
  </Card>
);

export default AgentSchedule;

import React, { useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import { StatusHistory } from "@/interfaces";
import dayjs from "dayjs";

export interface TimelineComponentProps {
  index: number;
  statusHistory: StatusHistory[];
}
export default function TimelineComponent(props: TimelineComponentProps) {
  const { index, statusHistory } = props;

  return (
    <Box
      sx={{
        border: "solid",
        borderColor: "#C4C4C4",
        borderRadius: 1,
        width: "100%",
        [`& .MuiTimeline-root:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          borderBottom: "solid",
          p: 2,
          borderColor: "#C4C4C4",
          width: "100%",
        }}
      >
        <Typography align="left" variant="body2">
          Lot No: {index}
        </Typography>
      </Box>
      <Timeline
        sx={{
          [`& .MuiTimelineItem-root:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {statusHistory?.map((event, index) => {
          const isCompleted = event.stageType === "PREVIOUS";
          const isCurrent = event.stageType === "CURRENT";

          return (
            <TimelineItem key={index} sx={{ padding: 0 }}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    isCompleted ? "secondary" : isCurrent ? "secondary" : "grey"
                  }
                  variant="outlined"
                  sx={{ width: 25, height: 25, m: 0, p: 0 }}
                >
                  {isCompleted ? (
                    <CheckIcon sx={{ fontSize: 22 }} color="secondary" />
                  ) : isCurrent ? (
                    <CheckIcon sx={{ fontSize: 22 }} color="secondary" />
                  ) : (
                    <CheckIcon
                      sx={{ color: "rgba(0, 0, 0, 0)", fontSize: 22 }}
                    />
                  )}
                </TimelineDot>
                {index < statusHistory.length - 1 && (
                  <TimelineConnector
                    sx={{ bgcolor: isCompleted ? "secondary.main" : undefined }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    px: 1,
                  }}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={8} sx={{ padding: 0 }}>
                      <Typography align="left">{event.statusName}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ padding: 0 }}>
                      <Typography color="textSecondary" align="right">
                        {event.updatedAt
                          ? dayjs(event.updatedAt).format("YYYY-MM-DD")
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
}

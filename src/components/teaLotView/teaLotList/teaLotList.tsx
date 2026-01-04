"use client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { ReactNode } from "react";
import { API_MESSAGES } from "@/constant";
import { Box } from "@mui/material";
import { TeaLot } from "@/interfaces";
import AppPagination from "@/components/common/AppPagination/AppPagination";
import SkeletonBar from "@/components/common/Skeleton/skeleton";

interface TeaLotListProps {
 children?: ReactNode;
 lots: TeaLot[]
 isLoading: boolean;
 hasError: boolean;
 selectedLotId: number
 onRowClick: (
    lot: TeaLot,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) =>void
  height?: number
}

export default function TeaLotList(props: TeaLotListProps) {
  const {lots,
    children,
    isLoading,
    hasError,
    selectedLotId,
    onRowClick,
    height
  }  =props;

  return (
    <div>
      {isLoading ? (
        <SkeletonBar />
      ) : hasError ? (
        <p>{API_MESSAGES.FAILED_GET}</p>
      ) : (
        <List
          subheader={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ListSubheader sx={{ fontWeight: "600" }}>Lot No.</ListSubheader>
            </Box>
          }
          sx={{ height: height, overflow: "auto", marginBottom: 4 }}
          disablePadding
        >
          {lots?.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ borderBottom: "1px solid #ddd", padding: 0 }}
            >
              <ListItemButton
                sx={{ "&.Mui-selected": { backgroundColor: "#005893" } }}
                onClick={(e) => onRowClick(item, e, index)}
                selected={item.lotId === selectedLotId}
              >
                <ListItemText primary={item.lotNo} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      {/* <AppPagination /> */}
      {children && <Box>{children}</Box>}
    </div>
  );
}

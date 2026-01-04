"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { BlendShipmentReportResponse } from "@/service/readyForShipmentService";

interface ReadyForShipmentReportTableProps {
  data: BlendShipmentReportResponse[];
}

const ReadyForShipmentReportTable: React.FC<ReadyForShipmentReportTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
          <TableRow>
            <TableCell><strong>Blend Sheet No</strong></TableCell>
            <TableCell><strong>Blend Date</strong></TableCell>
            <TableCell><strong>Product Description</strong></TableCell>
            <TableCell><strong>Sales Contract No</strong></TableCell>
            <TableCell><strong>Customer</strong></TableCell>
            <TableCell align="right"><strong>Quantity</strong></TableCell>
            <TableCell align="right"><strong>Average Price</strong></TableCell>
            <TableCell align="right"><strong>Value</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.blendSheetNo}</TableCell>
                <TableCell>{item.blendDate}</TableCell>
                <TableCell>{item.productDescription}</TableCell>
                <TableCell>{item.salesContractNo}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.averagePrice?.toFixed(2)}</TableCell>
                <TableCell align="right">{item.value?.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No data available for the selected date range.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReadyForShipmentReportTable;

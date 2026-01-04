"use client";
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Divider,
} from "@mui/material";
import { DeliveryOrderAckReport } from "@/interfaces";
import moment from "moment";

interface DeliveryOrderPrintViewProps {
  deliveryOrderAckReportData: DeliveryOrderAckReport;
}

export default function DeliveryOrderPrintView({
  deliveryOrderAckReportData,
}: DeliveryOrderPrintViewProps) {
  // console.log(deliveryOrderAckReportData,'deliveryOrderAckReportData')
  const orderData = {
    company:"HVA FOODS PLC",
    address:  "39/A LINTON ROAD, KADANA, SRI LANKA",
    date: deliveryOrderAckReportData?.salesDate,
    status: deliveryOrderAckReportData.statusName,
    doNo: deliveryOrderAckReportData.deliveryOrderNumber,
    broker: deliveryOrderAckReportData?.lots ? deliveryOrderAckReportData?.lots[0]?.brokerCode : '',
    records: deliveryOrderAckReportData?.lots || [],
    deliveryOrderNumber: deliveryOrderAckReportData?.deliveryOrderNumber,
    collectionDate: deliveryOrderAckReportData?.collectionDate
  };

  // Calculate total packages and total quantity
  const totalPackages = orderData.records.reduce((total, record) => {
    return total + (record.bagCount || 0);
  }, 0);

  const totalQuantity = orderData.records.reduce((total, record) => {
    return total + ((record.bagCount || 0) * (record.weightPerBag || 0));
  }, 0);

  return (
    <Grid container sx={{ p: 1, fontFamily: "Arial", color: "#000" }}>
      {/* Header */}
      <Grid item lg={4} md={4} sm={4}>
        <Typography variant="subtitle2" sx={{color:'black'}}>BrewOne</Typography>
        <Typography variant="caption">
          {moment().format("YYYY-MM-DD hh.mm.ss A")}
        </Typography>
      </Grid>
      
      <Grid item lg={4} md={4} sm={4} textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px", color:'black' }}>
          {orderData.company}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "12px", color:'black' }}>
          {orderData.address}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "12px", color:'black' }}>
          {"Confirmed DO's List"}
        </Typography>
      </Grid>
      
      <Grid item lg={4} md={4} sm={4} display="flex" justifyContent="flex-end">
        <Grid item>
          <Typography  color="black">
            Date: {moment(orderData.date).format("YYYY/MM/DD")}
          </Typography>
          <Typography  color="black">
            Status: {orderData.status || "-"}
          </Typography>
          <Typography  color="black">
            Do No.: {orderData.deliveryOrderNumber || "-"}
          </Typography>
        </Grid>
      </Grid>

      {/* Broker Information */}
      <Grid item xs={12} mt={1}>
        <Typography variant="body2" sx={{ fontWeight: "bold", color:'black' }}>
          {orderData.broker}
        </Typography>
      </Grid>

      {/* Table Section */}
      <Grid item xs={12} mt={2}>
        <TableContainer
          sx={{
            "& .MuiTableCell-root": {
              fontSize: "11px",
              padding: "2px 4px",
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    lineHeight: 1,
                    fontSize: "12px",
                    borderBottom: "1px solid #000000",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell width="8%">Box No</TableCell>
                <TableCell width="12%">Lot No</TableCell>
                <TableCell width="15%">Garden Mark</TableCell>
                <TableCell width="8%">Inv.No</TableCell>
                <TableCell width="8%">Grade</TableCell>
                <TableCell width="12%">Package</TableCell>
                <TableCell width="8%">Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.records.map((record, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell>{record.boxNo || '-'}</TableCell>
                  <TableCell>{record.lotNo || '-'}</TableCell>
                  <TableCell>{record.estateCode || '-'}</TableCell>
                  <TableCell>{record.invoiceNo || '-'}</TableCell>
                  <TableCell>{record.gradeCode || '-'}</TableCell>
                  <TableCell>
                    {record.bagCount} {record.chestTypeName || 'B'} {record.weightPerBag}
                  </TableCell>
                  <TableCell>{(record.bagCount || 0) * (record.weightPerBag || 0)}</TableCell>
                </TableRow>
              ))}
              
              {/* Total Quantity Row - Like in your first image */}
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    borderTop: "1px solid #000000",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell colSpan={5}></TableCell>
                <TableCell 
                  sx={{ 
                    textAlign: "right",
                    borderTop: "1px solid #000000"
                  }}
                >
                  {/* no. of bags */}
                </TableCell>
                <TableCell 
                  sx={{ 
                    borderTop: "1px solid #000000"
                  }}
                >
                  {totalQuantity.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
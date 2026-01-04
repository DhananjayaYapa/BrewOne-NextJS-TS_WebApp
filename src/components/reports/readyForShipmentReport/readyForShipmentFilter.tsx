"use client";

import React, { useState } from "react";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
  Container,
  Card,
  CardContent
} from "@mui/material";
import { Broker, CatalogueStatus, FieldValue, Sales } from "@/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs, { Dayjs } from "dayjs";
import styles from "./catalogueFilter.module.scss"
import { PackingSheetStatus, GetAllPackingSheetsRequest } from "@/interfaces/packingSheet";

export interface ReadyForShipmentReportFilterProps {
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  onFromDateChange: (date: Dayjs | null) => void;
  onToDateChange: (date: Dayjs | null) => void;
  onGenerateReport: () => void;
  onResetAll: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isGenerating?: boolean;
  isDownloading?: boolean;
  isPrinting?: boolean;
}

export default function ReadyForShipmentReportFilter(props: ReadyForShipmentReportFilterProps) {
  const {
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onGenerateReport,
    onResetAll,
    onDownload,
    onPrint,
    isGenerating = false,
    isDownloading = false,
    isPrinting = false
  } = props;

  return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={onFromDateChange}
                    slotProps={{ 
                      textField: { 
                        size: "small", 
                        fullWidth: true,
                        variant: "outlined",
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={5} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={onToDateChange}
                    slotProps={{ 
                      textField: { 
                        size: "small", 
                        fullWidth: true,
                        variant: "outlined",
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>

          {/*Buttons section */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
              alignItems: 'center',
              gap: 2,
              height: '100%'
            }}>
              <Button 
                size="medium" 
                variant="outlined"
                onClick={onResetAll}
                disabled={isGenerating}
                sx={{ 
                  minWidth: 120,
                  fontWeight: 'bold'
                }}
              >
                RESET ALL
              </Button>
              <Button
                size="medium"
                variant="contained"
                endIcon={<FilterAltIcon />}
                onClick={onGenerateReport}
                disabled={isGenerating || !fromDate || !toDate}
                sx={{ 
                  minWidth: 180,
                  fontWeight: 'bold'
                }}
              >
                {isGenerating ? "GENERATING..." : "GENERATE REPORT"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  );
}
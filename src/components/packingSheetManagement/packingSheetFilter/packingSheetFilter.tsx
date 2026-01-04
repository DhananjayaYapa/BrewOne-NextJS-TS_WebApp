"use client";

import React, { useState } from "react";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { Broker, CatalogueStatus, FieldValue, Sales } from "@/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs, { Dayjs } from "dayjs";
import styles from "./catalogueFilter.module.scss"
import { PackingSheetStatus, GetAllPackingSheetsRequest } from "@/interfaces/packingSheet";
export interface PackingingSheetFilterProps {
  onSearch: (value: string) => void;
  packingSheetStatusList: PackingSheetStatus[];
  packingSheetRequest: GetAllPackingSheetsRequest
  onEndDateChange: (value: Dayjs | null) => void;
  onStartDateChange: (value: Dayjs | null) => void;
  onStatusChange: (value: PackingSheetStatus | null) => void;
  onApplyFilter: () => void;
  onReset: () => void;
}

export default function PackingingSheetFilter(props: PackingingSheetFilterProps) {
  const {
    onSearch,
    packingSheetStatusList,
    packingSheetRequest,
    onStatusChange,
    onApplyFilter,
    onReset,
    onEndDateChange,
    onStartDateChange,
  } = props;

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} p={1} pb={0}>
        <TextField
          placeholder="Quick Search"
          fullWidth
          size="small"
          onChange={(e: { target: { value: string } }) =>
            onSearch(e.target.value)
          }
          value={packingSheetRequest?.search || ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">                   
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

<Grid container alignItems="center" justifyContent="space-between" p={1} spacing={1}>
  
<Grid item xs={12} md={3} lg={3}>
    {/* Autocomplete for Catalogue Status */}
    <Autocomplete
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Status"
          label="Packing Sheet Status"
        />
      )}
      options={packingSheetStatusList}
      size="small"
      value={packingSheetRequest.status || null}
      getOptionLabel={(option) => option.statusName || ""}
      isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
      onChange={(event, value) => onStatusChange(value)}
    />
  </Grid>
  <Grid item xs={12} md={3} lg={3}>
    {/* Date picker for From */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="From"
        slotProps={{ textField: { size: "small", error: false }}}
        onChange={onStartDateChange}
        sx={{ width: "100%" }}
        value={packingSheetRequest.startDate ? dayjs(packingSheetRequest.startDate) : dayjs(null)}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={12} md={3} lg={3}>
    {/* Date picker for To */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="To"
        slotProps={{ 
          textField: { 
            size: "small", 
            error: (packingSheetRequest.startDate !== undefined && !packingSheetRequest.endDate),
            helperText: (packingSheetRequest.startDate !== undefined && !packingSheetRequest.endDate ? "End Date is Required" : "") 
          } 
        }}
        minDate={dayjs(packingSheetRequest.startDate)}
        onChange={onEndDateChange}
        sx={{ width: "100%" }}
        value={packingSheetRequest.endDate ? dayjs(packingSheetRequest.endDate) : dayjs(null)}
        // error={packingSheetRequest.startDate === undefined ? "End Date is Required" : ""}
        disabled={packingSheetRequest.startDate === undefined}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={12} md={3} lg={3}>
    {/* Buttons */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: { lg: 'center'}  }}>
      <Button size="small" 
      onClick={onReset} 
      variant="text">
        RESET ALL
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={onApplyFilter}
        endIcon={<FilterAltIcon />}
      >
        Apply Filter
      </Button>
    </Box>
  </Grid>
</Grid>

    </Grid>
  );
}

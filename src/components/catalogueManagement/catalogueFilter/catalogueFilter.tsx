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
export interface CatalogueFilterProps {
  onSearch: (value: string) => void;
  onEndDateChange: (value: Dayjs | null) => void;
  onStartDateChange: (value: Dayjs | null) => void;
  onBrokerChange: (value: Broker | null) => void;
  onSalesCodeChange: (value: Sales | null) => void;
  catalogStatus: FieldValue<CatalogueStatus[] | null>;
  onStateChange: (value: CatalogueStatus[] | null) => void;
  broker: FieldValue<Broker | null>;
  brokers: Broker[];
  sales: Sales[];
  salesFilterValue: FieldValue<Sales | null>;
  onApplyFilter: () => void;
  onReset: () => void;
  catalogueStatusList: CatalogueStatus[];
  startDate: Date;
  startDateValue:Date | null;
  
  endDateValue:Date | null;
}

export default function CatalogueFilter(props: CatalogueFilterProps) {
  const {
    onSearch,
    onBrokerChange,
    broker,
    brokers,
    onSalesCodeChange,
    sales,
    salesFilterValue,
    onApplyFilter,
    onReset,
    catalogueStatusList,
    onEndDateChange,
    onStartDateChange,
    startDate,
    onStateChange,
    catalogStatus,
    startDateValue,
    endDateValue
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
  <Grid item xs={12} md={2} lg={2}>
    {/* Autocomplete for Broker */}
    <Autocomplete
      size="small"
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          error={broker?.error !== null && broker !== null}
          helperText={broker?.error}
          placeholder="Broker Code / Name"
          label="Broker Code / Name"
        />
      )}
      filterSelectedOptions
      options={brokers}
      value={broker.value}
      getOptionLabel={(option) => `${option.brokerCode} - ${option.brokerName}` || ""}
      isOptionEqualToValue={(option, value) => option.brokerCode === value?.brokerCode}
      onChange={(event, value) => onBrokerChange(value)}
    />
  </Grid>
  <Grid item xs={12} md={2} lg={2}>
    {/* Autocomplete for Sales Code */}
    <Autocomplete
      size="small"
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          error={salesFilterValue?.error !== null && salesFilterValue !== null}
          helperText={salesFilterValue?.error}
          placeholder="Sales Code"
          label="Sales Code"
        />
      )}
      filterSelectedOptions
      options={sales}
      disabled={broker === null}
      value={salesFilterValue.value}
      getOptionLabel={(option) => option.salesCode || ""}
      isOptionEqualToValue={(option, value) => option.salesCode === value?.salesCode}
      onChange={(event, value) => onSalesCodeChange(value)}
    />
  </Grid>
  <Grid item xs={12} md={2} lg={2}>
    {/* Date picker for From */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="From"
        slotProps={{ textField: { size: "small", error: false }}}
        onChange={onStartDateChange}
        sx={{ width: "100%" }}
        value={dayjs(startDateValue)}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={12} md={2} lg={2}>
    {/* Date picker for To */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="To"
        slotProps={{ textField: { size: "small", error: false } }}
        minDate={dayjs(startDate)}
        onChange={onEndDateChange}
        sx={{ width: "100%" }}
        value={dayjs(endDateValue)}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={12} md={1.7} lg={1.7}>
    {/* Autocomplete for Catalogue Status */}
    <Autocomplete
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Catalogue Status"
          label="Catalogue Status"
        />
      )}
      options={catalogueStatusList}
      filterSelectedOptions
      limitTags={1}
      multiple
      size="small"
      value={catalogStatus.value || []}
      getOptionLabel={(option) => option.statusName || ""}
      isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
      onChange={(event, value) => onStateChange(value)}
    />
  </Grid>
  <Grid item xs={12} md={2.3} lg={2.3}>
    {/* Buttons */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: { lg: 'center'}  }}>
      <Button size="small" onClick={onReset} variant="text">
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

"use client";

import React from "react";
import { Autocomplete, Button, Grid, TextField, Box } from "@mui/material";
import { DeliveryOrderStatus, FieldValue } from "@/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs, { Dayjs } from "dayjs";

export interface DeliveryOrderFilterProps {
  onSearch: (value: string) => void;
  onToDateChange: (value: Dayjs | null) => void;
  onFromDateChange: (value: Dayjs | null) => void;
  deliveryOrderStatus: FieldValue<DeliveryOrderStatus[] | null>;
  onStateChange: (value: DeliveryOrderStatus[] | null) => void;
  onApplyFilter: () => void;
  onReset: () => void;
  deliveryOrderStatusList: DeliveryOrderStatus[];
  startDate: Date;
  startDateValue: Date | null;
  endDateValue: Date | null;
}

export default function DeliveryOrderFilter(props: DeliveryOrderFilterProps) {
  const {
    onSearch,
    onApplyFilter,
    onReset,
    deliveryOrderStatusList,
    onFromDateChange,
    onToDateChange,
    startDate,
    onStateChange,
    deliveryOrderStatus,
    startDateValue,
    endDateValue,
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

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        p={1}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={3}>
          {/* Autocomplete for Status */}
          <Autocomplete
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Status"
                label="Status"
              />
            )}
            options={deliveryOrderStatusList}
            filterSelectedOptions
            limitTags={1}
            multiple
            size="small"
            value={deliveryOrderStatus.value || []}
            getOptionLabel={(option) => option.statusName || ""}
            isOptionEqualToValue={(option, value) =>
              option.statusName === value?.statusName
            }
            onChange={(event, value) => onStateChange(value)}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          {/* Date picker for From */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              slotProps={{ textField: { size: "small", error: false } }}
              onChange={onFromDateChange}
              sx={{ width: "100%" }}
              value={dayjs(startDateValue)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          {/* Date picker for To */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To"
              slotProps={{ textField: { size: "small", error: false } }}
              minDate={dayjs(startDate)}
              onChange={onToDateChange}
              sx={{ width: "100%" }}
              value={dayjs(endDateValue)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: { lg: "center" },
            }}
          >
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

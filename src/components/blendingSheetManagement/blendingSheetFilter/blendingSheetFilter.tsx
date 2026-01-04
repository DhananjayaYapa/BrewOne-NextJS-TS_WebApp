"use client";

import React from "react";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs, { Dayjs } from "dayjs";
import { BlendSheetStatus, GetAllBlendSheetsRequest } from "@/interfaces/blendSheet";
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";
import { SalesOrder } from "@/interfaces";
export interface BlendingSheetFilterProps {
  onSearch: (value: string) => void;
  blendSheetStatusList: BlendSheetStatus[];
  blendSheetRequest: GetAllBlendSheetsRequest
  onEndDateChange: (value: Dayjs | null) => void;
  onStartDateChange: (value: Dayjs | null) => void;
  onStatusChange: (value: BlendSheetStatus | null) => void;
  onApplyFilter: () => void;
  onReset: () => void;
  salesOrderList: SalesOrder[]
  salesOrderListIsLoading: boolean
  onSalesOrderSelect: (value: SalesOrder | null) => void;
  onFetchOptions: () => void
  onSearchOptions: (value: string | undefined) => void
  isDate: boolean
}

export default function BlendingSheetFilter(props: BlendingSheetFilterProps) {
  const {
    onSearch,
    blendSheetStatusList,
    blendSheetRequest,
    onStatusChange,
    onApplyFilter,
    onReset,
    onEndDateChange,
    onStartDateChange,
    salesOrderList,
    salesOrderListIsLoading,
    onSalesOrderSelect,
    onFetchOptions,
    onSearchOptions,
    isDate
  } = props;
  const widthParam = isDate ? 2 : 4

  const uniqueBlendStatusList = React.useMemo(() => {
    return blendSheetStatusList.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.statusCode === item.statusCode)
    );
  }, [blendSheetStatusList]);

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
          value={blendSheetRequest?.search || ""}
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

        <Grid item xs={12} md={isDate ? 2 : 3} lg={isDate ? 2 : 3}>
          <Autocomplete
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Blending Sheet Status"
                label="Blending Sheet Status"
              />
            )}
            options={uniqueBlendStatusList}
            size="small"
            value={blendSheetRequest.status || null}
            getOptionLabel={(option) => option.statusName || ""}
            isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
            onChange={(event, value) => onStatusChange(value)}
          />
        </Grid>
        {isDate && (
        <Grid item xs={12} md={2.5} lg={2.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              slotProps={{ textField: { size: "small", error: false } }}
              onChange={onStartDateChange}
              sx={{ width: "100%" }}
              value={blendSheetRequest.startDate ? dayjs(blendSheetRequest.startDate) : dayjs(null)}
            />
          </LocalizationProvider>
        </Grid>
        )}
        {isDate && (
        <Grid item xs={12} md={2.5} lg={2.5}>
          {/* Date picker for To */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To"
              slotProps={{
                textField: {
                  size: "small",
                  error: (blendSheetRequest.startDate !== undefined && !blendSheetRequest.endDate),
                  helperText: (blendSheetRequest.startDate !== undefined && !blendSheetRequest.endDate ? "End Date is Required" : "")
                }
              }}
              minDate={dayjs(blendSheetRequest.startDate)}
              onChange={onEndDateChange}
              sx={{ width: "100%" }}
              value={blendSheetRequest.endDate ? dayjs(blendSheetRequest.endDate) : dayjs(null)}
              // error={blendSheetRequest.startDate === undefined ? "End Date is Required" : ""}
              disabled={blendSheetRequest.startDate === undefined}
            />
          </LocalizationProvider>
        </Grid>
        )}
        <Grid item xs={12} md={isDate ? 2.5 : 3} lg={isDate ? 2.5 : 3}>
          <AsyncSingleAutocomplete
            fullWidth
            loading={salesOrderListIsLoading}
            options={salesOrderList}
            placeHolder="Select Sales Order"
            value={blendSheetRequest.salesOrder || null}
            onChange={(value) => onSalesOrderSelect(value)}
            onFetchOptions={onFetchOptions}
            onSearch={(value) => onSearchOptions && onSearchOptions(value)}
            displayKey={"salesOrderId"}
            disabled={false}
          />
        </Grid>
        <Grid item xs={12} md={isDate ? 2.5 : 4} lg={isDate ? 2.5 : 6}>
          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: { lg: 'center' } }}>
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

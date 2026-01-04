"use client";

import React from "react";

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import {
  CatalogFileList,
  FieldValue,
  LotSummeryAPIResponse,
} from "@/interfaces";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import dayjs, { Dayjs } from "dayjs";
import { setSelectedCatalogSerialNumber } from "@/redux/slice/dashBoardLotHistorySlice";
export interface DashboardFilterProps {
  onStartDateChange: (value: Dayjs | null) => void;
  onEndDateChange: (value: Dayjs | null) => void;
  onLotNumberChange: (value: string | null) => void;
  onApplyFilter: () => void;
  onReset: () => void;
  onCatalogChange: (value: string | null) => void;

  selectedCatalogNo: number | undefined;
  selectedCatalogSerialNumber: string | undefined;
  selectedLotNo: string | null;
  lotNumber: LotSummeryAPIResponse[];
  catalogs: CatalogFileList[];
  catalog: FieldValue<CatalogFileList | null>;
  startDateValue: Date | null;
  endDateValue: Date | null;
}

export default function DashboardFilter(props: DashboardFilterProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    onStartDateChange,
    onEndDateChange,
    onLotNumberChange,
    onApplyFilter,
    onReset,
    onCatalogChange,

    selectedCatalogNo,
    selectedCatalogSerialNumber,
    selectedLotNo,
    lotNumber,
    catalogs,
    catalog,
    startDateValue,
    endDateValue,
  } = props;

  const selectedCatalogId = catalogs.find(
    (item) => item.catalogId === selectedCatalogNo
  );
  const selectedCatalogSerialNo = catalogs.find(
    (item) => item.catalogSerialNumber === selectedCatalogSerialNumber
  );

  const brokerCode = selectedCatalogId ? selectedCatalogId.brokerCode : "";
  const brokerCodeValue = selectedCatalogSerialNo ? selectedCatalogSerialNo.brokerCode : "";

  return (
    <>
      <Grid container mb={1}>
        <Grid item xs={12} md={10} lg={10}>
          <Typography variant="h3" align="left">
            Lot Details
          </Typography>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Autocomplete
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Catalogue"
                label="Select Catalogue"
              />
            )}
            options={catalogs?.map((item) => {
              return item.catalogSerialNumber;
            })}
            filterSelectedOptions
            size="small"
            value={selectedCatalogSerialNumber || undefined}
            onChange={(event, value) => onCatalogChange(value)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
          <Tooltip title={`${brokerCodeValue}${selectedCatalogSerialNo
              ? `: ${selectedCatalogSerialNo?.brokerName}`
              : ""
            }`} placement="top">
            <TextField
              size="small"
              disabled
              //={!selectedCatalogSerialNo}
              fullWidth
              id="outlined-required"
              label="Broker Code/Name"
              value={`${brokerCodeValue}${selectedCatalogSerialNo
                  ? `: ${selectedCatalogSerialNo?.brokerName}`
                  : ""
                }`}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder="Broker"
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
          <Autocomplete
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Lot Number"
                label="Lot Number"
              />
            )}
            options={lotNumber?.map((item) => {
              return item.lotNo;
            })}
            filterSelectedOptions
            size="small"
            value={selectedLotNo !== null ? selectedLotNo.toString() : ""}
            onChange={(event, value) =>
              onLotNumberChange(value ? value : null)
            }
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) =>
              option.toString() === value.toString()
            }
          />
        </Grid>
        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              slotProps={{ textField: { size: "small", error: false } }}
              onChange={onStartDateChange}
              sx={{ width: "100%" }}
              value={dayjs(startDateValue)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To"
              slotProps={{ textField: { size: "small", error: false } }}
              minDate={dayjs(startDateValue)}
              onChange={onEndDateChange}
              sx={{ width: "100%" }}
              value={dayjs(endDateValue)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
          {/* Buttons */}
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
    </>
  );
}

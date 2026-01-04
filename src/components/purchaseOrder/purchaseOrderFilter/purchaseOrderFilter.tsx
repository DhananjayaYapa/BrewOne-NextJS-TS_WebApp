"use client";

import React from "react";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Box,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { GetPurchaseOrderListRequest } from "@/interfaces/purchaseOrder";
import { Broker } from "@/interfaces";
export interface PurchaseOrderFilterProps {
  // onSearch: (value: string) => void;
  purchaseOrderStatusList: ['Pending', 'Approved','Rejected'];
  purchaseOrderRequest: GetPurchaseOrderListRequest
  onStatusChange: (value: string | null) => void;
  onApplyFilter: () => void;
  onReset: () => void;
  onSearch: (value: string) => void;
  brokerCodeList: string[]
  onBrokerChange:(broker: string | null) => void
}

export default function PurchaseOrderFilter(props: PurchaseOrderFilterProps) {
  const {
    purchaseOrderStatusList,
    purchaseOrderRequest,
    onStatusChange,
    onApplyFilter,
    onSearch,
    onReset,
    brokerCodeList,
    onBrokerChange
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
          value={purchaseOrderRequest?.search || ""}
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
    <Autocomplete
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Purchase Order Status"
          label="Purchase Order Status"
        />
      )}
      options={purchaseOrderStatusList}
      size="small"
      value={purchaseOrderRequest.approvalStatus || null}
      onChange={(event, value) => onStatusChange(value?.toUpperCase() || null)}
    />
  </Grid>

  <Grid item xs={12} md={3} lg={3}>
    <Autocomplete
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Broker Code"
          label="Broker Code"
        />
      )}
      options={brokerCodeList}
      size="small"
      value={purchaseOrderRequest.brokerCode || null}
      onChange={(event, value) => onBrokerChange(value)}
    />
  </Grid>
  <Grid item xs={12} md={6} lg={6}>
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

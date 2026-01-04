"use client";
import {
  Autocomplete,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { BlendSFGItem, BlendSFGItemOptions } from "@/interfaces/blendSheet";
export interface BlendSFGTableProps {
  onBlendSheetNoSelect: (blendSheetNo: string) => void
  selectedSfgItems: BlendSFGItem[];
  isView: boolean;
  onDeleteSfgItem: (blendsheetNo: string) => void;
  selectableSFGItems: BlendSFGItemOptions[]
}

export default function BlendSFGTable(props: BlendSFGTableProps) {
  const {
    onBlendSheetNoSelect,
    selectedSfgItems,
    isView,
    onDeleteSfgItem,
    selectableSFGItems
  } = props;

  const isNewItem = (blendSheetNo: string) => {
    let isNew = true;
    if (blendSheetNo !== "") {
      isNew = false
    }
    return isNew
  }

  const selectableOptions = () => {
    const selectedBlendNos = selectedSfgItems?.map(item => item.blendSheetNo).filter(blendSheetNo => blendSheetNo && blendSheetNo.trim() !== "") || [];

    const filteredOptions = selectableSFGItems?.filter(item => !selectedBlendNos.includes(item.blendSheetNo)).map((item) => item.blendSheetNo) || [];

    return filteredOptions;
  }
  
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: "auto !important" }}>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6">Blend Sheet No</Typography></TableCell>
            {/* <TableCell><Typography variant="h6">Item Code</Typography></TableCell>
            <TableCell><Typography variant="h6">Item Description</Typography></TableCell> */}
            <TableCell><Typography variant="h6">Warehouse</Typography></TableCell>
            <TableCell><Typography variant="h6">Batch No</Typography></TableCell>
            <TableCell><Typography variant="h6">Price</Typography></TableCell>
            <TableCell><Typography variant="h6">Value</Typography></TableCell>
            <TableCell><Typography variant="h6">Quantity</Typography></TableCell>
            {!isView && (
              <TableCell>
                <Typography variant="h6" align="center">Actions</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedSfgItems?.map((row, idx) => {
            return (
              <React.Fragment key={idx}>
                <TableRow>
                  <TableCell sx={{ width: "20%" }}>
                    {!isNewItem(row.blendSheetNo) && (row.blendSheetNo)}
                    {isNewItem(row.blendSheetNo) && (
                      <Autocomplete
                        fullWidth
                        size="small"
                        options={selectableOptions() || []}
                        value={row.blendSheetNo === "" ? null : row.blendSheetNo}
                        getOptionLabel={(option) => option ?? ""}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(_, val) => {
                        if (val) onBlendSheetNoSelect(val);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Blend Sheet"
                            variant="outlined" />
                        )}
                        disabled={isView}
                    />
                    )}

                  </TableCell>

                  {/* <TableCell>{row.itemCode ?? "" : ""}</TableCell> */}
                  {/* <TableCell>{(row as any).itemDescription ?? "" : ""}</TableCell> */}
                  <TableCell>{row.warehouseCode ?? "" }</TableCell>
                  <TableCell>{row.batchId ?? ""}</TableCell>
                  <TableCell>{row.price ?? ""}</TableCell>
                  <TableCell>{row.quantity && row.price ? (row.quantity * row.price).toFixed(3) : ""}</TableCell>
                  <TableCell>{row.quantity ?? "" }</TableCell>

                  {!isView && (
                    <TableCell>
                      <Box display="flex" flexDirection="row" sx={{ zIndex: 10000 }}>
                        <IconButton
                          disabled={isView}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSfgItem(row.blendSheetNo);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
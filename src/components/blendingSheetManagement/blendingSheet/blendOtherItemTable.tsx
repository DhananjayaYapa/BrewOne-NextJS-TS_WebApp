"use client";
import React from "react";
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
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OtherBlendItem, OtherBlendLotStock, OtherBlendWarehouse, OtherBOMItem, OtherBOMItemDetail, SelectedOtherItemLotStock } from "@/interfaces/blendSheet";
import { GetItemRequest } from "@/interfaces/item";
import { itemMasterService } from "@/service/ItemMasterService"
import { ItemDetail } from "@/interfaces/teaLotById"
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete"
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'

export interface BlendOtherItemTableProps {
  otherBOMDetails: OtherBOMItemDetail;
  selectedWarehouses: SelectedOtherItemLotStock[]
  setOpen: (value: boolean, itemCode: string, index: number) => void
  // onWarehouseSelect: (itemCode: string, value: OtherBlendWarehouse | null, index: number) => void
  isView: boolean
  // warehouseList: WarehouseStock[]
  toWarehouse: string | null
  addLot: (itemCode: string, index: number) => void
  onDeleteLot: (itemCode: string, index: number) => void
  onLotSelect: (itemCode: string, value: OtherBlendLotStock | null, index: number) => void
  onEnterRequiredQuantity: (requiredQuantity: number, itemCode: string, lot: OtherBlendLotStock | null, index: number) => void
  deleteBlendItem: (row: OtherBOMItem, index: number) => void
  initialBlendItems: OtherBlendItem[]
  onItemSelect: (value: ItemDetail | null, index: number) => void
  onSearchOptions: (value: string) => void
  onFetchOptions: () => void
  itemList: ItemDetail[]
}

export default function BlendOtherItemTable(props: BlendOtherItemTableProps) {

  const {
    otherBOMDetails,
    selectedWarehouses,
    setOpen,
    // onWarehouseSelect,
    isView,
    // warehouseList,
    addLot,
    onDeleteLot,
    onLotSelect,
    onEnterRequiredQuantity,
    deleteBlendItem,
    initialBlendItems,
    onItemSelect,
    onSearchOptions,
    onFetchOptions,
    itemList,
    toWarehouse
  } = props;

  const isNewItem = (itemCode: string) => {
    let isNew = true;
    if (initialBlendItems.some((item) => item.code === itemCode)) {
      isNew = false
    }
    return isNew
  }

  const otherItemList = new Set(itemList)
  const otherItemsArray = Array.from(otherItemList);
  const uniqueItemList = otherItemsArray;

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: "auto !important" }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Item Code</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Item Description</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Batch No</Typography>
            </TableCell>
             <TableCell>
              <Typography variant="h6">Warehouse</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">No Of Bags</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Price</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Value</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Stock Available</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Required Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">To Warehouse</Typography>
            </TableCell>
            {!isView && (
              <TableCell>
                <Typography variant="h6" align="center">
                  Actions
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {otherBOMDetails?.bomItems.map((row, index) => (
            <React.Fragment key={row.code}>
              <TableRow>
                <TableCell width={180}>
                  {!isNewItem(row.code) && (row.code)}
                  {isNewItem(row.code) && (
                    <AsyncSingleAutocomplete
                      fullWidth
                      loading={false}
                      options={uniqueItemList}
                      placeHolder="Select Item Code"
                      value={row.item || null}
                      onChange={(value) => onItemSelect(value, index)}
                      onFetchOptions={onFetchOptions}
                      onSearch={(value) => onSearchOptions(value || "")}
                      displayKey={"itemCode"}
                      disabled={false}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ width: '20%' }}>{row.description}</TableCell>
                {selectedWarehouses.filter((item) => item.itemCode === row.code).slice(0, 1)?.map((item1, index) => (
                  <React.Fragment key={`${item1.itemCode}-0`}>
                    <TableCell sx={{ width: '15%', minWidth: '15%'}}>
                       <Autocomplete
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Batch No" />
                        )}
                        options={
                          item1?.lotOptions?.length > 0 && item1?.lotOptions?.filter(s => !selectedWarehouses?.map(x => x.selectedLot?.batchId)?.filter((batchId => batchId != null)).includes(s.batchId)) || []
                        }
                        groupBy={() => 'Batch Info'}
                        getOptionLabel={(option) => option.batchId}
                        renderGroup={(params) => (
                          <li key={params.key}>
                            <div
                              style={{
                                fontWeight: 'bold',
                                display: 'flex',
                                gap: '20px',
                                padding: '8px 16px',
                                backgroundColor: '#f0f0f0',
                              }}
                            >
                              <span style={{ flex: 1 }}>Batch ID</span>
                              <span style={{ flex: 1 }}>Quantity</span>
                            </div>
                            <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                          </li>
                        )}
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              display: 'flex',
                              gap: '20px',
                              padding: '8px 16px',
                            }}
                          >
                            <span style={{ flex: 1 }}>{option.batchId}</span>
                            <span style={{ flex: 1 }}>{option.quantity}</span>
                          </li>
                        )}
                        value={item1?.selectedLot || null
                        }
                        onChange={(event, value) =>
                          onLotSelect(
                            row.code,
                            value,
                            1
                          )
                        }
                        filterSelectedOptions
                        disabled={isView}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ width: '5%', minWidth: '5%' }}>
                        {item1.selectedLot?.warehouseCode}
                    </TableCell>
                    <TableCell>
                      <Typography> {!item1?.selectedLot?.weightPerBag ? '-' : ((item1?.selectedLot?.requiredQuantity || 0) / (item1?.selectedLot?.weightPerBag || 0)).toFixed(3) || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography> {item1?.selectedLot?.price?.toFixed(2) || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography> {!item1?.selectedLot?.price ? '-' : ((item1?.selectedLot?.requiredQuantity || 0) * (item1?.selectedLot?.price || 0)).toFixed(3) || '-'}</Typography>
                    </TableCell>
                    <TableCell >
                      {item1?.selectedLot?.quantity || "-"}
                    </TableCell>

                    <TableCell>
                      <TextField
                        variant="standard"
                        type='number'
                        value={item1?.selectedLot?.requiredQuantity}
                        required
                        onChange={(e) => onEnterRequiredQuantity(
                          parseFloat(e.target.value),
                          row.code,
                          item1?.selectedLot || null,
                          item1.index,
                        )}
                        disabled={isView}

                        error={item1.error !== "No Error" || !item1?.selectedLot?.requiredQuantity}
                        helperText={item1.error !== "No Error" && !isView ? item1.error : ""}
                        InputProps={{
                          inputProps: {
                            type: 'number',
                            step: 0.001,
                            min: 0.000,
                          },
                        }} />
                    </TableCell>
                    <TableCell>

                      <Typography> {toWarehouse || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="row">

                        {!isView && index === (selectedWarehouses.filter(i => i.itemCode === item1.itemCode).length - 1) && item1?.lotOptions?.length > 1 && (
                          <IconButton disabled={isView || item1.selectedLot === null}
                            onClick={(e) => addLot(row.code, item1.index)}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                        {!isView && (
                          <Tooltip title='Delete BOM Item'>

                            <IconButton
                              aria-label="expand row"
                              size="small"
                              // disabled
                              onClick={() => deleteBlendItem(row, index)}
                            >
                              <DeleteIcon />

                            </IconButton>
                          </Tooltip>
                        )}
                        {selectedWarehouses.filter(r => r.itemCode === row.code)?.length > 1 && (
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(item1.isCollapsed, item1.itemCode, item1.index)}
                          >
                            {item1.isCollapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        )}
                        {!isView && selectedWarehouses.filter(
                          (t) => t.itemCode === row.code && t.error !== "No Error"
                        ).length > 0
                          && (
                            <Tooltip title={selectedWarehouses.filter(
                              (t) => t.itemCode === row.code && t.error !== "No Error"
                            )?.map(error => error.error).toString() || 'Please Check Required Quantity'}>
                              <IconButton
                                size="small"
                                color="error"
                              >
                                <ErrorIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                      </Box>

                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
              {selectedWarehouses.filter((item) => item.itemCode === row.code).slice(1)?.map((i, iindex) => (
                <TableRow key={index} sx={{ display: i.isCollapsed ? "table-row" : "none" }}>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell sx={{ width: '15%', minWidth: '15%' }}>
                    <Autocomplete
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Lot No" />
                      )}
                      options={
                        i?.lotOptions?.filter(s => !selectedWarehouses.map(x => x.selectedLot?.batchId)?.filter(batchId => batchId != null).includes(s.batchId)) || []
                      }
                      groupBy={() => 'Batch Info'}
                      getOptionLabel={(option) => `${option.batchId}`}
                      renderGroup={(params) => (
                        <li key={params.key}>
                          <div
                            style={{
                              fontWeight: 'bold',
                              display: 'flex',
                              gap: '20px',
                              padding: '8px 8px',
                              backgroundColor: '#f0f0f0',
                            }}
                          >
                            <span style={{ flex: 1 }}>Batch ID</span>
                            <span style={{ flex: 1 }}>Quantity</span>
                          </div>
                          <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                        </li>
                      )}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            display: 'flex',
                            gap: '20px',
                            padding: '8px 8px',
                          }}
                        >
                          <span style={{ flex: 1 }}>{option.batchId}</span>
                          <span style={{ flex: 1 }}>{option.quantity}</span>
                        </li>
                      )}
                      value={
                        i?.selectedLot || undefined
                      }
                      disableClearable
                      onChange={(event, value) =>
                        onLotSelect(
                          row.code,
                          value,
                          i.index
                        )
                      }
                      filterSelectedOptions
                      disabled={isView}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ width: '5%', minWidth: '5%' }}>
                        {i?.selectedLot?.batchId || "-"}
                    </TableCell>
                    <TableCell sx={{ width: '5%', minWidth: '5%' }}>
                        {i?.selectedLot?.warehouseCode || "-"}
                    </TableCell>

                  <TableCell>
                    <Typography> {!i?.selectedLot?.weightPerBag ? '-' : ((i?.selectedLot?.requiredQuantity || 0) / (i?.selectedLot?.weightPerBag || 0)).toFixed(3) || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography> {i?.selectedLot?.price?.toFixed(2) || '-'}</Typography>
                  </TableCell>
                  <TableCell>

                    <Typography> {!i?.selectedLot?.price ? '-' : ((i?.selectedLot?.requiredQuantity || 0) * (i?.selectedLot?.price || 0)).toFixed(3) || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    {i.selectedLot?.quantity}
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      type='number'
                      value={i?.selectedLot?.requiredQuantity}
                      required
                      onChange={(e) => onEnterRequiredQuantity(
                        parseFloat(e.target.value),
                        row.code,
                        i?.selectedLot || null,
                        i.index)}
                      disabled={isView}

                      error={i.error !== "No Error"}
                      helperText={i.error !== "No Error" ? i.error : ""}
                      InputProps={{
                        inputProps: {
                          type: 'number',
                          step: 0.001,
                          min: 0.000,
                        },
                      }} />
                  </TableCell>
                  <TableCell>
                    <Typography>{toWarehouse || ''}</Typography>
                  </TableCell>
                  {!isView && (
                    <TableCell>
                      <Box display="flex" flexDirection="row">
                        {(iindex + 1) === ((selectedWarehouses.filter(it => it.itemCode === i.itemCode).length - 1)) && (
                          <IconButton
                            disabled={isView}
                            onClick={(e) => addLot(row.code, i.index)}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                        <IconButton disabled={isView}
                          onClick={(e) => onDeleteLot(row.code, i.index)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              )
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
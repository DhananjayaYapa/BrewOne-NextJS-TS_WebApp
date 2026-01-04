'use client';
import { Autocomplete, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import { BOMItemDetail, Warehouse, WarehouseStock } from "@/interfaces";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ErrorIcon from '@mui/icons-material/Error';
import { LotStock, SelectedWarehouseStock, BlendWarehouse, BlendItem, BOMItem } from "@/interfaces/salesOrder";
import React from "react";
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";
import { ItemDetail } from "@/interfaces/teaLotById";
import { Rowdies } from "next/font/google";

export interface BlendingSheetBomDetailsProps {
  blendBOMdetails: BOMItemDetail;
  deleteBlendItem: (row: BOMItem, index: number) => void
  initialBlendItems: BOMItem[]
  addLot: (itemCode: string, index: number) => void;
  onDeleteLot: (itemCode: string, index: number) => void;
  plannedProductQuantity: number;
  isView: boolean;
  warehouseList: WarehouseStock[];
  // toWarehouseList: BlendWarehouse[];
  onWarehouseSelect: (itemCode: string, value: BlendWarehouse | null, index: number) => void
  // onToWarehouseSelect: (itemCode: string, value: BlendWarehouse | null, index: number) => void
  selectedWarehouses: SelectedWarehouseStock[]
  onLotSelect: (itemCode: string, value: LotStock | null, warehouse: BlendWarehouse | null, index: number) => void
  setOpen: (value: boolean, itemCode: string, index: number) => void
  onEnterRequiredQuantity: (value: number, itemCode: string, warehouse: BlendWarehouse | null, lot: LotStock | null,
    index: number, plannedQuantity: number) => void
  onItemSelect: (value: ItemDetail | null, index: number) => void;
  onSearchOptions: (value: string) => void
  onFetchOptions: () => void
  itemList: ItemDetail[]
  onBasedQuantityChange: (itemCode: string, value: number) => void
  toWarehouse: string | null
  grnCheckList: string[] | undefined
  isFromDuplicate?: boolean
  isFromCreate?: boolean
  onNestedWarehouseSelect?:(itemCode: string, value: BlendWarehouse | null, index: number) => void
}

export default function BlendingSheetBomDetails(props: BlendingSheetBomDetailsProps) {

  const {
    blendBOMdetails,
    addLot,
    plannedProductQuantity,
    warehouseList,
    // toWarehouseList,
    onWarehouseSelect,
    selectedWarehouses,
    onLotSelect,
    onEnterRequiredQuantity,
    // onToWarehouseSelect,
    onDeleteLot,
    setOpen,
    isView,
    onItemSelect,
    onSearchOptions,
    onFetchOptions,
    itemList,
    onBasedQuantityChange,
    initialBlendItems,
    deleteBlendItem,
    toWarehouse,
    grnCheckList,
    isFromDuplicate,
    isFromCreate,
    onNestedWarehouseSelect
  } = props

  const isNewItem = (itemCode: string) => {
    let isNew = true;
    if (initialBlendItems.some((item) => item.code === itemCode)) {
      isNew = false
    }
    return isNew
  }
  
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: 'auto !important' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Item Code</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Item Description</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Based Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Planned Quantity</Typography>
            </TableCell>
            <TableCell width={50}>
              <Typography variant="h6">From Warehouse*</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Lot No*</Typography>
            </TableCell>
            {/* <TableCell>
              <Typography variant="h6">Box No</Typography>
            </TableCell>*/}
             <TableCell>
              <Typography variant="h6">Box No.</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">No. of Bags</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Price</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Value</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Stock Available*</Typography>
            </TableCell>

            <TableCell>
              <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>Required Quantity*</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">To Warehouse</Typography>
            </TableCell>
            {!isView && (
              <TableCell sx={{ position: 'sticky' }}>
                <Typography variant="h6" align='center'>Actions</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {blendBOMdetails?.bomItems?.map((row, index) => (
            <React.Fragment key={row.code}>
              <TableRow>
                {/* Bug-681 */}
                <TableCell width={180}>
                  {!isNewItem(row.code) && (row.code)}
                  {isNewItem(row.code) && (
                    <AsyncSingleAutocomplete
                      fullWidth
                      loading={false}
                      options={itemList}
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
                <TableCell>
                  {!isNewItem(row.code) && (
                    (row.basedQuantity)
                  )}

                  {isNewItem(row.code) && (
                    <TextField
                      variant="standard"
                      type='number'
                      value={row.basedQuantity}
                      required
                      onChange={(e) => onBasedQuantityChange(row.code, parseFloat(e.target.value))}
                      InputProps={{
                        inputProps: {
                          type: 'number',
                          step: 0.001,
                          min: 0.000,
                        }, // Set min and max constraints
                      }} />
                  )}
                </TableCell>
                <TableCell>
                  {!isNaN(Number((row.basedQuantity * plannedProductQuantity)?.toFixed(3))) && Number(plannedProductQuantity) && (row.basedQuantity * plannedProductQuantity) > 0 ?
                    (row.basedQuantity * plannedProductQuantity)?.toFixed(3) : "-"}
                </TableCell>
                {selectedWarehouses.filter((item) => item.itemCode === row.code).slice(0, 1)?.map((item1, index) => (
                  <React.Fragment key={`${item1.itemCode}-0`}>
                    <TableCell width={50}>
                      {(warehouseList?.find((w) => w.itemCode === row.code)?.warehouses?.length ?? 0) > 1 ? (
                        <Autocomplete
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Warehouse" />
                          )}
                          options={warehouseList?.find((w) => w.itemCode === row.code)?.warehouses || []}
                          getOptionLabel={(option) => option.warehouseCode}
                          value={item1?.fromWarehouse || null}
                          onChange={(event, value) => onWarehouseSelect(row.code, value, item1.index)}
                          size="small"
                          disabled={isView}
                        />
                      ) :
                        (
                          <Typography paddingLeft={2}>{warehouseList?.find((w) => w.itemCode === row.code)?.warehouses?.map(w => w.warehouseCode).toString()
                            || item1?.fromWarehouse?.warehouseCode}</Typography>
                        )}
                      {(warehouseList?.find((w) => w.itemCode === row.code)?.warehouses?.filter(w => w.warehouseCode !== toWarehouse)?.length) === 0 && !item1?.fromWarehouse?.warehouseCode && (
                        <Typography>No Warehouses</Typography>
                      )
                      }
                    </TableCell>
                    {/* {item1?.fromWarehouse?.warehouseCode} */}
                    <TableCell sx={{ width: '15%', minWidth: '15%' }}>
                      <Autocomplete
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Lot No" />
                        )}
                        // filterSelectedOptions
                        options={
                          item1?.lotOptions?.length > 0 && item1?.lotOptions?.filter(s => !selectedWarehouses?.map(x => x.selectedLot?.batchId)?.filter(batchId => batchId != null).includes(s.batchId)) || []
                        }
                        groupBy={() => 'Batch Info'}
                        getOptionLabel={(option) => `${option.batchId} - ${((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === item1.fromWarehouse?.warehouseCode)
                          ?.lots?.find(l => l.batchId === option?.batchId)?.quantity || 0) +
                          (blendBOMdetails.bomItems
                            .find((e: { code: string; }) => e.code === row.code)?.lots
                            ?.find(l => l.batchId === option?.batchId)?.quantity || 0))?.toFixed(3)
                          }`} // Only for input display
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
                            <span style={{ flex: 1 }}>{option.batchId || 0}</span>
                            <span style={{ flex: 1 }}>{((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === item1.fromWarehouse?.warehouseCode)
                              ?.lots?.find(l => l.batchId === option?.batchId)?.quantity || 0) +
                              (blendBOMdetails.bomItems
                                .find((e: { code: string; }) => e.code === row.code)?.lots
                                ?.find(l => l.batchId === option.batchId)?.quantity || 0))?.toFixed(3)
                            }</span>
                          </li>
                        )}
                        value={item1?.selectedLot || null}
                        onChange={(event, value) =>
                          onLotSelect(
                            row.code,
                            value,
                            item1.fromWarehouse || null,
                            1
                          )
                        }
                        filterSelectedOptions
                        disabled={isView}
                        // disabled={selectedWarehouses?.filter((o) => o.itemCode === row.code).length > 1}
                        size="small"
                      // disableClearable
                      />
                      {/* ) : (
                      <Typography>{item1?.selectedLot?.batchId}</Typography>
                     )}  */}
                    </TableCell>

                    <TableCell sx={{ color: grnCheckList?.some(item => item === item1.selectedLot?.boxNo) ? '#FF0000' : 'initial' }}> {item1.selectedLot?.boxNo || "-"}</TableCell>
                   {/* <TableCell>

                      <Typography> {item1.selectedLot?.price || '-'}</Typography>
                    </TableCell>
                    <TableCell>

                      <Typography> {item1.selectedLot?.weightPerBag || '-'}</Typography>
                    </TableCell> */}
                     <TableCell>

                      <Typography> {!item1?.selectedLot?.weightPerBag ? '-' : ((item1?.selectedLot?.requiredQuantity || 0)/(item1?.selectedLot?.weightPerBag || 0)).toFixed(2)|| '-'}</Typography>
                    </TableCell>
                     <TableCell>
                      <Typography> {item1?.selectedLot?.price?.toFixed(2) || '-'}</Typography>
                    </TableCell>
                    <TableCell>

                      <Typography> {!item1?.selectedLot?.price ? '-' :((item1?.selectedLot?.requiredQuantity || 0)*(item1?.selectedLot?.price || 0)).toFixed(2)|| '-'}</Typography>
                    </TableCell>
                    <TableCell >
                      {/* {isView && */}
                      {((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === item1.fromWarehouse?.warehouseCode)
                        ?.lots?.find(l => l.batchId === item1.selectedLot?.batchId)?.quantity || 0) +
                        (blendBOMdetails.bomItems
                          .find((e: { code: string; }) => e.code === row.code)?.lots
                          ?.find(l => l.batchId === item1.selectedLot?.batchId)?.quantity || 0))?.toFixed(3)
                      }
                      {/* } */}
                      {/* {!isView && (
                      (warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.lots)
                      ?.lots?.find(l=> l.batchId === item1.selectedLot?.batchId)?.quantity || 0)
                    )} */}
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
                          item1?.fromWarehouse || null,
                          item1?.selectedLot || null,
                          item1.index,
                          Number((row.basedQuantity * plannedProductQuantity)?.toFixed(3)))}
                        disabled={isView}

                        error={item1.error !== "No Error" || !item1?.selectedLot?.requiredQuantity}
                        helperText={item1.error !== "No Error" && !isView ? item1.error : ""}
                        InputProps={{
                          inputProps: {
                            type: 'number',
                            step: 0.001,
                            min: 0.000, max: (warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === item1.fromWarehouse?.warehouseCode)
                              ?.lots?.find(l => l.batchId === item1.selectedLot?.batchId)?.quantity || 0) +
                              (blendBOMdetails.bomItems
                                .find((e: { code: string; }) => e.code === row.code)?.lots
                                ?.find(l => l.batchId === item1.selectedLot?.batchId)?.quantity || 0)

                          }, // Set min and max constraints
                        }} />
                    </TableCell>
                    <TableCell>

                      <Typography> {toWarehouse || '-'}</Typography>
                    </TableCell>
                    {/* {!isView && ( */}
                    <TableCell>
                      <Box display="flex" flexDirection="row">

                        {!isView && index === (selectedWarehouses.filter(i => i.itemCode === item1.itemCode).length - 1) && item1?.lotOptions?.length > 1 && (
                          <IconButton disabled={isView || item1.selectedLot === null}
                            onClick={(e) => addLot(row.code, item1.index)}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                        {/* This is for duplicate blend sheet */}
                        {!isView && (isFromDuplicate  && !isFromCreate &&  row?.isDeletable) &&(
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
                        {/* This is for edit blend sheet */}
                        {!isView && (!isFromDuplicate && !isFromCreate && row?.isDeletable) &&(
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
                        {/* This is for create blend sheet */}
                        {!isView && (isFromCreate) &&(
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
                    {/* )} */}
                  </React.Fragment>
                ))}

              </TableRow>
              {selectedWarehouses.filter((item) => item.itemCode === row.code).slice(1)?.map((i, iindex) => (
                <TableRow key={index} sx={{ display: i.isCollapsed ? "table-row" : "none" }}>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell>

                    {/* <Autocomplete
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Warehouse" />
                      )}
                      options={warehouseList?.find((w) => w.itemCode === row.code)?.warehouses || []}
                      getOptionLabel={(option) => option.warehouseCode}
                      value={i.fromWarehouse || null}
                      // onChange={(event, value) => onAdditionalWarehouseSelect(row.code, value,i.index)}
                      size="small"
                      disabled={true}
                    /> */}
                    {/* BUGFIX-679 */}
                    <Typography sx={{ paddingLeft: 2 }}>
                      {isFromDuplicate ? (
                        <Autocomplete
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Warehouse" />
                          )}
                          options={warehouseList?.find((w) => w.itemCode === row.code)?.warehouses || []}
                          getOptionLabel={(option) => option.warehouseCode}
                          value={i.fromWarehouse || null}
                          onChange={(event, value) => {
                              if(onNestedWarehouseSelect){
                                onNestedWarehouseSelect(row.code, value,i.index)
                              }
                          }}
                          size="small"
                          disabled={false}
                        />
                      ): i.fromWarehouse?.warehouseCode || null}
                      {/* {i.fromWarehouse?.warehouseCode || null} */}
                    </Typography>
                  </TableCell>
                  {/* Lot No */}
                  <TableCell sx={{ width: '15%', minWidth: '15%' }}>
                    {/* {(!i.selectedLot && i.lotOptions.length > 1) || !i.fromWarehouse?.warehouseCode ? ( */}
                    <Autocomplete
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Lot No" />
                      )}
                      options={
                        i?.lotOptions?.filter(s => !selectedWarehouses.map(x => x.selectedLot?.batchId)?.filter(batchId => batchId != null).includes(s.batchId)) || []
                      }
                      groupBy={() => 'Batch Info'}
                      getOptionLabel={(option) => `${option.batchId} - ${((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === i.fromWarehouse?.warehouseCode)
                        ?.lots?.find(l => l.batchId === option?.batchId)?.quantity || 0) +
                        (blendBOMdetails.bomItems
                          .find((e: { code: string; }) => e.code === row.code)?.lots
                          ?.find(l => l.batchId === option?.batchId)?.quantity || 0))?.toFixed(3)
                        }`} // Only for input display
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
                          {/* <span style={{ flex: 1 }}>{option?.batchId || 0}</span> */}
                          <span style={{ flex: 1 }}>{((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === i.fromWarehouse?.warehouseCode)
                            ?.lots?.find(l => l.batchId === option?.batchId)?.quantity || 0) +
                            (blendBOMdetails.bomItems
                              .find((e: { code: string; }) => e.code === row.code)?.lots
                              ?.find(l => l.batchId === option.batchId)?.quantity || 0))?.toFixed(3)
                          }</span>
                        </li>
                      )}
                      value={
                        i?.selectedLot || undefined
                      }
                      // disableClearable
                      onChange={(event, value) =>
                        onLotSelect(
                          row.code,
                          value,
                          i.fromWarehouse || null,
                          i.index
                        )
                      }
                      filterSelectedOptions
                      disabled={isView}
                      // disabled={selectedWarehouses?.length >= i.index}
                      size="small"
                    />
                    {/* ) : (
                    <Typography>{i?.selectedLot?.batchId}</Typography>
                  )}  */}
                  </TableCell>

                  <TableCell sx={{ color: grnCheckList?.some(item => item === i?.selectedLot?.boxNo) ? '#FF0000' : 'initial' }}>{i?.selectedLot?.boxNo || "-"}</TableCell>

                 {/* <TableCell>

                      <Typography> {i?.selectedLot?.price || '-'}</Typography>
                    </TableCell>
                    <TableCell>

                      <Typography> {i?.selectedLot?.weightPerBag || '-'}</Typography>
                    </TableCell> */}
                     <TableCell>

                      <Typography> {!i?.selectedLot?.weightPerBag ?  '-' : ((i?.selectedLot?.requiredQuantity || 0) /(i?.selectedLot?.weightPerBag || 0)).toFixed(2)|| '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography> {i?.selectedLot?.price?.toFixed(2) || '-'}</Typography>
                    </TableCell>
                     <TableCell>

                      <Typography> {!i?.selectedLot?.price ? '-' : ((i?.selectedLot?.requiredQuantity || 0) *(i?.selectedLot?.price || 0)).toFixed(3)|| '-'}</Typography>
                    </TableCell>
                  {/* Stock Available */}
                  <TableCell>
                    {((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.warehouseCode === i.fromWarehouse?.warehouseCode)
                      ?.lots?.find(l => l.batchId === i.selectedLot?.batchId)?.quantity || 0) +
                      (blendBOMdetails.bomItems
                        .find((e: { code: string; }) => e.code === row.code)?.lots
                        ?.find(l => l.batchId === i.selectedLot?.batchId)?.quantity || 0)
                    )?.toFixed(3)}
                  </TableCell>
                  {/* Required Quantity */}
                  <TableCell>
                    <TextField
                      variant="standard"
                      type='number'
                      value={i?.selectedLot?.requiredQuantity}
                      required
                      onChange={(e) => onEnterRequiredQuantity(
                        parseFloat(e.target.value),
                        row.code,
                        i?.fromWarehouse || null,
                        i?.selectedLot || null,
                        i.index,
                        Number((row.basedQuantity * plannedProductQuantity)?.toFixed(3)))}
                      disabled={isView}

                      error={i.error !== "No Error"}
                      helperText={i.error !== "No Error" ? i.error : ""}
                      InputProps={{
                        inputProps: {
                          type: 'number',
                          step: 0.001,
                          min: 0.000, max: (warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.lots)
                            ?.lots?.find(l => l.batchId === i.selectedLot?.batchId)?.quantity || 0) +
                            (blendBOMdetails.bomItems
                              .find((e: { code: string; }) => e.code === row.code)?.lots
                              ?.find(l => l.batchId === i.selectedLot?.batchId)?.quantity || 0)
                        }, // Set min and max constraints
                      }} />
                  </TableCell>
                  <TableCell>
                    <Typography>{toWarehouse || ''}</Typography>
                  </TableCell>
                  {/* Actions */}
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

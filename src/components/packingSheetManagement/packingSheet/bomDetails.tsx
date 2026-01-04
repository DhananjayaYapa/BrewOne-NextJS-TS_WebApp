'use client';
import { Autocomplete, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { BOMItemDetail, WarehouseStock } from "@/interfaces";
import { LotStock, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
import React from "react";

export interface BlendingSheetBomDetailsProps {
  blendBOMdetails: BOMItemDetail;
  addLot: (itemCode: string, index: number) => void;
  onDeleteLot: (itemCode: string, index: number) => void;
  toWarehouse: string;
  // addAdditionalLot: (itemCode: string, index: number) => void;
  plannedProductQuantity: number;
  isView: boolean;
  warehouseList: WarehouseStock[];
  toWarehouseList: BlendWarehouse[];
  onWarehouseSelect: (itemCode: string, value: BlendWarehouse | null, index: number) => void
  // onAdditionalWarehouseSelect: (itemCode: string, value: BlendWarehouse | null, index: number) => void
  selectedWarehouses: SelectedWarehouseStock[]
  onLotSelect: (itemCode: string, value: LotStock | null, warehouse: BlendWarehouse | null, index: number) => void
  setOpen: (value: boolean,itemCode : string,index:number) => void
  onEnterRequiredQuantity: (value: number, itemCode: string, warehouse: BlendWarehouse | null, lot: LotStock | null, index: number, plannedQuantity: number) => void
  // onEnterRequiredQuantityAdditional: (index: number, value: number, itemCode: string, warehouse: BlendWarehouse | null, lot: LotStock | null) => void
}

export default function PackingingSheetBomDetails(props: BlendingSheetBomDetailsProps) {

  const {
    blendBOMdetails,
    addLot,
    plannedProductQuantity,
    warehouseList,
    toWarehouseList,
    onWarehouseSelect,
    selectedWarehouses,
    onLotSelect,
    onEnterRequiredQuantity,
    onDeleteLot,
    setOpen,
    isView,
    toWarehouse
  } = props
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: 'auto !important' }}>
        <TableHead>
          <TableRow>
            <TableCell width={150}>
              <Typography variant="h6">Item Code</Typography>
            </TableCell>
            <TableCell width={600}>
              <Typography variant="h6">Item Description</Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography variant="h6">Based Quantity</Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography variant="h6">Planned Quantity</Typography>
            </TableCell>
            <TableCell width={120}>
              <Typography variant="h6">From Warehouse*</Typography>
            </TableCell>
            <TableCell width={130}>
              <Typography variant="h6">Lot No*</Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography variant="h6">Stock Available*</Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography variant="h6">Required Quantity*</Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography variant="h6">To Warehouse*</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blendBOMdetails?.bomItems?.map((row, index) => (
            <React.Fragment key={row.code}>
              <TableRow>

                <TableCell>
                  {row.code}
                </TableCell>
                <TableCell >{row.description}</TableCell>
                <TableCell >{row.basedQuantity}</TableCell>
                <TableCell >{parseFloat
                ((row.basedQuantity * plannedProductQuantity)?.toFixed(3))}</TableCell>
                {selectedWarehouses.filter((item) => item.itemCode === row.code).slice(0, 1)?.map((item1) => (
                  <>
                    <TableCell>
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
                    </TableCell>
                    {/* {item1?.fromWarehouse?.warehouseCode} */}
                    <TableCell>
                      <Autocomplete
                        renderInput={(params) => (
                          <TextField {...params} 
                          placeholder="Lot No"
                        error={item1.selectedLot === null}
                        helperText={item1.selectedLot === null ? 'Lot is Required' : ''} />
                        )}
                        // filterSelectedOptions
                        options={
                          selectedWarehouses.find(
                            (l) => l.itemCode === row.code
                          )?.lotOptions || []
                        }
                        getOptionLabel={(option) => option.batchId}
                        value={item1?.selectedLot || null
                        }
                        onChange={(event, value) =>
                          onLotSelect(
                            row.code,
                            value,
                            item1.fromWarehouse || null,
                            1
                          )
                        }
                        disabled={isView}
                        // disabled={selectedWarehouses?.filter((o) => o.itemCode === row.code).length > 1}
                        size="small"
                      // disableClearable
                      />
                    </TableCell>
                    <TableCell>
                      {/* {isView && */}
                     {parseFloat(((warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.lots)
                      ?.lots?.find(l=> l.batchId === item1.selectedLot?.batchId)?.quantity || 0) +
                       (blendBOMdetails.bomItems
                      .find((e: { code: string; }) => e.code === row.code)?.lots
                      ?.find(l=> l.batchId === item1.selectedLot?.batchId)?.quantity || 0))?.toFixed(3))
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
                        disabled={isView}
                        value={item1.selectedLot?.requiredQuantity}
                        onChange={(e) => onEnterRequiredQuantity(Number(e.target.value),
                          row.code, item1?.fromWarehouse || null,
                          item1.selectedLot || null,
                          item1.index,
                          Number((row.basedQuantity * plannedProductQuantity)?.toFixed(3))
                          )}
                        error={item1.error !== "No Error" || selectedWarehouses
                          .filter((e) => e.itemCode === row.code)
                          .reduce((sum, e) => sum + (e.selectedLot?.requiredQuantity || 0), 0) !== Number((plannedProductQuantity* row.basedQuantity).toFixed(3))}
                        helperText={item1.error !== "No Error"  ? selectedWarehouses
                          .filter((e) => e.itemCode === row.code)
                          .reduce((sum, e) => sum + (e.selectedLot?.requiredQuantity || 0), 0) !== (plannedProductQuantity* row.basedQuantity) ? item1.error :"" : ""}
                        InputProps={{
                          inputProps: {
                            step: 0.001,
                            min: 0.000, max: (warehouseList.find(o => o.itemCode === row.code)?.warehouses?.find(w => w.lots)
                            ?.lots?.find(l=> l.batchId === item1.selectedLot?.batchId)?.quantity || 0) +
                             (blendBOMdetails.bomItems
                            .find((e: { code: string; }) => e.code === row.code)?.lots
                            ?.find(l=> l.batchId === item1.selectedLot?.batchId)?.quantity || 0)
                            }, // Set min and max constraints
                        }} />
                    </TableCell>
                    <TableCell>
                      {/* <Autocomplete
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Warehouse"
                          error={item1.isToWarehouseRequired }
                          helperText={item1.isToWarehouseRequired ? "This field is required" : ""}/>

                        )}
                        options={toWarehouseList.filter(w => w.warehouseCode !== item1.fromWarehouse?.warehouseCode) || []}
                        getOptionLabel={(option) => option.warehouseCode}
                        // value={item1?.toWarehouse || null}
                        onChange={(event, value) => onToWarehouseSelect(row.code, value, item1.index)}
                        size="small"
                        disabled={isView}

                        isOptionEqualToValue={(option, value) =>
                          option?.warehouseCode === value?.warehouseCode
                        }
                      /> */}
                      {toWarehouse}
                    </TableCell>
                  </>
                ))}

              </TableRow>

            </React.Fragment>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
}

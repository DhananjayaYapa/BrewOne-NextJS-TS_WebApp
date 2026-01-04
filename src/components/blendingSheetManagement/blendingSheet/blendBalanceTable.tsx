// 'use client';
// import { Autocomplete, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
// import { BOMItem } from "@/interfaces/salesOrder";
// import React, { useState } from "react";
// import { BlendBalance, BlendBalanceItem, BlendSheet } from "@/interfaces";

// import DeleteIcon from '@mui/icons-material/Delete';
// import { BLEND_BALANCE_TYPES } from "@/constant";
// export interface BlendingSheetBalanceTableProps {
//   selectedBlendBalances: BlendBalance[]; // Redux state variable = from parent blendBalance[]
//   blendBalanceDetails: BlendBalanceItem[] | []; //Separate API Call arrays
//   initialBlendItems: BlendBalanceItem[]
//   isView: boolean;
//   onBlendBalanceQuantityChange: (value: BlendBalance, quantity: number) => void
//   onBlendSheetSelect: (blendSheetNo: string, rowId: number) => void
//   onDeleteBlendBalace:(value: BlendBalance, rowId: number) => void
//   onSelectItemType: (value: number, rowId: number) => void
//   selectableBlendSheets: string[] // work around
//   blendBalanceErrors?: string[] | undefined
// }

// export default function BlendBalanceTable(props: BlendingSheetBalanceTableProps) {

//   const {
//     selectedBlendBalances,
//     blendBalanceDetails,
//     isView,
//     onBlendSheetSelect,
//     onBlendBalanceQuantityChange,
//     onDeleteBlendBalace,
//     initialBlendItems,
//     onSelectItemType,
//     selectableBlendSheets,
//     blendBalanceErrors } = props

//   const isNewItem = (itemCode: string) => {
//     let isNew = true;
//     // if (initialBlendItems.some((item) => item.blendSheet?.blendNumber === itemCode)){
//     //   isNew = false
//     // }
//     return isNew
//   }
//   const typeOptions = BLEND_BALANCE_TYPES.map((item) => ({
//       label: item?.label,
//       value: item?.value
//     })) || [];
// console.log(blendBalanceDetails,selectedBlendBalances,'blendBalanceDetailsblendBalanceDetails')
//   return (
//     <TableContainer component={Paper} sx={{ mt: 2 }}>
//       <Table sx={{ tableLayout: 'auto !important' }}>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Type</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Blend Sheet</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Batch ID</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Warehouse</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Available Quantity</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Value</Typography>
//             </TableCell>
//             <TableCell sx={{textAlign: 'center'}}>
//               <Typography variant="h6">Required Quantity</Typography>
//             </TableCell>
//             {!isView && (
//               <TableCell>
//                 <Typography variant="h6" align='center'>Actions</Typography>
//               </TableCell>
//             )}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {selectedBlendBalances?.map((row, idx) => (
//             <React.Fragment key={idx}>
//               <TableRow>
//                 <TableCell sx={{ width: '15%' }}>
//                   <Autocomplete
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         placeholder="Select Type"
//                         fullWidth
//                       />
//                     )}
//                     options={typeOptions}
//                     size="small"
//                     value={typeOptions.find((item) => item.value === row.typeId)}
//                     // getOptionLabel={(option) => option.label || ""}
//                     // isOptionEqualToValue={(option, value) => option === value}
//                     onChange={(event, value) => onSelectItemType(value?.value ?? 0, idx)}  // Passing itemType or 0
//                     disabled={isView}
//                     />
//                 </TableCell>
//                 <TableCell sx={{ width: '15%' }}>
//                   <Autocomplete
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         placeholder="Select Blend Sheet "
//                         fullWidth
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             border: blendBalanceErrors?.some((item) => item === row.blendSheetNo) ? "1px solid #FF0000" : "initial",
//                           },
//                         }}
//                       />
//                     )}
//                     options={selectableBlendSheets}
//                     size="small"
//                     value={row.blendSheetNo}
//                     getOptionLabel={(option) => option || ""}
//                     isOptionEqualToValue={(option, value) => option === value}
//                     onChange={(event, value) => onBlendSheetSelect(value || '', idx)}
//                     disabled={isView}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ textAlign: 'center', width: '10%' }}>
//                   {row.batchId}
//                 </TableCell>
//                 <TableCell  sx={{ textAlign: 'center', width: '10%' }}>
//                   {row.warehouseCode}
//                 </TableCell>
//                 {/* <TableCell sx={{ textAlign: 'center', width: '10%' }}>{row?.initialQuantity ? (row.initialQuantity - row.quantity).toFixed(2) : '-'}</TableCell> */}
//                 <TableCell sx={{ textAlign: "center", width: "10%" }}>
//                   {(() => {
//                     const availableQty = Number(row?.initialQuantity)
//                     if (isNaN(availableQty)) return 0; // show 0 instead of NaN
//                     return availableQty.toFixed(2);
//                   })()}
//                 </TableCell>
//                  {/* <TableCell sx={{ width: '20%' }}>{blendBalanceDetails?.warehouses.find(o => o.warehouseCode === row.warehouseCode)
//                   ?.masterBlendSheets.find(m => m.masterBlendSheetNo === row.blendSheetNo)?.price}</TableCell> */}
//                 <TableCell sx={{ textAlign: 'center', width: '20%' }}>{(row?.price * (row?.quantity || 0)).toFixed(3)}</TableCell>

//                 <TableCell>
//                   <TextField
//                     variant="standard"
//                     type='number'
//                     value={row.quantity}
//                     error={row.isError !== 'No Error' ? true : undefined}
//                     helperText={row.isError !== 'No Error' ? row.isError : ''}
//                     required
//                     onChange={(e) => onBlendBalanceQuantityChange(row, parseFloat(e.target.value))}
//                     InputProps={{
//                       inputProps: {
//                         type: 'number',
//                         step: 0.001,
//                         min: 1,
//                       }, // Set min and max constraints
//                     }}
//                     disabled={isView} />

//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" flexDirection="row" sx={{ zIndex: 10000 }}>
//                     <IconButton
//                       disabled={isView}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteBlendBalace(row, idx);
//                       }}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             </React.Fragment>
//           ))}

//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

'use client';
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
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { BLEND_BALANCE_TYPES } from "@/constant";
import { BlendBalance, BlendBalanceItem } from "@/interfaces";

export interface BlendingSheetBalanceTableProps {
  selectedBlendBalances: BlendBalance[];
  blendBalanceDetails: BlendBalanceItem[] | [];
  initialBlendItems: BlendBalanceItem[];
  isView: boolean;
  onBlendBalanceQuantityChange: (value: BlendBalance, quantity: number, updatedFullQty?: number) => void;
  onBlendSheetSelect: (blendSheetNo: string, rowId: number) => void;
  onDeleteBlendBalace: (value: BlendBalance, rowId: number) => void;
  onSelectItemType: (value: number, rowId: number) => void;
  selectableBlendSheets: string[];
  blendBalanceErrors?: string[] | undefined;
  isFrom?: string
}

export default function BlendBalanceTable(props: BlendingSheetBalanceTableProps) {
  const {
    selectedBlendBalances,
    blendBalanceDetails,
    isView,
    onBlendSheetSelect,
    onBlendBalanceQuantityChange,
    onDeleteBlendBalace,
    onSelectItemType,
    selectableBlendSheets,
    blendBalanceErrors,
    isFrom
  } = props;


  const typeOptions =
    BLEND_BALANCE_TYPES.map((item) => ({
      label: item?.label,
      value: item?.value,
    })) || [];

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ tableLayout: "auto !important" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center"><Typography variant="h6">Type</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Blend Sheet</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Batch ID</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Warehouse</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Available Quantity</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Value</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Required Quantity</Typography></TableCell>
            {!isView && (
              <TableCell align="center"><Typography variant="h6">Actions</Typography></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedBlendBalances?.map((row, idx) => {
            // Find matching record from blendBalanceDetails
            const matchedDetail = blendBalanceDetails.find(
              (d) => d.masterBlendSheetNo === row.blendSheetNo
            );

            const availableQty = matchedDetail
              ? Number(matchedDetail.quantity || 0)
              : 0;
            const value = matchedDetail
              ? Number(matchedDetail.price || 0)
              : 0;

            return (
              <TableRow key={idx}>
                {/* Type */}
                <TableCell sx={{ width: "15%" }}>
                  <Autocomplete
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Type" fullWidth />
                    )}
                    options={typeOptions}
                    size="small"
                    value={typeOptions.find((item) => item.value === row.typeId) || null}
                    onChange={(event, value) =>
                      onSelectItemType(value?.value ?? 0, idx)
                    }
                    disabled={isView}
                  />
                </TableCell>

                {/* Blend Sheet */}
                <TableCell sx={{ width: "15%" }}>
                  <Autocomplete
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Blend Sheet"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            border: blendBalanceErrors?.some(
                              (item) => item === row.blendSheetNo
                            )
                              ? "1px solid #FF0000"
                              : "initial",
                          },
                        }}
                      />
                    )}
                    options={selectableBlendSheets}
                    size="small"
                    value={row.blendSheetNo || ""}
                    getOptionLabel={(option) => option || ""}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, value) =>
                      onBlendSheetSelect(value || "", idx)
                    }
                    disabled={isView}
                  />
                </TableCell>

                {/* Batch ID */}
                <TableCell align="center" sx={{ width: "10%" }}>
                  {row.batchId}
                </TableCell>

                {/* Warehouse */}
                <TableCell align="center" sx={{ width: "10%" }}>
                  {row.warehouseCode}
                </TableCell>
                {/* available quantity */}
                {/* <TableCell align="center" sx={{ width: "10%" }}>
                  {(() => {
                    const fullAvailableQty = Number((row?.initialQuantity || 0) + (isFrom == 'editViewBlendSheet' ? availableQty : 0)  || 0)
                    if (isNaN(fullAvailableQty)) return 0; // show 0 instead of NaN
                    return fullAvailableQty.toFixed(2);
                  })()}
                </TableCell> */}
                <TableCell align="center" sx={{ width: "10%" }}>
                  {isFrom == 'editViewBlendSheet'  && (row?.isNew == true) ?
                  (() => {
                    const fullAvailableQty = Number((row?.initialQuantity || 0))
                    if (isNaN(fullAvailableQty)) return 0; // show 0 instead of NaN
                    return fullAvailableQty.toFixed(2);
                  })()
                  :
                   (() => {
                    const fullAvailableQty = Number((row?.initialQuantity || 0) + (isFrom == 'editViewBlendSheet' ? availableQty : 0)  || 0)
                    if (isNaN(fullAvailableQty)) return 0; // show 0 instead of NaN
                    return fullAvailableQty.toFixed(2);
                  })()
                  }
                </TableCell>

                {/* total value */}
                <TableCell sx={{ textAlign: 'center', width: '20%' }}>
                  {(row?.price * ((row?.quantity + (isFrom && isFrom == 'editViewBlendSheet' ? availableQty : 0)) || 0)).toFixed(3)}
                </TableCell>

                {/* Required Quantity */}
                <TableCell sx={{ width: "15%" }}>
                  <TextField
                    variant="standard"
                    type="number"
                    value={row.quantity}
                    error={row.isError !== "No Error" ? true : undefined}
                    helperText={row.isError !== "No Error" ? row.isError : ""}
                    required
                    onChange={(e) => {
                      if (isFrom) {
                        if(row.isNew){
                           onBlendBalanceQuantityChange(row, parseFloat(e.target.value), (row?.initialQuantity || 0))
                        }else{
                          onBlendBalanceQuantityChange(row, parseFloat(e.target.value), (row?.initialQuantity || 0) + availableQty)
                        }
                      } else {
                        onBlendBalanceQuantityChange(row, parseFloat(e.target.value))
                      }
                    }
                    }
                    InputProps={{
                      inputProps: {
                        type: "number",
                        step: 0.001,
                        min: 1,
                      },
                    }}
                    disabled={isView}
                  />
                </TableCell>

                {/* Actions */}
                {!isView && (
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBlendBalace(row, idx);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


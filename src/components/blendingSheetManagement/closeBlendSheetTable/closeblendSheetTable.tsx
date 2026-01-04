// "use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Pagination,
  TableRow,
  IconButton,
  Checkbox,
  Collapse,
  Link,
  Paper,
  Tooltip,
  TextField,
  CircularProgress,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BlendSheet, BlendSheetTemplate } from "@/interfaces/blendSheet";
import { BLEND_SHEET_STATUS } from "@/constant";
import { GetMasterBlendBalance } from "@/interfaces";

export interface CloseBlendSheetTableProps {
  tableData: BlendSheetTemplate[];
  tableHeaderData: { id: string; column: string }[];
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  tableRowCount: number;
  tableDataIsLoading: boolean;
  // onView: (col: BlendSheet) => void
  selectedRows: BlendSheetTemplate[]
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectBlendSheet: (isChecked: boolean, blend: BlendSheetTemplate) => void
  handleToggleBlendSheet: (title: string) => void
  openBlendSheet: Record<string, boolean>
  getMasterBlendSheetDetailsResponse: GetMasterBlendBalance[]
  getMasterBlendSheetDetailsResponseIsLoading: boolean
}

export default function CloseBlendSheetTable(props: CloseBlendSheetTableProps) {

  const {
    tableData,
    tableHeaderData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    tableDataIsLoading,
    // onView,
    selectedRows,
    handleSelectAll,
    handleSelectBlendSheet,
    handleToggleBlendSheet,
    openBlendSheet,
    getMasterBlendSheetDetailsResponse,
    getMasterBlendSheetDetailsResponseIsLoading
  } = props;

  const selectedRowsSet = new Set(selectedRows?.map(row => row.blendItemId)); //TODO
  // const structuredTableData = tableData?.flatMap((x) => x.blendSheets)
console.log(openBlendSheet,tableData,'openBlendSheet')
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={
                    tableData.length > 0 &&
                    tableData.every((b) => selectedRowsSet.has(b.blendItemId))
                  }

                  onChange={handleSelectAll}
                // indeterminate={!tableData.every((b) => selectedRowsSet.has(b.blendSheetId))}
                />
              </TableCell>
              {tableHeaderData?.map((column) => (
                <TableCell key={column.id} sx={{ width: "auto" }}>{column.column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {tableData?.map((col) => (
              // col.blendSheets?.map((blendSheet) => (
              <>
                <TableRow
                  // onClick={() => onView(blendSheet)}
                  key={col.blendItemId}
                // sx={{ cursor: 'pointer' }}
                >

                  <TableCell padding="checkbox">

                    {getMasterBlendSheetDetailsResponseIsLoading && selectedRows.some(i => i.blendItemId
                          === col.blendItemId
                        ) &&
                      <CircularProgress size={15} color="primary" />
                    }
                    <label // Wrapping checkbox inside a label

                      onClick={(e) => e.stopPropagation()} // Stops event bubbling
                    >
                      <Checkbox
                        color="primary"
                        checked={selectedRows.some(i => i.blendItemId
                          === col.blendItemId
                        )}
                        onChange={(e) => handleSelectBlendSheet(e.target.checked, col)} />
                    </label>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{col.masterBlendSheetNo || "-"}</TableCell>
                  <TableCell>{col.salesOrderId || "-"}</TableCell>
                  <TableCell>{col.productItemCode || "-"}</TableCell>
                  <TableCell>{col.blendItemCode || "-"}</TableCell>
                  <TableCell></TableCell>
                  <Tooltip title="Total Quantity">
                    <TableCell>{col.totalQuantity}</TableCell>
                  </Tooltip>
                  <TableCell></TableCell>
                  <TableCell>
                  {getMasterBlendSheetDetailsResponse?.find(o => o.masterBlendSheetNo === col.masterBlendSheetNo)?.blendBalanceQuantity}
                  </TableCell>
                  {/* <TableCell>
                  {(getMasterBlendSheetDetailsResponse?.find(o => o.masterBlendSheetNo === col.masterBlendSheetNo) as any)?.blendGainQuantity}
                  </TableCell> */}
                  <TableCell>
                    <Box display="flex" flexDirection="row" sx={{ zIndex: 10000 }}>
                      {/* Planned */}
                      {/* {col.statusId === 1 && (  */}
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBlendSheet(col.blendItemId);
                          }}>
                          {openBlendSheet[col.blendItemId] ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
                        </IconButton>
                        {/* <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onReleaseClick(col);
                        } }>
                        <MoveToInboxIcon />
                      </IconButton> */}
                      </>
                      {/* )} */}
                    </Box>
                  </TableCell>
                  {/* <TableCell>{col. || '-'}</TableCell> */}
                </TableRow>
                {openBlendSheet[col.blendItemId] && col.blendSheets?.map((x) => (
                  <TableRow key={x.blendSheetId} sx={{ borderBottom: "none", background: "#E0E0E0" }}>
                    <TableCell padding="checkbox">
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{x.blendNumber}</TableCell>
                    <TableCell>{col.salesOrderId}</TableCell>
                    <TableCell>{col.productItemCode}</TableCell>
                    <TableCell>{col.blendItemCode}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{new Date(x.blendDate).toLocaleDateString('en-CA') || '-'}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{x.plannedQuantity}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
                {/* <TableRow sx={{ borderBottom: "none" }}>
                                  <TableCell colSpan={7} sx={{ borderBottom: "none" }}>
                                    <Collapse in={openBlenSheet[col.blendItemId]} timeout="auto" unmountOnExit>

                                      {col.blendSheets?.map((x) => (
                                        <TableRow key={x.blendNumber}>

                                          <TableCell padding="checkbox" sx={{ width: '50px'}}></TableCell>
                                          <TableCell>{x.blendNumber}</TableCell>
                                          <TableCell>{col.salesOrderId}</TableCell>
                                        <TableCell>{col.productItemCode|| "-"}</TableCell>
                                        <TableCell>{col.blendItemCode|| "-"}</TableCell>
                                          <TableCell sx={{ textTransform: "capitalize !important" }}>{x?.approval?.status?.toLowerCase() || "-"}</TableCell>
                                          <TableCell>{x?.approval?.rejectReason || "-"}</TableCell>

                                        </TableRow>

                                      ))}
                                    </Collapse>
                                  </TableCell>
                                </TableRow> */}
              </>
              // ))
            ))}

            {!tableDataIsLoading && tableData?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={9}>There are no blend sheet records to display!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid
        container
        xs={12}
        md={12}
        lg={12}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={6}
            count={tableRowCount}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            labelRowsPerPage="Rows per page"
            onPageChange={(event, newPage) => handleChangePage(null, newPage + 1)}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ width: "100%", borderBottom: "none" }}
          />
        </Box>
        <Pagination
          count={Math.ceil(tableRowCount / rowsPerPage)}
          page={page}
          onChange={(event, newPage) => handleChangePage(null, newPage)}
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { fontWeight: "600" } }}
        />
      </Grid>
    </>
  );
}

// "use client";

import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
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
  Tooltip,
  Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { BLEND_SHEET_STATUS, ROUTES } from "@/constant";
import { BlendSheet, BlendSheetTemplate } from "@/interfaces/blendSheet";
import { Blend } from "@/interfaces";
import { Tangerine } from "next/font/google";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

export interface BlendingSheetTableProps {
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
  totalPages: number;
  tableDataIsLoading: boolean;
  onEditClick: (col: BlendSheet,isInitial: boolean) => void;
  onReleaseClick: (col: BlendSheet) => void;
  onView: (col: BlendSheet, isInitial: boolean) => void;
  selectedRows: BlendSheet[];
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectBlendSheet: (isChecked: boolean, blend: BlendSheet) => void;
  isCheckboxEnabled: boolean;
  onDuplicate: (col: BlendSheet, template: BlendSheetTemplate) => void;
  onTeaBoardClick: (col: BlendSheet) => void;
  isHideSFG: boolean,
  setIsHideSFG: (value: boolean) => void;
}

export default function BlendingSheetTable(props: BlendingSheetTableProps) {
  const {
    tableData,
    tableHeaderData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    totalPages,
    tableDataIsLoading,
    onEditClick,
    onView,
    selectedRows,
    handleSelectAll,
    handleSelectBlendSheet,
    isCheckboxEnabled,
    onDuplicate,
    onReleaseClick,
    onTeaBoardClick,
    isHideSFG,
    setIsHideSFG
  } = props;

  const [openBlenSheet, setOpenSubMenu] = useState<Record<string, boolean>>({});
  const handleToggleBlendSheet = (title: string) => {
    setOpenSubMenu((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  const selectedRowsSet = new Set(selectedRows?.map((row) => row.blendSheetId));
  const blendSheets: BlendSheet[] = tableData.flatMap(
    (item) => item.blendSheets
  );
  { console.log(tableData, 'tableDatatableData') }
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {isCheckboxEnabled && (
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={
                      blendSheets.length > 0 &&
                      blendSheets.every((b) =>
                        selectedRowsSet.has(b.blendSheetId)
                      )
                    }
                    onChange={handleSelectAll}
                  // indeterminate={!tableData.every((b) => selectedRowsSet.has(b.blendSheetId))}
                  />
                </TableCell>
              )}
              {tableHeaderData?.map((column) => (
                <TableCell key={column.id} sx={{ width: "auto" }}>
                  {column.column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((col) => (
              <>
                <TableRow
                  onClick={() => handleToggleBlendSheet(col.blendItemId)}
                  key={col.blendItemId}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {col.masterBlendSheetNo}
                  </TableCell>
                  <TableCell>{col.salesOrderId}</TableCell>
                  <TableCell>{col?.productItemCode}</TableCell>
                  <TableCell>{col.blendItemCode}</TableCell>

                  <Tooltip title="Total Quantity">
                    <TableCell> {col.totalQuantity}</TableCell>
                  </Tooltip>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      flexDirection="row"
                      sx={{ zIndex: 10000 }}
                    >
                      {/* Planned */}
                      {/* {col.statusId === 1 && (  */}
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBlendSheet(col.blendItemId);
                          }}
                        >
                          {openBlenSheet[col.blendItemId] ? (
                            <ExpandLess color="primary" />
                          ) : (
                            <ExpandMore color="primary" />
                          )}
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
                </TableRow>
                {/* <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell colSpan={6} sx={{ borderBottom: "none" }}>
                    <Collapse in={openBlenSheet[col.blendItemId]} timeout="auto" unmountOnExit> */}

                {/* <TableHead>
                        <TableCell>Blend Sheet ID</TableCell>
                        <TableCell>Blend Date</TableCell>
                        <TableCell>Planned Quantity</TableCell>
                        <TableCell>Blend Status</TableCell>
                        <TableCell>Approval Status</TableCell>
                        <TableCell>Reject Reason</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableHead> */}
                {openBlenSheet[col.blendItemId] &&
                  col.blendSheets?.map((x, index) => (
                    <TableRow
                      key={x.blendNumber}
                      sx={{ background: "#E0E0E0" }}
                    >
                      {isCheckboxEnabled && (
                        <TableCell padding="checkbox">
                          <label // Wrapping checkbox inside a label
                            onClick={(e) => e.stopPropagation()} // Stops event bubbling
                          >
                            <Checkbox
                              color="primary"
                              checked={selectedRows.some(
                                (i) => i.blendSheetId === x.blendSheetId
                              )}
                              onChange={(e) =>
                                handleSelectBlendSheet(e.target.checked, x)
                              }
                            />
                          </label>
                        </TableCell>
                      )}
                      <TableCell>
                        {/* <Link
                          onClick={() => onView(x)}
                          sx={{ cursor: "pointer" }}
                        >
                          {x.blendNumber}
                        </Link> */}
                        <Link
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const shouldHideSFG = index === 0;
                            setIsHideSFG(shouldHideSFG);
                            onView(x, shouldHideSFG);
                          }}
                        >
                          {x.blendNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{col.salesOrderId}</TableCell>
                      <TableCell>{col?.productItemCode}</TableCell>
                      <TableCell>{col.blendItemCode}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{x.plannedQuantity}</TableCell>
                      <TableCell>{x.statusName}</TableCell>
                      <TableCell
                        sx={{ textTransform: "capitalize !important" }}
                      >
                        {x?.approval?.status?.toLowerCase() || "-"}
                      </TableCell>
                      <TableCell>{x?.approval?.rejectReason || "-"}</TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          flexDirection="row"
                          sx={{ zIndex: 10000 }}
                        >
                          {x?.approval?.status === "APPROVED" &&
                            x?.statusId !== BLEND_SHEET_STATUS.RELEASED &&
                            x?.statusId !== BLEND_SHEET_STATUS.ERROR &&
                            x?.statusId !== BLEND_SHEET_STATUS.CLOSED && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReleaseClick(x);
                                }}
                              >
                                <MoveToInboxIcon />
                              </IconButton>
                            )}
                          {x?.statusId === BLEND_SHEET_STATUS.PLANNED &&
                            x?.approval?.status !== "PENDING" &&
                            x?.approval?.status !== "APPROVED" && ( //phase 4 HVA change
                              <IconButton
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    const shouldHideSFG = index === 0;
                                    setIsHideSFG(shouldHideSFG);
                                    onEditClick(x, shouldHideSFG);
                                  }}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          {/* {col.blendSheets.reduce(
                            (accumulator, currentVal) =>
                              accumulator + currentVal.plannedQuantity,
                            0
                          ) < col.totalQuantity && ( */}
                          {(x?.statusId === BLEND_SHEET_STATUS.RELEASED) && (index === col?.blendSheets?.length - 1) &&(
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicate(x, col);
                              }}>
                              <ContentCopyIcon />
                            </IconButton>
                          )}
                          {/* Add Tea Board button to the last blend sheet row */}
                          {index === col.blendSheets.length - 1 && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onTeaBoardClick(x);
                              }}
                              color="primary"
                              size="small"
                              sx={{ ml: 1 }}
                              title="Teaboard Report"
                            >
                              <LocalCafeIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
            {!tableDataIsLoading && tableData?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={9}>
                  There are no blend sheet records to display!
                </TableCell>
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
            onPageChange={(event, newPage) =>
              handleChangePage(null, newPage + 1)
            }
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

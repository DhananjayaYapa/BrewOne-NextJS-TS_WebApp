// "use client";

import React from "react";
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
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { BlendSheet, BlendSheetTemplate } from "@/interfaces/blendSheet";
import { BLEND_SHEET_STATUS } from "@/constant";

export interface BlendSheetApprovalsTableProps {
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
  onView: (col: BlendSheet) => void
  approveRequest: (blendSheet: BlendSheet) => void
  rejectRequest: (blendSheet: BlendSheet) => void
}

export default function BlendSheetApprovalsTable(props: BlendSheetApprovalsTableProps) {

  const {
    tableData,
    tableHeaderData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    tableDataIsLoading,
    onView,
    approveRequest,
    rejectRequest
  } = props;
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaderData?.map((column) => (
                <TableCell key={column.id} sx={{ width: "auto", whiteSpace: "nowrap" }}>{column.column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {tableData?.map((col) => (
              col.blendSheets?.map((blendSheet) => (
                <TableRow
                  onClick={() => onView(blendSheet)}
                  key={blendSheet.blendSheetId}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{blendSheet.blendNumber || "-"}</TableCell>
                  <TableCell>{col.salesOrderId || '-'}</TableCell>
                  <TableCell>{col.productItemCode || '-'}</TableCell>
                  <TableCell>{col.blendItemCode || '-'}</TableCell>
                  <TableCell>{blendSheet.statusName || '-'}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize !important"}}>{blendSheet?.approval?.status?.toLowerCase() || '-'}</TableCell>
                  {/* <TableCell>
                    {blendSheet.statusId === BLEND_SHEET_STATUS.PLANNED && (
                <Box display="flex" flexDirection="row" sx={{ zIndex: 10000}}>
                <IconButton onClick={(e) => {
                  e.stopPropagation()
                  approveRequest(blendSheet)
                }}>
                    <DoneIcon />
                    </IconButton>
                    <IconButton onClick={(e) => {
                  e.stopPropagation()
                  rejectRequest(blendSheet)
                }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  ) }
                </TableCell> */}
                </TableRow>
              ))
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

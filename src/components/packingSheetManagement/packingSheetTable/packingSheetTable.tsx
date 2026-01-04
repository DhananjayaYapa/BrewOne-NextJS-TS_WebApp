// "use client";

import React from "react";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
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
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import { PACKING_SHEET_STATUS, ROUTES } from "@/constant";
import { PackingSheet } from "@/interfaces/packingSheet";

export interface PackingingSheetTableProps {
  tableData: PackingSheet[];
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
  tableDataIsLoading: boolean
  onEditClick: (col: PackingSheet) => void;
  onReleaseClick: (col: PackingSheet) => void;
  onView: (col: PackingSheet) => void;
}

export default function PackingingSheetTable(props: PackingingSheetTableProps) {

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
    onReleaseClick,
    onView
  } = props;

  return (
    <>
    <TableContainer>
      <Table  sx={{ tableLayout: 'auto !important' }}>
        <TableHead>
          <TableRow>
            {tableHeaderData?.map((column) => (
              <TableCell key={column.id} sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{column.column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
            <TableBody>
           {tableData?.map((col) => (
            <TableRow onClick={(e) => {
              e.stopPropagation()
              onView(col)
            }} key={col.packingSheetId} sx={{ cursor: 'pointer'}}>
                <TableCell>{col.salesOrderId}</TableCell>
                <TableCell>{col.packingSheetId}</TableCell>
                <TableCell>{col.packingItemCode}</TableCell>
                <TableCell sx={{ width: "60%"}}>{col.packingItemDescription}</TableCell>
                <TableCell>{new Date(col.packingDate).toLocaleDateString('en-CA')}</TableCell>
                <TableCell>{col.statusName}</TableCell>
                <TableCell>{col.plannedQuantity}</TableCell>
                <TableCell>
                <Box display="flex" flexDirection="row" sx={{ zIndex: 10000}}>
                  {/* Planned */}
                  {col.statusId === PACKING_SHEET_STATUS.PLANNED && (
                    <>
                    <IconButton title="Edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditClick(col)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton title="Release"
                    onClick={(e) => {
                      e.stopPropagation()
                    onReleaseClick(col)}}>
                      <MoveToInboxIcon />
                    </IconButton>
                    </>
                    )}
                  </Box>
                </TableCell>
            </TableRow>
            ))}
            {!tableDataIsLoading && tableData?.length <= 0 &&(
                <TableRow>
                    <TableCell colSpan={9}>There are no packing sheet records to display!</TableCell>
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

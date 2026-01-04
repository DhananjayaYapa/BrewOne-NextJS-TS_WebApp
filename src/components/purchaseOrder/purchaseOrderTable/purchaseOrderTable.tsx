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
  Link,
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { PurchaseOrder } from "@/interfaces/purchaseOrder";
import { ROUTES } from "@/constant";

export interface PurchaseOrderTableProps {
  tableData: PurchaseOrder[];
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
  onView: (col: PurchaseOrder) => void
}

export default function PurchaseOrderTable(props: PurchaseOrderTableProps) {

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
            <TableRow 
            onClick={() => onView(col)} 
            key={col.purchaseOrderId} 
            sx={{ cursor: 'pointer'}}
            >
                <TableCell>{col.purchaseOrderId || '-'} </TableCell>
                <TableCell>{col.purchaseOrderNumber || '-'} </TableCell>
                <TableCell>{col.salesCode || '-'}</TableCell>
                <TableCell>{col.catalogNo}</TableCell>
                <TableCell>{col.brokerCode || '-'}</TableCell>
                <TableCell>{col.brokerName || '-'}</TableCell>
                <TableCell sx={{ textTransform: "capitalize"}}>{col?.approval?.status?.toLowerCase() || "-"}</TableCell>
                <TableCell>{col?.approval?.createdBy || "-"}</TableCell>
                <TableCell>{col?.approval?.rejectReason || "-"}</TableCell>
                <TableCell>{col?.isPurchaseOrderCancelled ? "Cancelled" : "-"}</TableCell>
            </TableRow>
            ))}
            {!tableDataIsLoading && tableData?.length <= 0 &&(
                <TableRow>
                    <TableCell colSpan={9}>There are no purchase order records to display!</TableCell>
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

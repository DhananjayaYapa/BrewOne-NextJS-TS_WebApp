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
} from "@mui/material";
import { PurchaseOrder } from "@/interfaces/purchaseOrder";

export interface PurchaseOrderApprovalsTableProps {
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

export default function PurchaseOrderApprovalsTable(props: PurchaseOrderApprovalsTableProps) {

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
           {tableData?.map((col,index) => (
            <TableRow 
            onClick={() => onView(col)} 
            key={col.purchaseOrderNumber} 
            sx={{ cursor: 'pointer'}}
            >   <TableCell>{col?.salesCode || "-"}</TableCell>
                <TableCell>{col?.catalogNo || "-"}</TableCell>
                <TableCell>{col?.brokerCode || "-"}</TableCell>
                <TableCell>{col?.brokerName || "-"}</TableCell>
                <TableCell>{col?.salesYear || "-"}</TableCell>
                <TableCell>{col?.lots?.length || "0"}</TableCell>
                <TableCell sx={{width:'20%'}}>{col?.approval?.createdBy || '-'}</TableCell>
                <TableCell>{col?.approval?.createdAt?.split(" ")[0] || "-"}</TableCell>
                <TableCell sx={{textTransform: "capitalize"}}>{col?.approval?.status?.toLocaleLowerCase() || "-"}</TableCell>
                <TableCell>{col?.approval?.rejectReason || "-"}</TableCell>
                {/* <TableCell>
                <Box display="flex" flexDirection="row" sx={{ zIndex: 10000}}>
                <IconButton onClick={(e) => {
                  e.stopPropagation()
                  approveRequest(col)
                }}>
                    <DoneIcon />
                    </IconButton>
                    <IconButton onClick={(e) => {
                  e.stopPropagation()
                  rejectRequest(col)
                }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </TableCell> */}
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

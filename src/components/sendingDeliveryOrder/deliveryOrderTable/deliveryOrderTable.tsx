"use client";

import React from "react";
import {
  Box,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Pagination,
  TableRow,
} from "@mui/material";
import { SendingDeliveryOrder } from "@/interfaces";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
import { useDispatch } from "react-redux";
import { resetFilter, setSelectedRow } from "@/redux/slice/deliveryOrderSlice";
import { AppDispatch } from "@/redux/store";

export interface DeliveryOrderTableProps {
  tableData: SendingDeliveryOrder[];
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
}

export default function DeliveryOrderTable(props: DeliveryOrderTableProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    tableData,
    tableHeaderData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    totalPages,
  } = props;

  const onDONumberClick = (code: number) => {
    dispatch(setSelectedRow(code));
    const deliveryOrderDetailRoute = `${ROUTES.SENDING_DELIVERY_ORDERS}/${code}`;
    window.location.href = deliveryOrderDetailRoute;
    dispatch(resetFilter());
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "#9E9E9E";
      case 2:
        return "#4CAF50";
      default:
        return "#000000";
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaderData?.map((column) => (
                <TableCell key={column.id}>{column.column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((column) => (
              <TableRow key={column.doId}>
                <TableCell onClick={() => onDONumberClick(column.doId)}>
                  <Link sx={{ cursor: "pointer" }}>{column.doNumber}</Link>
                </TableCell>
                <TableCell>{column.vehicleNumber}</TableCell>
                <TableCell>
                  {new Date(column.deliveryDate)
                    .toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\//g, "-")}
                </TableCell>
                {/* <TableCell>{column.warehouseName}</TableCell> */}
                <TableCell sx={{ color: getStatusColor(column.statusId) }}>
                  {column.statusName}
                </TableCell>
              </TableRow>
            ))}
            {tableData.length <= 0 && (
              <TableRow>
                <TableCell colSpan={5}>No Records Found!</TableCell>
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
            page={page}
            labelRowsPerPage="Rows per page"
            onPageChange={(event, newPage) => handleChangePage(null, newPage + 1)}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ width: "100%", borderBottom: "none" }}
          />
        </Box>
        <Pagination
          count={Math.ceil(tableRowCount / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => handleChangePage(null, newPage - 1)}
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { fontWeight: "600" } }}
        />
      </Grid>
    </>
  );
}

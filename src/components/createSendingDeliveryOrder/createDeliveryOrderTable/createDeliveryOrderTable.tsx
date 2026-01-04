"use client";

import React, { useEffect, useState } from "react";

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
import Checkbox from "@mui/material/Checkbox";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedRows,
} from "@/redux/slice/sendingDeliveryOrderSlice";

export interface CreateSendingDeliveryOrderTableProps {
  tableData: any [];
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
  onSelectedRowsChange?: (selectedRows: number[]) => void;
  showCheckbox?: boolean;
  paginationClassName?: string;
}

export default function CreateSendingDeliveryOrderTable(
  props: CreateSendingDeliveryOrderTableProps
) {
  const {
    tableData,
    tableHeaderData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    totalPages,
    onSelectedRowsChange,
    showCheckbox = true,
    paginationClassName,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const isSelectAllChecked = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.isSelectAllChecked
  );

  const selectedRows = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.selectedRows
  );

  const handleCheckboxChange = (code: number) => {
    const isSelected = selectedRows.includes(code);

    let newSelectedRows: number[];
    if (isSelected) {
      newSelectedRows = selectedRows.filter((id) => id !== code);
    } else {
      newSelectedRows = [...selectedRows, code];
    }

    dispatch(setSelectedRows(newSelectedRows));
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
  };

  const handleSelectAllChange = () => {
    const currentPagecodes = tableData?.map((item) => item.code);
    const areAllSelected = currentPagecodes.every((id) =>
      selectedRows.includes(id)
    );

    let newSelectedRows: number[];
    if (areAllSelected) {
      newSelectedRows = selectedRows.filter(
        (id) => !currentPagecodes.includes(id)
      );
    } else {
      newSelectedRows = Array.from(
        new Set([...selectedRows, ...currentPagecodes])
      );
    }

    dispatch(setSelectedRows(newSelectedRows));
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
  };

  // useEffect(() => {
  //   dispatch(setAllcodes(allcodes));
  // }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {showCheckbox && (
                  <Checkbox
                    checked={
                      tableData.length > 0 &&
                      tableData.every((item) => selectedRows.includes(item.code))
                    }
                    onChange={handleSelectAllChange}
                  />
                )}
                {tableHeaderData[0].column}
              </TableCell>
              {tableHeaderData.slice(1)?.map((column) => (
                <TableCell key={column.id}>{column.column}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData?.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>
                  {showCheckbox && (
                    <Checkbox
                    checked={
                      isSelectAllChecked || selectedRows.includes(item.code)
                    }
                    onChange={() => handleCheckboxChange(item.code)}
                    />
                  )}
                  {item.code}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}

            {tableData.length <= 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  Failed to load purchased tea items details. Please refresh the
                  page or contact support if the issue continues.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Grid
        container
        xs={12}
        md={12}
        lg={12}
        justifyContent="flex-end"
        alignItems="center"
        className={paginationClassName}
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
          onChange={(event, newPage) => handleChangePage(null, newPage)}
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { fontWeight: "600" } }}
        />
      </Grid> */}
    </>
  );
}

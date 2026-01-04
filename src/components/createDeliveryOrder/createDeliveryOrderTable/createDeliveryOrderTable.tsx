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
import { TeaLot } from "@/interfaces";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllLotIds,
  setIsSelectAllChecked,
  setSelectedRows,
} from "@/redux/slice/deliveryOrderSlice";

export interface CreateDeliveryOrderTableProps {
  tableData: TeaLot[];
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

export default function CreateDeliveryOrderTable(
  props: CreateDeliveryOrderTableProps
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
    (state: RootState) => state.deliveryOrder.createDO.isSelectAllChecked
  );

  const selectedRows = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.selectedRows
  );

  const allLotIds = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.allLotIds
  );

  const handleCheckboxChange = (lotId: number) => {
    const isSelected = selectedRows.includes(lotId);

    let newSelectedRows: number[];
    if (isSelected) {
      newSelectedRows = selectedRows.filter((id) => id !== lotId);
    } else {
      newSelectedRows = [...selectedRows, lotId];
    }

    dispatch(setSelectedRows(newSelectedRows));
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
  };

  const handleSelectAllChange = () => {
    const currentPageLotIds = tableData?.map((lot) => lot.lotId);
    const areAllSelected = currentPageLotIds.every((id) =>
      selectedRows.includes(id)
    );

    let newSelectedRows: number[];
    if (areAllSelected) {
      newSelectedRows = selectedRows.filter(
        (id) => !currentPageLotIds.includes(id)
      );
    } else {
      newSelectedRows = Array.from(
        new Set([...selectedRows, ...currentPageLotIds])
      );
    }

    dispatch(setSelectedRows(newSelectedRows));
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelectedRows);
    }
  };

  // Helper function to get cell value based on header id
  const getCellValue = (lot: TeaLot, headerId: string): React.ReactNode => {
    switch (headerId) {
      case "lotNo":
        return lot.lotNo || '-';
      case "brokerCode":
        return lot.brokerCode || '-';
      case "boxNo":
        return lot.boxNo || '-';
      case "purchaseOrderNumber":
        return lot.purchaseOrderNumber || '-';
      case "bagCount":
        return lot.bagCount ?? '-';
      case "totalQuantity":
        return lot.netQuantity ?? '-';
      case "storeAddress":
        return lot.storeAddress || '-';
      case "estateName":
        return lot.estateName || '-';
      case "invoiceNo":
        return lot.invoiceNo || '-';
      case "grade":
        return lot.gradeCode || '-';
      default: {
        const value = lot[headerId as keyof TeaLot];
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null ||
          value === undefined
        ) {
          return value ?? '-';
        }
        // For objects (like Approval), return a string representation or '-'
        return typeof value === "object" ? JSON.stringify(value) : '-';
      }
    }
  };

  useEffect(() => {
    dispatch(setAllLotIds(allLotIds));
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      tableData.length > 0 &&
                      tableData.every((lot) => selectedRows.includes(lot.lotId))
                    }
                    onChange={handleSelectAllChange}
                  />
                </TableCell>
              )}
              {tableHeaderData.map((column) => (
                <TableCell key={column.id}>{column.column}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData?.map((lot) => (
              <TableRow key={lot.lotId}>
                {showCheckbox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        isSelectAllChecked || selectedRows.includes(lot.lotId)
                      }
                      onChange={() => handleCheckboxChange(lot.lotId)}
                    />
                  </TableCell>
                )}
                {tableHeaderData.map((header) => (
                  <TableCell key={`${lot.lotId}-${header.id}`}>
                    {getCellValue(lot, header.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {tableData.length <= 0 && (
              <TableRow>
                <TableCell 
                  colSpan={
                    showCheckbox ? tableHeaderData.length + 1 : tableHeaderData.length
                  }
                >
                  Failed to load purchased tea lots details. Please refresh the
                  page or contact support if the issue continues.
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
          onChange={(event, newPage) => handleChangePage(null, newPage - 1)}
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { fontWeight: "600" } }}
        />
      </Grid>
    </>
  );
}
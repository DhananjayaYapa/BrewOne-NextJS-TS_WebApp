// "use client";

import React, {  } from "react";

import {
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Pagination,
  TableRow,
  Paper,
} from "@mui/material";
import { TeaLotDetailsSummery } from "@/interfaces";

import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import TimelineComponent from "../timeLineBar/timeLineBar";
import {
  getTeaLotHistoryById,
} from "@/redux/action/dashBoardTeaLotsAction";
import {
  setSelectedRecord,
} from "@/redux/slice/dashBoardLotHistorySlice";

export interface DashboardTableProps {
  tableData: TeaLotDetailsSummery[];
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

export default function DashboardTable(props: DashboardTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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

  const timeLineData = useSelector(
    (state: RootState) => state.lotHistory.timeLineData
  );

  const getChipColor = (status: string) => {
    switch (status) {
      case "Active":
        return "primary"; 
      case "Close":
        return "error"; 
    }
  };

  const selectRecord = useSelector(
    (state: RootState) => state.lotHistory.selectedRecord
  );

  const handleRowClick = (record: number) => {
    dispatch(setSelectedRecord(record));
    dispatch(getTeaLotHistoryById());
    // dispatch(resetSelectedRow());

    // setSelectedRowIndex(index);
  };
  const tableHeight = tableData.length > 11 ? "492px" : "auto";
  return (
    <>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          lg={selectRecord ? 9 : 12}
          xl={selectRecord ? 9 : 12}
        >
          <TableContainer component={Paper} sx={{ height: tableHeight }}>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaderData?.map((column) => (
                    <TableCell key={column.id} sx={{ width: "auto", whiteSpace: "nowrap" }}>{column.column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((data) => (
                  <TableRow
                    key={data.lotId}
                    onClick={() => handleRowClick(data.lotId)}
                    sx={{
                      backgroundColor: selectRecord === data.lotId ? "#f0f0f0" : "inherit",
                    }}
                    >
                   <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{data.lotNo}</TableCell>
                   <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{data.purchaseOrderNumber}</TableCell>
                   <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>
                      {new Date(data.purchaseOrderDate)
                        .toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\//g, "-")}
                    </TableCell>
                   <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{data.boxNo}</TableCell>
                   <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{data.totalQuantity}</TableCell>

                    <TableCell sx={{ paddingLeft: "1px" }}>
                      <Chip
                        label={data.status}
                        size="small"
                        variant="outlined"
                        color={getChipColor(data.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {tableData.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={9}>No Records Found!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {selectRecord && (
          <Grid item xs={12} lg={3} xl={3}>
            
            <TimelineComponent
              index={timeLineData.lotNo}
              statusHistory={timeLineData.statusHistory}
            />
          </Grid>
        )} 
      </Grid>
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


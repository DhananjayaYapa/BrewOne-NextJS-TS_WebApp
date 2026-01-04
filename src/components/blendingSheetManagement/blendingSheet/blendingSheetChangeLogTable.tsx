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
  CircularProgress,
} from "@mui/material";
import { BlendChangeLogs } from "@/interfaces/blendSheet";
import moment from "moment";

export interface BlendingSheetTableProps {
  tableData: BlendChangeLogs[];
  tableDataIsLoading: boolean
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  tableRowCount: number;
  totalPages: number;
  onClickLog: (changeLog: number, changeLogVersion: number) => void;
}

export default function BlendingSheetChangeLogTable(props: BlendingSheetTableProps) {

  const {
    tableData,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
    tableDataIsLoading,
    onClickLog } = props;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}> Instance</TableCell>
              <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}> Updated By</TableCell>
              <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}> Updated On</TableCell>
              <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}> Created By </TableCell>
              <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}> Created On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableDataIsLoading && (
              <TableCell colSpan={5} sx={{ textAlign: 'center'}}>
                <CircularProgress size={20}/>
              </TableCell>
            )}
            {!tableDataIsLoading && tableData?.map((col, index) => (
              <TableRow
                key={index} sx={{ cursor: 'pointer' }} onClick={() => onClickLog(col.blendId, col.versionNo)}>
                <TableCell>{col.versionNo}</TableCell>
                <TableCell>{col.updatedBy}</TableCell>
                <TableCell>{col.updatedAt ? moment(col.updatedAt).format('YYYY-MM-DD HH.mm.ss') : '-'}</TableCell>
                <TableCell>{col.createdBy}</TableCell>
                <TableCell>{col.createdAt ? moment(col.createdAt).format('YYYY-MM-DD HH.mm.ss') : '-'}</TableCell>
              </TableRow>
            ))}
            {!tableDataIsLoading && tableData?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={5}>There are no blend sheet change logs to display!</TableCell>
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
          onChange={(event, newPage) => handleChangePage(null, newPage -1)}
          showFirstButton
          showLastButton
          sx={{ "& .MuiPaginationItem-root": { fontWeight: "600" } }}
        />
      </Grid>
    </>
  );
}

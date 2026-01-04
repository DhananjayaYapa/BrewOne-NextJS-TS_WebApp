// "use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Pagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Catalogue } from "@/interfaces";

import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
import MessageBox from "../deleteMessageBox/deleteMessageBox";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { deleteCatalog, getCatalogues } from "@/redux/action/catalogueAction";
import {
  setDeleteCatalogIsError,
  setDeleteCatalogErrorMessage,
  setDeleteCatalogIsSuccess,
  setDeleteCatalogSuccessMessage,
} from "@/redux/slice/catalogueSlice";

export interface CatalogueTableProps {
  tableData: Catalogue[];
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

export default function CatalogueTable(props: CatalogueTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const deleteCatalogResponse = useSelector(
    (state: RootState) => state.catalogue.deleteCatalogResponse
  );

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

  const [isDeleteButtonClick, setIsDeleteButtonClick] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const handleOpen = (catalogId: number) => {
    setIsDeleteButtonClick(true);
    setDeletingId(catalogId);
  };
  const handleClose = () => {
    setIsDeleteButtonClick(false);
    setDeletingId(null);
  };
  const handleConfirmDelete = (catalogId: number) => {
    // Handle file confirmation logic here
    dispatch(deleteCatalog(catalogId));
    handleClose();
  };
  const handleCancel = () => {
    handleClose();
  };

  const handleResponseMessageClose = () => {
    if (deleteCatalogResponse.isSuccess) {
      dispatch(setDeleteCatalogIsSuccess(false));
      dispatch(setDeleteCatalogSuccessMessage(""));
      dispatch(getCatalogues());
      setDeletingId(null);
    }

    if (deleteCatalogResponse.hasError) {
      dispatch(setDeleteCatalogIsError(false));
      dispatch(setDeleteCatalogErrorMessage(""));
    }
  };

  const getChipColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "primary"; // Green
      case 3:
        return "error"; // Red
      default:
        return "default";
    }
  };
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
          <TableBody>
            {tableData?.map((column) => (
              <TableRow
                key={column.catalogId}
              >
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{column.salesCode}</TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>
                  <Link href={`${ROUTES.CATALOGUE_MANAGEMENT}/${column.catalogId}`}>{column.catalogSerialNumber}</Link>
                </TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{column.brokerCode}</TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>
                  {column.brokerName}
                </TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>{new Date(column.salesDate).getFullYear()}</TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>
                  {new Date(column.salesDate)
                    .toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\//g, "-")}
                </TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>

                  {/* <Chip label={column.statusName} variant="outlined" /> */}
                  <Chip

                    label={column.statusName}
                    variant="outlined"
                    color={getChipColor(column.statusId)}
                  />
                </TableCell>
                <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>
                  {column.statusId === 1 && (
                    <IconButton>
                      <DeleteIcon
                        onClick={(e) => handleOpen(column.catalogId)}
                      />
                      <MessageBox
                        isOpen={isDeleteButtonClick}
                        onClose={handleClose}
                        onConfirm={() =>
                          deletingId && handleConfirmDelete(deletingId)
                        }
                        onCancel={handleCancel}
                      />

                      {deleteCatalogResponse.isSuccess && (
                        <Dialog
                          open={deleteCatalogResponse.isSuccess}
                          id="deleteSuccessMessage"
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                          onClose={handleResponseMessageClose}
                        >
                          <DialogContent dividers>
                            <DialogContentText id="alert-dialog-description">
                              {deleteCatalogResponse.message}
                            </DialogContentText>
                          </DialogContent>

                          <DialogActions>
                            <Button
                              id="confirmationMessage"
                              size="small"
                              variant="outlined"
                              onClick={handleResponseMessageClose}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      )}
                      {deleteCatalogResponse.hasError && (
                        <Dialog
                          onClose={handleResponseMessageClose}
                          open={deleteCatalogResponse.hasError}
                          id="deleteSuccessMessage"
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogContent dividers>
                            <DialogContentText id="alert-dialog-description">
                              {deleteCatalogResponse.message}
                            </DialogContentText>
                          </DialogContent>

                          <DialogActions>
                            <Button
                              id="confirmationMessage"
                              size="small"
                              variant="outlined"
                              onClick={handleResponseMessageClose}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      )}
                    </IconButton>
                  )}
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

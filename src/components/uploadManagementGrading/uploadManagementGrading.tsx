"use client";
import {
  Grid, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  TextField, TablePagination, InputAdornment, Pagination, Alert,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { TableHead } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTeaLotDetails, updateTeaLotDetails } from "@/redux/action/gradingAction";
import { 
  setBuyer,setCurrentPage,setLimit,setPrice,setSearchText,setStandard,resetEditedData,
  setTabStatus,resetTeaLotUpdateResponse, setStandardErrorAlert,setPriceErrorAlert,
  setBuyerErrorAlert
} from "@/redux/slice/gradingSlice";
import { BulkForm, TeaLot } from "@/interfaces";
import Autocomplete from "@mui/material/Autocomplete";
import { getStandardTeaLotDetails } from "@/redux/action/standardAction";
import SearchIcon from "@mui/icons-material/Search";
import { API_MESSAGES, EDIT_GRADING_FIELD_ERRORS, NO_RECORDS_FOUND, TABLE_HEADERS } from "@/constant";
import SkeletonBar from "../common/Skeleton/skeleton";
import AppButton from "../common/AppButton/AppButton";
import { Standard } from "@/interfaces/teaLotById";

export default function UploadManagementGrading() {
  const dispatch = useDispatch<AppDispatch>();
  const tableData = useSelector((state: RootState) => state.grading.tableData.data);
  const isLoading = useSelector((state: RootState) => state.grading.tableData.isLoading);
  const hasError = useSelector((state: RootState) => state.grading.tableData.hasError);
  const updateTeaLotResponse = useSelector((state: RootState) => state.grading.updateTeaLotResponse);
  const tableRowCount = useSelector((state: RootState) => state.grading.totalRowCount);
  const rowsPerPage = useSelector((state: RootState) => state.grading.limit);
  const page = useSelector((state: RootState) => state.grading.currentPage);
  const editTableData = useSelector((state: RootState) => state.grading.editedData);
  const masterData = useSelector((state: RootState) => state.lotDetails.masterData);
  const catalogueDetails = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue);
  const standardErrorAlert = useSelector((state: RootState) => state.grading.standardErrorAlert);
  const priceErrorAlert = useSelector((state: RootState) => state.grading.priceErrorAlert);
  const buyerErrorAlert = useSelector((state: RootState) => state.grading.buyerErrorAlert);

  useEffect(() => {
    dispatch(setTabStatus("1,2"))
    dispatch(getTeaLotDetails());
    dispatch(getStandardTeaLotDetails());
  }, []);

  useEffect(() => {
    if (updateTeaLotResponse.isSuccess) {
      dispatch(getTeaLotDetails());
      dispatch(resetEditedData());
      dispatch(resetTeaLotUpdateResponse());
    }
  }, [updateTeaLotResponse]);

  const onStandardChange = (lotId: number, value: string | null) => {
    let id = 0;
    if(value === masterData.standard?.map((i) => i.standardName)[0]){id = 1}
    else if(value === masterData.standard?.map((i) => i.standardName)[1]){id = 2}
    else if(value === masterData.standard?.map((i) => i.standardName)[2]){id = 3}
    else{id = -1}

    const form : BulkForm = { lotId:lotId, standardName: value, standardId:id }
    dispatch(setStandard(form));
  };

  const handlePriceChange = (lotId: number, value: string, e: any) => {
    if(value){
      const updatedValue = Number(value)
      const form: BulkForm = { lotId: lotId, price: updatedValue };
      dispatch(setPrice(form));
    }
  };

  const handleBuyerChange = (lotId: number, value: string | null) => {
    const form: BulkForm = { lotId: lotId, buyer: value };
    dispatch(setBuyer(form));
  };

  const handleSave = () => {
    const hasInvalidStandard = editTableData.some((item: BulkForm) => item.standardId === -1);
    const hasInvalidPrice = editTableData.some((item: BulkForm) => item.price && item.price <= 0 || item.price && isNaN(item.price));
    const hasInvalidBuyer = editTableData.some((item: BulkForm) => item.buyer === '')
    if (hasInvalidStandard) { dispatch(setStandardErrorAlert(true)); return}
    if (hasInvalidPrice) { dispatch(setPriceErrorAlert(true)); return}
    if (hasInvalidBuyer) { dispatch(setBuyerErrorAlert(true)); return}
    dispatch(updateTeaLotDetails(editTableData))
    .then(() => {dispatch(getTeaLotDetails())})
    .catch((error: any) => {console.log(error)})
  };

  const handleCancel = () => {
    dispatch(setStandardErrorAlert(false))
    dispatch(setBuyerErrorAlert(false))
    dispatch(setPriceErrorAlert(false))
    dispatch(resetEditedData())
    dispatch(getTeaLotDetails())
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCurrentPage(newPage));
    dispatch(setTabStatus("1,2"))
    dispatch(getTeaLotDetails());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setLimit(Number(event.target.value)));
    dispatch(setCurrentPage(0));
    dispatch(setTabStatus("1,2"))
    dispatch(getTeaLotDetails());
  };

  const handleOnSearch = (value: string) => {
    dispatch(setSearchText(value));
    dispatch(getTeaLotDetails());
  };
  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} p={1} pb={0}>
        <TextField
          placeholder="Quick Search"
          fullWidth
          size="small"
          onChange={(e: { target: { value: string } }) =>
            handleOnSearch(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {isLoading ? (
          <SkeletonBar />
        ) : hasError ? (
        <p>{API_MESSAGES.FAILED_GET}</p>
        ) : (
          <>
            <Grid item xs={12} md={12} lg={12} mt={2}>
              <TableContainer component={Paper}>
                <Table aria-label="dummy-data-table" sx={{ border: "none" }}>
                  <TableHead sx={{backgroundColor:"#E7F0DC"}}>
                    <TableRow>
                      {TABLE_HEADERS?.map((i,index) => (
                        <TableCell key={index} sx={{ textAlign: "center" }}>{i}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableData?.map((row: TeaLot, index: any) => (
                      <TableRow
                        key={index}
                        className="tableRowHover"
                        sx={
                          index === tableData.length - 1
                            ? { borderBottom: "none" }
                            : {}
                        }
                      >
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.lotNo}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {catalogueDetails.statusId === 1 ? (
                            <Autocomplete
                              defaultValue={row.standardName}
                              fullWidth
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                />
                              )}
                              options={masterData.standard?.map((i:Standard) => i.standardName)}
                              onChange={(event, value) =>onStandardChange(row.lotId, value)}
                            />
                          ) : (
                            <span>{row.standardName}</span>
                          )}
                        </TableCell>


                        <TableCell sx={{ textAlign: "center" }}>
                          {catalogueDetails.statusId === 1 ? (
                            <TextField
                              size="small"
                              variant="standard"
                              defaultValue={row.price}
                              type="number"
                              onChange={(e) =>handlePriceChange(row.lotId, e.target.value, e)}
                            />
                          ) : (
                            <span>{row.price}</span>
                          )}
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}>
                          {catalogueDetails.statusId === 1 ? (
                            <TextField
                              size="small"
                              variant="standard"
                              value={
                                editTableData.find(
                                  (item:BulkForm) => item.lotId === row.lotId
                                )
                                  ? editTableData.find(
                                      (item:BulkForm) => item.lotId === row.lotId
                                    )?.buyer
                                  : row.buyer
                              }
                              onChange={(e) =>
                                handleBuyerChange(row.lotId, e.target.value)
                              }
                            />
                          ) : (
                            <span>{row.buyer}</span>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.grade}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.breakName}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tableData?.length <= 0 && (
                      <TableRow className="tableRowHover">
                        <TableCell colSpan={6}>{NO_RECORDS_FOUND}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              container
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

            {standardErrorAlert && (
                <Alert 
                  variant="filled" 
                  severity="error" 
                  sx={{ marginBottom: 3, fontWeight:"400", borderRadius:"16px",width:"50%" }}
                  action={<CloseIcon onClick={() => {dispatch(setStandardErrorAlert(false))}}/>}
                >
                  {EDIT_GRADING_FIELD_ERRORS.STANDARD_ERROR}
                </Alert>   
            )}

            {priceErrorAlert && (
                <Alert 
                  variant="filled" 
                  severity="error" 
                  sx={{ marginBottom: 3, fontWeight:"400", borderRadius:"16px",width:"50%" }}
                  action={<CloseIcon onClick={() => {dispatch(setPriceErrorAlert(false))}}/>}
                >
                  {EDIT_GRADING_FIELD_ERRORS.PRICE_ERROR}
                </Alert>   
            )}

            {buyerErrorAlert && (
                <Alert 
                  variant="filled" 
                  severity="error" 
                  sx={{ marginBottom: 3, fontWeight:"400", borderRadius:"16px",width:"50%" }}
                  action={<CloseIcon onClick={() => {dispatch(setBuyerErrorAlert(false))}}/>}
                >
                  {EDIT_GRADING_FIELD_ERRORS.BUYER_ERROR}
                </Alert>   
            )}

            <Grid
              item xs={12} md={12} lg={12} my={2}
              container
              justifyContent="flex-end"
              gap={1}
            >
              <AppButton
                buttonText={"Cancel"}
                size={"medium"}
                variant={"outlined"}
                color={"primary"}
                borderRadius="40px"
                onClick={handleCancel}
              />

              <AppButton
                buttonText={"Save changes"}
                size={"medium"}
                variant={"contained"}
                color={"primary"}
                borderRadius="40px"
                disabled={editTableData.length <= 0}
                onClick={handleSave}
              />
            </Grid> 
          </>
        )}
      </Grid>
    </Grid>
  );
}

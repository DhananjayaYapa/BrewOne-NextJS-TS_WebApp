'use client'
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HeaderBar from "@/components/headerBar/headerBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useRouter } from 'next/navigation';
import { Dayjs } from "dayjs";
import { ROUTES, SCREEN_MODES } from "@/constant";
import { resetPackingSheetFilter, setPackingSheetLimit, setPackingSheetSearchText, setPackingSheetStatus, setPackingSheetCurrentPage, setPackingSheetEndDateValue, setPackingSheetStartDateValue } from "@/redux/slice/packingSheetSlice";
import { getAllPackingSheets, getPackingSheetStatus } from "@/redux/action/packingSheetAction";
import { PackingSheet, PackingSheetStatus } from "@/interfaces";
import PackingSheetFilter from "@/components/packingSheetManagement/packingSheetFilter/packingSheetFilter";
import PackingSheetTable from "@/components/packingSheetManagement/packingSheetTable/packingSheetTable";
import { setIsEdit, setIsRelease, setIsView, setSelectedPackingSheet } from "@/redux/slice/editPackingSheetSlice";


export default function PackingSheetGrid() {
  const tableHeaderData = [
    {
      id: 'salesOrderNumber',
      column: 'Sales Order Number'
    },
    {
      id: 'packingNo',
      column: 'Packing Sheet Number'
    },
    {
      id: 'packingItemCode',
      column: 'Packing Item Code'
    },
    {
      id: 'packingItemDescription',
      column: 'Packing Item Name'
    },
    {
      id: 'packingDate',
      column: 'Packing Date'
    },
    {
      id: 'status',
      column: 'Packing Status'
    },
    {
      id: 'packingQuantity',
      column: 'Packing Quantity'
    },
    {
      id: 'action',
      column: 'Actions'
    }

  ]

  const dispatch = useDispatch<AppDispatch>();

  const packingSheetListResponse = useSelector(
    (state: RootState) => state.packingSheet.packingSheetListResponse,
  );

  const packingSheetStatusList = useSelector(
    (state: RootState) => state.packingSheet.packingSheetStatusList,
  );

  const packingSheetListRequest = useSelector(
    (state: RootState) => state.packingSheet.packingSheetListRequest,
  );

  useEffect(() => {
    dispatch(getAllPackingSheets())
    dispatch(getPackingSheetStatus())

    //   dispatch(setIsView(false))
    //   dispatch(setIsRelease(false))
    //   dispatch(setIsEdit(false))
  }, [])

  const handleOnSearch = (value: string) => {
    dispatch(setPackingSheetSearchText(value))
    dispatch(getAllPackingSheets())
  };

  const onStatusChange = (value: PackingSheetStatus | null) => {
    dispatch(setPackingSheetStatus(value))
  };


  const handleOnEndDateChange = (value: Dayjs | null) => {
    dispatch(setPackingSheetEndDateValue(value?.format('YYYY-MM-DD').toString() || ""))
  };

  const handleOnStartDateChange = (value: Dayjs | null) => {
    dispatch(setPackingSheetStartDateValue(value?.format('YYYY-MM-DD').toString() || ""))
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setPackingSheetCurrentPage(newPage));
    dispatch(getAllPackingSheets())
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPackingSheetLimit(Number(event.target.value)));
    dispatch(setPackingSheetCurrentPage(1));
    dispatch(getAllPackingSheets())

  };

  const handleOnApplyFilter = () => {
    dispatch(setPackingSheetCurrentPage(1));
    dispatch(getAllPackingSheets())
  };

  const handleOnReset = () => {
    dispatch(setPackingSheetCurrentPage(1));
    dispatch(resetPackingSheetFilter())
    dispatch(getAllPackingSheets())
  };

  const router = useRouter();

  const goToCreatePage = () => {
    dispatch(resetPackingSheetFilter());
    window.location.href = ROUTES.CREATE_PACKING_SHEET;
  };

  const onEditClick = (column: PackingSheet) => {
    dispatch(setSelectedPackingSheet(column))
    dispatch(setIsEdit(true))
    dispatch(setIsRelease(false))
    router.push(`${ROUTES.PACKING_SHEETS}/${column.packingSheetId}?mode=${SCREEN_MODES.EDIT}`)
  };

  const onReleaseClick = (column: PackingSheet) => {
    dispatch(setSelectedPackingSheet(column))
    dispatch(setIsEdit(false))
    dispatch(setIsRelease(true))
    router.push(`${ROUTES.PACKING_SHEETS}/${column.packingSheetId}?mode=${SCREEN_MODES.RELEASE}`)
  };

  const onViewClick = (column: PackingSheet) => {
    dispatch(setSelectedPackingSheet(column))
    dispatch(setIsView(true))
    router.push(`${ROUTES.PACKING_SHEETS}/${column.packingSheetId}?mode=${SCREEN_MODES.VIEW}`)
  };

  const breadcrumbs = [
    {
      id: 1,
      link: 'Packing Sheets',
      route: ROUTES.PACKING_SHEETS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]

  const createButton = (
    <Button
      size="large"
      variant="contained"
      color='primary'
      onClick={goToCreatePage}
    >
      CREATE NEW PACKING SHEET
    </Button>
  )
  return (
    <main>

      <CatalogueManagementHeader
        title={'Packing Sheets'}
        breadcrumbs={breadcrumbs}
        component={createButton}
      />
      <PackingSheetFilter
        onSearch={handleOnSearch}
        packingSheetStatusList={packingSheetStatusList.data}
        packingSheetRequest={packingSheetListRequest}
        onStatusChange={onStatusChange}
        onApplyFilter={handleOnApplyFilter}
        onStartDateChange={handleOnStartDateChange}
        onEndDateChange={handleOnEndDateChange}
        onReset={handleOnReset}
      />
      <Grid m={2}>
        <PackingSheetTable
          tableData={packingSheetListResponse?.data?.data}
          tableDataIsLoading={packingSheetListResponse?.isLoading}
          tableHeaderData={tableHeaderData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          page={packingSheetListRequest.page || 1}
          rowsPerPage={packingSheetListRequest.limit || 10}
          tableRowCount={packingSheetListResponse.data.totalCount}
          totalPages={packingSheetListResponse.data.totalPages}
          onEditClick={onEditClick}
          onReleaseClick={onReleaseClick}
          onView={onViewClick}
        />
      </Grid>
    </main>
  );
}

"use client";

import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  resetFilterDashboard,
  setSelectedCatalog,
  setCurrentPage,
  setEndDateFilterValue,
  setLimit,
  setStartDateFilterValue,
  setTeaLotFilterValue,
  resetTimeLineData,
  resetSelectedRow,
  setSelectedCatalogSerialNumber,
} from "@/redux/slice/dashBoardLotHistorySlice";
import { LotSummeryAPIResponse, CatalogFileList } from "@/interfaces";
import { Box, Divider, Grid, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { ROUTES } from "@/constant";
import DashboardTable from "@/components/dashBoard/dashBoardTable/dashBoardTable";
import DashboardFilter from "@/components/dashBoard/dashBoardFilter/dashboardFilter";

import {
  getCatalogueFileList,
  getTeaLotSummaryAPI,
  getTeaLotsDetailsSummary,
} from "@/redux/action/dashBoardTeaLotsAction";
import CatalogueSummary from "@/components/dashboardCharts/catalogueSummary/CatalogueSummary";
import PurchasedLots from "@/components/dashboardCharts/purchasedLots/PurchasedLots";
import HeaderBar from "@/components/headerBar/headerBar";

export default function Dashboard() {
  const tableHeaderData = [
    {
      id: "lotNumber",
      column: "Lot Number",
    },
    {
      id: "PONumber",
      column: "PO Number",
    },
    {
      id: "PODate",
      column: "PO Date",
    },
    {
      id: "BoxNumber",
      column: "Box Number",
    },
    {
      id: "Quantity",
      column: "Quantity",
    },
    {
      id: "status",
      column: "Status",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const currentPage = useSelector(
    (state: RootState) => state.lotHistory.currentPage
  );
  const totalPages = useSelector(
    (state: RootState) => state.lotHistory.totalPages
  );
  const tableRowCount = useSelector(
    (state: RootState) => state.lotHistory.totalCount
  );
  const teaLotTableData = useSelector(
    (state: RootState) => state.lotHistory.tableData.data
  );
  const rowsPerPage = useSelector((state: RootState) => state.lotHistory.limit);

  // Dashboard table functions
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCurrentPage(newPage));
    dispatch(getTeaLotsDetailsSummary());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setLimit(Number(event.target.value)));
    dispatch(setCurrentPage(0));

    dispatch(getTeaLotsDetailsSummary());
  };

  const lotNumbers = useSelector(
    (state: RootState) => state.lotHistory.lotData
  );
  const catalogs = useSelector(
    (state: RootState) => state.lotHistory.catalogFiles
  );
  const catalogsList = useSelector(
    (state: RootState) => state.lotHistory.catalogsFiles
  );
  const startDateValue = useSelector(
    (state: RootState) => state.lotHistory.filterValues?.startDate
  );
  const endDateValue = useSelector(
    (state: RootState) => state.lotHistory.filterValues?.endDate
  );
  const selecteLotNo = useSelector(
    (state: RootState) => state.lotHistory.filterValues.lotNumber
  );
  const catalogSerialNumberFilterValue = useSelector(
    (state: RootState) => state.lotHistory.filterValues.catalogSerialNumber
  );
  const selectCatalogNo = useSelector(
    (state: RootState) => state.lotHistory.selectedCatalogId
  );
  const selectCatalogSerialNumber = useSelector(
    (state: RootState) => state.lotHistory.selectedcatalogSerialNumber
  );
  // Dashboard filter functions
  const handleOnApplyFilter = () => {
    dispatch(setCurrentPage(0))
    dispatch(getTeaLotsDetailsSummary());
    dispatch(resetTimeLineData());
    dispatch(resetSelectedRow());
  };
  const handleOnReset = () => {
    dispatch(setCurrentPage(0))
    dispatch(resetFilterDashboard());
    dispatch(getTeaLotsDetailsSummary());
    dispatch(resetTimeLineData());
    dispatch(resetSelectedRow());
    dispatch(setSelectedCatalog(undefined));
    dispatch(setSelectedCatalogSerialNumber(undefined));
  };

  const handleOnLotNumberChange = (value: string | null) => {
    dispatch(setTeaLotFilterValue(value));
  };

  const handleOnCatalogChange = (value: string | null) => {
    if (value) {
      const id = catalogs.find((i) => i.catalogSerialNumber === value)?.catalogId
      dispatch(setSelectedCatalog(id));
      dispatch(setSelectedCatalogSerialNumber(value));
      dispatch(getTeaLotSummaryAPI());
      dispatch(getTeaLotsDetailsSummary());
      dispatch(resetTimeLineData());
      dispatch(resetSelectedRow());
    }else{
      dispatch(setSelectedCatalog(undefined));
      dispatch(setSelectedCatalogSerialNumber(undefined));
    }
  };

  const handleOnEndDateChange = (value: Dayjs | null) => {
    dispatch(setEndDateFilterValue(value?.toDate() || null));
  };

  const handleOnStartDateChange = (value: Dayjs | null) => {
    dispatch(setStartDateFilterValue(value?.toDate() || null));
  };

  const breadcrumbs = [
    {
      id: 1,
      link: "Dashboard",
      route: ROUTES.DASHBOARD,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
  ];

  useEffect(() => {
    if (catalogs.length > 0) {
      const firstCatalogSerialNumber = catalogs[0].catalogSerialNumber;
      const firstCatalogId = catalogs[0].catalogId;
      dispatch(setSelectedCatalog(firstCatalogId));
      dispatch(setSelectedCatalogSerialNumber(firstCatalogSerialNumber));

      dispatch(getTeaLotsDetailsSummary());
      dispatch(getTeaLotSummaryAPI());
    }
    
    
  }, [catalogs, dispatch]);
  useEffect(() => {
    dispatch(getCatalogueFileList());
  }, []);

  return (
    <main>
      {/*  */}
      <CatalogueManagementHeader
        title={"Dashboard"}
        breadcrumbs={breadcrumbs}
      />

      <Grid container spacing={2} p={2}>
        <Grid item lg={4} md={6} xs={12}>
          <Box border={"1px solid #C4C4C4"} borderRadius={"10px"}>
            <Typography p={2} fontWeight={"500"} fontSize={"16px"}>
              Total Catalogue Summary
            </Typography>
            <Divider />
            <Grid
              container
              p={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              height={350}
            >
              <CatalogueSummary />
            </Grid>
          </Box>
        </Grid>

        <Grid item lg={8} md={6} xs={12}>
          <Box
            border={"1px solid #C4C4C4"}
            borderRadius={"10px"}
            minHeight={100}
          >
            <Typography p={2} fontWeight={"500"} fontSize={"16px"}>
              Purchased Tea Lots (Past 12 months)
            </Typography>
            <Divider />
            <Grid
              container
              p={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
              height={350}
            >
              <PurchasedLots />
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Grid m={2}>
        <DashboardFilter
          onStartDateChange={handleOnStartDateChange}
          onEndDateChange={handleOnEndDateChange}
          onLotNumberChange={handleOnLotNumberChange}
          onCatalogChange={handleOnCatalogChange}
          onApplyFilter={handleOnApplyFilter}
          onReset={handleOnReset}
          selectedLotNo={selecteLotNo}
          selectedCatalogNo={selectCatalogNo}
          lotNumber={lotNumbers}
          catalogs={catalogs}
          catalog={catalogSerialNumberFilterValue}
          startDateValue={startDateValue}
          endDateValue={endDateValue}
          selectedCatalogSerialNumber={selectCatalogSerialNumber}
        />
      </Grid>

      <Grid m={2}>
        <DashboardTable
          tableData={teaLotTableData}
          tableHeaderData={tableHeaderData}
          tableRowCount={tableRowCount} 
          rowsPerPage={rowsPerPage} 
          page={currentPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalPages={totalPages} 
        />
      </Grid>
      {/*  */}
    </main>
  );
}

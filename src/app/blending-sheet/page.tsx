"use client";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HeaderBar from "@/components/headerBar/headerBar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Alert, Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";
import { BLEND_SHEET_STATUS, ROUTES, SCREEN_MODES } from "@/constant";
import BlendingSheetFilter from "@/components/blendingSheetManagement/blendingSheetFilter/blendingSheetFilter";
import BlendingSheetTable from "@/components/blendingSheetManagement/blendingSheetTable/blendingSheetTable";
import {
  getAllBlendSheets,
  getBlendSheetStatus,
  getSalesOrderList,
} from "@/redux/action/blendAction";
import {
  resetBlendingSheetFilter,
  resetCloseBlendSheetResponse,
  setBlendingSheetLimit,
  setBlendingSheetSalesOrder,
  setBlendingSheetSearchText,
  setBlendingSheetStatus,
  setBlendSheetCurrentPage,
  setBlendSheetEndDateValue,
  setBlendSheetStartDateValue,
  setSalesOrderPage,
  setSalesOrderSearchKey,
  setSelectedBlendSheets,
} from "@/redux/slice/blendSheetSlice";
import {
  BlendSheet,
  BlendSheetStatus,
  BlendSheetTemplate,
} from "@/interfaces/blendSheet";
import {
  resetReleaseResponse,
  setIsEdit,
  setIsRelease,
  setIsView,
  setSelectedBlendSheet,
} from "@/redux/slice/editBlendSheetSlice";
import { SalesOrder } from "@/interfaces";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { setSelectedSalesOrder } from "@/redux/slice/dataSlice";
import { releaseBlendSheet } from "@/redux/action/editBlendSheetAction";
import { getDuplicatedBlendSheetDetail } from "@/redux/action/duplicateBlendSheetAction";
import { resetDuplicateBlendSheetState, setDuplicatedBlendSheet } from "@/redux/slice/duplicateBlendSheetSlice";
import AppAlert from "@/components/common/AppAlert/AppAlert";

export default function BlendingSheet() {

  // states
  const [isHideSFG, setIsHideSFG] = useState<boolean>(false);
  const [duplicateNavigationId, setDuplicateNavigationId] = useState<number | null>(null);

  const tableHeaderData = [
    {
      id: "blendSheetNumber",
      column: "Blend Sheet No.",
    },
    {
      id: "salesOrderNumber",
      column: "Sales Contract No.",
    },
    {
      id: "productItemCode",
      column: "Product Item Code",
    },
    {
      id: "blendItemCode",
      column: "Blend Item Code",
    },
    {
      id: "BlendQuantity",
      column: "Blend Quantity",
    },
    {
      id: "blendPlannedQuantity",
      column: "Blend Planned Quantity",
    },
    {
      id: "status",
      column: "Blend Status",
    },
    {
      id: "approvalStatus",
      column: "Approval Status",
    },
    {
      id: "rejectionReason",
      column: "Reject Reason",
    },
    // {
    //   id: 'blendDate',
    //   column: 'Blend Date'
    // },
    // {
    //   id: 'blendQuantity',
    //   column: 'Blend Quantity'
    // },
    {
      id: "action",
      column: "Actions",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const blendSheetListResponse = useSelector(
    (state: RootState) => state.blendSheet.blendSheetListResponse
  );

  const blendSheetStatusList = useSelector(
    (state: RootState) => state.blendSheet.blendSheetStatusList
  );

  const blendSheetListRequest = useSelector(
    (state: RootState) => state.blendSheet.blendSheetListRequest
  );

  const salesOrderList = useSelector(
    (state: RootState) => state.blendSheet.salesOrderListResponse
  );
  const salesOrderListPagination = useSelector(
    (state: RootState) => state.blendSheet.salesOrderListRequest
  );

  const selectedBlendSheets = useSelector(
    (state: RootState) => state.blendSheet.selectedBlendSheets
  );

  const closeBlendSheetResponse = useSelector(
    (state: RootState) => state.blendSheet.closeBlendSheetResponse
  );
  const releaseBlendSheetResponse = useSelector((state: RootState) => state.editBlendSheet.releaseBlendSheetResponse)

  const getBlendSheetDetailResponse = useSelector((state: RootState) => state.duplicateBlendSheet.getDuplicatedBlendSheetDetailResponse)

  const [isCloseSheetEnabled, setIsCloseBlendSheetEnabled] = useState(false);

  useEffect(() => {
    dispatch(getAllBlendSheets());
    dispatch(getBlendSheetStatus());
    dispatch(setBlendingSheetStatus(null));
    dispatch(getSalesOrderList());

    dispatch(setIsView(false));
    dispatch(setIsRelease(false));
    dispatch(setIsEdit(false));
  }, []);

  useEffect(() => {
    if (closeBlendSheetResponse.isSuccess) {
      dispatch(resetBlendingSheetFilter());
      dispatch(getAllBlendSheets());
      // setIsCloseBlendSheetEnabled(!isCloseSheetEnabled)
      // dispatch(setSelectedBlendSheets([]))
    }
  }, [closeBlendSheetResponse]);

  useEffect(() => {
    if (releaseBlendSheetResponse.hasError) {
      setTimeout(() => {
        dispatch(resetReleaseResponse());
      }, 5000);
    }
    if (releaseBlendSheetResponse.isSuccess) {
      setTimeout(() => {
        dispatch(resetReleaseResponse());
        dispatch(getAllBlendSheets());
      }, 3000);
    }
  }, [releaseBlendSheetResponse]);

  const onSalesOrderSearchOptions = (value: string | undefined) => {
    dispatch(setSalesOrderSearchKey(value));
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages >= salesOrderListPagination?.page) {
    dispatch(setSalesOrderPage(1));
    dispatch(getSalesOrderList());
    // }
  };
  const onFetchOptions = () => {
    if (
      salesOrderListPagination?.page &&
      salesOrderList.data.totalPages > salesOrderListPagination?.page
    ) {
      dispatch(setSalesOrderPage(salesOrderListPagination?.page + 1));
      dispatch(getSalesOrderList());
    }
  };
  const handleOnSearch = (value: string) => {
    dispatch(setBlendingSheetSearchText(value));
    dispatch(getAllBlendSheets());
  };

  const onStatusChange = (value: BlendSheetStatus | null) => {
    dispatch(setBlendingSheetStatus(value));
  };

  const onSalesOrderChange = (value: SalesOrder | null) => {
    dispatch(setBlendingSheetSalesOrder(value));
  };

  const handleOnEndDateChange = (value: Dayjs | null) => {
    dispatch(
      setBlendSheetEndDateValue(value?.format("YYYY-MM-DD").toString() || "")
    );
  };

  const handleOnStartDateChange = (value: Dayjs | null) => {
    dispatch(
      setBlendSheetStartDateValue(value?.format("YYYY-MM-DD").toString() || "")
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setBlendSheetCurrentPage(newPage));
    dispatch(getAllBlendSheets());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setBlendingSheetLimit(Number(event.target.value)));
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets());
  };

  const handleOnApplyFilter = () => {
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets());
  };

  const handleOnReset = () => {
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(resetBlendingSheetFilter());
    dispatch(getAllBlendSheets());
  };

  const router = useRouter();

  const goToUploadPage = () => {
    dispatch(resetBlendingSheetFilter());
    window.location.href = ROUTES.CREATE_BLENDING_SHEET;
  };

  const onTeaBoardClick = (column: BlendSheet) => {
    dispatch(setSelectedBlendSheet(column));
    dispatch(setIsEdit(true));
    router.push(`${ROUTES.TEA_BOARD_REPORT}/${column.blendSheetId}?mode=${SCREEN_MODES.EDIT}`);
  };

  const onEditClick = (column: BlendSheet, isInitial: boolean) => {
    dispatch(setSelectedBlendSheet(column));
    dispatch(setIsEdit(true));
    // console.log(isInitial, 'isHideSFG')
    router.push(
      `${ROUTES.BLENDING_SHEETS}/${column.blendSheetId}?mode=${SCREEN_MODES.EDIT}&isInitial=${isInitial}`
    );
  };

  const onReleaseClick = (column: BlendSheet) => {
    dispatch(setSelectedBlendSheet(column));
    dispatch(setIsRelease(true));
    router.push(
      `${ROUTES.BLENDING_SHEETS}/${column.blendSheetId}?mode=${SCREEN_MODES.RELEASE}&isInitial=false`
    );
  };

  const onViewClick = (column: BlendSheet, isInitial: boolean) => {
    dispatch(setSelectedBlendSheet(column));
    dispatch(setIsView(true));
    router.push(
      `blending-sheet/${column.blendSheetId}?mode=${SCREEN_MODES.VIEW}&isInitial=${isInitial}`
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(
        setSelectedBlendSheets(
          selectedBlendSheets.concat(
            blendSheetListResponse.data.data.flatMap((X) => X.blendSheets)
          )
        )
      );
    } else {
      const selectedRowsSet = new Set(
        selectedBlendSheets?.map((row) => row.blendSheetId)
      );
      const filteredData = selectedBlendSheets.filter(
        (item) => !selectedRowsSet.has(item.blendSheetId)
      );
      dispatch(setSelectedBlendSheets(filteredData));
    }
  };

  const handleSelectBlendSheet = (
    isChecked: boolean,
    blendSheet: BlendSheet
  ) => {
    if (isChecked) {
      dispatch(setSelectedBlendSheets(selectedBlendSheets.concat(blendSheet)));
    } else {
      const filteredData = selectedBlendSheets.filter(
        (item) => item.blendSheetId !== blendSheet.blendSheetId
      );
      dispatch(setSelectedBlendSheets(filteredData));
    }
  };

  const handleCloseBlendSheets = () => {
    // const releaseStatus: BlendSheetStatus = {
    //   statusId: 2,
    //   statusName: 'Released',
    //   statusCode: "2"
    // }
    // dispatch(setBlendingSheetStatus(releaseStatus))
    // dispatch(setBlendSheetCurrentPage(1))
    // dispatch(getAllBlendSheets())
    // setIsCloseBlendSheetEnabled(!isCloseSheetEnabled)
    router.push(`${ROUTES.CLOSE_BLEND_SHEETS}`);
  };

  const confirmCloseBlendSheets = () => {
    // dispatch(closeBlendSheets())
  };
  const cancelCloseBlendSheets = () => {
    dispatch(setSelectedBlendSheets([]));
    dispatch(setBlendingSheetStatus(null));
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets());
    dispatch(resetCloseBlendSheetResponse());
    setIsCloseBlendSheetEnabled(false);
  };


  // const onDuplicateClick = (col:  BlendSheet, template: BlendSheetTemplate) => {
  //     dispatch(setDuplicatedBlendSheet(col))
  //     dispatch(getDuplicatedBlendSheetDetail(col.blendSheetId))
  //     router.push(`${ROUTES.DUPLICATE_BLENDING_SHEET}/${col.blendSheetId}`)
  // }
  const onDuplicateClick = (col: BlendSheet, template: BlendSheetTemplate) => {
    dispatch(setDuplicatedBlendSheet(col));
    dispatch(getDuplicatedBlendSheetDetail(col.blendSheetId));
    // Set the ID we're trying to duplicate
    setDuplicateNavigationId(col.blendSheetId);
  };

  const handleCloseReleaseConfirmation = () =>{
    dispatch(setSelectedBlendSheet(null))
  }

  const handleReleaseConfirmation = () =>{
    dispatch(releaseBlendSheet())
  }
  const breadcrumbs = [
    {
      id: 1,
      link: "Blending Sheets",
      route: ROUTES.BLENDING_SHEETS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
  ];

  const createButton = (
    <>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={handleCloseBlendSheets}
      >
        CLOSE BLEND SHEETS
      </Button>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={goToUploadPage}
      >
        CREATE NEW BLEND SHEET
      </Button>
    </>
  );

  // mount on effect function for navigate getDuplicatedBlendSheetDetail success
  useEffect(() => {
  if (duplicateNavigationId &&
      !getBlendSheetDetailResponse?.hasError &&
      getBlendSheetDetailResponse?.data) {
    router.push(`${ROUTES.DUPLICATE_BLENDING_SHEET}/${duplicateNavigationId}`);
    setDuplicateNavigationId(null);
    dispatch(resetDuplicateBlendSheetState());
  }
}, [getBlendSheetDetailResponse, duplicateNavigationId, router, dispatch]);

// mount on effect function for hide alert after some time
useEffect(() => {
  if (getBlendSheetDetailResponse.hasError) {
    const timer = setTimeout(() => {
      dispatch(resetDuplicateBlendSheetState());
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }
}, [getBlendSheetDetailResponse.hasError, dispatch]);

  return (
    <main>
      {/*  */}
      <CatalogueManagementHeader
        title={"Blending Sheets"}
        breadcrumbs={breadcrumbs}
        component={!isCloseSheetEnabled && createButton}
      />
      {!isCloseSheetEnabled && (
        <BlendingSheetFilter
          onSearch={handleOnSearch}
          blendSheetStatusList={blendSheetStatusList.data}
          blendSheetRequest={blendSheetListRequest}
          onStatusChange={onStatusChange}
          onApplyFilter={handleOnApplyFilter}
          onStartDateChange={handleOnStartDateChange}
          onEndDateChange={handleOnEndDateChange}
          onReset={handleOnReset}
          salesOrderList={salesOrderList?.data?.data}
          salesOrderListIsLoading={salesOrderList.isLoading}
          onSalesOrderSelect={onSalesOrderChange}
          onFetchOptions={onFetchOptions}
          onSearchOptions={onSalesOrderSearchOptions}
          isDate={true}
        />
      )}

      {closeBlendSheetResponse.hasError && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {closeBlendSheetResponse?.message ||
              "API Error in closing blend sheets"}
          </Alert>
        </Grid>
      )}
      {releaseBlendSheetResponse.hasError && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {releaseBlendSheetResponse?.message ||
              "API Error in releasing blend sheets"}
          </Alert>
        </Grid>
      )}
      {releaseBlendSheetResponse.isSuccess && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="success"
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {releaseBlendSheetResponse?.data?.message}
          </Alert>
        </Grid>
      )}

      {getBlendSheetDetailResponse.hasError && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {getBlendSheetDetailResponse?.message || 'API Error in duplicate blend sheets'}
          </Alert>
        </Grid>
      )}
      <Grid m={2}>
        <BlendingSheetTable
          tableData={blendSheetListResponse?.data?.data}
          tableDataIsLoading={blendSheetListResponse?.isLoading}
          tableHeaderData={tableHeaderData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          page={blendSheetListRequest.page || 1}
          rowsPerPage={blendSheetListRequest.limit || 10}
          tableRowCount={blendSheetListResponse.data.totalCount}
          totalPages={blendSheetListResponse.data.totalPages}
          onEditClick={onEditClick}
          onReleaseClick={onReleaseClick}
          onView={onViewClick}
          selectedRows={selectedBlendSheets}
          handleSelectAll={handleSelectAll}
          handleSelectBlendSheet={handleSelectBlendSheet}
          isCheckboxEnabled={isCloseSheetEnabled}
          onDuplicate={onDuplicateClick}
          onTeaBoardClick={onTeaBoardClick}
          isHideSFG={isHideSFG}
          setIsHideSFG={setIsHideSFG}
        />
      </Grid>

      {isCloseSheetEnabled && (
        <Grid m={2} justifyContent={"end"} display={"flex"}>
          <Button
            variant="outlined"
            onClick={cancelCloseBlendSheets}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmCloseBlendSheets}>
            Close Blend Sheets
          </Button>
        </Grid>
      )}

      {/* <ConfirmationMessage
        dialogTitle="SUCCEEDED"
        dialogContentText={
          <>
            {closeBlendSheetResponse?.data?.message && (
              <div>{closeBlendSheetResponse?.data?.message}</div>
            )}
          </>
        }
        open={closeBlendSheetResponse.isSuccess}
        onClose={cancelCloseBlendSheets}
        showCloseButton={true}
      /> */}
      {/*  */}
    </main>
  );
}

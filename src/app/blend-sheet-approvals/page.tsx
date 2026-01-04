'use client'
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HeaderBar from "@/components/headerBar/headerBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { APPROVAL_STATUS, ROUTES } from "@/constant";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { approveBlendSheet, getAllBlendSheets, getBlendSheetStatus, getSalesOrderList, rejectBlendSheet } from "@/redux/action/blendSheetApprovalsAction";
import BlendSheetApprovalsTable from "@/components/blendingSheetManagement/blendSheetApprovals/blendSheetApprovalsTable/blendSheetApprovalsTable";
import { BlendSheet, BlendSheetStatus } from "@/interfaces/blendSheet";
import { resetApproveResponse, resetBlendingSheetFilter, resetRejectResponse, setBlendingSheetSalesOrder, setBlendingSheetSearchText, setBlendingSheetStatus, setBlendSheetApprovalStatus, setBlendSheetCurrentPage, setBlendSheetLimit, setRejectReason, setSalesOrderPage, setSalesOrderSearchKey, setSelectedBlendSheet } from "@/redux/slice/blendSheetApprovalSlice";
import BlendingSheetFilter from "@/components/blendingSheetManagement/blendingSheetFilter/blendingSheetFilter";
import { Dayjs } from "dayjs";
import { SalesOrder } from "@/interfaces";

export default function BlendSheetApprovals() {
  const tableHeaderData = [
    {
      id: 'blendSHeetNo',
      column: 'Blend Sheet'
    },
    {
      id: 'Sales Code',
      column: 'Sales Code'
    },
    {
      id: 'Product Item Code',
      column: 'Product Item Code'
    },
    {
      id: 'Blend Item',
      column: 'Blend Item'
    },
    {
      id: 'status',
      column: 'Status'
    },
    {
      id: 'approvalStatus',
      column: 'Approval Status'
    }

  ]

  const dispatch = useDispatch<AppDispatch>();
  const [openApprovalConfirmation, setOpenApprovalConfirmation] = useState<boolean>(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState<boolean>(false);

  const salesOrderList = useSelector(
    (state: RootState) => state.blendSheetApprovals.salesOrderListResponse,
  );
  const salesOrderListPagination = useSelector(
    (state: RootState) => state.blendSheetApprovals.salesOrderListRequest
  )
  const blendSheetApprovalsListResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.blendSheetListResponse,
  );

  const blendSheetListRequest = useSelector(
    (state: RootState) => state.blendSheetApprovals.blendSheetListRequest,
  );
  const rejectReason = useSelector(
    (state: RootState) => state.blendSheetApprovals.rejectReason,
  );
  const blendSheetStatusList = useSelector(
    (state: RootState) => state.blendSheetApprovals.blendSheetStatusList,
  );
  const approveBlendSheetResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.approveBlendSheetResponse,
  );

  const rejectBlendSheetResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.rejectBlendSheetResponse,
  );
  useEffect(() => {
    
    dispatch(resetBlendingSheetFilter())
    dispatch(getAllBlendSheets())
    dispatch(getBlendSheetStatus())
    dispatch(getSalesOrderList());
    
  }, [])

  useEffect(() => {
    if (approveBlendSheetResponse.isSuccess) {
      setOpenApprovalConfirmation(false)
      dispatch(getAllBlendSheets())

    }
    if (approveBlendSheetResponse.hasError) {
      setOpenApprovalConfirmation(false)
      dispatch(getAllBlendSheets())
      setTimeout(() => {
        dispatch(resetApproveResponse())
      }, 3000);

    }
  }, [approveBlendSheetResponse])

  useEffect(() => {
    if (rejectBlendSheetResponse.isSuccess || rejectBlendSheetResponse.hasError) {
      setOpenRejectConfirmation(false)
      dispatch(getAllBlendSheets())
      dispatch(setRejectReason(null))
      setTimeout(() => {
        dispatch(resetRejectResponse())
      }, 3000);

    }
  }, [rejectBlendSheetResponse])


  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setBlendSheetCurrentPage(newPage));
    dispatch(getAllBlendSheets())
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBlendSheetLimit(Number(event.target.value)));
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets())

  };


  const router = useRouter();

  const onViewBlendSheet = (col: BlendSheet) => {
    dispatch(setSelectedBlendSheet(col))
    router.push(`blend-sheet-approvals/${col.blendSheetId}`)

  };

  const approveRequest = () => {
    dispatch(approveBlendSheet())

  };

  const rejectRequest = () => {
    if (rejectReason) {
      dispatch(rejectBlendSheet())
    }
  };

  const handleOnApproveRequest = (col: BlendSheet) => {
    dispatch(setSelectedBlendSheet(col))
    setOpenApprovalConfirmation(true)
  };

  const handleOnRejectRequest = (col: BlendSheet) => {
    setOpenRejectConfirmation(true)
    dispatch(setSelectedBlendSheet(col))
  };

  const closeApprovalConfirmation = () => {
    setOpenApprovalConfirmation(false)
    dispatch(setSelectedBlendSheet(null))
  };

  const closeRejectReason = () => {
    setOpenRejectConfirmation(false)
    dispatch(setSelectedBlendSheet(null))
  };

  const onChangeRejectReason = (reason: string) => {
    dispatch(setRejectReason(reason))
  };


  const breadcrumbs = [
    {
      id: 1,
      link: 'Blend Sheet Approvals',
      route: ROUTES.BLEND_SHEET_APPROVALS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]

  const onFetchOptions = () => {
    if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
      dispatch(setSalesOrderPage(salesOrderListPagination?.page + 1))
      dispatch(getSalesOrderList());
    }
  };
  const handleOnSearch = (value: string) => {
    dispatch(setBlendingSheetSearchText(value))
    dispatch(getAllBlendSheets())
  };

  const onSalesOrderChange = (value: SalesOrder | null) => {
    dispatch(setBlendingSheetSalesOrder(value))
  };

  const onStatusChange = (value: BlendSheetStatus | null) => {
    if(APPROVAL_STATUS.some(status => status.statusCode === value?.statusCode) && value){
      const approvalStatus = value?.statusCode as 'PENDING' | 'REJECTED' | 'APPROVED'
      dispatch(setBlendSheetApprovalStatus(approvalStatus))
    }else{
      dispatch(setBlendSheetApprovalStatus(undefined))
      dispatch(setBlendingSheetStatus(value))
    }
  };


  const handleOnApplyFilter = () => {
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets())
  };

  const handleOnReset = () => {
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(resetBlendingSheetFilter())
    dispatch(getAllBlendSheets())
  };


  const onSalesOrderSearchOptions = (value: string | undefined) => {
    dispatch(setSalesOrderSearchKey(value))
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages >= salesOrderListPagination?.page) {
    dispatch(setSalesOrderPage(1))
    dispatch(getSalesOrderList());
    // }
  };
  return (
    <main>
      
        <CatalogueManagementHeader
          title={'Blend Sheet Approvals'}
          breadcrumbs={breadcrumbs}
        // component={!isCloseSheetEnabled && createButton}
        />
        <BlendingSheetFilter
          onSearch={handleOnSearch}
          blendSheetStatusList={blendSheetStatusList.data}
          blendSheetRequest={blendSheetListRequest}
          onStatusChange={onStatusChange}
          onApplyFilter={handleOnApplyFilter}
          onReset={handleOnReset}
          salesOrderList={salesOrderList?.data?.data}
          salesOrderListIsLoading={salesOrderList.isLoading}
          onSalesOrderSelect={onSalesOrderChange}
          onFetchOptions={onFetchOptions}
          onSearchOptions={onSalesOrderSearchOptions}
          onEndDateChange={function (value: Dayjs | null): void {
            throw new Error("Function not implemented.");
          }} onStartDateChange={function (value: Dayjs | null): void {
            throw new Error("Function not implemented.");
          }}
          isDate={false} />
        <Grid m={2}>


          {(rejectBlendSheetResponse.hasError || approveBlendSheetResponse.hasError) && (
            <Alert
              variant="filled"
              severity="error"
              sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
            >
              {rejectBlendSheetResponse?.message || approveBlendSheetResponse?.message || 'error in API'}
            </Alert>
          )}
          <BlendSheetApprovalsTable
            tableData={blendSheetApprovalsListResponse.data.data}
            tableHeaderData={tableHeaderData}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            page={blendSheetListRequest?.page || 0}
            rowsPerPage={blendSheetListRequest?.limit || 0}
            tableRowCount={blendSheetApprovalsListResponse.data.totalCount}
            tableDataIsLoading={blendSheetApprovalsListResponse.isLoading}
            onView={onViewBlendSheet}
            approveRequest={handleOnApproveRequest}
            rejectRequest={handleOnRejectRequest}
          />
        </Grid>
        <ConfirmationMessage
          dialogTitle="Confirm Approval"
          dialogContentText={
            <div>Are you sure you want to approve this blending sheet?</div>
          }
          open={openApprovalConfirmation}
          onClose={closeApprovalConfirmation}
          showCloseButton={true}
          buttons={[
            {
              buttonText: "Confirm",
              onClick: approveRequest,
              isLoading: approveBlendSheetResponse.isLoading
            },
            {
              buttonText: "Close",
              onClick: closeApprovalConfirmation,
              design: 'outlined'
            },
          ]}
        />

        <ConfirmationMessage
          dialogTitle="Confirm Rejection"
          dialogContentText={
            <Grid>
              <Typography sx={{ mb: 2 }}>Are you sure you want to reject this blending sheet?
              </Typography>
              <TextField
                variant="standard"
                fullWidth
                value={rejectReason}
                error={!rejectReason}
                helperText={!rejectReason && "Reject Reason is required"}

                label="Reject Reason"
                onChange={(e) => onChangeRejectReason((e.target.value))}
              />
            </Grid>
          }
          open={openRejectConfirmation}
          onClose={closeRejectReason}
          showCloseButton={true}
          buttons={[
            {
              buttonText: "Confirm",
              onClick: rejectRequest,
              isLoading: rejectBlendSheetResponse.isLoading
            },
            {
              buttonText: "Close",
              onClick: closeRejectReason,
              design: 'outlined'
            },
          ]}
        />

      
    </main>
  );
}

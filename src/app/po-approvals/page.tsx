'use client'
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HeaderBar from "@/components/headerBar/headerBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Alert, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constant";
import { approvePO, getBrokerList, getPurchaseOrderApprovalList, rejectPO } from "@/redux/action/purchaseOrderApprovalsAction";
import { resetApproveResponse, resetPurchaseOrderFilter, resetRejectResponse, setBroker, setPurchaseOrderCurrentPage, setPurchaseOrderGetAll, setPurchaseOrderLimit, setPurchaseOrderSearchText, setPurchaseOrderStatus, setRejectReason, setSelectedPurchaseOrder } from "@/redux/slice/purchaseOrderApprovalSlice";
import { PurchaseOrder } from "@/interfaces/purchaseOrder";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import PurchaseOrderApprovalsTable from "@/components/purchaseOrder/purchaseOrderApprovalsTable/purchaseOrderApprovalsTable";
import PurchaseOrderFilter from "@/components/purchaseOrder/purchaseOrderFilter/purchaseOrderFilter";

export default function POApprovals() {
  const tableHeaderData = [
    {
      id: 'salesCode',
      column: 'Sales Code'
    },
    {
      id: 'catalogNoCatalogue no',
      column: 'Catalogue No.'
    },
    {
      id: 'brokerCode',
      column: 'Broker Code'
    },
    {
      id: 'broker Name',
      column: 'Broker Name'
    },
    {
      id: 'salesYear',
      column: 'Sale Year'
    },
    {
      id: 'noOfLOts',
      column: 'No. of Lots'
    },
    {
      id: 'Requested By ',
      column: 'Requested By '
    },
    {
      id: 'Requested Date',
      column: 'Requested Date'
    },
    {
      id: 'staus',
      column: 'Status'
    },

    {
      id: 'rejectReason',
      column: 'Reject Reason'
    }

  ]

  const dispatch = useDispatch<AppDispatch>();
  const [openApprovalConfirmation, setOpenApprovalConfirmation] = useState<boolean>(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState<boolean>(false);

  const purchaseOrderListResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.purchaseOrderListResponse,
  );

  const purchaseOrderListRequest = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.purchaseOrderListRequest,
  );
  const rejectReason = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.rejectReason,
  );

  const approvePOResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.approvePOResponse,
  );

  const rejectPOResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.rejectPOResponse,
  );

  const brokerList = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.brokerListReponse,
  );

  useEffect(() => {
    // dispatch(setPurchaseOrderGetAll(false))
    dispatch(getBrokerList())
    dispatch(getPurchaseOrderApprovalList())
  }, [])


  // useEffect(() => {
  //   if (approvePOResponse.isSuccess) {
  //     setOpenApprovalConfirmation(false)
  //     dispatch(getPurchaseOrderApprovalList())

  //   }
  //   if (approvePOResponse.hasError) {
  //     setOpenApprovalConfirmation(false)
  //     dispatch(getPurchaseOrderApprovalList())
  //     setTimeout(() => {
  //       dispatch(resetApproveResponse())
  //     }, 3000);

  //   }
  // }, [approvePOResponse])

  // useEffect(() => {
  //   if (rejectPOResponse.isSuccess || rejectPOResponse.hasError) {
  //     setOpenRejectConfirmation(false)
  //     dispatch(getPurchaseOrderApprovalList())
  //     dispatch(setRejectReason(null))
  //     setTimeout(() => {
  //       dispatch(resetRejectResponse())
  //     }, 3000);

  //   }
  // }, [rejectPOResponse])


  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setPurchaseOrderCurrentPage(newPage));
    dispatch(getPurchaseOrderApprovalList())
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPurchaseOrderLimit(Number(event.target.value)));
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(getPurchaseOrderApprovalList())

  };


  const router = useRouter();

  const onViewPO = (col: PurchaseOrder) => {
    dispatch(setSelectedPurchaseOrder(col))
    //     dispatch(setIsView(true))

    router.push(`po-approvals/${col.purchaseOrderId}`)

  };

  const approveRequest = () => {
    dispatch(approvePO())

  };

  const rejectRequest = () => {
    if (rejectReason) {
      dispatch(rejectPO())
    }
  };

  const handleOnApproveRequest = (col: PurchaseOrder) => {
    dispatch(setSelectedPurchaseOrder(col))
    setOpenApprovalConfirmation(true)
  };

  const handleOnRejectRequest = (col: PurchaseOrder) => {
    setOpenRejectConfirmation(true)
    dispatch(setSelectedPurchaseOrder(col))
  };

  const closeApprovalConfirmation = () => {
    setOpenApprovalConfirmation(false)
    dispatch(setSelectedPurchaseOrder(null))
  };

  const closeRejectReason = () => {
    setOpenRejectConfirmation(false)
    dispatch(setSelectedPurchaseOrder(null))
  };

  const onChangeRejectReason = (reason: string) => {
    dispatch(setRejectReason(reason))
  };

  const onBrokerChange = (broker: string | null) => {
    dispatch(setBroker(broker || undefined))
  }
  const onStatusChange = (broker: string | null) => {
    dispatch(setPurchaseOrderStatus(broker || undefined))
  }
  const onApplyFilter = () => {
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(getPurchaseOrderApprovalList())
  };

  const onReset = () => {
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(resetPurchaseOrderFilter())
    dispatch(getPurchaseOrderApprovalList())
  };

  const onSearch = (value: string) => {
    dispatch(setPurchaseOrderSearchText(value))
    dispatch(getPurchaseOrderApprovalList())
  };
  const breadcrumbs = [
    {
      id: 1,
      link: 'PO Approvals',
      route: ROUTES.PO_APPROVALS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]
  return (
    <main>
      
        <Paper >
          <CatalogueManagementHeader
            title={'Purchase Order Approvals'}
            breadcrumbs={breadcrumbs}
          // component={!isCloseSheetEnabled && createButton}
          />

          <Grid m={1}>


            {(rejectPOResponse.hasError || approvePOResponse.hasError) && (
              <Alert
                variant="filled"
                severity="error"
                sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
              >
                {rejectPOResponse?.message || approvePOResponse?.message || 'error in API'}
              </Alert>
            )}
            {/* purchase order filter */}
            <PurchaseOrderFilter
              purchaseOrderStatusList={['Pending', 'Approved', 'Rejected']}
              purchaseOrderRequest={purchaseOrderListRequest}
              onStatusChange={onStatusChange}
              onApplyFilter={onApplyFilter}
              onReset={onReset}
              onSearch={onSearch}
              brokerCodeList={brokerList?.data.map((broker => broker.brokerCode))}
              onBrokerChange={onBrokerChange} />
            <PurchaseOrderApprovalsTable
              tableData={purchaseOrderListResponse.data.data}
              tableHeaderData={tableHeaderData}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={purchaseOrderListRequest?.page || 0}
              rowsPerPage={purchaseOrderListRequest?.limit || 10}
              tableRowCount={purchaseOrderListResponse.data.totalCount}
              tableDataIsLoading={purchaseOrderListResponse.isLoading}
              onView={onViewPO}
            // approveRequest={handleOnApproveRequest}
            // rejectRequest={handleOnRejectRequest}
            />
          </Grid>
          <ConfirmationMessage
            dialogTitle="Confirm Approval"
            dialogContentText={
              <div>Are you sure you want to approve this purchase order?</div>
            }
            open={openApprovalConfirmation}
            onClose={closeApprovalConfirmation}
            showCloseButton={true}
            buttons={[
              {
                buttonText: "Confirm",
                onClick: approveRequest,
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
                <Typography sx={{ mb: 2 }}>Are you sure you want to reject this purchase order?
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
              },
              {
                buttonText: "Close",
                onClick: closeRejectReason,
                design: 'outlined'
              },
            ]}
          />

          <ConfirmationMessage
            dialogTitle={"Succeeded"}
            dialogContentText={
              <Grid>
                <Typography sx={{ mb: 2 }}>
                  {approvePOResponse?.data?.message || rejectPOResponse?.data?.message}
                </Typography>
              </Grid>
            }
            open={approvePOResponse.isSuccess || rejectPOResponse.isSuccess}
            onClose={() => {
              dispatch(resetApproveResponse())
              dispatch(resetRejectResponse())

            }}
            showCloseButton={true}
          />

        </Paper>    
    </main>
  );
}

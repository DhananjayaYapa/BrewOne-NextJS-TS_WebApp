"use client";

import { Grid, Box, Tabs, Tab, Button, TextField, Typography, Alert } from "@mui/material";

import { AppDispatch, RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { FEATURES, ROUTES, UserRolesInterface } from "@/constant";
import { resetApproveResponse, resetRejectResponse, setRejectReason, setSelectedTeaLot } from "@/redux/slice/purchaseOrderApprovalSlice";
import { TeaLot } from "@/interfaces/teaLot";
import { approvePO, getMasterData, getTeaLotDetails, rejectPO } from "@/redux/action/purchaseOrderApprovalsAction";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import LotDetails from "@/components/purchaseOrder/purchaseOrderLotDetails.tsx/purchaseOrderLotDetails";
import TeaLotList from "@/components/teaLotView/teaLotList/teaLotList";
import { useRouter } from 'next/navigation';
type Props = { params: { view: number } }

export default function POApprovalsTab({ params }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState(0);
  const purchaseOrderListResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.purchaseOrderListResponse,
  );

  const selectedPurchaseOrder = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.selectedPurchaseOrder,
  );

  const selectedTeaLot = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.selectedLot,
  );

  const selectedTeaLotDetail = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.selectedLotDetail,
  );
  const lotForm = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.lotDetailForm,
  );

  const masterData = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.masterData,
  );

  const featureList = useSelector(
    (state: RootState) => state.auth.currentUserFeatureList
  );



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [userRole, setUserRole] = useState<UserRolesInterface | undefined>(undefined);


  const router = useRouter();
  useEffect(() => {
    const roleFromCookie = Cookies.get('userRole') as UserRolesInterface | undefined;
    setUserRole(roleFromCookie);
    dispatch(getMasterData())
    if (selectedPurchaseOrder?.lots?.length && selectedPurchaseOrder?.lots?.length >= 1) {
      dispatch(setSelectedTeaLot(selectedPurchaseOrder?.lots[0]))
      // dispatch(getTeaLotDetails())
    }
    if (!selectedPurchaseOrder) {
      router.push(`/${ROUTES.PO_APPROVALS}`)
    }
  }, []);

  useEffect(() => {
    if (selectedTeaLot) {
      dispatch(getTeaLotDetails())
    }
  }, [selectedTeaLot]);

  const onLotRowClick = (
    lot: TeaLot,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setSelectedTeaLot(lot))
  }

  const renderTabContent = (index: any) => {
    switch (index) {
      case 0:
        return <Box>
          <Grid container>
            <Grid item lg={3} xs={12} pr={{ xs: 0, lg: 2 }}>
              <TeaLotList
                lots={selectedPurchaseOrder?.lots || []}
                isLoading={false}
                hasError={false}
                selectedLotId={0}
                onRowClick={onLotRowClick} />
            </Grid>
            <Grid item lg={9} py={2}>
              <LotDetails
                lotDetailForm={lotForm}
                lotDetail={selectedTeaLotDetail?.data || null}
                isEdit={false}
                isDisabled={true}
                userRole={userRole}
                isLoading={false}
                hasError={false}
                isEditClicked={false}
                masterData={masterData.data}
                onHandleChange={function (key: string, value: string): void {
                  throw new Error("Function not implemented.");
                }} handleEditClick={function (): void {
                  throw new Error("Function not implemented.");
                }} handleSaveChanges={function (): void {
                  throw new Error("Function not implemented.");
                }} handleCancel={function (): void {
                  throw new Error("Function not implemented.");
                }} isUnsavedChanged={false} isUnsavedChangesOnCancel={false} handleCancelConfirm={function (): void {
                  throw new Error("Function not implemented.");
                }} handleRemainCancel={function (): void {
                  throw new Error("Function not implemented.");
                }} hasAPIError={undefined} />
            </Grid>
          </Grid>
        </Box>;
      default:
        return null;
    }
  };
  const breadcrumbs = [
    {
      id: 1,
      link: 'Purchase Orders Approvals',
      route: `/${ROUTES.PO_APPROVALS}`,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
    {
      id: 2,
      link: selectedPurchaseOrder?.purchaseOrderNumber || 'purchase order',
      route: "",
    },
  ]

  const [openApprovalConfirmation, setOpenApprovalConfirmation] = useState<boolean>(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState<boolean>(false);
  const rejectReason = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.rejectReason,
  );

  const approvePOResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.approvePOResponse,
  );

  const rejectPOResponse = useSelector(
    (state: RootState) => state.purchaseOrderApprovals.rejectPOResponse,
  );
  useEffect(() => {
    if (approvePOResponse.isSuccess) {
      setOpenApprovalConfirmation(false)
      setTimeout(() => {
        dispatch(resetApproveResponse())
      }, 3000);
      dispatch(getTeaLotDetails())

    }
    if (approvePOResponse.hasError) {
      setOpenApprovalConfirmation(false)
      setTimeout(() => {
        dispatch(resetApproveResponse())
      }, 3000);
      dispatch(getTeaLotDetails())

    }
  }, [approvePOResponse])

  useEffect(() => {
    if (rejectPOResponse.isSuccess || rejectPOResponse.hasError) {
      setOpenRejectConfirmation(false)
      dispatch(setRejectReason(null))
      setTimeout(() => {
        dispatch(resetRejectResponse())
      }, 3000);
      dispatch(getTeaLotDetails())

    }
  }, [rejectPOResponse])


  const approveRequest = () => {
    dispatch(approvePO())

  };

  const rejectRequest = () => {
    if (rejectReason) {
      dispatch(rejectPO())
    }
  };

  const handleOnApproveRequest = () => {
    setOpenApprovalConfirmation(true)
  };

  const handleOnRejectRequest = () => {
    setOpenRejectConfirmation(true)
  };

  const closeApprovalConfirmation = () => {
    setOpenApprovalConfirmation(false)
    // dispatch(setSelectedPurchaseOrder(null))
  };

  const onChangeRejectReason = (reason: string) => {
    dispatch(setRejectReason(reason))
  };

  const closeRejectReason = () => {
    setOpenRejectConfirmation(false)
    // dispatch(setSelectedPurchaseOrder(null))
  };

  return (
    <main>
      <CatalogueManagementHeader
        title={'Purchase Order Approvals'}
        breadcrumbs={breadcrumbs}
      // component={!isCloseSheetEnabled && createButton}
      />
      {selectedTeaLotDetail.data?.approval?.status === "PENDING" && (
        <Grid container direction="row" justifyContent="end" mb="1" >
          {featureList?.includes(FEATURES.APPROVE_PURCHASE_ORDER) &&
            <Button variant="contained" sx={{ mr: 1 }}
              onClick={handleOnApproveRequest}>
              Approve
            </Button>
          }

          {featureList?.includes(FEATURES.REJECT_PURCHASE_ORDER) &&
            <Button variant="outlined"
              onClick={handleOnRejectRequest}>
              Reject
            </Button>
          }
        </Grid>
      )}

      {(rejectPOResponse.hasError || approvePOResponse.hasError) && (
        <Alert
          variant="filled"
          severity="error"
          sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
        >
          {rejectPOResponse?.message || approvePOResponse?.message || 'error in API'}
        </Alert>
      )}
      {(rejectPOResponse.isSuccess || approvePOResponse.isSuccess) && (
        <Alert
          variant="filled"
          severity="success"
          sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
        >
          {rejectPOResponse?.data?.message || approvePOResponse?.data?.message || 'error in API'}
        </Alert>
      )}
      <Grid container direction="column" alignItems="left" mb="1" >
        {/* <PurchaseOrder /> */}

        <Box sx={{ maxWidth: { xs: 320, sm: 600 } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="View-Purchasing-Grading tab"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
          >
            <Tab
              icon={<RemoveRedEyeIcon />}
              label="View"
              iconPosition="start"
              disableRipple
            />
          </Tabs>
        </Box>
        <Grid item xs={12} md={8} lg={6}>
          {renderTabContent(value)}
        </Grid>
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
            isLoading: approvePOResponse.isLoading
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
            isLoading: rejectPOResponse.isLoading
          },
          {
            buttonText: "Close",
            onClick: closeRejectReason,
            design: 'outlined',
          },
        ]}
      />

    </main>
  )
}



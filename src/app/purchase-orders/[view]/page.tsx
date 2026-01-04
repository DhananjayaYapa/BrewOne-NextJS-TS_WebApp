"use client";

import {
  Grid,
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import { AppDispatch, RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { FEATURES, ROUTES, UserRolesInterface } from "@/constant";
import { TeaLot } from "@/interfaces/teaLot";
import LotDetails from "@/components/purchaseOrder/purchaseOrderLotDetails.tsx/purchaseOrderLotDetails";
import TeaLotList from "@/components/teaLotView/teaLotList/teaLotList";
import { useRouter } from "next/navigation";
import {
  cancelPO,
  getMasterData,
  getPurchaseOrderByID,
  getTeaLotDetails,
} from "@/redux/action/purchaseOrdersAction";
import {
  resetCancelPurchaseOrderResponse,
  setSelectedTeaLot,
} from "@/redux/slice/purchaseOrdersSlice";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import {
  resetCreatePurchaseOrderResponse,
  resetReleasePurchaseOrderResponse,
  setIsGeneratePO,
  setSelectedPurchaseOrderId,
} from "@/redux/slice/createPurchaseOrderSlice";
import { releasePO } from "@/redux/action/createPurchaseOrderAction";
type Props = { params: { view: number } };

export default function POListTab({ params }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState(0);
  const [openCancelPOConfirmation, setOpenCancelPOConfirmation] =
    useState(false);
  const selectedPurchaseOrder = useSelector(
    (state: RootState) => state.purchaseOrderList.selectedPurchaseOrder
  );

  const selectedTeaLot = useSelector(
    (state: RootState) => state.purchaseOrderList.selectedLot
  );

  const selectedTeaLotDetail = useSelector(
    (state: RootState) => state.purchaseOrderList.selectedLotDetail
  );
  const lotForm = useSelector(
    (state: RootState) => state.purchaseOrderList.lotDetailForm
  );

  const masterData = useSelector(
    (state: RootState) => state.purchaseOrderList.masterData
  );

  const featureList = useSelector(
    (state: RootState) => state.auth.currentUserFeatureList
  );

  const cancelPOResponse = useSelector(
    (state: RootState) => state.purchaseOrderList.cancelPurchaseOrderReponse
  );

  const isGeneratePO = useSelector(
    (state: RootState) => state.createPurchaseOrder.isGeneratePO
  );
  const selectedPurchaseOrderId = useSelector(
    (state: RootState) => state.createPurchaseOrder.selectedPurchaseOrderId
  );
  const releasePurchaseOrderResponse = useSelector(
    (state: RootState) => state.createPurchaseOrder.releasePurchaseOrderResponse
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [userRole, setUserRole] = useState<UserRolesInterface | undefined>(
    undefined
  );

  const router = useRouter();
  useEffect(() => {
    const roleFromCookie = Cookies.get("userRole") as
      | UserRolesInterface
      | undefined;
    setUserRole(roleFromCookie);
    dispatch(getMasterData());
    if (
      selectedPurchaseOrder?.lots?.length &&
      selectedPurchaseOrder?.lots?.length >= 1
    ) {
      dispatch(setSelectedTeaLot(selectedPurchaseOrder?.lots[0]));
      // dispatch(getTeaLotDetails())
    }
  }, []);

  useEffect(() => {
    if (releasePurchaseOrderResponse.isSuccess) {
      dispatch(getTeaLotDetails());
       setTimeout(() => {
        dispatch(resetReleasePurchaseOrderResponse());
        router.push(`/purchase-orders`);
        // dispatch(getPurchaseOrderByID())
      }, 3000);
    }
    if (releasePurchaseOrderResponse.hasError) {
      dispatch(setIsGeneratePO(false));
      setTimeout(() => {
        dispatch(resetReleasePurchaseOrderResponse());
      }, 3000);
    }
  }, [releasePurchaseOrderResponse]);
  useEffect(() => {
    if (cancelPOResponse.hasError) {
      setOpenCancelPOConfirmation(false);
      setTimeout(() => {
        dispatch(resetCancelPurchaseOrderResponse());
      }, 3000);
    }
    if (cancelPOResponse.isSuccess) {
      setOpenCancelPOConfirmation(false);
      setTimeout(() => {
        dispatch(resetCancelPurchaseOrderResponse());
        router.push(`/purchase-orders`);
        // dispatch(getPurchaseOrderByID())
      }, 3000);
    }
  }, [cancelPOResponse]);

  useEffect(() => {
    if (selectedTeaLot) {
      dispatch(getTeaLotDetails());
    }
  }, [selectedTeaLot]);

  const onLotRowClick = (
    lot: TeaLot,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setSelectedTeaLot(lot));
  };

  const handleCancelPO = () => {
    setOpenCancelPOConfirmation(!openCancelPOConfirmation);
  };

  const closeCancelPOConfirmation = () => {
    setOpenCancelPOConfirmation(false);
  };

  const cancelPOConfirmation = () => {
    dispatch(cancelPO());
  };
  const renderTabContent = (index: any) => {
    switch (index) {
      case 0:
        return (
          <Box>
            <Grid container>
              <Grid item lg={3} xs={12} pr={{ xs: 0, lg: 2 }}>
                <TeaLotList
                  lots={selectedPurchaseOrder?.lots || []}
                  isLoading={false}
                  hasError={false}
                  selectedLotId={0}
                  onRowClick={onLotRowClick}
                />
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
                  }}
                  handleEditClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  handleSaveChanges={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  handleCancel={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  isUnsavedChanged={false}
                  isUnsavedChangesOnCancel={false}
                  handleCancelConfirm={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  handleRemainCancel={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  hasAPIError={undefined}
                />
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };
  const breadcrumbs = [
    {
      id: 1,
      link: "Purchase Orders",
      route: `/${ROUTES.PURCHASE_ORDERS}`,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: selectedPurchaseOrder?.purchaseOrderId || "purchase order",
      route: "",
    },
  ];
  const handleGeneratePOButtonClick = (purchaseOrderId: number) => {
    dispatch(setIsGeneratePO(true));
    dispatch(setSelectedPurchaseOrderId(purchaseOrderId));
  };

  const handleGeneratePO = () => {
    if (selectedPurchaseOrderId) {
      dispatch(releasePO(selectedPurchaseOrderId));
      dispatch(resetCreatePurchaseOrderResponse());
      dispatch(setIsGeneratePO(false));
      // dispatch(setTabStatus(undefined));
    }
  };

  const handleClose = () => {
    dispatch(setIsGeneratePO(false));
  };
  return (
    <main>
      <CatalogueManagementHeader
        title={"Purchase Orders"}
        breadcrumbs={breadcrumbs}
        // component={!isCloseSheetEnabled && createButton}
      />
      {cancelPOResponse.isSuccess ||
        (releasePurchaseOrderResponse.isSuccess && (
          <Alert
            variant="filled"
            severity="success"
            sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
          >
            {cancelPOResponse?.data?.message ||
              releasePurchaseOrderResponse?.message}
          </Alert>
        ))}
      {cancelPOResponse.hasError ||
        (releasePurchaseOrderResponse.hasError && (
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
          >
            {cancelPOResponse?.message || releasePurchaseOrderResponse?.message}
          </Alert>
        ))}

      <Grid container direction="row" justifyContent="end" mb="1">
        {featureList?.includes(FEATURES.CANCEL_PO) &&
          !selectedPurchaseOrder?.isPurchaseOrderCancelled &&
          selectedPurchaseOrder?.purchaseOrderNumber &&
          !cancelPOResponse.isSuccess && (
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={handleCancelPO}
            >
              Cancel PO
            </Button>
          )}

        {!selectedPurchaseOrder?.isPurchaseOrderCancelled &&
        !selectedPurchaseOrder?.purchaseOrderNumber &&
        !releasePurchaseOrderResponse.isSuccess &&
          featureList?.includes(FEATURES.RELEASE_PURCHASE_ORDER) &&
          selectedPurchaseOrder?.approval?.status === "APPROVED" && (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={(e) =>
                handleGeneratePOButtonClick(
                  selectedPurchaseOrder?.purchaseOrderId
                )
              }
              // disabled={
              //      teaLotById.statusId === 1
              //   || teaLotById.statusId === 2
              //   || teaLotById.statusId === 4
              //   || teaLotById.statusId === 5
              //   || teaLotById.statusId === 6
              //   // || checkedItems.length === 0
              //   // teaLotById?.approval?.status !== 'REJECTED' ||
              //   // teaLotById.approval !== null
              // }
            >
              Generate PO
              {releasePurchaseOrderResponse?.isLoading && (
                <CircularProgress size="10px" color="info" />
              )}
            </Button>
          )}
      </Grid>

      <Grid container direction="column" alignItems="left" mb="1">
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
        dialogTitle="Confirm Rejection"
        dialogContentText={
          <Grid>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to cancel this purchase order?
            </Typography>
          </Grid>
        }
        open={openCancelPOConfirmation}
        onClose={closeCancelPOConfirmation}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm Cancellation",
            onClick: cancelPOConfirmation,
            isLoading: cancelPOResponse.isLoading,
          },
          {
            buttonText: "Close",
            onClick: closeCancelPOConfirmation,
            design: "outlined",
          },
        ]}
      />
      <ConfirmationMessage
        dialogContentText="Are you sure you want to Generate PO?"
        open={isGeneratePO}
        onClose={handleClose}
        buttons={[
          {
            buttonText: "Yes",
            onClick: handleGeneratePO,
          },
          {
            buttonText: "No",
            onClick: handleClose,
          },
        ]}
        showCloseButton={false}
      />
    </main>
  );
}

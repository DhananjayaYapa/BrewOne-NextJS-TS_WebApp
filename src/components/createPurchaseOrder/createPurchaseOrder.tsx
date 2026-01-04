"use client";

import LotNoList from "../common/LotNoList/LotNoList";
import LotDetails from "../common/LotDetails/LotDetails";
import { Box, Button, CircularProgress, Container, FormControlLabel, Grid } from "@mui/material";
import Styles from "./createPurchaseOrder.module.scss";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTeaLotDetailsById } from "@/redux/action/teaLotDetailsAction";
import { getTeaLotDetails } from "@/redux/action/gradingAction";
import {
  addBuyingPlan,
  cancelBuyingPlan,
  createPurchaseOrder,
  releasePO,
} from "@/redux/action/createPurchaseOrderAction";
import { setCurrentPage, setIsBuyingPlan, setTabStatus } from "@/redux/slice/gradingSlice";
import { setLot } from "@/redux/slice/lotDetailsSlice";
import { CreatePurchaseOrderRequest } from "@/interfaces";
import {
  resetAddBuyingPlanResponse,
  resetCancelBuyingPlanResponse,
  resetCreatePurchaseOrderResponse,
  resetReleasePurchaseOrderResponse,
  setIsAddToBuyingPlanClicked,
  setIsFilterChecked,
  setIsGeneratePO,
  setIsRemoveBuyingPlanClicked,
  setSelectedPurchaseOrderId,
} from "@/redux/slice/createPurchaseOrderSlice";
import ConfirmationMessage from "../confirmationMessage/confirmationMessage";

import { getFeatureList } from "@/redux/action/authAction";
import { FEATURES, UserRolesInterface } from "@/constant";

export default function CreatePurchaseOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isApprovalRequestButtonClick, setIsApprovalRequestButtonClick] = useState<boolean>(false);

  const isFilterChecked = useSelector(
    (state: RootState) => state.createPurchaseOrder.isFilterChecked
  );

  const teaLotById = useSelector((state: RootState) => state.lotDetails.data);

  const selectedLot = useSelector(
    (state: RootState) => state.lotDetails.selectedLot
  );

  const addBuyingPlanResponse = useSelector(
    (state: RootState) => state.createPurchaseOrder.addBuyingPlanResponse
  );

  const createPurchaseOrderResponse = useSelector(
    (state: RootState) => state.createPurchaseOrder.createPurchaseOrderResponse
  );

  const cancelBuyingPlanResponse = useSelector(
    (state: RootState) => state.createPurchaseOrder.cancelBuyingPlanResponse
  );


  const releasePurchaseOrderResponse = useSelector(
    (state: RootState) => state.createPurchaseOrder.releasePurchaseOrderResponse
  );

  const isAddToBuyingPlanClicked = useSelector(
    (state: RootState) => state.createPurchaseOrder.isAddToBuyingPlanClicked
  );

  const isRemoveBuyingPlanClicked = useSelector(
    (state: RootState) => state.createPurchaseOrder.isRemoveBuyingPlanClicked
  );

  const isGeneratePO = useSelector(
    (state: RootState) => state.createPurchaseOrder.isGeneratePO
  );
  const selectedPurchaseOrderId = useSelector(
    (state: RootState) => state.createPurchaseOrder.selectedPurchaseOrderId
  );

  const featureList = useSelector(
    (state: RootState) => state.auth.featureListReponse
  );

  const loggedInUserFeatureList = useSelector(
    (state: RootState) => state.auth.currentUserFeatureList
  );

  const handleAddToBuyingPlanButtonClick = () => {
    dispatch(setIsAddToBuyingPlanClicked(true));
  };

  const handleRemoveBuyingPlanButtonClick = () => {
    dispatch(setIsRemoveBuyingPlanClicked(true));
  };

  const handleGeneratePOButtonClick = (purchaseOrderId: number) => {
    dispatch(setIsGeneratePO(true));
    dispatch(setSelectedPurchaseOrderId(purchaseOrderId))
  };

  const handleRequestPOApprovalButtonClick = () => {
   setIsApprovalRequestButtonClick(!isApprovalRequestButtonClick)
  };

  useEffect(() => {
    if (createPurchaseOrderResponse.isSuccess) {
      setIsApprovalRequestButtonClick(false)
      dispatch(setTabStatus(undefined));
      dispatch(setLot(selectedLot));
      dispatch(getTeaLotDetails());
      dispatch(getTeaLotDetailsById());
      dispatch(setIsFilterChecked(false));
      setCheckedItems([]);
    }
    if (createPurchaseOrderResponse.hasError) {
      setIsApprovalRequestButtonClick(false)
      dispatch(setIsFilterChecked(true));
    }
  }, [createPurchaseOrderResponse]);

  useEffect(() => {
    if (releasePurchaseOrderResponse.isSuccess) {
      setIsApprovalRequestButtonClick(false)
      dispatch(setTabStatus(undefined));
      dispatch(setLot(selectedLot));
      dispatch(getTeaLotDetails());
      dispatch(getTeaLotDetailsById());
      dispatch(setIsFilterChecked(false));
      setCheckedItems([]);
    }
    if (releasePurchaseOrderResponse.hasError) {
      dispatch(setIsGeneratePO(false));
      dispatch(setIsFilterChecked(true));
    }
  }, [releasePurchaseOrderResponse]);

  useEffect(() => {
    if (addBuyingPlanResponse.isSuccess) {
      dispatch(setIsAddToBuyingPlanClicked(false));
      dispatch(setTabStatus(undefined));
      dispatch(setLot(selectedLot));
      dispatch(getTeaLotDetails());
      dispatch(getTeaLotDetailsById());
    }
    if (addBuyingPlanResponse.hasError) {
      dispatch(setIsAddToBuyingPlanClicked(false));
    }
  }, [addBuyingPlanResponse]);

  useEffect(() => {
    if (cancelBuyingPlanResponse.isSuccess) {
      dispatch(getTeaLotDetails());
      dispatch(setIsRemoveBuyingPlanClicked(false));
      dispatch(setTabStatus(undefined));
      dispatch(setLot(selectedLot));
      dispatch(getTeaLotDetailsById());
    }
    if (cancelBuyingPlanResponse.hasError) {
      dispatch(setIsRemoveBuyingPlanClicked(false));
    }
    dispatch(resetCancelBuyingPlanResponse());
  }, [cancelBuyingPlanResponse]);

  const handleAddToBuyingPlan = () => {
    dispatch(addBuyingPlan());
    dispatch(resetAddBuyingPlanResponse());
    dispatch(setIsAddToBuyingPlanClicked(false));
    dispatch(setTabStatus(undefined));
  };

  const handleRemoveBuyingPlan = () => {
    dispatch(cancelBuyingPlan());
    dispatch(resetCancelBuyingPlanResponse());
    dispatch(setIsRemoveBuyingPlanClicked(false));
    dispatch(setTabStatus(undefined));
  };

  const handleGeneratePO = () => {
    if(selectedPurchaseOrderId){
      dispatch(releasePO(selectedPurchaseOrderId));
      dispatch(resetCreatePurchaseOrderResponse());
      dispatch(setIsGeneratePO(false));
      dispatch(setTabStatus(undefined));
    }
  };

  const handlePOApprovalRequest = () => {
    const createPurchaseOrderRequest: CreatePurchaseOrderRequest = {
      lots: checkedItems?.map((lotId) => ({ lotId })),
      autoRequestApproval: true,
      autoRelease: false
    };
    dispatch(createPurchaseOrder(createPurchaseOrderRequest));
    dispatch(setTabStatus(undefined));
  };
  useEffect(() => {
    dispatch(getFeatureList())
    return () => {
    dispatch(setIsBuyingPlan(false))
    dispatch(setIsFilterChecked(false))
    dispatch(setIsRemoveBuyingPlanClicked(false));
    dispatch(setCurrentPage(0))
    // dispatch(getTeaLotDetails());
  };
  }, []);
  useEffect(() => {
    dispatch(setTabStatus(undefined));
    dispatch(getTeaLotDetails());
    dispatch(setLot(selectedLot));
  }, [dispatch]);

  const handleClose = () => {
    dispatch(resetAddBuyingPlanResponse());
    dispatch(resetCancelBuyingPlanResponse());
    dispatch(resetReleasePurchaseOrderResponse());
    dispatch(setIsAddToBuyingPlanClicked(false));
    dispatch(setIsRemoveBuyingPlanClicked(false));
    dispatch(setIsGeneratePO(false));
    if (releasePurchaseOrderResponse.hasError) {
      dispatch(setIsFilterChecked(true));
    }
  };

  const handleCloseApprovalRequest = () => {
    dispatch(resetCreatePurchaseOrderResponse());
    dispatch(setIsAddToBuyingPlanClicked(false));
    dispatch(setIsRemoveBuyingPlanClicked(false));
    setIsApprovalRequestButtonClick(false)
  };

  const handleFilterChange = () => {
    dispatch(setIsBuyingPlan(!isFilterChecked))
    dispatch(setCurrentPage(0))
    dispatch(getTeaLotDetails());

    const newFilterChecked = !isFilterChecked;
    dispatch(setIsFilterChecked(newFilterChecked));
    if (!newFilterChecked) {
      setCheckedItems([]);
    }
  };

  return (
    <div>
        <Grid container>
          <Grid item lg={3} xs={12} pr={{ xs: 0, lg: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFilterChecked}
                  onChange={handleFilterChange}
                />
              }
              label="Filter Buying Plan"
              sx={{ paddingLeft: "18px" }}
            />

            <LotNoList
              showIcon={true}
              checkedFilterBuyingPlan={isFilterChecked}
              onCheckedItemsChange={setCheckedItems}
              height={220}
              isFromPurchasing={true}
            >
              <Box className={Styles.buttongrid}>
                {loggedInUserFeatureList?.includes(FEATURES.ADD_TO_BUYING_PLAN) && (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={handleAddToBuyingPlanButtonClick}
                    disabled={
                      teaLotById.statusId === 1 ||
                      teaLotById.statusId === 3 ||
                      teaLotById.statusId === 4 ||
                      teaLotById.statusId === 5 ||
                      teaLotById.statusId === 6 
                      // teaLotById?.approval?.status !== 'REJECTED' ||
                      // teaLotById.approval === null
                    }
                  >
                    Add to buying plan
                  </Button>
                )}
                {loggedInUserFeatureList?.includes(FEATURES.REMOVE_BUYING_PLAN) && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={handleRemoveBuyingPlanButtonClick}
                    disabled={
                      teaLotById.statusId === 1 ||
                      teaLotById.statusId === 2 ||
                      teaLotById.statusId === 4 ||
                      teaLotById.statusId === 5 ||
                      teaLotById.statusId === 6 
                      || checkedItems.length > 0 
                      // ||
                      // teaLotById?.approval?.status !== 'REJECTED' ||
                      // teaLotById.approval !== null
                    }
                  >
                    Remove buying plan
                  </Button>
                )}
                {loggedInUserFeatureList?.includes(FEATURES.REQUEST_APPROVAL_FOR_RELEASE_PURCHASE_ORDER) 
                && teaLotById?.approval?.status !== 'APPROVED'
                && featureList?.data?.find(x => x.featureKey === FEATURES.RELEASE_PURCHASE_ORDER)?.isApprovalRequired === 1 
                && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={handleRequestPOApprovalButtonClick}
                    disabled={
                         teaLotById.statusId === 1 
                      || teaLotById.statusId === 2 
                      || teaLotById.statusId === 4 
                      || teaLotById.statusId === 5 
                      || teaLotById.statusId === 6
                      || checkedItems.length === 0 
                      // || teaLotById?.approval?.status !== 'REJECTED' 
                      // teaLotById.approval !== null
                    }
                  >
                     Request for PO Approval
                  </Button>
                )}
                {/* {loggedInUserFeatureList?.includes(FEATURES.RELEASE_PURCHASE_ORDER) 
                && teaLotById?.approval?.status === 'APPROVED'
                && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={(e) => handleGeneratePOButtonClick(teaLotById?.purchaseOrderId)}
                    disabled={
                         teaLotById.statusId === 1 
                      || teaLotById.statusId === 2 
                      || teaLotById.statusId === 4 
                      || teaLotById.statusId === 5 
                      || teaLotById.statusId === 6
                      // || checkedItems.length === 0 
                      // teaLotById?.approval?.status !== 'REJECTED' ||
                      // teaLotById.approval !== null
                    }
                  >
                     Generate PO 
                     {releasePurchaseOrderResponse?.isLoading && (
                      <CircularProgress size='10px' color="info"/>
                     )}
                  </Button>
                )} */}
              </Box>
            </LotNoList>
          </Grid>

          <Grid item lg={9} py={2}>
            <LotDetails />
          </Grid>
        </Grid>

        {/* request  PO approval */}
        <ConfirmationMessage
          dialogTitle="SUCCEEDED"
          dialogContentText={
            <>
              {createPurchaseOrderResponse.message && (
                <div>{createPurchaseOrderResponse.message}</div>
              )}
              {createPurchaseOrderResponse.purchaseOrderNumber !==
                undefined && (
                  <div> {createPurchaseOrderResponse.purchaseOrderNumber}</div>
                )}
            </>
          }
          open={createPurchaseOrderResponse.isSuccess}
          onClose={handleCloseApprovalRequest}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleCloseApprovalRequest,
            },
          ]}
          showCloseButton={false}
        />

{/* Generate PO */}
        <ConfirmationMessage
          dialogTitle="SUCCEEDED"
          dialogContentText={
            <>
              {releasePurchaseOrderResponse.message && (
                <div>{releasePurchaseOrderResponse.message}</div>
              )}
              {releasePurchaseOrderResponse.purchaseOrderNumber !==
                undefined && (
                  <div> {releasePurchaseOrderResponse.purchaseOrderNumber}</div>
                )}
            </>
          }
          open={releasePurchaseOrderResponse.isSuccess}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogTitle="FAILED"
          dialogContentText={createPurchaseOrderResponse.message}
          open={createPurchaseOrderResponse.hasError}
          onClose={handleCloseApprovalRequest}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleCloseApprovalRequest,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogTitle="FAILED"
          dialogContentText={releasePurchaseOrderResponse.message}
          open={releasePurchaseOrderResponse.hasError}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        {/* add buying plan */}
        <ConfirmationMessage
          dialogTitle="SUCCEEDED"
          dialogContentText={addBuyingPlanResponse.message}
          open={addBuyingPlanResponse.isSuccess}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogTitle="FAILED"
          dialogContentText={addBuyingPlanResponse.message}
          open={addBuyingPlanResponse.hasError}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        {/* cancel buying plan */}
        <ConfirmationMessage
          dialogTitle="SUCCEEDED"
          dialogContentText={cancelBuyingPlanResponse.message}
          open={cancelBuyingPlanResponse.isSuccess}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogTitle="FAILED"
          dialogContentText={cancelBuyingPlanResponse.message}
          open={cancelBuyingPlanResponse.hasError}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Close",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogContentText="Are you sure you want to add the lot to the buying plan?"
          open={isAddToBuyingPlanClicked}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Yes",
              onClick: handleAddToBuyingPlan,
            },
            {
              buttonText: "No",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
        />

        <ConfirmationMessage
          dialogContentText="Are you sure you want to remove the lot from the buying plan?"
          open={isRemoveBuyingPlanClicked}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Yes",
              onClick: handleRemoveBuyingPlan,
            },
            {
              buttonText: "No",
              onClick: handleClose,
            },
          ]}
          showCloseButton={false}
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

        <ConfirmationMessage
          dialogContentText="Are you sure you want to request for a Purchase Order Approval?"
          open={isApprovalRequestButtonClick}
          onClose={handleCloseApprovalRequest}
          buttons={[
            {
              buttonText: "Yes",
              onClick: handlePOApprovalRequest,
            },
            {
              buttonText: "No",
              onClick: handleCloseApprovalRequest,
            },
          ]}
          showCloseButton={false}
        />
    </div>
  );
}

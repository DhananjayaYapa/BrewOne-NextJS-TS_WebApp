"use client";

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import gradingSlice from "./slice/gradingSlice";
import uploadCatalogueSlice from "./slice/uploadCatalogueSlice";
import catalogueSlice from "./slice/catalogueSlice";
import brokerSlice from "./slice/brokerSlice";
import dataSlice from "./slice/dataSlice";
import standardSlice from "./slice/standardSlice";
import lotDetailsSlice from "./slice/lotDetailsSlice";
import createPurchaseOrderSlice from "./slice/createPurchaseOrderSlice";
import authReducer from "./slice/authSlice";
import dashBoardLotHistorySlice from "./slice/dashBoardLotHistorySlice";
import deliveryOrderSlice from "./slice/deliveryOrderSlice";
import createBlendSheetSlice from "./slice/createBlendSheetSlice";
import blendSheetSlice from "./slice/blendSheetSlice";
import sendingDeliveryOrder from "./slice/sendingDeliveryOrderSlice";
import editBlendSheetSlice from "./slice/editBlendSheetSlice";
import packingSheetSlice from "./slice/packingSheetSlice";
import createPackingSheetSlice from "./slice/createPackingSheetSlice";
import editPackingSheetSlice from "./slice/editPackingSheetSlice";
import createCatalogueSlice from "./slice/createCatalogueSlice";
import purchaseOrderApprovalsSlice from "./slice/purchaseOrderApprovalSlice";
import purchaseOrdersSlice from "./slice/purchaseOrdersSlice";
import blendSheetApprovalsSlice from "./slice/blendSheetApprovalSlice";
import closeBlendSheetSlice from "./slice/closeBlendSheetSlice";
import masterDataSyncSlice from "./slice/masterDataSyncSlice";
import teaBoardSlice from "./slice/teaBoardSlice";
import duplicateBlendSheetSlice from './slice/duplicateBlendSheetSlice';
import readyForShipmentSlice from "./slice/readyForShipmentSlice";

export const store = configureStore({
  reducer: {
    grading: gradingSlice,
    uploadCatalog: uploadCatalogueSlice,
    catalogue: catalogueSlice,
    broker: brokerSlice,
    data: dataSlice,
    standard: standardSlice,
    lotDetails: lotDetailsSlice,
    createPurchaseOrder: createPurchaseOrderSlice,
    lotHistory: dashBoardLotHistorySlice,
    auth: authReducer,
    deliveryOrder: deliveryOrderSlice,
    createBlendSheet: createBlendSheetSlice,
    blendSheet: blendSheetSlice,
    sendingDeliveryOrder: sendingDeliveryOrder,
    editBlendSheet: editBlendSheetSlice,
    packingSheet: packingSheetSlice,
    createPackingSheet: createPackingSheetSlice,
    editPackingSheet: editPackingSheetSlice,
    createCatalogue: createCatalogueSlice,
    purchaseOrderApprovals: purchaseOrderApprovalsSlice,
    purchaseOrderList: purchaseOrdersSlice,
    blendSheetApprovals: blendSheetApprovalsSlice,
    closeBlendSheet: closeBlendSheetSlice,
    masterDataSync: masterDataSyncSlice,
    teaBoard: teaBoardSlice,
    duplicateBlendSheet: duplicateBlendSheetSlice,
     readyForShipment: readyForShipmentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

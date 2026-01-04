import { patch } from "@mui/material";
import { ROUTES } from "./route";
import { FEATURES } from "./feature";
import { features } from "process";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BREW_ONE_BASE_URL;
export const MAX_SIGN_IN_ATTEMPTS = 3;
export const CUSTOMER_ID = 1;
export const SELECTED_STATUS_IDS = '4,5,6';
export const CURRENT_DATE = new Date().toISOString().split('T')[0];
export const MONTHS = 12
export const TABLE_HEADERS: String[] = ['Lot No', 'Standard', 'Price', 'Main Buyer', 'Grade', 'Break'];
export const NO_RECORDS_FOUND = "No Records Found!";
export const DATE_FORMAT = 'YYYY-MM-DD'

export enum UserRolesInterface {
  ASSISTANT_MANAGER_TEA = "ASSISTANT_MANAGER_TEA",
  TEA_MASTER = "TEA_MASTER",
  SUPERVISOR_TEA = "SUPERVISOR_TEA",
  GENERAL_MANAGER_PROCUREMENT_AND_ADMINISTRATION = "GENERAL_MANAGER_PROCUREMENT_AND_ADMINISTRATION",
  EXECUTIVE_PROCUREMENT = "EXECUTIVE_PROCUREMENT",
  MANAGER_PRODUCTION = "MANAGER_PRODUCTION",
  EXECUTIVE_PRODUCTION = "EXECUTIVE_PRODUCTION",
  SUPERVISOR_QC = "SUPERVISOR_QC",
  SUPERVISOR_WAREHOUSE = "SUPERVISOR_WAREHOUSE",
  MANAGER_STORES = "MANAGER_STORES",
  ADMIN = "ADMIN",
  TEA_MANAGER = "TEA_MANAGER",
  TEA_EXECUTIVE = "TEA_EXECUTIVE"
}

export const headers = [
  // { title: "HOME",
  //   path: ROUTES.HOME,
  //   display: false,
  //   allowedRoles: [
  //     UserRolesInterface.TEA_EXECUTIVE]
  // },
  {
    title: "Dashboard",
    path: ROUTES.DASHBOARD,
    featureKey: [FEATURES.VIEW_DASHBOARD],
 },
  {
    title: "Catalogue Management",
    path: "/catalogue-management",
    featureKey: [FEATURES.VIEW_CATALOG,FEATURES.UPLOAD_CATALOG_FILE, FEATURES.CREATE_CATALOG, FEATURES.VIEW_PURCHASE_ORDER],
    subItems: [
      {
        title: "Catalogue List",
        path: ROUTES.CATALOGUE_MANAGEMENT,
        featureKey: [FEATURES.VIEW_CATALOG, FEATURES.UPLOAD_CATALOG_FILE , FEATURES.CREATE_CATALOG, ],

      },
      {
        title: "PO List",
        path: ROUTES.PURCHASE_ORDERS,
        featureKey: [FEATURES.VIEW_PURCHASE_ORDER],
      },
    ],
  },
  {
    title: "Blend Sheet Management",
    path: ROUTES.BLENDING_SHEETS,
    featureKey: [FEATURES.VIEW_BLEND_SHEET,FEATURES.CLOSE_BLEND_SHEET, FEATURES.CREATE_BLEND_SHEET],
    // subItems: [
    //   // {
    //   //   title: "Close Blend Sheets",
    //   //   path: ROUTES.CLOSE_BLEND_SHEETS,
    //   //   featureKey: [FEATURES.CLOSE_BLEND_SHEET],

    //   // },
    //   // {
    //   //   title: "Create Blend Sheets",
    //   //   path: ROUTES.CREATE_BLENDING_SHEET,
    //   //   featureKey: [FEATURES.CREATE_BLEND_SHEET],

    //   // },
    // ]
  },
  {
    title: "Approvals Management",
    path: "/approvals",
    featureKey: [FEATURES.VIEW_BLEND_SHEET, FEATURES.VIEW_PURCHASE_ORDER],
    subItems: [
      {
         title: "PO Approvals",
        path: ROUTES.PO_APPROVALS,
        featureKey: [FEATURES.VIEW_PURCHASE_ORDER],
       },
      {
        title: "Blend Sheet Approvals",
        path: ROUTES.BLEND_SHEET_APPROVALS,
        featureKey: [FEATURES.VIEW_BLEND_SHEET],
      },
    ],
  },
  {
    title: "Delivery Order", path: ROUTES.DELIVERY_ORDERS,
    featureKey: [FEATURES.VIEW_RECEIVING_DELIVERY_ORDER, FEATURES.CREATE_RECEIVING_DELIVERY_ORDER],
  },
  {
    title: "Sending Delivery Order", path: ROUTES.SENDING_DELIVERY_ORDERS,
    featureKey: [FEATURES.VIEW_SENDING_DELIVERY_ORDER, FEATURES.CREATE_SENDING_DELIVERY_ORDER],
  },
  {
    title: "Packing Management", path: ROUTES.PACKING_SHEETS,
    featureKey: [FEATURES.CREATE_PACKING_SHEET, FEATURES.VIEW_PACKING_SHEET],
   },
  {
    title: "Master Data Sync",
    path: ROUTES.MASTER_DATA_SYNC,
    featureKey: [FEATURES.MASTER_DATA_SYNC],
  },
  { 
    title: "Reports",
    path: "/reports",
    featureKey: [FEATURES.GENERATE_DELIVERY_ORDER_ACKNOWLEDGEMENT_REPORT],
    subItems: [
      {
         title: "Ready for Shipment",
        path: ROUTES.READY_FOR_SHIPMENT_REPORT,
        featureKey: [FEATURES.GENERATE_DELIVERY_ORDER_ACKNOWLEDGEMENT_REPORT],
       },
    ],
  },
];

export const SCREEN_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  RELEASE: 'release',
  SAVE: 'save'
}

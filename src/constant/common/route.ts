import { features } from "process"
import { FEATURES } from "./feature"

export const ROUTES = {
    CATALOGUE_MANAGEMENT: 'catalogue-management',
    UPLOAD_CATALOGUE: 'catalogue-upload',
    CREATE_CATALOGUE: 'catalogue-create',
    GRADING: 'catalogue-grading',
    DASHBOARD:'dashboard',
    DELIVERY_ORDERS: 'delivery-order',
    SENDING_DELIVERY_ORDERS: 'sending-delivery-order',
    CREATE_DELIVERY_ORDER: 'create-delivery-order',
    CREATE_SENDING_DELIVERY_ORDER: 'create-sending-delivery-order',
    HOME:'/',
    LOGIN:'login',
    BLENDING_SHEETS:'blending-sheet',
    CREATE_BLENDING_SHEET:'create-blending-sheet',
    PACKING_SHEETS:'packing-sheet',
    CREATE_PACKING_SHEET:'create-packing-sheet',
    BLENDING_SHEET_HISTORY_LOGS:'blending-sheet-history-log',
    CATALOGUE_CHANGE_LOGS:'catalogue-change-logs',
    PURCHASE_ORDERS: 'purchase-orders',
    PO_APPROVALS: 'po-approvals',
    BLEND_SHEET_APPROVALS: 'blend-sheet-approvals',
    CLOSE_BLEND_SHEETS: 'close-blend-sheets',
    MASTER_DATA_SYNC: 'master-data-sync',
    CHANGE_LOG: 'change-log',
    READY_FOR_SHIPMENT_REPORT: 'ready-for-shipment-report',
    TEA_BOARD_REPORT: 'tea-board-report',
    DUPLICATE_BLENDING_SHEET: 'duplicate-blending-sheet'
}

export const ROUTES_FEATURES = {
    CATALOGUE_MANAGEMENT: [FEATURES.VIEW_CATALOG,FEATURES.UPLOAD_CATALOG_FILE, FEATURES.CREATE_CATALOG ],
    UPLOAD_CATALOGUE: [FEATURES.UPLOAD_CATALOG_FILE],
    CREATE_CATALOGUE: [FEATURES.CREATE_CATALOG],
    GRADING: [FEATURES.EDIT_TEA_LOTS], //check
    DASHBOARD: [FEATURES.VIEW_DASHBOARD],
    DELIVERY_ORDERS: [FEATURES.VIEW_RECEIVING_DELIVERY_ORDER], //check
    SENDING_DELIVERY_ORDERS: [FEATURES.VIEW_SENDING_DELIVERY_ORDER], //check
    CREATE_DELIVERY_ORDER: [FEATURES.CREATE_RECEIVING_DELIVERY_ORDER],
    CREATE_SENDING_DELIVERY_ORDER: [FEATURES.CREATE_SENDING_DELIVERY_ORDER],
    // HOME:'/',
    // LOGIN:'login',
    BLENDING_SHEETS:[FEATURES.VIEW_BLEND_SHEET], //check
    CREATE_BLENDING_SHEET:[FEATURES.CREATE_BLEND_SHEET],
    // PACKING_SHEETS:'packing-sheet',
    // CREATE_PACKING_SHEET:'create-packing-sheet',
    // BLENDING_SHEET_HISTORY_LOGS:'blending-sheet-history-log',
    // CATALOGUE_CHANGE_LOGS:'catalogue-change-logs',
    // PURCHASE_ORDERS: 'purchase-orders',
    // PO_APPROVALS: 'po-approvals',
    // BLEND_SHEET_APPROVALS: 'blend-sheet-approvals',
    // CLOSE_BLEND_SHEETS: 'close-blend-sheets',
    // MASTER_DATA_SYNC: 'master-data-sync'
}
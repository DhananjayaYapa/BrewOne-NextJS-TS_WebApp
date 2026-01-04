import { APIErrorMessage, APISuccessMessage, Approval, BlendBalance, BOMItem, BOMLot, PaginationRequest, SalesOrder } from ".";

export interface GetAllBlendSheetsRequest extends PaginationRequest {
  statusId?: number
  status?: BlendSheetStatus | null
  startDate?: string
  endDate?: string
  salesOrder?: SalesOrder | null
  salesOrderId?: string
  getAll?: boolean
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  filterAllSheetsByStatusId?: number
}
export interface BlendSheetTemplate {
  salesOrderId: number,
  blendDate: string;
  productItemCode: string;
  blendItemCode: string;
  blendItemDescription: string;
  blendItemId: string;
  masterBlendSheetNo: string
  totalQuantity: number;
  blendSheets: BlendSheet[]
}

export interface BlendSheet {
  blendSheetId: number;
  salesOrderId: number;
  productItemCode: string;
  blendNumber: string;
  blendItemCode: string;
  blendItemDescription: string
  blendDate: string;
  statusId: number;
  statusName: string
  plannedQuantity: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string
  approval: Approval | null
}

export interface BlendSheetStatus {
  statusId: number;
  statusCode: string;
  statusName: string;
}

export interface CreateBlendSheet {
  salesOrderId: number;
  productItemCode: string;
  orderDate: string;
  startDate: string;
  dueDate: string;
  customerCode: string
  blendItemCode: string
  blendItemType: string
  blendItemDescription: string;
  plannedQuantity: number;
  warehouseCode: string;
  remarks?: string;
  blendSheetItems?: BOMItem[]
  attachments?: {
    fileKey: string
  }[]
  blendBalance?: BlendBalance[]
  totalQuantity: number
  quantity: number
  otherBlendItems?: OtherBlendItem[]
  blendItems?: BlendSFGItem[]
}

export interface CreatePackingSheet {
  salesOrderId: number;
  productItemCode: string;
  orderDate: string;
  startDate: string;
  dueDate: string;
  customerCode: string
  packingItemCode: string
  packingItemType: string
  packingItemDescription: string;
  plannedQuantity: number;
  warehouseCode: string;
  remarks?: string;
  packingSheetItems: BOMItem[]
}

export interface CreatePackingSheet {
  salesOrderId: number;
  productItemCode: string;
  orderDate: string;
  startDate: string;
  dueDate: string;
  customerCode: string
  packingItemCode: string
  packingItemType: string
  packingItemDescription: string;
  plannedQuantity: number;
  warehouseCode: string;
  remarks?: string;
  packingSheetItems: BOMItem[]
}

export interface GetBlendSheetDetail {
  approval: Approval | null;
  blendId: number,
  blendSheetNo: string,
  salesContractQuantity: number;
  salesOrderEntryId: number
  salesOrderId: number,
  productItemCode: string,
  orderDate: string,
  startDate: string,
  dueDate: string,
  customerCode: string,
  blendItemCode: string,
  blendItemType: string,
  blendItemDescription: string,
  plannedQuantity: number,
  warehouseCode: string,
  statusId: number,
  remarks: string,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
  masterBlendSheetNo: string;
  totalQuantity: number;
  quantity: number //added phase4
  blendSheetItems: BOMItem[]
  attachments: {
    fileKey: string
  }[]
  blendBalance?: BlendBalance[]
  blendItems: BlendSFGItem[]  //added phase4
  otherBlendItems: OtherBlendItem[] //added phase4
}
export interface CreateBlendSheetSuccess extends APISuccessMessage {
  blendSheetNo?: number
}

export interface EditBlendSheetBody {
  orderDate: string;
  startDate: string
  dueDate: string
  remarks?: string
  attachments?: { fileKey: string }[]
  blendSheetItems?: BlendSheetItem[]
  blendBalance?: BlendBalance[]
  totalQuantity: number
  blendItems?: BlendSFGItem[]
  otherBlendItems?: OtherBlendItem[]
}

export interface BlendSheetItem {
  code: string
  lots: BOMLot[]
}

export interface EditBlendSheetSuccess extends APISuccessMessage {
  docEntry?: number
}

export interface CloseBlendSheetRequest {
  masterBlendSheetNos: string[]
}

export interface ApprovalAPICustomError extends APIErrorMessage {
  extraInfo?: string[]
  blendInfo?: string[]
}

export interface PrintBlendSheetLot {
  salesDate: number
  salesCode: string
  boxNo: string
  brokerCode: string
  lotNo: string
  estateName: string
  invoiceNo: string
  noOfBags: number
  weightPerBag: number
  netQuantity: number
  requiredQuantity: number
  price: number
  value: number
  grade: string
  chestType: string
  standardName: string
}

interface PrintBlendSheetItemsList {
  blendDate?: string,
  warehouseCode?: string,
  productDescription: string,
  batchId: string,
  blendSheetNo: string,
  quantity: number,
  price: number,
  // standard?: string
  averageWeight: number
}

interface PrintBlendBalance {
  warehouseCode?: string
  blendSheetNo: string
  balanceQuantity: number
  blendDate: string
  productDescription: string //TODO: change
  blendPrice: number;
  gainQuantity: number;
  sieveQuantity?: number;
}

interface PrintApproval {
  requestId: number
  status: string
}

export interface GetPrintBlendSheetDetail {
  blendId: number
  blendSheetNo: string
  orderDate: string
  startDate: string
  dueDate: string
  createdAt: string
  productDescription: string
  statusId: number
  customerName: string
  salesContractNo: string
  salesContractQuantity: number
  lots: PrintBlendSheetLot[]
  blendItemList: PrintBlendSheetItemsList[]
  blendBalance: PrintBlendBalance[]
  approval: PrintApproval,
  remarks: string
  otherBlendItemList: OtherBlendItemLot[]
}

export interface BlendChangeLogs {
  blendId: number,
  blendSheetHistoryId: number,
  versionNo: number,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
}


export interface ChangeLogByIdField {
  fieldName: string
  updatedDate: string | null
  updatedBy: string | null
  previousValue: string | null
  newValue: string | null
}

export interface ChangeLogById {
  headerDetails: ChangeLogByIdField[]
  blendDetails: ChangeLogByIdField[][]
  itemDetails: ChangeLogByIdField[][]
}

export interface BlendChangeLogByIdRequest {
  previousVersionNo: number
  currentVersionNo: number
}
export interface BlendChangeLogFields {
  fieldName: string,
  previousValue: string,
  currentValue: string,
}

export interface BlendChangeLogByIdSection {
  sectionName: string
  fields: BlendChangeLogFields[]
}

export interface BlendChangeLogByIdResponse {
  sections: BlendChangeLogByIdSection[]
}

//SFG AND OTHER ITEM DTO
export interface BlendSFGItem {
  batchId: string
  blendSheetNo: string
  price: number
  quantity: number
  warehouseCode: string
  averageWeight: number
}

export interface OtherBlendWarehouse {
  warehouseCode: string
  lots: OtherBlendLotStock[]
}

export interface SelectedOtherItemWarehouseStock{
    index: number;
    itemCode: string;
    fromWarehouse: OtherBlendWarehouse | null
    selectedLot: OtherBlendLotStock |  null
    lotOptions: OtherBlendLotStock[]
    plannedQuantity: number
    remainingQuantity: number
    error: "Exceeded" | "Should be greater than 0" | "No Error";
    isToWarehouseRequired: boolean;
    isCollapsed: boolean
}

export interface WarehouseStockOtherBlend{
    itemCode: string;
    warehouses: OtherBlendWarehouse[]
}

//new change after API
export interface OtherItemLotStock{
    itemCode: string;
    lots: OtherBlendLotStock[]
}

export interface OtherBlendLotStock {
  batchId: string
  warehouseCode: string
  quantity: number
  requiredQuantity?: number
  boxNo?: string | null
  price: number | null
  weightPerBag: number | null
}

export interface SelectedOtherItemLotStock {
  index: number;
  itemCode: string;
  // fromWarehouse: OtherBlendWarehouse | null
  selectedLot: OtherBlendLotStock | null
  lotOptions: OtherBlendLotStock[]
  plannedQuantity: number
  remainingQuantity: number
  error: "Exceeded" | "Should be greater than 0" | "No Error";
  isToWarehouseRequired: boolean;
  isCollapsed: boolean
}

export interface OtherBlendItem {
  batchId?: string,
  code: string
  description: string
  lots: OtherBlendItemLot[]
}

export interface OtherBlendItemLot {
  warehouseCode: string
  batchId: string
  quantity: number
  price: number | null
  weightPerBag: number | null
}

export interface OtherBOMItemDetail{
  itemCode: string;
  bomItems: OtherBOMItem[]
}

export interface OtherBOMItem{
  blendSheetItemId?: number
  code:string
  description:string
  // basedQuantity: number
  lots: OtherBOMLot[]
  item?: OtherItemDetail
}

export interface OtherBOMLot{
  warehouseCode: string
  batchId: string
  quantity: number
  price: number | null
  weightPerBag: number | null
}

export interface OtherItemDetail {
	itemCode: string,
	itemName: string
}

export interface GetDuplicatedBlendSheetDetail {
  approval: Approval | null;
  blendId: number,
  blendSheetNo: string,
  salesContractQuantity: number;
  salesOrderEntryId: number
  salesOrderId: number,
  productItemCode: string,
  orderDate: string,
  startDate: string,
  dueDate: string,
  customerCode: string,
  blendItemCode: string,
  blendItemType: string,
  blendItemDescription: string,
  plannedQuantity: number,
  warehouseCode: string,
  statusId: number,
  remarks: string,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
  masterBlendSheetNo: string;
  totalQuantity: number;
  quantity: number //added phase4
  blendSheetItems: BOMItem[]
  attachments: {
    fileKey: string
  }[]
  blendBalance?: BlendBalance[]
  blendItems: BlendSFGItem[]  //added phase4
  otherBlendItems: OtherBlendItem[] //added phase4
}

export interface BlendSFGItemOptions{
  itemCode: string,
  itemDescription: string,
  warehouseCode: string,
  warehouseName: string
  blendSheetNo: string
  batchId: string
  quantity: number
  price: number
  averageWeight: number
}
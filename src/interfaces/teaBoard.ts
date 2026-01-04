import { Approval, BlendSFGItem, BlendSheetItem, OtherBlendItem, PrintBlendSheetLot } from ".";
import { BlendBalance } from "./blendBalance";
import { BOMItem } from "./salesOrder";

export interface GetTeaBoardDetail {
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
  blendItems?: BlendSFGItem[]  //added phase4
  otherBlendItems?: OtherBlendItem[] //added phase4
}

export interface EditTeaBoardBody {
  orderDate: string,
  startDate: string,
  dueDate: string,
  totalQuantity: number,
  blendId: number,
  blendSheetNo: string,
  salesOrderId?: number,
  productItemCode?: string,
  attachments?: { fileKey: string; }[],
  customerCode?: string,
  blendItemCode?: string,
  blendItemType?: string,
  blendItemDescription?: string,
  quantity?: number,
  plannedQuantity?: number,
  warehouseCode?: string,
  masterBlendSheetNo?: string,
  salesContractQuantity?: number,
  statusId?: number,
  remarks?: string,
  blendSheetItems?: BlendSheetItem[],
  blendBalance?: BlendBalance[],
  blendItems?: BlendSFGItem[],
  otherBlendItems?: OtherBlendItem[]
}

export interface GetTeaBoardReportDetail{
  blendId: number,
  blendSheetNo: string,
  orderDate: string,
  startDate: string,
  dueDate: string,
  createdAt: string, 
  productDescription: string,
  statusId: number,
  customerName: string,
  salesContractNo: string,
  salesContractQuantity: number,
  remarks: string,
  lots: PrintBlendSheetLot[],
  blendBalance: ReportBlendBalance[],
  otherBlendItemList: ReportOtherBlendItem[],
  blendItemList: BlendItemList[],
  approval?: {
		requestId: number,
		status: string,
		createdBy: string,
		createdAt: string,
		updatedBy: string | null,
		updatedAt: string | null,
    rejectReason: string | null
	} | null
  
}

interface ReportBlendBalance {
    blendSheetNo: string,
    balanceQuantity: number,
    gainQuantity: number,
    productDescription: string,
    blendDate: string,
    blendPrice: number,
    averageWeight: number,
  }

  interface ReportOtherBlendItem {
    batchId: string,
    quantity: number,
    price: number,
    weightPerBag: number,
  }

  interface BlendItemList {
    blendDate: string,
    productDescription: string,
    batchId: string,
    blendSheetNo: string,
    quantity: number,
    price: number,
    averageWeight: number
  }
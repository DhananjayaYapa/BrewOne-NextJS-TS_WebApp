import { Approval, PaginationRequest } from "./common"
import { TeaLot } from "./teaLot"

export interface PurchaseOrder {
    purchaseOrderId: number,
    purchaseOrderNumber: number | null,
    approval: Approval | null,
    brokerCode: string;
    brokerName: string
    catalogNo: string;
    catalogId: string;
    salesCode: string;
    salesYear: number
    isPurchaseOrderCancelled: boolean;
    isCancelled: boolean;
    lots: TeaLot[]
}

export interface GetPurchaseOrderListRequest extends PaginationRequest {
    approvalStatus?: string
    getAll?: boolean
    brokerCode?: string
}


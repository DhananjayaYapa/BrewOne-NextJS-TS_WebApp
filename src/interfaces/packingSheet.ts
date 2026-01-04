import { PaginationRequest } from "./common";

export interface GetAllPackingSheetsRequest extends PaginationRequest{
    statusId?: number
    status?: PackingSheetStatus | null
    startDate?: string
    endDate?: string
}

export interface PackingSheet{
    packingSheetId: number;
    salesOrderId: number;
    packingSheetNumber: string;
    packingItemCode: string; 
    packingItemDescription: string;
    packingDate: string;
    statusId: number;
    statusName: string
    plannedQuantity: number;
    createdBy: string;
    createdAt:string;
    updatedBy: string;
    updatedAt: string
}

export interface PackingSheetStatus{
    statusId: number;
    statusCode: string;
    statusName: string;
}
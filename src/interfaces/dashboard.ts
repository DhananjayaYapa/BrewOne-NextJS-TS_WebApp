import { APIGetResponse, PaginationRequest, UploadTeaLot } from "@/interfaces";

export interface DashboardHistoryRequest{
    customerId: number;
    teaLotId: number;

}


export interface LotHistoryDetails{
   lotId: number;
lotNo: number
statusHistory: StatusHistory[];
}
export interface CatalogFileList{
   catalogId: number;
   catalogSerialNumber: string;
   brokerCode: string;
   brokerName: string;
}
export interface StatusHistory{
   index:number;
   statusId: number;                                                    
  statusName: string;
  stageType: string; //(PREVIOUS,CURRENT,UPCOMING)
  updatedAt: string|null;
}


export interface TeaLotDetailsSummeryRequest extends PaginationRequest{
 
   customerId: number;
catalogId?: number;
lotNumber?: string;
fromDate?: string | undefined;
toDate?: string | undefined;
}
export interface TeaLotDetailsSummery{ 

      lotId: number;
      lotNo: string;
      totalQuantity: number;
      purchaseOrderId: number;
      purchaseOrderNumber: number;
      purchaseOrderDate: Date;
      boxNo: string;
      status: string;  
}
export interface TeaLotDetailsSummeryResponse extends APIGetResponse<TeaLotDetailsSummery>{
}
export interface LotSummeryAPIRequest{
   customerId: number;
catalogId: number | undefined;
statusId: string;
}
export interface LotSummeryAPIResponse{
   lotId: number;
    lotNo: string;
}

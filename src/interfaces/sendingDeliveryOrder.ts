import { APIGetResponse, PaginationRequest } from "./common";

export interface SendingDeliveryOrder {
  doId: number;
  doNumber: string;
  deliveryDate: Date;
  vehicleId: number;
  vehicleNumber: string;
  statusId: number;
  statusName: string;
}

export interface GetSendingDeliveryOrderDetailsByIdRequest {
  customerId: number;
}

export interface GetSendingDeliveryOrderDetailsRequest extends PaginationRequest {
  customerId: number;
  search?: string;
  statusId?: number[] | undefined;
  fromDate?: string | undefined;
  toDate?: string | undefined;
}

export interface GetSendingDeliveryOrderDetailsResponse
  extends APIGetResponse<SendingDeliveryOrder> {}

export interface SendingDeliveryOrderStatus {
  statusId: number;
  statusName: string;
}

export interface CreateSendingDeliveryOrderRequest {
  deliveryDate: string | undefined;
  vehicleId: number | undefined;
  driverId: number | undefined;
  salesOrderId: number | undefined;
  items: [];
}

export interface GetSendingDeliveryOrderDetailsByIdResponse
  extends APIGetResponse<SendingDeliveryOrderDetailsById> {}

export interface UpdateSendingDeliveryOrderActionRequest {
  customerId: number;
  statusId: number;
}

export interface DeliveryOrderItem {
      code: string;
      quantity: number;
      description: string;
}

export interface UpdateSendingDeliveryOrderActionRequest {
  statusId: number;
}


export interface SendingDeliveryOrderDetailsById {
  deliveryOrderId: number;
  deliveryOrderNumber: string;
  driverId: number;
  driverName: string;
  vehicleId: number;
  vehicleType: string;
  vehicleNumber: string;
  deliveryDate: Date;
  statusId: number;
  statusName: string;
  items:SendingDeliveryOrderItem[];
}

export interface SendingDeliveryOrderItem {
  itemCode: string;
  itemDescription: string;
  quantity: number;
}

export interface DeliveryItem {
  code: string;
  description: string;
  quantity: number;
}

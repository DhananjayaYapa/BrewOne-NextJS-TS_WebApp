import { APIGetResponse, PaginationRequest } from "./common";

export interface DeliveryOrder {
  salesDate: string;
  salesCode: string;
  doId: number;
  doNumber: string;
  collectionDate: Date;
  vehicleId: number;
  vehicleNumber: string;
  wareHouseId: number;
  warehouseName: string;
  statusId: number;
  statusName: string;
}

export interface GetDeliveryOrderDetailsByIdRequest {
  customerId: number;
}

export interface GetDeliveryOrderDetailsRequest extends PaginationRequest {
  customerId?: number;
  search?: string;
  statusId?: number[] | undefined;
  fromDate?: string | undefined;
  toDate?: string | undefined;
}

export interface GetDeliveryOrderDetailsResponse
  extends APIGetResponse<DeliveryOrder> {}

export interface DeliveryOrderStatus {
  statusId: number;
  statusName: string;
}

export interface Vehicle {
  vehicleId: number;
  vehicleType: string;
  vehicleNumber: string;
}

export interface Driver {
  driverId: number;
  driverName: string;
  licenseNumber: string;
  contactNumber: string;
}

export interface Warehouse {
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
}

export interface DeliveryOrderMasterData {
  vehicle: Vehicle[];
  driver: Driver[];
  warehouse: Warehouse[];
}

export interface CreateDeliveryOrderRequest {
  // customerId: number;
  collectionDate: string | undefined;
  vehicleId: number | undefined;
  driverId: number | undefined;
  warehouseId: number | undefined;
  salesCode: string;
  salesDate: string | undefined;
  teaLots: [];
}

export interface DeliveryOrderLot {
      LotId: number
      lotNo: string
      brokerCode: string
      gradeCode: string
      price: number,
      value: number,
      boxNo: string
      bagCount: number,
      weightPerBag: number,
      netQuantity: number,
      estateCode: string
      estateName: string
      invoiceNo: string;
      breakName: string,
      standardName: string,
      chestTypeName: string,
      sackTypeName: string,
      statusName: string,
      statusId: number
}

export interface DeliveryOrderDetailsById {
  salesDate: any;
  salesCode: unknown;
  deliveryOrderId: number;
  deliveryOrderNumber: string;
  driverId: number;
  driverName: string;
  vehicleId: number;
  vehicleType: string;
  vehicleNumber: string;
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  collectionDate: Date;
  statusId: number;
  statusName: string;
}
export interface DeliveryOrderAckReport {
  salesDate: any;
  salesCode: unknown;
  deliveryOrderId: number;
  deliveryOrderNumber: string;
  driverId: number;
  driverName: string;
  vehicleId: number;
  vehicleType: string;
  vehicleNumber: string;
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  collectionDate: Date;
  statusId: number;
  statusName: string;
  lots?: DeliveryOrderLot[]
}

export interface GetDeliveryOrderDetailsByIdResponse
  extends APIGetResponse<DeliveryOrderDetailsById> {}

export interface UpdateDeliveryOrderActionRequest {
  customerId: number;
  statusId: number;
}

export interface DeliverySalesOrderMasterData {
  salesCode: string;
  dates: {salesDate: string;}[];
}


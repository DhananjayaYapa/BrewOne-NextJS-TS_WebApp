import { APIGetResponse, Approval, DropDownOptionDto, PaginationRequest } from "@/interfaces";
import { FormValidatorField, FormValidatorForm } from "@/utill/common/formValidator";
import { Break, ChestType, Elevation, Estate, Grade, ItemDetail, SackType, Standard } from "./teaLotById";

export interface GetTeaLotDetailsRequest extends PaginationRequest {
  brokerCode?: string;
  salesCode?: string;
  salesDate?: string;
  customerId?: number;
  catalogId?: number;
  statusId?: string;
  catalogStatusId?: string;
  deliveryOrderId?: number;
  search?: string;
  date?: string;
  months?: number
  filterBuyingPlan?: boolean;
}

export interface GetTeaLotDetailsResponse extends APIGetResponse<TeaLot> { }

// export interface TeaLot {
//   lotId: number;
//   lotNo: number;
//   grade: string;
//   remarks: string;
//   breakId: number;
//   breakName: string;
//   standardId: number;
//   standardName: string;
//   buyer: string;
//   price: number;
//   purchaseOrderId: number;
//   statusId: number;
//   statusName: string;
// }

export interface TeaLot {
  salesDate: string;
  lotId: number;
  lotNo: number;
  grade: string;
  remarks: string;
  breakId: number;
  breakName: string;
  standardId: number;
  standardName: string;
  buyer: string;
  price: number;
  purchaseOrderId: number;
  statusId: number;
  statusName: string;
  catalogId: number;
  brokerCode: string;
  salesCode: string;
  boxNo: string;
  bagCount: number;
  netQuantity: number;
  storeAddress: string;
  purchaseOrderNumber: number;
  deliveryOrderId: number;
  approval: Approval | null
  gradeCode: string;
  estateName: string;
  invoiceNo: string;
  contractNumber: string;
  weightPerBag: number;
  chestTypeName: string
  value: number;
  paymentTypeId: number;
}
export interface BulkForm {
  lotId: number | null;
  standardId?: number | null;
  standardName?: string | null;
  buyer?: string | null;
  price?: number | null;
  breakId?: number;
}

export interface UploadTeaLot {
  lotNo: string;
  estateCode?: string;
  estateName?: string;
  invoiceNo?: string;
  grade?: string;
  bagsCount: number;
  WeightPerBag: number;
  chestType?: string;
  sackType?: string;
  break?: string;
  elevation?: string;
  allowance?: number;
  storeAddress?: string;
  netQuantity: number;
  noOfDeliveryDates?: number;
}

export interface CreatePurchaseOrderRequest {
  autoRequestApproval: boolean,
  autoRelease: boolean
  // customerId: number;
  lots: {lotId: number}[];
}

export interface PurchasedSummary {
  startDate: string,
  endDate: string,
  totalPurchasedLots: number,
  lotsByMonth: lotsByMonth[]
}

export interface lotsByMonth {
  month: string,
  purchasedLots: number
}

export interface LotDetailsForm extends FormValidatorForm{
  lotNo: FormValidatorField<string | null>
  boxNo: FormValidatorField<string | null>
  statusName: FormValidatorField<string | null>
  breakType: FormValidatorField<DropDownOptionDto | null> //currently both coming
  grade: FormValidatorField<DropDownOptionDto | null> //currently string name only coming
  bagCount: FormValidatorField<number | null>
  weightPerBag: FormValidatorField<number | null> //DECIMAL
  estateCode: FormValidatorField<string | null> //code & name - should be shown in 2 fields
  estateName: FormValidatorField<string | null> //code & name - should be shown in 2 fields
  standard: FormValidatorField<DropDownOptionDto | null> //code & name
  purchaseOrderNo: FormValidatorField<number | null>
  chest: FormValidatorField<DropDownOptionDto | null> //code & name
  sack: FormValidatorField<DropDownOptionDto | null> //code & name
  netQuantity: FormValidatorField<number | null>
  storeAddress: FormValidatorField<string | null> //only string is provided
  buyer: FormValidatorField<string | null> //user can change
  allowance:  FormValidatorField<number | null> //DECIMAL
  elevation: FormValidatorField<DropDownOptionDto | null> //code & name
  sampleCount: FormValidatorField<number | null>
  price: FormValidatorField<number | null> //DECIMAL
  deliveryDatesCount: FormValidatorField<number | null>
  itemType:  FormValidatorField<DropDownOptionDto | null> // should be shown in 2 fields
  valueNumber:  FormValidatorField<number | null> //DECIMAL
  invoiceNo: FormValidatorField<string | null>
  postingDate: FormValidatorField<Date | null> //DATA -preferably today
  remarks: FormValidatorField<string | null>
  paymentType: FormValidatorField<DropDownOptionDto | null>
  contractNumber: FormValidatorField<string | null>
}


export interface LotForm extends FormValidatorForm {
  lotNo: FormValidatorField<string | null>;
  boxNo: FormValidatorField<string | null>;
  statusName: FormValidatorField<string | null>
  breakId: FormValidatorField<number | null> //currently both coming
  gradeId: FormValidatorField<number | null> //currently string name only coming
  bagCount: FormValidatorField<number | null>
  weightPerBag: FormValidatorField<number | null> //DECIMAL
  estateId: FormValidatorField<number | null> //code & name - should be shown in 2 fields
  estateCode: FormValidatorField<number | null> //code & name - should be shown in 2 fields
  estateName: FormValidatorField<string | null> //code & name - should be shown in 2 fields
  standardId: FormValidatorField<number | null> //code & name
  purchaseOrderNumber: FormValidatorField<number | null>
  chestTypeId: FormValidatorField<number | null> //code & name
  sackTypeId: FormValidatorField<number | null> //code & name
  netQuantity: FormValidatorField<number | null>
  storeAddress: FormValidatorField<string | null> //only string is provided
  buyer: FormValidatorField<string | null> //user can change
  allowance:  FormValidatorField<number | null> //DECIMAL
  elevationId: FormValidatorField<number | null> //code & name
  sampleCount: FormValidatorField<number | null>
  price: FormValidatorField<number | null> //DECIMAL
  deliveryDatesCount: FormValidatorField<number | null>
  itemCode:  FormValidatorField<string | null> // should be shown in 2 fields
  value:  FormValidatorField<number | null> //DECIMAL
  invoiceNo: FormValidatorField<string | null>
  postingDate: FormValidatorField<Date | null> //DATA -preferably today
  remarks: FormValidatorField<string | null>
  paymentType: FormValidatorField<DropDownOptionDto | null>
  contractNumber: FormValidatorField<string | null>
}

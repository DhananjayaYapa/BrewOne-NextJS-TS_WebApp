import { APIGetResponse, DropDownOptionDto, PaginationRequest, UploadTeaLot } from "@/interfaces";
import { FormValidatorField, FormValidatorForm } from "@/utill/common/formValidator";
export interface Catalogue {
  catalogId: number;
  catalogSerialNumber: string;
  brokerCode: string;
  brokerName: string;
  salesCode: string;
  salesDate: Date | string;
  statusId: number;
  statusName: string;
  isEnable: boolean;
  typeId: number;
  typeName: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GetCatalogueRequest extends PaginationRequest {
  customerId: number
  search?: string;
  brokerCode?: string;
  salesCode?: string;
  statusId?: number[];
  startDate?: string;
  endDate?: string;
  getDisable?: boolean;
}
export interface TabDetailsRequest {
  customerId: number;
}

export interface GetCatalogueResponse extends APIGetResponse<Catalogue> { }

export interface UploadCatalogRequest {
  brokerCode: string;
  typeId: number;
  salesCode?: string;
  salesDate: string;
  lots: UploadTeaLot[];
}

export interface CatalogueStatus {
  statusId: number;
  statusName: string;
}

export interface CataloguesSummary {
  totalCatalogFiles: number,
  statuses: Statuses[]
}

export interface Statuses {
  statusId: number,
  statusName: "Active" | "Closed",
  count: number
}

export interface CreateCatalogueHeaderForm extends FormValidatorForm {
  catalogueType: FormValidatorField<DropDownOptionDto | null>;
  brokerCode: FormValidatorField<DropDownOptionDto | null>;
  salesCode: FormValidatorField<string | null>;
  salesDate: FormValidatorField<Date | null>;
}

export interface CreateCatalogueLotForm extends FormValidatorForm {
  lotNo: FormValidatorField<string | null>;
  invoiceNo: FormValidatorField<string | null>;
  estateCode: FormValidatorField<string | null>;
  estateName: FormValidatorField<string | null>;
  grade: FormValidatorField<DropDownOptionDto | null>;
  noOfBags: FormValidatorField<number | null>;
  chestType: FormValidatorField<DropDownOptionDto | null>;
  weightOfBag: FormValidatorField<number | null>;
  netQuantity: FormValidatorField<number | null>;
  sackType: FormValidatorField<DropDownOptionDto | null>;
  breakType: FormValidatorField<DropDownOptionDto | null>;
  noOfDeliveryDays: FormValidatorField<number | null>;
  mainBuyer: FormValidatorField<string | null>;
  elevationType: FormValidatorField<DropDownOptionDto | null>;
  allowance: FormValidatorField<number | null>;
  standardType: FormValidatorField<DropDownOptionDto | null>;
  storeAddress: FormValidatorField<string | null>;
  itemType: FormValidatorField<DropDownOptionDto | null>;
  sampleCount: FormValidatorField<number | null>;
  price: FormValidatorField<number | null>
  valueNumber: FormValidatorField<number | null>;
  postingDate: FormValidatorField<Date | null>
  remarks: FormValidatorField<string | null>
  contractNo: FormValidatorField<string | null>
  paymentType: FormValidatorField<DropDownOptionDto | null>;
}

export interface CatalogueTypeList {
  typeId: number,
  typeName: string,
  allowedSalesCode:string
}

export interface CreatedLotDetails {
  catalogueHeader: CreateCatalogueHeaderForm,
  catalogueLot: CreateCatalogueLotForm
}

export interface PostHandleHeaderDto {
  brokerCode: string,
  customerId: number,
  typeId: number,
  salesCode: string,
  salesDate: string
}

export interface AddPayloadLotFormDto {
  data: AddLotFormNewDto,
  isEdit?: boolean
}


export interface CreateCatalogRequest {
  brokerCode: string;
  typeId: number;
  salesCode: string;
  salesDate: string;
  lots: AddLotFormNewDto[];
}

export interface AddLotFormNewDto {
  lotNo: string
  estateCode?: string
  estateName?: string
  invoiceNo?: string
  gradeId?: number
  mainBuyer?: string
  bagsCount: number
  weightPerBag: number
  chestTypeId?: number
  sackTypeId?: number
  breakId?: number
  elevationId?: number
  allowance?: number
  standardId?: number
  storeAddress?: string
  itemCode?: string
  netQuantity?: number
  sampleCount?: number
  price: number
  contractNumber?: string
  value?: number
  postingDate: string
  paymentTypeId: string
  noOfDeliveryDates?: number
  remarks?: string
}


export interface CatalogueChangeLogs {
  lotId: number,
  lotNo: string,
  teaLotHistoryId: number,
  versionNo: number,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
}

export interface ChangeLogsPagination {
  limit?: number;
  page?: number;
}

export interface CatalogueLogsVersionRequest{
  previousVersionNo: number
  currentVersionNo: number
}


export interface CatalogueLogVersions{
  fieldName:string,
  previousValue: string,
  currentValue: string,
}

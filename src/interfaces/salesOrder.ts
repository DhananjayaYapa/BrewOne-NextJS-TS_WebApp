import { FormValidatorForm, FormValidatorField } from "@/utill/common/formValidator";
import { ItemDetail } from "./teaLotById";

export interface SalesOrder {
    salesOrderId: number;
    salesOrderEntryId: number,
    orderDate: string;
    startDate: string;
    dueDate: string;
    customerCode: string;
    productItems: ProductItem[]
}
export interface ProductItem {
    salesContractQuantity: number
    productItemCode: string
}
export interface BOMItemDetail{
    itemCode: string;
    bomItems:BOMItem[]

}
export interface BlendItem{
    type: string;
    code: string;
    description: string;
    plannedQuantity: number;
    quantity: number;
    warehouseCode: string;
    isAlreadyCreated?: boolean // phase 4 new dev
}

export interface Blend{
    salesOrderId: number;
    productItemCode: string;
    masterBlendSheetNo: string;
    totalQuantity: number;
    blendItems:BlendItem[];
}

export interface PackingData{
    salesOrderId: number;
    productItemCode: string;
    blendItems:BlendItem[];
    packingItemDescription?: string
    warehouseCode?: string;
    plannedQuantity?: number;
}


export interface BOMItem{
    isDeletable?: boolean | undefined;
    blendSheetItemId?: number
    code:string
    description:string
    basedQuantity: number
    lots: BOMLot[]
    item?: ItemDetail,
    isNew?: boolean | undefined,
}

export interface BOMLot{
    blendSheetItemLotId?: number;
    fromWarehouseCode: string
    batchId: string
    quantity: number
    price?: number| null
    weightPerBag?: number| null
    boxNo?: string | null
}

export interface LotStock{
    batchId: string
    quantity: number
    requiredQuantity?: number
    boxNo?: string | null
    price?: number | null
    weightPerBag?: number | null
}
export interface BlendWarehouse{
    warehouseCode: string
    lots:LotStock[]
}
export interface WarehouseStock{
    itemCode: string;
    warehouses: BlendWarehouse[]
}

export interface SelectedWarehouseStock{
    index: number;
    itemCode: string;
    fromWarehouse: BlendWarehouse | null
    selectedLot: LotStock |  null
    lotOptions:LotStock[]
    plannedQuantity: number
    remainingQuantity: number
    error: "Exceeded" | "Minimum is planned quantity" | "No Error";
    isToWarehouseRequired: boolean;
    isCollapsed: boolean;
    isNew?: boolean
}

export interface BlendSheetHeaderForm extends FormValidatorForm {
    salesOrderId: FormValidatorField<number | null>;
    productItemCode: FormValidatorField<string | null>;
    blendItemCode: FormValidatorField<string | null>;
    orderDate: FormValidatorField<Date | null>;
    startDate: FormValidatorField<Date | null>;
    dueDate: FormValidatorField<Date | null>;
    customerCode: FormValidatorField<string | null>
    plannedQuantity: FormValidatorField<number>
    actualPlannedQuantity: FormValidatorField<number>
    warehouse: FormValidatorField<string | null>
    remarks: FormValidatorField<string | null>
  }

  export interface PackingSheetHeaderForm extends FormValidatorForm {
    salesOrderId: FormValidatorField<number | null>;
    productItemCode: FormValidatorField<string | null>;
    packingItemCode: FormValidatorField<string | null>;
    orderDate: FormValidatorField<Date | null>;
    startDate: FormValidatorField<Date | null>;
    dueDate: FormValidatorField<Date | null>;
    customerCode: FormValidatorField<string | null>
    plannedQuantity: FormValidatorField<number>
    warehouse: FormValidatorField<string | null>
  }

export interface PackingSheetHeaderForm extends FormValidatorForm {
    salesOrderId: FormValidatorField<number | null>;
    productItemCode: FormValidatorField<string | null>;
    packingItemCode: FormValidatorField<string | null>;
    orderDate: FormValidatorField<Date | null>;
    startDate: FormValidatorField<Date | null>;
    dueDate: FormValidatorField<Date | null>;
    customerCode: FormValidatorField<string | null>
    plannedQuantity: FormValidatorField<number>
    warehouse: FormValidatorField<string | null>
  }




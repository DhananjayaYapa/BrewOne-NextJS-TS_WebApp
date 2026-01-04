export interface GetMasterBlendBalance {
    masterBlendSheetNo: string;
    blendItemCode: string;
    blendBalanceQuantity: number | null;
    blendSheets: {
        blendId: number;
        blendSheetNo: string;
        isSapClosed: boolean;
        statusId: string;
    }[]
}


export interface BlendBalance {
  warehouseCode: string | null
  blendSheetNo: string
  quantity: number,
  price: number,
  batchId: string | null
  typeId: number
  averageWeight: number
  initialQuantity?: number
  isError?: 'Exceeded Stock' | 'Cannot Exceed Blend Quantity' | 'Please Enter Required Quantity' | 'No Error' |'Cannot Exceed Blend Quantitiesss'
  isNew?: boolean
}

export interface BlendBalanceItem{
  availableQuantity: number;
  blendItemCode: string
  batchId: string | null
  warehouseCode: string | null
  masterBlendSheetNo: string
  quantity: number
  price: number
  typeId: number
  averageWeight: number
}
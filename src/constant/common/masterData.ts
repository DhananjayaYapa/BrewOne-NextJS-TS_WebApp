export const MASTER_DATA = {
  BREAK_NAME: {

  }
}

export const WAREHOUSE_TYPES = {
  TO_WAREHOUSE_BLEND_SHEET: 2
}

export const CATALOGUE_TYPES = {
  AUCTION: 1,
  DIRECT: 2,
}

export const ITEM_TYPES = {
  TEA_LOT_ITEMS: 1,
  BLEND_ITEMS: 2,
  PACKING_ITEMS: 3,
}

export const UPLOAD_FORMATS_COLUMNS = {
  BROKER_CODE: "broker_code",
  SALES_CODE: "sales_code",
  SALES_DATE: "sales_date",
  LOT_NO: "lot_no",
  ESTATE_CODE: "estate_code",
  ESTATE_NAME: "estate_name",
  INVOICE_NO: "invoice_no",
  GRADE: "grade",
  NO_OF_BAGS: "no_of_bags",
  CHEST_TYPE: "chest_type",
  ONE_BAG_WEIGHT: "one_bag_weight",
  TOTAL_QUANTITY: "total_quantity",
  PAPER_SACK: "paper_sack",
  BREAK: "break",
  NO_OF_DELIVERY_DATES: "no_of_delivery_dates",
  STORE_ADDRESS: "store_address",
  ALLOWANCE: "allowance",
  ELEVATION: "elevation",
};

export const CATALOGUE_STATUS = {
  UPLOADED: 1,
  SAVED: 2,
  PLANNED: 3,
  PLANNED_GENERATED_PO: 4,
  DELIVERY_ORDER_CREATED: 5,
  DELIVERY_ORDER_COMPLETED: 6,
}


export const BLEND_SHEET_STATUS = {
  PLANNED: 1,
  RELEASED: 2,
  CLOSED: 3,
  ERROR: 5
}

export const PAYMENT_TYPES = {
  URGENT_DO: 1,
  OTHERS: 2
}

export const APPROVAL_STATUS = [
  {
    statusId: -1,
    statusCode: 'PENDING',
    statusName: 'Pending',
  },
  {
    statusId: -1,
    statusCode: 'APPROVED',
    statusName: 'Approved',
  },
  {
    statusId: -1,
    statusCode: 'REJECTED',
    statusName: 'Rejected',
  }
]

export const PACKING_SHEET_STATUS = {
  PLANNED: 1,
  RELEASED: 2,
  CLOSED: 3,
  ERROR: 4
}

export const BLEND_BALANCE_TYPES = [
  {
    label: "BB",
    value: 1,
  },
  {
    label: "TBB",
    value: 2,
  },
  {
    label: "BG",
    value: 3,
  }
]

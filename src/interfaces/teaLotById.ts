export interface TeaLotById {
	lotId: number,
	lotNo: string,
	catalogId: number
	estateCode: string,
	estateName: string,
	gradeCode: string,
	gradeId: number,
	bagCount: number,
	weightPerBag: number,
	netQuantity: number,
	deliveryDatesCount: number,
	boxNo: string,
	itemCode: string,
	itemName: string,
	allowance: number,
	price: number,
	value: number,
	standardId: number,
	standardName: string,
	buyer: string,
	sampleCount: number,
	breakId: number,
	breakName: string,
	elevationId: number,
	elevationName: string,
	chestTypeId: number,
	chestTypeName: string,
	sackTypeId: number,
	sackTypeName: string,
	description?: string,
	remarks: string,
	purchaseOrderId: number,
	purchaseOrderNumber: number,
	statusId: number,
	statusName: string,
	postingDate: string,
	storeAddress: string,
	deliveryOrderId: string,
	invoiceNo: string,
	chestTypeDescription?: string
	contractNumber: string
	paymentTypeId: number,
	paymentType: string,
	approval?: {
		requestId: number | null,
		status: string | null,
		createdBy: string | null,
		createdAt: string | null,
		updatedBy: string | null,
		updatedAt: string | null
	}
}

export interface updateTeaLotDetails {
	// estateCode?: string | null,
	// estateName?: string | null,
	// gradeId?: string | null,
	// bagCount?: number | null,
	// weightPerBag?: number | null,
	// itemCode?: string | null,
	// allowance?: number | null,
	// price?: number | null,/
	// value?: number | null,
	// standardId?: number | null,
	// buyer?: string | null,
	// sampleCount?: number | null,
	// breakId?: number | null,
	// elevationId?: number | null,
	// chestTypeId?: number | null,
	// sackTypeId?: number | null,
	// invoiceNo?: string | null,
	// remarks?: string | null,
	// storeAddress: string | null,
	// postingDate: Date | null,
	// paymentType: number | null,
	// contractNo: string | null
	estateCode?: string | null, //(optional)
    estateName?: string | null, //(optional)
    gradeId?: string | null, //(optional)
    bagCount: number,
    weightPerBag: number,
	itemCode: string,
	allowance?: number | null, //(optional)
	price: number,
	standardId?: number | null, //(optional)
	buyer?: string | null, //(optional)
	sampleCount?: number | null, //(optional)
	breakId?: number | null, //(optional)
	elevationId?: number | null, //(optional)
	chestTypeId?: number | null, //(optional)
	sackTypeId?: number | null, //(optional)
	invoiceNo?: string | null, //(optional)
	remarks?: string | null, //(optional)
	storeAddress?: string | null, //(optional)
	postingDate: Date,
	noOfDeliveryDays?: number | null, //(optional)
	paymentTypeId: number,
	contractNo?: string | null //(optional)
}

export interface MasterData {
	break: Break[],
	chestType: ChestType[],
	elevation: Elevation[],
	itemDetail: ItemDetail[],
	sackType: SackType[],
	standard: Standard[],
	grade: Grade[],
	// estate: Estate[],
	paymentType: Payment[]
}

export interface Break {
	breakId: number,
	breakName: string,
}

export interface ChestType {
	chestTypeId: number,
	chestTypeName: string
	chestTypeDescription: string

}

export interface Elevation {
	elevationId: number,
	elevationName: string
}

export interface ItemDetail {
	itemCode: string,
	itemName: string
}

export interface SackType {
	sackTypeId: number,
	sackTypeName: string
}

export interface Standard {
	standardId: number,
	standardName: string
}

export interface Grade {
	gradeId: number,
	gradeCode: string
}

export interface Estate {
	estateId: number,
	estateCode: string,
	estateName: string
}

export interface Payment {
	paymentTypeId: number,
	paymentType: string
}

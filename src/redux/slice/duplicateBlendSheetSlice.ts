import { ITEM_TYPES } from "@/constant";
import {
    APIGetResponse, Blend, BlendBalance, BlendBalanceItem, BlendItem, BlendSFGItem, BlendSFGItemOptions, BlendSheet, BlendSheetHeaderForm,
    BlendWarehouse, BOMItem, BOMItemDetail, FormIdentifier, GetBlendSheetDetail, GetDuplicatedBlendSheetDetail, OtherBlendItem,
    OtherBOMItemDetail, OtherItemLotStock, PaginationRequest, PreSignedURL, ProductItem, ResponseState, SalesOrder,
    SelectedOtherItemLotStock, SelectedWarehouseStock, Warehouse, WarehouseStock
} from "@/interfaces";
import { GetItemRequest } from "@/interfaces/item";
import { ItemDetail } from "@/interfaces/teaLotById";
import { FORM_VALIDATOR_TYPES } from "@/utill/common/formValidator/const";
import { formFieldValidator } from "@/utill/common/formValidator/main";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createBlendSheet, getBlendBalanceByBlendItem, getBlendDetailBySalesOrderId, getDuplicatedBlendSheetDetail, getItemMasterList,
    getOtherItemMasterList
} from "../action/duplicateBlendSheetAction";
import {
    deleteAttachment, getBlendSheetBalances, getBOMDetailsByBlendItem, getToWarehousesList, getUploadPresignedURL,
    getWarehousesByItemCodes
} from "../action/createBlendSheetAction";
import { getOtherItemLotsByItemCodes } from "../action/editBlendSheetAction";
import { getAllSFGItemsByMasterBlendNo } from "../action/blendAction";

export interface DuplicateBlendSheetSliceState {
    duplicatedBlendSheet: BlendSheet | null;
    getDuplicatedBlendSheetDetailResponse: ResponseState<GetDuplicatedBlendSheetDetail | null> //SHOULD CHANGE
    selectedSalesOrder: SalesOrder | null;
    selectedProduct: ProductItem | null;
    selectedBlendItem: BlendItem | null;
    selectedBlendDetail: Blend | null

    createBlendSheetHeaderForm: BlendSheetHeaderForm
    createBlendSheetResponse: ResponseState<string | undefined>
    blendDetails: Blend | null;

    viewPreSignedURLResponse: ResponseState<PreSignedURL | null>
    uplaodPresignedURL: ResponseState<PreSignedURL | null>
    uploads: { fileKey: string }[]
    deleteAttachmentResponse: ResponseState<string | null>
    deletedAttachments: { fileKey: string }[]

    blendBalanceDetails: ResponseState<BlendSheet[]>
    selectedBlendBalances: BlendBalance[] | null
    getBlendBalanceByBlendItemResponse: ResponseState<BlendBalanceItem[]>
    selectableBlendSheets: string[]
    masterTotalQuantity: number

    warehouseListResponse: ResponseState<WarehouseStock[]>
    selectedWarehouses: SelectedWarehouseStock[]
    itemListRequest: GetItemRequest
    itemListResponse: ResponseState<APIGetResponse<ItemDetail>>
    initialBlendItems: BOMItem[];
    BOMDetails: BOMItemDetail | null;
    BOMItems: BOMItemDetail | null

    otherItemsLotsListResponse: ResponseState<OtherItemLotStock[]>
    selectedOtherItem: SelectedOtherItemLotStock[]
    otherItemsMasterListRequest: GetItemRequest
    otherItemsMasterListResponse: ResponseState<APIGetResponse<ItemDetail>> //sieve
    initialOtherBlendItem: OtherBlendItem[];
    OtherBOMDetails: OtherBOMItemDetail | null
    OtherBOMItems: OtherBOMItemDetail | null
    otherBOMItemsState: boolean

    selectedSFGItems: BlendSFGItem[] //SFG
    getSFGItemsResponse: ResponseState<BlendSFGItemOptions[]>

}

export const initialBlendSheetHeaderForm: BlendSheetHeaderForm = {
    salesOrderId: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
    },
    productItemCode: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
    },
    blendItemCode: {
        value: null,
        type: FORM_VALIDATOR_TYPES.OBJECT,
        isRequired: false,
        disable: false,
    },
    orderDate: {
        value: null,
        type: FORM_VALIDATOR_TYPES.DATE,
        isRequired: true,
        disable: false,
        errorMessages: {
            required: "Select order date",
        },
    },
    startDate: {
        value: null,
        type: FORM_VALIDATOR_TYPES.DATE,
        isRequired: true,
        disable: false,
        errorMessages: {
            required: "Select start date",
        },
    },
    dueDate: {
        value: null,
        type: FORM_VALIDATOR_TYPES.DATE,
        isRequired: true,
        disable: false,
        errorMessages: {
            required: "Select due date",
        },
    },
    customerCode: {
        value: "",
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
        validators: {
            maxLength: 255,
        },
        errorMessages: {
            maxLength: 'Character length should be less than 25',

        },
    },
    plannedQuantity: {
        value: 0,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: true,
        disable: false,
        errorMessages: {
            required: "Enter planned quantity",
        },
    },
    actualPlannedQuantity: {
        value: 0,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: true,
        disable: false,
        errorMessages: {
            required: "Enter planned quantity",
        },
    },
    warehouse: {
        value: null,
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
        errorMessages: {
            required: "Please select a warehouse",
        },

    },
    remarks: {
        value: '',
        type: FORM_VALIDATOR_TYPES.TEXT,
        isRequired: false,
        disable: false,
    },
    totalQuantity: {
        value: 0,
        type: FORM_VALIDATOR_TYPES.NUMBER,
        isRequired: false,
        disable: false,
        errorMessages: {
            required: "Enter total quantity",
        },
    }
};

const initialState: DuplicateBlendSheetSliceState = {
    duplicatedBlendSheet: null, //selected
    itemListRequest: {
        page: 1,
        limit: 100,
        type: ITEM_TYPES.TEA_LOT_ITEMS
    },
    itemListResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            data: []
        }
    },
    getDuplicatedBlendSheetDetailResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: null
    },
    selectedSalesOrder: null,
    createBlendSheetHeaderForm: initialBlendSheetHeaderForm,
    BOMItems: null,
    selectedProduct: null,
    selectedWarehouses: [],

    warehouseListResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    blendDetails: null,
    BOMDetails: null,

    selectedBlendItem: null,
    selectedBlendDetail: null,
    initialBlendItems: [],
    viewPreSignedURLResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: null
    },
    uplaodPresignedURL: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: null
    },
    uploads: [],
    deleteAttachmentResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: null
    },
    deletedAttachments: [],
    blendBalanceDetails: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    selectedBlendBalances: null,
    getBlendBalanceByBlendItemResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    selectableBlendSheets: [],
    masterTotalQuantity: 0,

    otherItemsMasterListRequest: {
        page: 1,
        limit: 100,
        type: ITEM_TYPES.PACKING_ITEMS //rert 3 other items
    },
    initialOtherBlendItem: [],
    otherItemsMasterListResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            data: []
        }
    },
    OtherBOMDetails: null,
    OtherBOMItems: null,
    otherItemsLotsListResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },
    selectedOtherItem: [],
    otherBOMItemsState: false,

    selectedSFGItems: [],
    createBlendSheetResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: undefined
    },
    getSFGItemsResponse: {
        isLoading: false,
        hasError: false,
        isSuccess: false,
        data: []
    },

}

export const duplicateBlendSheetSlice = createSlice({
    name: "duplicateBlendSheet",
    initialState,
    reducers: {
        setDuplicatedBlendSheet: (state, action) => {
            state.duplicatedBlendSheet = action.payload;
        },
        setBlendSheetHeaderFormData: (state, action: PayloadAction<FormIdentifier<any>>) => {

            const fieldName = action.payload.name as keyof typeof state.createBlendSheetHeaderForm;

            const [validatedFormField] = formFieldValidator<string>({
                ...state.createBlendSheetHeaderForm[fieldName],
                value: action.payload.value
            });

            state.createBlendSheetHeaderForm[fieldName] = validatedFormField;
        },
        setSelectedBlendItemCode: (state, action: PayloadAction<BlendItem | null>) => {
            state.selectedBlendItem = action.payload;
        },
        setSelectedEditWarehouses: (state, action) => {
            state.selectedWarehouses = action.payload;
        },
        setSelectedWarehouses: (state, action) => {
            state.selectedWarehouses = action.payload;
        },
        setBomItemDetails: (state, action) => {
            if (state.BOMItems?.bomItems) {
                state.BOMItems.bomItems = action.payload
            }
        },
        setItemMasterListPage: (state, action) => {
            state.itemListRequest.page = action.payload;
        },
        setItemListSearchKey: (state, action) => {
            state.itemListRequest.search = action.payload;
        },
        setItemList: (state, action) => {
            state.itemListResponse.data.data = action.payload;
        },
        setInitialBlendItems: (state, action) => {
            state.initialBlendItems = action.payload
        },

        resetCreateBlendSheet: (state) => {
            state.BOMDetails = initialState.BOMDetails
            state.selectedWarehouses = []
        },
        resetCreateBlendResponse: (state) => {
            state.createBlendSheetResponse = initialState.createBlendSheetResponse
        },
        resetViewPresignedURL: (state) => {
            state.viewPreSignedURLResponse = initialState.viewPreSignedURLResponse
        },
        resetUploadPresignedUrl: (state) => {
            state.uplaodPresignedURL.data = null
        },
        resetWarehouseListResponse: (state) => {
            state.warehouseListResponse.hasError = initialState.warehouseListResponse.hasError
        },
        setUploadFileKeys: (state, action) => {
            state.uploads = action.payload
        },
        setDeletedFileKeys: (state, action) => {
            state.deletedAttachments = action.payload
        },
        setSelectedBlendSheet: (state, action) => {
            state.duplicatedBlendSheet = action.payload;
        },
        setSelectedBlendBalances: (state, action) => {
            state.selectedBlendBalances = action.payload
        },
        resetGetBlendBalanceByItemResponse: (state) => {
            state.getBlendBalanceByBlendItemResponse = initialState.getBlendBalanceByBlendItemResponse
        },
        setSelectableBlendSheets: (state, action: PayloadAction<string[]>) => {
            state.selectableBlendSheets = action.payload
        },
        //other items
        setSelectedOtherItemsEdit: (state, action) => {
            state.selectedOtherItem = action.payload;
        },
        resetOtherItemsLotResponse: (state) => {
            state.otherItemsLotsListResponse.hasError = initialState.otherItemsLotsListResponse.hasError
        },
        setOtherItemMasterListPage: (state, action) => {
            state.otherItemsMasterListRequest.page = action.payload;
        },
        setOtherItemMasterListSearchKey: (state, action) => {
            state.otherItemsMasterListRequest.search = action.payload;
        },
        setOtherItemList: (state, action) => {
            state.otherItemsMasterListResponse.data.data = action.payload;
        },
        setOtherBomItemDetails: (state, action) => {
            if (state.OtherBOMItems?.bomItems) {
                state.OtherBOMItems.bomItems = action.payload
            }
        },
        setInitialOtherBlendItems: (state, action) => {
            state.initialOtherBlendItem = action.payload
        },
        setOtherBOMItemsState: (state, action: PayloadAction<boolean>) => {
            state.otherBOMItemsState = action.payload
        },
        setSelectedSFGItems: (state, action) => {
            state.selectedSFGItems = action.payload;
        },
        resetDuplicateBlendSheetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            //get Blend Sheet By Detail
            .addCase(getDuplicatedBlendSheetDetail.pending, (state) => {
                state.getDuplicatedBlendSheetDetailResponse.hasError = false;
                state.getDuplicatedBlendSheetDetailResponse.isLoading = true;
            })
            .addCase(getDuplicatedBlendSheetDetail.fulfilled, (state, action: PayloadAction<GetBlendSheetDetail>) => {
                state.getDuplicatedBlendSheetDetailResponse.isLoading = false;
                state.getDuplicatedBlendSheetDetailResponse.isSuccess = true;
                state.getDuplicatedBlendSheetDetailResponse.hasError = false;
                state.getDuplicatedBlendSheetDetailResponse.data = action.payload;

                const selectedSalesOrder: SalesOrder = {
                    salesOrderId: action.payload?.salesOrderId,
                    salesOrderEntryId: action.payload.salesOrderEntryId,
                    orderDate: action.payload.orderDate,
                    startDate: action.payload.startDate,
                    dueDate: action.payload.dueDate,
                    customerCode: action.payload.customerCode,
                    productItems: [{
                        productItemCode: action.payload.productItemCode,
                        salesContractQuantity: action.payload.salesContractQuantity
                    }]
                }
                state.selectedSalesOrder = selectedSalesOrder
                state.selectedProduct = selectedSalesOrder.productItems[0]
                const blendItem: BlendItem = {
                    type: action.payload.blendItemType,
                    code: action.payload.blendItemCode,
                    description: action.payload.blendItemDescription,
                    plannedQuantity: action.payload.plannedQuantity,
                    quantity: action.payload.quantity,
                    warehouseCode: action.payload.warehouseCode
                }
                state.selectedBlendItem = blendItem //blend item

                const blendDetail: Blend = {
                    salesOrderId: action.payload.salesOrderId,
                    productItemCode: action.payload.productItemCode,
                    masterBlendSheetNo: action.payload.masterBlendSheetNo,
                    totalQuantity: action.payload.totalQuantity,
                    blendItems: [blendItem]
                }
                state.selectedBlendDetail = blendDetail

                const bomItems: BOMItemDetail = {
                    itemCode: action.payload.blendItemCode,
                    bomItems: action.payload.blendSheetItems
                }
                state.BOMItems = bomItems
                state.initialBlendItems = action.payload.blendSheetItems
                let temp: SelectedWarehouseStock[] = []
                bomItems.bomItems?.forEach((item) => {
                    item.lots.forEach((lot, lotIndex) => {
                        temp.push({
                            index: lotIndex + 1, // Use the lot's position in its array
                            itemCode: item.code, // Convert item code to lowercase
                            fromWarehouse: { warehouseCode: lot.fromWarehouseCode, lots: [] },
                            isToWarehouseRequired: false,
                            selectedLot: {
                                batchId: lot.batchId || "",
                                quantity: lot.quantity,
                                requiredQuantity: lot.quantity,
                                boxNo: lot.boxNo || null,
                                price: lot.price || null,
                                weightPerBag: lot.weightPerBag || null,
                            },
                            lotOptions: [],
                            isCollapsed: false,
                            error: "No Error",
                            plannedQuantity: parseFloat((item.basedQuantity * action.payload.plannedQuantity)?.toFixed(3)),
                            remainingQuantity: 0
                        });
                    });
                });
                state.selectedWarehouses = temp
                state.uploads = action.payload.attachments
                // Coming from view/edit  main api
                // blend balance
                state.selectedBlendBalances = action.payload.blendBalance && action.payload.blendBalance?.length > 0
                    ? action.payload.blendBalance.map(item => ({
                        ...item,
                        initialQuantity: item.quantity,
                        isError: 'No Error'
                    })) : null
                state.masterTotalQuantity = action.payload.quantity

                // other items
                state.initialOtherBlendItem = action.payload.otherBlendItems
                const otherItems: OtherBOMItemDetail = {
                    itemCode: action.payload.blendItemCode,
                    bomItems: action.payload.otherBlendItems
                }
                state.OtherBOMItems = otherItems
                let temp1: SelectedOtherItemLotStock[] = []
                otherItems.bomItems?.forEach((item) => {
                    item.lots.forEach((lot, lotIndex) => {
                        temp1.push({
                            index: lotIndex + 1, // Use the lot's position in its array
                            itemCode: item.code, // Convert item code to lowercase
                            isToWarehouseRequired: false,
                            selectedLot: {
                                batchId: lot.batchId || "",
                                quantity: lot.quantity,
                                requiredQuantity: lot.quantity,
                                price: lot.price,
                                warehouseCode: lot.warehouseCode || "",
                                weightPerBag: lot.weightPerBag
                            },
                            lotOptions: [],
                            isCollapsed: false,
                            error: "No Error",
                            plannedQuantity: 0,
                            remainingQuantity: 0,
                        });
                    });
                });
                state.selectedOtherItem = temp1
                temp1.length > 0 ? state.otherBOMItemsState = true : state.otherBOMItemsState

                //SFG
                state.selectedSFGItems = action?.payload?.blendItems
            })
            .addCase(getDuplicatedBlendSheetDetail.rejected, (state, action) => {
                state.getDuplicatedBlendSheetDetailResponse.isLoading = false;
                state.getDuplicatedBlendSheetDetailResponse.hasError = true;
                state.getDuplicatedBlendSheetDetailResponse.message = action.error.message;
            })

            //get warehouse details
            .addCase(getWarehousesByItemCodes.pending, (state) => {
                state.warehouseListResponse.isLoading = true;
            })
            .addCase(getWarehousesByItemCodes.fulfilled, (state, action) => {
                state.warehouseListResponse.isLoading = false;
                state.warehouseListResponse.isSuccess = true;
                state.warehouseListResponse.data = action.payload;
            })
            .addCase(getWarehousesByItemCodes.rejected, (state, action) => {
                state.warehouseListResponse.isLoading = false;
                state.warehouseListResponse.hasError = true;
                state.warehouseListResponse.message = action.error.message;
            })


            //get item master list
            .addCase(getItemMasterList.pending, (state) => {
                state.itemListResponse.isLoading = true;
            })
            .addCase(getItemMasterList.fulfilled, (state, action) => {
                state.itemListResponse.isLoading = false;
                state.itemListResponse.isSuccess = true;
                // state.salesOrderListResponse.data.data = state.salesOrderListResponse.data.data.concat(action.payload.data);
                state.itemListResponse.data.currentPage = action.payload.currentPage;
                state.itemListResponse.data.totalCount = action.payload.totalCount;
                state.itemListResponse.data.totalPages = action.payload.totalPages;

                if (state.itemListRequest.search !== "" && state.itemListRequest.search !== undefined) {
                    state.itemListResponse.data.data = action.payload.data;
                } else {
                    state.itemListResponse.data.data = state.itemListResponse.data.data.concat(action.payload.data);
                }
            })
            .addCase(getItemMasterList.rejected, (state, action) => {
                state.itemListResponse.isLoading = false;
                state.itemListResponse.hasError = true;
                state.itemListResponse.message = action.error.message;
            })

            //get other item master list
            .addCase(getOtherItemMasterList.pending, (state) => {
                state.otherItemsMasterListResponse.isLoading = true;
            })
            .addCase(getOtherItemMasterList.fulfilled, (state, action) => {
                state.otherItemsMasterListResponse.isLoading = false;
                state.otherItemsMasterListResponse.isSuccess = true;
                state.otherItemsMasterListResponse.data.currentPage = action.payload.currentPage;
                state.otherItemsMasterListResponse.data.totalCount = action.payload.totalCount;
                state.otherItemsMasterListResponse.data.totalPages = action.payload.totalPages;
                const existingItems = new Set(state.OtherBOMItems?.bomItems?.map((item) => item.code))
                if (state.otherItemsMasterListRequest.search !== "" && state.otherItemsMasterListRequest.search !== undefined) {
                    state.otherItemsMasterListResponse.data.data = action.payload.data.filter((item) => !existingItems.has(item.itemCode));
                } else {
                    state.otherItemsMasterListResponse.data.data = state.otherItemsMasterListResponse.data.data
                        .concat(action.payload.data).filter((item) => !existingItems.has(item.itemCode));
                }
            })
            .addCase(getOtherItemMasterList.rejected, (state, action) => {
                state.otherItemsMasterListResponse.isLoading = false;
                state.otherItemsMasterListResponse.hasError = true;
                state.otherItemsMasterListResponse.message = action.error.message;
            })

            //get other items lots details by item code
            .addCase(getOtherItemLotsByItemCodes.pending, (state) => {
                state.otherItemsLotsListResponse.isLoading = true;
            })
            .addCase(getOtherItemLotsByItemCodes.fulfilled, (state, action) => {
                state.otherItemsLotsListResponse.isLoading = false;
                state.otherItemsLotsListResponse.isSuccess = true;
                state.otherItemsLotsListResponse.data = action.payload || [];
            })
            .addCase(getOtherItemLotsByItemCodes.rejected, (state, action) => {
                state.otherItemsLotsListResponse.isLoading = false;
                state.otherItemsLotsListResponse.hasError = true;
                state.otherItemsLotsListResponse.message = action.error.message;
            })

            //create blend sheet
            .addCase(createBlendSheet.pending, (state) => {
                state.createBlendSheetResponse.isLoading = true;
            })
            .addCase(createBlendSheet.fulfilled, (state, action) => {
                state.createBlendSheetResponse.isLoading = false;
                state.createBlendSheetResponse.isSuccess = true;
                state.createBlendSheetResponse.data = action.payload?.message;
            })
            .addCase(createBlendSheet.rejected, (state, action) => {
                state.createBlendSheetResponse.isLoading = false;
                state.createBlendSheetResponse.hasError = true;
                state.createBlendSheetResponse.message = action.error.message;
            })

            //get upload pre signed url
            .addCase(getUploadPresignedURL.pending, (state) => {
                state.uplaodPresignedURL.isLoading = true;
            })
            .addCase(getUploadPresignedURL.fulfilled, (state, action) => {
                state.uplaodPresignedURL.isLoading = false;
                state.uplaodPresignedURL.isSuccess = true;
                state.uplaodPresignedURL.data = action.payload.data

            })
            .addCase(getUploadPresignedURL.rejected, (state, action) => {
                state.uplaodPresignedURL.isLoading = false;
                state.uplaodPresignedURL.hasError = true;
                state.uplaodPresignedURL.message = action.error.message;
            })

            //get delete pre signed url
            .addCase(deleteAttachment.pending, (state) => {
                state.deleteAttachmentResponse.isLoading = true;
            })
            .addCase(deleteAttachment.fulfilled, (state, action) => {
                state.deleteAttachmentResponse.isLoading = false;
                state.deleteAttachmentResponse.isSuccess = true;
                state.deleteAttachmentResponse.data = action.payload.message

            })
            .addCase(deleteAttachment.rejected, (state, action) => {
                state.deleteAttachmentResponse.isLoading = false;
                state.deleteAttachmentResponse.hasError = true;
                state.deleteAttachmentResponse.message = action.error.message;
            })

            //get blend sheet balances
            .addCase(getBlendSheetBalances.pending, (state) => {
                state.blendBalanceDetails.isLoading = true;
            })
            .addCase(getBlendSheetBalances.fulfilled, (state, action) => {
                state.blendBalanceDetails.isLoading = false;
                state.blendBalanceDetails.isSuccess = true;
                state.blendBalanceDetails.data = action.payload.data

            })
            .addCase(getBlendSheetBalances.rejected, (state, action) => {
                state.blendBalanceDetails.isLoading = false;
                state.blendBalanceDetails.hasError = true;
                state.blendBalanceDetails.message = action.error.message;
            })


            //get blend sheet balances
            .addCase(getBlendBalanceByBlendItem.pending, (state) => {
                state.getBlendBalanceByBlendItemResponse.isLoading = true;
                state.getBlendBalanceByBlendItemResponse.hasError = false;
            })
            .addCase(getBlendBalanceByBlendItem.fulfilled, (state, action) => {
                state.getBlendBalanceByBlendItemResponse.isLoading = false;
                state.getBlendBalanceByBlendItemResponse.hasError = false;
                state.getBlendBalanceByBlendItemResponse.isSuccess = true;
                state.getBlendBalanceByBlendItemResponse.data = action.payload || []

            })
            .addCase(getBlendBalanceByBlendItem.rejected, (state, action) => {
                state.getBlendBalanceByBlendItemResponse.isLoading = false;
                state.getBlendBalanceByBlendItemResponse.hasError = true;
                state.getBlendBalanceByBlendItemResponse.message = action.error.message;
            })


            //get SFG Items List by masterBlendSheetNo
            .addCase(getAllSFGItemsByMasterBlendNo.pending, (state) => {
                state.getSFGItemsResponse.isLoading = true
            })
            .addCase(getAllSFGItemsByMasterBlendNo.fulfilled, (state, action) => {
                state.getSFGItemsResponse.isLoading = false;
                state.getSFGItemsResponse.isSuccess = true;
                state.getSFGItemsResponse.data = action.payload;
            })
            .addCase(getAllSFGItemsByMasterBlendNo.rejected, (state, action) => {
                state.getSFGItemsResponse.isLoading = false;
                state.getSFGItemsResponse.hasError = true;
                state.getSFGItemsResponse.message = action.error.message;
            })

    },
});

export const {
    setDuplicatedBlendSheet,
    setSelectedBlendItemCode,
    setSelectedWarehouses,
    setBomItemDetails,
    setBlendSheetHeaderFormData,
    resetCreateBlendSheet,
    resetCreateBlendResponse,
    setItemMasterListPage,
    setItemListSearchKey,
    setItemList,
    setInitialBlendItems,
    resetUploadPresignedUrl,
    resetViewPresignedURL,
    setUploadFileKeys,
    setDeletedFileKeys,
    setSelectedBlendBalances,
    setSelectedEditWarehouses,
    resetWarehouseListResponse,
    setSelectedBlendSheet,
    setSelectableBlendSheets,

    //other items
    setSelectedOtherItemsEdit,
    resetOtherItemsLotResponse,
    setOtherItemMasterListPage,
    setOtherItemMasterListSearchKey,
    setOtherItemList,
    setOtherBomItemDetails,
    setInitialOtherBlendItems,
    setOtherBOMItemsState,
    //sfg
    setSelectedSFGItems,
    resetDuplicateBlendSheetState
} = duplicateBlendSheetSlice.actions;

export default duplicateBlendSheetSlice.reducer;
'use client'

import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { ROUTES } from "@/constant";
import { AppDispatch, RootState } from "@/redux/store";
import { Alert, Button, CircularProgress, Grid, Paper, Tooltip, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    resetCreateBlendResponse, resetCreateBlendSheet, resetOtherItemsLotResponse, resetDuplicateBlendSheetState, resetUploadPresignedUrl, resetViewPresignedURL,
    resetWarehouseListResponse,
    setBlendSheetHeaderFormData, setBomItemDetails, setDeletedFileKeys, setDuplicatedBlendSheet, setInitialBlendItems, setInitialOtherBlendItems, setItemList,
    setItemListSearchKey, setItemMasterListPage, setOtherBomItemDetails, setOtherBOMItemsState, setOtherItemList, setOtherItemMasterListPage,
    setSelectableBlendSheets,
    setSelectedBlendBalances, setSelectedBlendItemCode, setSelectedBlendSheet, setSelectedEditWarehouses, setSelectedOtherItemsEdit, setSelectedSFGItems, setSelectedWarehouses,
    setUploadFileKeys
} from "@/redux/slice/duplicateBlendSheetSlice";
import {
    createBlendSheet, getBlendBalanceByBlendItem, getBlendDetailBySalesOrderId, getDuplicatedBlendSheetDetail, getItemMasterList,
    getOtherItemMasterList
} from "@/redux/action/duplicateBlendSheetAction";
import BlendingSheetHeaderBar from "@/components/blendingSheetManagement/blendingSheet/blendingSheetHeaderBar";
import { calculateAveragePricePerUnit, calculateAverageWeight, calculateTotalAllocatedQuantity, calculateWarehouseQuantity } from "@/utill/blendSheetCalculations";
import { getCurrentUser } from "aws-amplify/auth";
import {
    BlendBalance, BlendBalanceItem, BlendItem, BlendSFGItem, BlendSheet, BlendWarehouse, BOMItem, FileData, LotStock, OtherBlendLotStock, OtherBOMItem, ProductItem, SalesOrder,
    SelectedOtherItemLotStock, SelectedWarehouseStock, UploadAttachment
} from "@/interfaces";
import { deleteAttachment, getBOMDetailsByBlendItem, getToWarehousesList, getUploadPresignedURL, getWarehousesByItemCodes } from "@/redux/action/createBlendSheetAction";
import dayjs, { Dayjs } from "dayjs";
import { ItemDetail } from "@/interfaces/teaLotById";
import { useRouter } from "next/navigation";
import { getOtherItemLotsByItemCodes, getViewPresignedURL } from "@/redux/action/editBlendSheetAction";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import BlendBalanceTable from "@/components/blendingSheetManagement/blendingSheet/blendBalanceTable";
import BlendOtherItemTable from "@/components/blendingSheetManagement/blendingSheet/blendOtherItemTable";
import BlendingSheetBomDetails from "@/components/blendingSheetManagement/blendingSheet/bomDetails";
import BlendSFGTable from "@/components/blendingSheetManagement/blendingSheet/blendSFGTable";
import { getAllSFGItemsByMasterBlendNo } from "@/redux/action/blendAction";

type Props = {
    params: { view: number }
}
export default function DuplicateBlendingSheet({ params }: Props) {
    console.log('testing in duplicate', params)
    const breadcrumbs = [
        {
            id: 1,
            link: "Blending Sheets",
            route: '/blending-sheet',
            icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
        },
        {
            id: 2,
            link: "Duplicate Blending Sheet",
            route: "",
        },
    ];

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    useEffect(() => {
        dispatch(getDuplicatedBlendSheetDetail(params.view));

        return () => {
            dispatch(resetDuplicateBlendSheetState());
        }
    }, []);

    useEffect(() => {
        dispatch(getItemMasterList())
        dispatch(getOtherItemMasterList())

        async function fetchData() {
            try {
                // Get the current user's details
                const user = await getCurrentUser();
                const { signInDetails } = user;
                setUsername(signInDetails?.loginId || "");
            } catch (error) {
                console.error("Error fetching user or dispatching data:", error);
            }
        }

        fetchData()
    }, []);

    const [username, setUsername] = useState<string>("");
    const [attachmentError, setAttachmentError] = useState<string>("");
    const [files, setFiles] = useState<FileData[]>([]);

    const selectedSalesOrder = useSelector((state: RootState) => state.duplicateBlendSheet.selectedSalesOrder)
    const selectedProduct = useSelector((state: RootState) => state.duplicateBlendSheet.selectedProduct)
    const blendDetail = useSelector((state: RootState) => state.duplicateBlendSheet.selectedBlendDetail)
    const blendSheetHeaderForm = useSelector((state: RootState) => state.duplicateBlendSheet.createBlendSheetHeaderForm)
    const BOMItems = useSelector((state: RootState) => state.duplicateBlendSheet.BOMItems)
    const warehouseListResponse = useSelector((state: RootState) => state.duplicateBlendSheet.warehouseListResponse)
    const selectedBlendItem = useSelector((state: RootState) => state.duplicateBlendSheet.selectedBlendItem)
    const initialBlendItems = useSelector((state: RootState) => state.duplicateBlendSheet.initialBlendItems)

    const itemMasterListResponse = useSelector((state: RootState) => state.duplicateBlendSheet.itemListResponse)
    const itemListPagination = useSelector((state: RootState) => state.duplicateBlendSheet.itemListRequest)

    const viewPresignedURL = useSelector((state: RootState) => state.duplicateBlendSheet.viewPreSignedURLResponse)
    const getBlendSheetDetailResponse = useSelector((state: RootState) => state.duplicateBlendSheet.getDuplicatedBlendSheetDetailResponse)

    const selectedWarehouses = useSelector((state: RootState) => state.duplicateBlendSheet.selectedWarehouses)

    //blend state variables
    const getBlendBalanceByBlendItemResponse = useSelector((state: RootState) => state.editBlendSheet.getBlendBalanceByBlendItemResponse)
    const selectedBlendBalances = useSelector((state: RootState) => state.duplicateBlendSheet.selectedBlendBalances)
    const getSelectableBlendSheets = useSelector((state: RootState) => state.duplicateBlendSheet.selectableBlendSheets)
    // const blendSheetAlreadyCreatedError = useSelector((state: RootState) => state.duplicateBlendSheet.blendSheetAlreadyCreatedError)

    //other item state variables
    const otherItemsMasterListPagination = useSelector((state: RootState) => state.duplicateBlendSheet.otherItemsMasterListRequest)
    const otherItemsMasterListResponse = useSelector((state: RootState) => state.duplicateBlendSheet.otherItemsMasterListResponse)
    const otherBOMItems = useSelector((state: RootState) => state.duplicateBlendSheet.OtherBOMItems)
    const selectedOtherItem = useSelector((state: RootState) => state.duplicateBlendSheet.selectedOtherItem)
    const initialOtherBlendItem = useSelector((state: RootState) => state.duplicateBlendSheet.initialOtherBlendItem)
    const otherItemsLotResponse = useSelector((state: RootState) => state.duplicateBlendSheet.otherItemsLotsListResponse)
    const otherBOMItemsState = useSelector((state: RootState) => state.duplicateBlendSheet.otherBOMItemsState)

    //sfg
    const selectedSFGItems = useSelector((state: RootState) => state.duplicateBlendSheet.selectedSFGItems)
    const masterTotalQuantity = useSelector((state: RootState) => state.duplicateBlendSheet.masterTotalQuantity)

    const createBlendSheetResponse = useSelector((state: RootState) => state.duplicateBlendSheet.createBlendSheetResponse);
    const getSelectableSFGItems = useSelector((state: RootState) => state.duplicateBlendSheet.getSFGItemsResponse)

    useEffect(() => {
        if (viewPresignedURL.data) {
            const newTab = window.open(viewPresignedURL.data.url, "_blank");

            if (newTab) {
                newTab.focus();
                dispatch(resetViewPresignedURL())
            }
        }
    }, [viewPresignedURL])


    // useEffect(() => {
    //     if (selectedBlendSheet !== null) {
    //         dispatch(getBlendSheetByDetail())
    //     }
    // }, [selectedBlendSheet])


    useEffect(() => {
        if (getBlendSheetDetailResponse.data?.attachments) {
            const attachments = getBlendSheetDetailResponse.data?.attachments?.map((item) => {
                return {
                    file: null,
                    url: item.fileKey,
                    fileKey: item.fileKey
                }

            })
            setFiles(attachments)
        }
        dispatch(setBlendSheetHeaderFormData({ name: 'salesOrderId', value: getBlendSheetDetailResponse.data?.salesOrderId }))
        dispatch(setBlendSheetHeaderFormData({ name: 'orderDate', value: getBlendSheetDetailResponse.data?.orderDate.toString() }))
        dispatch(setBlendSheetHeaderFormData({ name: 'startDate', value: getBlendSheetDetailResponse.data?.startDate.toString() }))
        dispatch(setBlendSheetHeaderFormData({ name: 'dueDate', value: getBlendSheetDetailResponse.data?.dueDate.toString() }))
        dispatch(setBlendSheetHeaderFormData({ name: 'remarks', value: getBlendSheetDetailResponse.data?.remarks }))
        dispatch(setBlendSheetHeaderFormData({ name: 'customerCode', value: getBlendSheetDetailResponse.data?.customerCode }))

    }, [getBlendSheetDetailResponse])


    useEffect(() => {
        if (selectedSalesOrder !== null) {
            dispatch(setBlendSheetHeaderFormData({ name: 'orderDate', value: selectedSalesOrder?.orderDate?.toString() || '' }))
            dispatch(setBlendSheetHeaderFormData({ name: 'startDate', value: selectedSalesOrder?.startDate?.toString() || '' }))
            dispatch(setBlendSheetHeaderFormData({ name: 'dueDate', value: selectedSalesOrder?.dueDate?.toString() || '' }))
        }
    }, [selectedSalesOrder !== null])

    useEffect(() => {
        dispatch(setBlendSheetHeaderFormData({ name: 'productItemCode', value: selectedProduct?.productItemCode?.toString() || '' }))
    }, [selectedProduct])

    useEffect(() => {

        dispatch(setBlendSheetHeaderFormData({ name: 'warehouse', value: selectedBlendItem?.warehouseCode?.toString() || '' }))
        dispatch(setBlendSheetHeaderFormData({ name: 'actualPlannedQuantity', value: selectedBlendItem?.plannedQuantity || 0 }))

        const blendBalanceSum = selectedBlendBalances && selectedBlendBalances?.length > 0 ? selectedBlendBalances.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
        if (selectedBlendItem) {
            dispatch(getBlendBalanceByBlendItem())
            dispatch(setBlendSheetHeaderFormData({ name: 'plannedQuantity', value: (selectedBlendItem?.plannedQuantity) - blendBalanceSum || 0 }))
        }
    }, [selectedBlendItem])

    useEffect(() => {
        if (BOMItems?.bomItems) {
            dispatch(getWarehousesByItemCodes(BOMItems?.bomItems?.filter((f) => f.code !== "")?.map((i) => i.code)?.toString()))
            dispatch(getToWarehousesList())
        }

    }, [BOMItems?.bomItems])

    useEffect(() => {
        if (warehouseListResponse.data) {
            const updatedBOMItemsStock = selectedWarehouses?.map(item => {
                const itemData = warehouseListResponse?.data?.find(w => w.itemCode === item.itemCode);
                const warehouses = itemData?.warehouses ?? [];
                const lotsLength = warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots?.length || 0
                return {
                    ...item,
                    fromWarehouse:
                        (warehouses?.length <= 1
                            ? warehouses[0]
                            : warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)
                        ) || item.fromWarehouse || null,

                    lotOptions: warehouses.length > 1
                        ? lotsLength > 1
                            ? warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots
                            : warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots[0]
                        : warehouses.find(w1 => w1.warehouseCode === warehouses[0].warehouseCode)?.lots
                        || []
                };
            });

            dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
        }

    }, [warehouseListResponse.data])


    const onPlannedQuantityChange = (value: number) => {
        dispatch(setBlendSheetHeaderFormData({ name: 'plannedQuantity', value: value }))
        dispatch(setBlendSheetHeaderFormData({ name: 'actualPlannedQuantity', value: value }))
        if (value) {
            onPlannedQuantityChangeTotalCalculations(undefined, value)
        }
    }

    const addLot = (itemCode: string, index: number) => {
        const updatedBOMItemsStock = [...selectedWarehouses]

        const previousForm = selectedWarehouses.find(item => item.itemCode === itemCode && item.index === index)
        if (previousForm) {
            updatedBOMItemsStock.push({
                itemCode,
                index: index + 1,
                fromWarehouse: previousForm.fromWarehouse || null,
                selectedLot: null,
                isToWarehouseRequired: false,
                lotOptions: previousForm?.lotOptions?.
                    filter(batch => batch.batchId !== previousForm?.selectedLot?.batchId) || [],
                plannedQuantity: previousForm?.plannedQuantity,
                remainingQuantity: previousForm?.plannedQuantity - (previousForm?.selectedLot?.requiredQuantity || 0),
                error: "No Error", //TODO
                isCollapsed: true,
                isNew: true
            });
            dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
        }
    };

    const onDeleteLot = (itemCode: string, index: number) => {
        const updatedBOMItemsStock = [...selectedWarehouses]
        const indexToDelete = selectedWarehouses.findIndex(
            (item) => item.itemCode === itemCode && item.index === index
        );

        if (indexToDelete !== -1) {
            updatedBOMItemsStock.splice(indexToDelete, 1);
        }
        const updatedBOMItemsStock1 = updatedBOMItemsStock?.map(item =>
            item.itemCode === itemCode
                && item.index !== index
                ? {
                    ...item,
                    error: "Minimum Planned Quantity"
                }
                : item
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock1));
    };


    const onWarehouseSelect = (itemCode: string, value: BlendWarehouse | null, index: number) => {
        if (value) {
            const isMoreExisting = selectedWarehouses?.map(item =>
                item.itemCode === itemCode).length
            if (isMoreExisting > 1) {
                const i = BOMItems?.bomItems?.find(item =>
                    item.code === itemCode);
                const updatedBOMItemsStock = selectedWarehouses.filter(item =>
                    item.itemCode !== itemCode);
                updatedBOMItemsStock.push({
                    index: 1,
                    itemCode: itemCode,
                    fromWarehouse: value,
                    isToWarehouseRequired: false,
                    selectedLot: null,
                    lotOptions: value.lots,
                    plannedQuantity: parseFloat(((i?.basedQuantity || 0) * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
                    remainingQuantity: parseFloat(((i?.basedQuantity || 0) * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
                    error: "Minimum is planned quantity",
                    isCollapsed: false
                });
                dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
            } else {
                const updatedBOMItemsStock = selectedWarehouses?.map(item =>
                    item.itemCode === itemCode
                        && item.index === index
                        ? {
                            ...item,
                            fromWarehouse: value,
                            selectedLot: null,
                            lotOptions: value.lots,
                        }
                        : item
                );
                dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
            }
        }
    };

    const onNestedWarehouseSelect = (
        itemCode: string,
        value: BlendWarehouse | null,
        index: number
      ) => {
        if (!value) return;

        const updatedWarehouses = selectedWarehouses.map((item) =>
          item.itemCode === itemCode && item.index === index
            ? {
              ...item,
              index: index,
              fromWarehouse: value,
              selectedLot: null,
              lotOptions: value.lots,
              plannedQuantity: item.plannedQuantity,
              isToWarehouseRequired: false,
              itemCode: item.itemCode,
              error: "Minimum is planned quantity",
              isCollapsed: true,
            }
            : item
        );

        dispatch(setSelectedEditWarehouses(updatedWarehouses));
    };

    const onToWarehouseSelect = (itemCode: string, value: BlendWarehouse | null, index: number) => {
        // if (value) {
        const updatedBOMItemsStock = selectedWarehouses?.map(item =>
            item.itemCode === itemCode
                ? {
                    ...item,
                    isToWarehouseRequired: value ? false : true,
                }
                : item
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));

        // }
    };

    const setOpen = (value: boolean, itemCode: string, index: number) => {

        const updatedBOMItemsStock = selectedWarehouses?.map(item =>
            item.itemCode === itemCode
                ? {
                    ...item,
                    isCollapsed: !value
                }
                : item
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    };

    const onLotSelect = (itemCode: string, value: LotStock | null, warehouse: BlendWarehouse | null, index: number) => {
        if (warehouse) {
            let val: LotStock | null = null
            if (value) {
                val = {
                    batchId: value?.batchId,
                    quantity: value?.quantity,
                    requiredQuantity: 0,
                    boxNo: value?.boxNo,
                    price: value?.price,
                    weightPerBag: value?.weightPerBag
                }
            }
            const totalQuantity = parseFloat((selectedWarehouses
                .filter(item => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
                .reduce((sum, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0))?.toFixed(3));

            const updatedBOMItemsStock = selectedWarehouses?.map(item =>
                item.itemCode === itemCode
                    && item.index === index
                    ? {
                        ...item,
                        selectedLot: val,
                        error: "Minimum is planned quantity"
                    }
                    : item
            );
            dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
        }
    }

    const isError = (requiredQuantity: number, plannedQuantity: number, lotQuantity: number, totalQuantity: number)  => {

    let err = "No Error";

    if (blendSheetHeaderForm.plannedQuantity.value < 1) {
      if (requiredQuantity > lotQuantity) {
        err = "Exceeded";
      }else if(requiredQuantity === 0){
         err = "Minimum is planned quantity";
      } else {
        err = "No Error";
      }
    } else {
      if (requiredQuantity > lotQuantity) {
        err = "Exceeded";
      } else if (requiredQuantity + totalQuantity < plannedQuantity) {
        err = "Minimum is planned quantity";
      }
      else {
        err = "No Error";
      }
    }

    return err;
  };



    const isOtherError = (plannedQuantity: number, totalQuantity: number, lotQuantity: number, requiredQuantity: number) => {
        let err = "No Error";

        if (blendSheetHeaderForm.plannedQuantity.value < 1) {

            if (requiredQuantity > lotQuantity) {
                err = "Exceeded"
            } else if (requiredQuantity === 0) {
                err = "Minimum is planned quantity";
            } else {
                err = "No Error";
            }
        } else {
            if (plannedQuantity > totalQuantity) {
                err = "Minimum is planned quantity";
            }
            else {
                err = "No Error";
            }
        }

        return err;
    };

    const onEnterRequiredQuantity = (requiredQuantity: number, itemCode: string, warehouse: BlendWarehouse | null, lot: LotStock | null, index: number, plannedQuantity: number) => {
        if (warehouse && lot) {
            const value: LotStock = {
                batchId: lot.batchId,
                quantity: lot.quantity,
                requiredQuantity: requiredQuantity,
                boxNo: lot.boxNo,
                price: lot.price,
                weightPerBag: lot.weightPerBag
            }
            const totalQuantity = parseFloat((selectedWarehouses
                .filter(item => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
                .reduce((sum, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0))?.toFixed(3));


            const lotQuantity = parseFloat(((warehouseListResponse.data.find(o => o.itemCode === itemCode)?.warehouses?.find(w => w.lots)
                ?.lots?.find(l => l.batchId === lot.batchId)?.quantity || 0) +
                (BOMItems?.bomItems
                    ?.find((e: { code: string; }) => e.code === itemCode)?.lots
                    ?.find(l => l.batchId === lot?.batchId)?.quantity || 0))?.toFixed(3))

            const updatedBOMItemsStock = selectedWarehouses?.map(item =>
                item.itemCode === itemCode
                    ? item.index === index
                        ? {
                            ...item,
                            selectedLot: value,
                            remainingQuantity: item.plannedQuantity - requiredQuantity,
                            error: isError(
                                blendSheetHeaderForm.plannedQuantity.value < 1 ? (item.selectedLot?.requiredQuantity !== undefined ? item.selectedLot.requiredQuantity : 0) : requiredQuantity || 0,
                                plannedQuantity,
                                lotQuantity,
                                totalQuantity),
                        }
                        : {
                            ...item,
                            error: isOtherError(parseFloat(blendSheetHeaderForm.plannedQuantity.value?.toFixed(3)),totalQuantity + requiredQuantity, lotQuantity, requiredQuantity)
                        }
                    : item // question: used or unused?
            );
            dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));

        }
    }

    const cancelPlan = () => {
        dispatch(setSelectedBlendSheet(null))
        dispatch(setSelectedEditWarehouses([]))
        dispatch(setSelectedOtherItemsEdit([]))
        router.back()
    };

    const onOrderDateChange = (date: Dayjs | null) => {
        dispatch(setBlendSheetHeaderFormData({ name: 'orderDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
    }

    const onStartDateChange = (date: Dayjs | null) => {
        dispatch(setBlendSheetHeaderFormData({ name: 'startDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
    }

    const onDueDateChange = (date: Dayjs | null) => {
        dispatch(setBlendSheetHeaderFormData({ name: 'dueDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
    }

    const onRemarksChange = (remark: string) => {
        dispatch(setBlendSheetHeaderFormData({ name: 'remarks', value: remark }))
    }

    const addNewItem = () => {
        //TODO
        if (itemMasterListResponse.data.data?.length > 0) {
            const existingItems = new Set(BOMItems?.bomItems?.map(item => item.code));
            const allItems = [...itemMasterListResponse.data.data]
            const filteredItems = allItems.filter((item) => !existingItems.has(item.itemCode))
            dispatch(setItemList(filteredItems))
        }

        const newItem: BOMItem = {
            // blendSheetItemId: (BOMItems?.bomItems?.length || 0) + 1,
            code: "",
            description: "",
            basedQuantity: 0,

            lots: [],
            isNew: true,
            isDeletable: true
        }
        if (BOMItems?.bomItems && BOMItems?.bomItems?.length > 0) {
            const temp = [...BOMItems?.bomItems]
            const temp1 = temp.concat(newItem)
            console.log(temp1, 'temp1')
            dispatch(setBomItemDetails(temp1))
        } else {
            dispatch(setBomItemDetails([newItem]))
        }
    };

    const onItemSelect = (value: ItemDetail | null, index: number) => {
        const previousItemCode = BOMItems?.bomItems.find(item =>
            item.blendSheetItemId === (index + 1))?.code
        const updatedBOMItem = BOMItems?.bomItems?.map(item =>
            item.code === previousItemCode || item.code === ""
                ? {
                    ...item,
                    code: value ? value?.itemCode : "",
                    description: value ? value?.itemName : "",
                    item: value || null,
                    basedQuantity: 0
                }
                : item
        );

        dispatch(setBomItemDetails(updatedBOMItem))

        if (value) {
            const itemList = [...itemMasterListResponse.data.data]

            dispatch(setItemList(itemList.filter(item => item.itemCode !== value.itemCode)))

            const tempW = [...selectedWarehouses]
            const stock: SelectedWarehouseStock = {
                index: 1,
                itemCode: value?.itemCode || "",
                isToWarehouseRequired: false,
                fromWarehouse: null,
                selectedLot: null,
                lotOptions: [],
                plannedQuantity: 0,
                remainingQuantity: 0,
                error: "Minimum is planned quantity",
                isCollapsed: false

            }
            let tempw1 = tempW.concat(stock).filter(item => item.itemCode !== previousItemCode)

            dispatch(setSelectedEditWarehouses(tempw1))

        }
    }

    const onBasedQuantityChange = (itemCode: string, value: number) => {
        const updatedBOMItem = BOMItems?.bomItems?.map(item =>
            item.code === itemCode
                ? {
                    ...item,
                    basedQuantity: value,
                }
                : item
        );
        dispatch(setBomItemDetails(updatedBOMItem))

        const updatedBOMItemsStock = selectedWarehouses?.map(item =>
            item.itemCode === itemCode
                ? {
                    ...item,
                    plannedQuantity: parseFloat((value * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
                }
                : item
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
    const deleteBlendItem = (row: BOMItem) => {
        const updatedBOMItem = BOMItems?.bomItems.filter(item =>
            item.code !== row.code
        );

        dispatch(setBomItemDetails(updatedBOMItem))
        dispatch(setInitialBlendItems(updatedBOMItem))
        const updatedBOMItemsStock = selectedWarehouses.filter(item =>
            item.itemCode !== row.code
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
        const itemList = [...itemMasterListResponse.data.data]
        const item: ItemDetail = {
            itemCode: row.code,
            itemName: row.description
        }
        dispatch(setItemList(itemList.concat(item)))

    }

    const onItemSearchOptions = (value: string) => {
        dispatch(setItemListSearchKey(value))
        if (itemListPagination?.page && itemMasterListResponse?.data?.totalPages > itemListPagination?.page && value !== "") {
            dispatch(setItemMasterListPage(1))
            dispatch(getItemMasterList());
        }
    }

    const onItemListFetchOptions = () => {
        if (itemListPagination?.page && itemMasterListResponse.data.totalPages > itemListPagination?.page) {
            dispatch(setItemMasterListPage(itemListPagination?.page + 1))
            dispatch(getItemMasterList());
        }
    };

    const viewFile = (fileKey: string) => {
        dispatch(getViewPresignedURL(fileKey))
    }
    const uploadPresignedURLResponse = useSelector(
        (state: RootState) => state.editBlendSheet.uplaodPresignedURL
    )
    const uploadFileKeys = useSelector(
        (state: RootState) => state.editBlendSheet.uploads
    )

    const deletedAttachments = useSelector(
        (state: RootState) => state.editBlendSheet.deletedAttachments
    )

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            if (files.some(x => x.file?.name === file.name)) {
                setAttachmentError("Cannot upload files with same name")
            } else {
                setAttachmentError("")
                const fileT = {
                    file: file,
                    url: URL.createObjectURL(file)
                }
                setFiles(files.concat(fileT))
                const attachment: UploadAttachment = {
                    filename: file.name,
                    filetype: file.type
                }
                dispatch(getUploadPresignedURL(attachment))
            }
        }
    };
    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            if (files.some(x => x.file?.name === file.name)) {
                setAttachmentError("Cannot upload files with same name")
            } else {
                setAttachmentError("")
                const fileT = {
                    file: file,
                    url: URL.createObjectURL(file)
                }
                setFiles(files.concat(fileT))
                const attachment: UploadAttachment = {
                    filename: file.name,
                    filetype: file.type
                }
                dispatch(getUploadPresignedURL(attachment))
            }
        }
    };

    const uploadObjectToS3 = async (file: FileData) => {

        try {
            if (uploadPresignedURLResponse.data?.url && file.file) {
                await fetch(uploadPresignedURLResponse.data?.url, {
                    method: 'PUT',
                    body: file?.file,
                    headers: {
                        'Content-Type': file?.file?.type,
                    },
                });

                dispatch(setUploadFileKeys(uploadFileKeys.concat({ fileKey: uploadPresignedURLResponse?.data?.fileKey })))
                dispatch(resetUploadPresignedUrl())
                console.log('success s3',)
            }
        } catch (error) { /* empty */
            console.log('failed s3')

        }
    };
    useEffect(() => {
        if (uploadPresignedURLResponse.data) {
            uploadObjectToS3(files[files.length - 1])
        }
    }, [uploadPresignedURLResponse.data])

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        if (uploadFileKeys[indexToRemove]) {
            const deletedAttachment = uploadFileKeys[indexToRemove]
            dispatch(setDeletedFileKeys(deletedAttachments?.concat(deletedAttachment)))
            dispatch(setUploadFileKeys(uploadFileKeys.filter((_, index) => index !== indexToRemove)));
        }
    };

    useEffect(() => {
        if (viewPresignedURL.hasError) {
            setTimeout(() => {
                dispatch(resetViewPresignedURL())
            }, 5000);
        }
    }, [viewPresignedURL.hasError])

    useEffect(() => {
        if (uploadPresignedURLResponse.hasError) {
            setTimeout(() => {
                dispatch(resetUploadPresignedUrl())
            }, 5000);
        }
    }, [uploadPresignedURLResponse.hasError])

    useEffect(() => {
        if (warehouseListResponse.hasError) {
            setTimeout(() => {
                dispatch(resetWarehouseListResponse())
            }, 5000);
        }
    }, [warehouseListResponse])

    const onPlannedQuantityChangeTotalCalculations = (blendBalancesParam?: BlendBalance[], blendQuantity?: number) => {
        const blendBalance = blendBalancesParam || selectedBlendBalances
        const actualBlendQuantity = blendQuantity || blendSheetHeaderForm.actualPlannedQuantity.value

        const blendBalanceTotal = blendBalance?.reduce((sum: number, item) => sum + (item.quantity || 0), 0) || 0
        const otherBOMItems = selectedOtherItem?.reduce((sum: number, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0) || 0
        const sfgItems = selectedSFGItems?.reduce((sum: number, item) => sum + (item.quantity || 0), 0) || 0

        const updatedPlanned = actualBlendQuantity - (blendBalanceTotal + otherBOMItems + sfgItems)
        dispatch(setBlendSheetHeaderFormData({ name: "plannedQuantity", value: updatedPlanned }));
        onResetBOMItemsLot(updatedPlanned)
    }

    const onResetBOMItemsLot = (updatedPlanned?: number) => {
        const getBasedQuantity = (itemCode: string) => {
            const master = BOMItems?.bomItems.find(b => b.code === itemCode);
            return master ? (master.basedQuantity || 0) : 0;
        };
        const updatedBOMItemsStock = selectedWarehouses?.map((item, index) => {
            if (!item.itemCode) return item;

            const sameItems = selectedWarehouses.filter(
                i => i.itemCode === item.itemCode
            );

            const totalQuantity = sameItems.reduce(
                (sum, i) => sum + (i.selectedLot?.requiredQuantity || 0),
                0
            );

            const baseQuantity = getBasedQuantity(item.itemCode) || 0
            const planned = updatedPlanned || blendSheetHeaderForm.plannedQuantity.value

            const plannedQuantity = baseQuantity * planned

            const requiredQuantity = item.selectedLot?.requiredQuantity || 0;
            const lotQuantity = item.selectedLot?.quantity || 0;

            let error = "No Error";

            if (plannedQuantity < 1) { //NEW CASE
                if (requiredQuantity > lotQuantity) {
                    error = "Exceeded";
                } else if (requiredQuantity === 0) {
                    error = "Minimum is planned quantity";
                }
            } else {
                if (requiredQuantity > lotQuantity) {
                    error = "Exceeded"; // individual lot exceeds available
                } else if (totalQuantity < plannedQuantity) {
                    error = "Minimum is planned quantity"; // total across all lots < planned
                }
            }

            return {
                ...item,
                selectedLot: { ...item.selectedLot },
                error,
            };


        });
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }

    const createBlendSheetPlan = () => {
        dispatch(createBlendSheet());
    }

    const handleClose = () => {
        if (createBlendSheetResponse.isSuccess) {
            router.push(`/${ROUTES.BLENDING_SHEETS}`);
        }
    }

    useEffect(() => {
        if (createBlendSheetResponse.hasError) {
            setTimeout(() => {
                dispatch(resetCreateBlendResponse())
            }, 2000)
        }
    }, [createBlendSheetResponse])

    // #region Blend Balance
    // const onSelectItemType = (value: number, rowId: number) => {

    //     //api response sheets having particular types
    //     const selectableBlendSheets = getBlendBalanceByBlendItemResponse.data.filter((item: BlendBalanceItem) =>
    //         item.typeId === value).map(item => item.masterBlendSheetNo)

    //     const alreadySelectedBlendSheets = selectedBlendBalances?.filter(
    //         (item, index, self) =>
    //             index ===
    //             self.findIndex((obj) => obj.blendSheetNo === item.blendSheetNo && (!obj?.warehouseCode || obj?.warehouseCode === item?.warehouseCode)))
    //         .map((item) => item.blendSheetNo)

    //     const unusedBlendBal = selectableBlendSheets?.filter(blendNo => !alreadySelectedBlendSheets?.includes(blendNo))

    //     const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
    //         if (idx === rowId) {
    //             return {
    //                 warehouseCode: "",
    //                 blendSheetNo: "",
    //                 batchId: "",
    //                 quantity: 0,
    //                 price: 0,
    //                 typeId: value,

    //             };
    //         } else {
    //             return item;
    //         }
    //     })

    //     dispatch(setSelectedBlendBalances(updatedBlendBalance))
    //     dispatch(setSelectableBlendSheets(unusedBlendBal))
    // }

    // new duplicate onSelectItemType function
    const onSelectItemType = (value: number, rowId: number) => {
    // Get all blend sheets for the selected type
    const selectableBlendSheetsByType = getBlendBalanceByBlendItemResponse.data.filter(
        (item: BlendBalanceItem) => item.typeId === value
    ).map(item => item.masterBlendSheetNo);

    // Get already selected blend sheets (excluding the current row being edited)
    // Use the same duplicate detection logic as before, but only for the same type
    const alreadySelectedBlendSheets = selectedBlendBalances
        ?.filter((item, index) => index !== rowId && item.typeId === value) // Exclude current row AND only same type
        ?.filter(
        (item, index, self) =>
            index ===
            self.findIndex(
            (obj) =>
                obj.blendSheetNo === item.blendSheetNo &&
                (!obj?.warehouseCode || obj?.warehouseCode === item?.warehouseCode)
            )
        )
        .map((item) => item.blendSheetNo)
        .filter(sheetNo => sheetNo !== "" && sheetNo !== null);

    // Get unused blend sheets - sheets that are available for this type AND not already selected in other rows OF THE SAME TYPE
    const unusedBlendBal = selectableBlendSheetsByType?.filter(
        blendNo => !alreadySelectedBlendSheets?.includes(blendNo)
    );

    // Update the current row with the selected type and reset other fields
    const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
        if (idx === rowId) {
        return {
            warehouseCode: "",
            blendSheetNo: "",
            batchId: "",
            quantity: 0,
            price: 0,
            typeId: value,
            averageWeight: 0
        };
        } else {
        return item;
        }
    });

    dispatch(setSelectedBlendBalances(updatedBlendBalance));
    dispatch(setSelectableBlendSheets(unusedBlendBal || []));
    };

    // const onBlendBalanceQuantityChange = (value: BlendBalance, quantity: number) => {
    //     const isErrorValu = isBlendBalanceError(quantity,
    //         getBlendBalanceByBlendItemResponse?.data?.find(m => m.masterBlendSheetNo === value.blendSheetNo)?.quantity || 0)
    //     const updatedBlendBalance = selectedBlendBalances?.map(item =>
    //         item.blendSheetNo === value.blendSheetNo
    //             ? {
    //                 ...item,
    //                 quantity: quantity,
    //                 isError: isErrorValu
    //             }
    //             : item
    //     );
    //     dispatch(setSelectedBlendBalances(updatedBlendBalance));
    //     if (isErrorValu === "No Error" && !isNaN(quantity)) {
    //         const blendBalance = updatedBlendBalance?.map(({ isError, ...rest }) => rest)
    //         onPlannedQuantityChangeTotalCalculations(blendBalance);
    //     }
    // }

    // const onBlendSheetBalanceSelect = (blendSheetNo: string, rowId: number) => {
    //     const blendSheet = getBlendBalanceByBlendItemResponse.data.find(item => item.masterBlendSheetNo === blendSheetNo)
    //     const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
    //         if (idx !== rowId) return item;
    //         if (!blendSheet) return item;
    //         return {
    //             ...item,
    //             blendSheetNo: blendSheet?.masterBlendSheetNo,
    //             batchId: blendSheet?.batchId,
    //             // quantity: blendSheet?.quantity,
    //             initialQuantity: blendSheet?.quantity,
    //             price: blendSheet?.price,
    //             typeId: blendSheet?.typeId,
    //             warehouseCode: blendSheet?.warehouseCode,
    //             averageWeight: blendSheet?.averageWeight
    //         };
    //     });
    //     dispatch(setSelectedBlendBalances(updatedBlendBalance));
    // }

    // new duplicate onBlendBalanceQuantityChange function
      const onBlendBalanceQuantityChange = (value: BlendBalance, quantity: number) => {
      // Find the blend sheet data that matches BOTH masterBlendSheetNo AND typeId
        const blendSheetData = getBlendBalanceByBlendItemResponse?.data?.find(
          m => m.masterBlendSheetNo === value.blendSheetNo && m.typeId === value.typeId
        );

        const availableQuantity = blendSheetData?.quantity || 0;
        const isErrorValu = isBlendBalanceError(quantity, availableQuantity);

        const updatedBlendBalance = selectedBlendBalances?.map(item =>
          item.blendSheetNo === value.blendSheetNo && item.typeId === value.typeId
            ? {
                ...item,
                quantity: quantity,
                isError: isErrorValu
              }
            : item
        );

        dispatch(setSelectedBlendBalances(updatedBlendBalance));

        if (isErrorValu === "No Error" && !isNaN(quantity)) {
          const blendBalance = updatedBlendBalance?.map(({ isError, ...rest }) => rest)
          onPlannedQuantityChangeTotalCalculations(blendBalance);
        }
      }

    // new duplicate onBlendSheetBalanceSelect function
    const onBlendSheetBalanceSelect = (blendSheetNo: string, rowId: number) => {
    const currentRowType = selectedBlendBalances?.[rowId]?.typeId;

    const blendSheet = getBlendBalanceByBlendItemResponse.data.find(
        (item) => item.masterBlendSheetNo === blendSheetNo &&
        item.typeId === currentRowType
    );

    const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
        if (idx !== rowId) return item;
        if (!blendSheet) return item;
        return {
        ...item,
        blendSheetNo: blendSheet?.masterBlendSheetNo,
        batchId: blendSheet?.batchId,
        initialQuantity: blendSheet?.quantity,
        price: blendSheet?.price,
        typeId: blendSheet?.typeId,
        warehouseCode: blendSheet?.warehouseCode,
        isError: 'Please Enter Required Quantity'
        };
    });
    dispatch(setSelectedBlendBalances(updatedBlendBalance));
    };

    const isBlendBalanceError = (quantity: number, stock: number) => {
        let errorValue = 'No Error'

        if (selectedBlendBalances) {
            if (quantity > stock) {
                errorValue = 'Exceeded Stock'

            } else if (isNaN(quantity) || quantity === 0) {
                errorValue = 'Please Enter Required Quantity'

            } else {

            }
        }
        return errorValue
    }

    //TODO: Check
    // const onDeleteBlendBalace = (value: BlendBalance, rowId: number) => {
    //     const updatedBlendBalance = selectedBlendBalances?.filter((item, index) => index !== rowId)
    //     const deletedBlendBalance = selectedBlendBalances?.filter(f => f.blendSheetNo === value.blendSheetNo && f.typeId === value.typeId &&
    //                     f.warehouseCode === value.warehouseCode).reduce((accumulator, currentVal) => accumulator + (!isNaN(currentVal.quantity) ? currentVal.quantity : 0), 0)

    //     const updatedPlannedQuantity = blendSheetHeaderForm.plannedQuantity.value + (deletedBlendBalance || 0)

    //     if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
    //         dispatch(setBlendSheetHeaderFormData({
    //             name: 'plannedQuantity', value: updatedPlannedQuantity
    //         }))
    //     }
    //     if (updatedBlendBalance && updatedBlendBalance?.length <= 0) {
    //         dispatch(setSelectedBlendBalances(null));
    //     } else {
    //         dispatch(setSelectedBlendBalances(updatedBlendBalance));
    //     }
    //     onResetBOMItemsLot(updatedPlannedQuantity);
    // }

    // new duplicate onDeleteBlendBalace function
      const onDeleteBlendBalace = (value: BlendBalance, rowId: number) => {
        const updatedBlendBalance = selectedBlendBalances?.filter((item, index) => index !== rowId);

        const deletedBlendBalance = selectedBlendBalances
          ?.filter(
            (f) =>
              f.blendSheetNo === value.blendSheetNo &&
              f.typeId === value.typeId &&
              f.warehouseCode === value.warehouseCode
          )
          .reduce(
            (accumulator, currentVal) =>
              accumulator + (!isNaN(currentVal?.quantity) ? currentVal?.quantity : 0),
            0
          );

        const updatedPlannedQuantity = blendSheetHeaderForm?.plannedQuantity?.value + (deletedBlendBalance || 0);

        if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
          dispatch(
            setBlendSheetHeaderFormData({
              name: 'plannedQuantity',
              value: updatedPlannedQuantity
            })
          );
        }

        if (updatedBlendBalance && updatedBlendBalance?.length <= 0) {
          dispatch(setSelectedBlendBalances(null));
        } else {
          dispatch(setSelectedBlendBalances(updatedBlendBalance));
        }

        onResetBOMItemsLot(updatedPlannedQuantity);
      };

    const addNewBlendBalance = () => {
        const intialBlendBalance: BlendBalance[] = [{
            warehouseCode: "",
            blendSheetNo: "",
            batchId: "",
            quantity: 0,
            price: 0,
            typeId: 0,
            averageWeight: 0,
        }]
        if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
            dispatch(setSelectedBlendBalances(selectedBlendBalances?.concat(intialBlendBalance)))
        } else {
            dispatch(setSelectedBlendBalances(intialBlendBalance))
        }
    };

    // #region other items
    const selectedOtherItemTotal = useMemo(() => {
        return selectedOtherItem.reduce((sum, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0);
    }, [selectedOtherItem]);

    useEffect(() => {
        if (selectedOtherItemTotal > 0) {
            onPlannedQuantityChangeTotalCalculations()
        }
    }, [selectedOtherItemTotal, selectedOtherItem])


    useEffect(() => {
        if (otherItemsLotResponse.data) {
            const updatedBOMItemsStock = selectedOtherItem?.map(item => {
                const itemData = otherItemsLotResponse?.data?.find(w => w.itemCode === item.itemCode);
                const lotOptions = itemData?.lots

                return {
                    ...item,
                    lotOptions: lotOptions || []
                }
            });

            dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
        }
    }, [otherItemsLotResponse.data])

    //Check 3, when item gets selected this get's triggered it in view, initial setup
    useEffect(() => {
        if (otherBOMItems?.bomItems) {
            dispatch(getOtherItemLotsByItemCodes(otherBOMItems?.bomItems?.filter((f) => f.code !== "")?.map((i) => i.code)?.toString()))
        }
    }, [otherBOMItems?.bomItems])

    useEffect(() => {
        if (otherItemsLotResponse.hasError) {
            setTimeout(() => {
                dispatch(resetOtherItemsLotResponse())
            }, 5000);
        }
    }, [otherItemsLotResponse])

    const addNewOtherItem = () => {
        dispatch(setOtherBOMItemsState(true))
        if (otherItemsMasterListResponse.data.data?.length > 0) {
            const existingItems = new Set(otherBOMItems?.bomItems?.map(item => item.code));
            const allItems = [...otherItemsMasterListResponse.data.data]
            const filteredItems = allItems.filter((item) => !existingItems.has(item.itemCode))
            dispatch(setOtherItemList(filteredItems))
        }

        const newItem: OtherBOMItem = {
            // blendSheetItemId: (BOMItems?.bomItems?.length || 0) + 1,
            code: "",
            description: "",
            lots: []

        }
        if (otherBOMItems?.bomItems && otherBOMItems?.bomItems?.length > 0) {
            const temp = [...otherBOMItems?.bomItems]
            const temp1 = temp.concat(newItem)
            dispatch(setOtherBomItemDetails(temp1))
        } else {
            dispatch(setOtherBomItemDetails([newItem]))
        }
    };

    const onOtherItemsOpen = (value: boolean, itemCode: string, index: number) => {

        const updatedBOMItemsStock = selectedOtherItem?.map(item =>
            item.itemCode === itemCode
                ? {
                    ...item,
                    isCollapsed: !value
                }
                : item
        );
        dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    };

    const addOtherItemLot = (itemCode: string, index: number) => {
        const updatedBOMItemsStock = [...selectedOtherItem]

        const previousForm = selectedOtherItem.find(item => item.itemCode === itemCode && item.index === index)
        if (previousForm) {
            updatedBOMItemsStock.push({
                itemCode,
                index: index + 1,
                selectedLot: null,
                isToWarehouseRequired: false,
                lotOptions: previousForm?.lotOptions?.
                    filter(batch => batch.batchId !== previousForm?.selectedLot?.batchId) || [],
                plannedQuantity: previousForm?.plannedQuantity,
                remainingQuantity: 0,
                error: "No Error", //TODO
                isCollapsed: true
            });
            dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
        }
    };

    const onDeleteOtherItemLot = (itemCode: string, index: number) => {
        const updatedBOMItemsStock = [...selectedOtherItem]
        const indexToDelete = selectedOtherItem.findIndex(
            (item) => item.itemCode === itemCode && item.index === index
        );

        if (indexToDelete !== -1) {
            updatedBOMItemsStock.splice(indexToDelete, 1);
        }
        const updatedBOMItemsStock1 = updatedBOMItemsStock?.map(item =>
            item.itemCode === itemCode
                && item.index !== index
                ? {
                    ...item,
                    error: "Minimum Planned Quantity"
                }
                : item
        );
        dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock1));
    };

    const onOtherItemLotSelect = (itemCode: string, value: OtherBlendLotStock | null, index: number) => {
        let val: OtherBlendLotStock | null = null
        if (value) {
            val = {
                batchId: value?.batchId,
                quantity: value?.quantity,
                requiredQuantity: 0,
                boxNo: value?.boxNo,
                price: value?.price,
                weightPerBag: value?.weightPerBag,
                warehouseCode: value?.warehouseCode
            }
        }

        const updatedBOMItemsStock = selectedOtherItem?.map(item =>
            item.itemCode === itemCode
                && item.index === index
                ? {
                    ...item,
                    selectedLot: val,
                    error: "Should be greater than 0"
                }
                : item
        );
        dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    }

    const otherItemQuantityError = (requiredQuantity: number, lot: OtherBlendLotStock | undefined): string => {
        let err = "No Error"
        if (lot) {
            if (requiredQuantity > lot?.quantity) {
                err = "Exceeded"
            }
            if (requiredQuantity === 0) {
                err = "Should be greater than 0"
            }
        }
        return err
    }


    const onEnterOtherItemRequiredQuantity = (requiredQuantity: number, itemCode: string, lot: OtherBlendLotStock | null, index: number) => {
        if (lot) {
            const value: OtherBlendLotStock = {
                batchId: lot.batchId,
                quantity: lot.quantity,
                requiredQuantity: requiredQuantity,
                boxNo: lot.boxNo,
                price: lot.price,
                weightPerBag: lot.weightPerBag,
                warehouseCode: lot.warehouseCode
            }

            const updatedBOMItemsStock = selectedOtherItem?.map(item =>
                item.itemCode === itemCode
                    ? item.index === index
                        ? {
                            ...item,
                            selectedLot: value,
                            remainingQuantity: item.plannedQuantity - requiredQuantity,
                            error: otherItemQuantityError(requiredQuantity, lot)
                        }
                        : {
                            ...item,
                        }
                    : item
            );
            dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
        }
    }

    const deleteOtherBlendItem = (row: OtherBOMItem, index: number) => {

        const updatedBOMItem = otherBOMItems?.bomItems.filter(item =>
            item.code !== row.code
        );

        dispatch(setOtherBomItemDetails(updatedBOMItem))
        dispatch(setInitialOtherBlendItems(updatedBOMItem))
        const updatedBOMItemsStock = selectedOtherItem.filter(item =>
            item.itemCode !== row.code
        );
        dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock))
        const itemList = [...otherItemsMasterListResponse.data.data]
        const item: ItemDetail = {
            itemCode: row.code,
            itemName: row.description
        }
        dispatch(setOtherItemList(itemList.concat(item)))
        if (updatedBOMItem) {
            if (otherBOMItems?.bomItems.length === 1) {
                dispatch(setOtherBOMItemsState(false))
            }
        }

        const deletedQuantity = selectedOtherItem
            .filter((item) => item.itemCode === row.code)
            .reduce((sum, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0);

        if (deletedQuantity > 0) {
            dispatch(
                setBlendSheetHeaderFormData({
                    name: "plannedQuantity",
                    value: blendSheetHeaderForm.plannedQuantity.value + deletedQuantity,
                })
            );
            onResetBOMItemsLot();
        }
    }

    const onOtherItemSelect = (value: ItemDetail | null, index: number) => {

        const previousItemCode = otherBOMItems?.bomItems.find(item =>
            item.code === value?.itemCode)

        const updatedBOMItem = otherBOMItems?.bomItems?.map(item =>
            item.code === previousItemCode?.code || item.code === ""
                ? {
                    ...item,
                    code: value ? value?.itemCode : "",
                    description: value ? value?.itemName : "",
                    item: value || null,
                }
                : item
        );


        dispatch(setOtherBomItemDetails(updatedBOMItem))

        if (value) {
            const itemList = [...otherItemsMasterListResponse.data.data]

            dispatch(setOtherItemList(itemList.filter(item => item.itemCode !== value.itemCode)))

            const tempW = [...selectedOtherItem]
            const stock: SelectedOtherItemLotStock = {
                index: 1,
                itemCode: value?.itemCode || "",
                isToWarehouseRequired: false,
                // fromWarehouse: null,
                selectedLot: null,
                lotOptions: [],
                plannedQuantity: 0,
                remainingQuantity: 0,
                error: "Should be greater than 0",
                isCollapsed: false
            }
            let tempw1 = tempW.concat(stock).filter(item => item.itemCode !== previousItemCode?.code)

            dispatch(setSelectedOtherItemsEdit(tempw1))
        }
    }

    const onOtherItemSearchOptions = (value: string) => {
        dispatch(setItemListSearchKey(value))
        if (otherItemsMasterListPagination?.page && otherItemsMasterListResponse?.data?.totalPages > otherItemsMasterListPagination?.page && value !== "") {
            dispatch(setOtherItemMasterListPage(1))
            dispatch(getOtherItemMasterList());
        }
    }

    const onOtherItemListFetchOptions = () => {
        if (otherItemsMasterListPagination?.page && otherItemsMasterListResponse.data.totalPages > otherItemsMasterListPagination?.page) {
            dispatch(setOtherItemMasterListPage(otherItemsMasterListPagination?.page + 1))
            dispatch(getOtherItemMasterList());
        }
    };

    // #region SFG Items
    const selectedSFGItemsTotal = useMemo(() => {
        return selectedSFGItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, [selectedSFGItems]);

    useEffect(() => {
        if (selectedSFGItemsTotal > 0) {
            onPlannedQuantityChangeTotalCalculations()
        }
    }, [selectedSFGItemsTotal, selectedSFGItems])

    const onDeleteSfgItem = (blendSheetNo: string) => {
        const updatedItems = selectedSFGItems.filter((item) => item.blendSheetNo !== blendSheetNo);
        const deletedItem = selectedSFGItems.find((item) => item.blendSheetNo === blendSheetNo)
        dispatch(setBlendSheetHeaderFormData({ name: 'plannedQuantity', value: blendSheetHeaderForm.plannedQuantity.value + (deletedItem?.quantity || 0) }))
        onResetBOMItemsLot()
        dispatch(setSelectedSFGItems(updatedItems));
    };

    const onBlendSheetNoSelect = (blendSheetNo: string) => {
        const SFGBlend = getSelectableSFGItems.data.find(item => item.blendSheetNo === blendSheetNo);
        if (!SFGBlend) return;

        const sfgItem = {
            batchId: SFGBlend.batchId,
            blendSheetNo: SFGBlend.blendSheetNo,
            price: SFGBlend.price,
            quantity: SFGBlend.quantity,
            warehouseCode: SFGBlend.warehouseCode,
            averageWeight: SFGBlend.averageWeight,
        }

        dispatch(setSelectedSFGItems([...selectedSFGItems.filter(item => item.blendSheetNo), sfgItem]));
    };

    const addNewSfgItem = () => {
        const newSfgItem: BlendSFGItem = {
            batchId: "",
            blendSheetNo: "",
            price: 0,
            quantity: 0,
            warehouseCode: "",
            averageWeight: 0,
        };
        if (selectedSFGItems && selectedSFGItems.length > 0) {
            dispatch(setSelectedSFGItems([...selectedSFGItems, newSfgItem]));
        } else {
            dispatch(setSelectedSFGItems([newSfgItem]));
        }
    };

    useEffect(() => {
        if (blendDetail !== null) {
            dispatch(getAllSFGItemsByMasterBlendNo(blendDetail.masterBlendSheetNo))
        }
    }, [blendDetail])

    return (
        <Grid>
            <CatalogueManagementHeader
                title={`Duplicate Blending Sheet ${getBlendSheetDetailResponse?.data?.blendSheetNo ? getBlendSheetDetailResponse.data.blendSheetNo : ""} `}
                breadcrumbs={breadcrumbs}
                showBorder={false}
            />
            <BlendingSheetHeaderBar
                averageWeight={calculateAverageWeight(selectedWarehouses, selectedBlendBalances || [], selectedSFGItems, selectedOtherItem)}
                averagePrice={calculateAveragePricePerUnit(selectedWarehouses, selectedBlendBalances || [], selectedSFGItems, selectedOtherItem)}
                totalQuantity={calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems,
                    selectedBlendBalances || [], selectedSFGItems, selectedOtherItem || [])}
                salesOrderList={[]}
                attachmentError={attachmentError}
                salesOrderListIsLoading={false}
                selectedSalesOrder={selectedSalesOrder}
                isEdit={false}
                isView={false}
                selectedProduct={selectedProduct}
                productListIsLoading={false}
                blendDetail={blendDetail}
                blendHeaderForm={blendSheetHeaderForm}
                onPlannedQuantityChange={onPlannedQuantityChange}
                selectedBlendItem={selectedBlendItem}
                username={username}
                initialPlannedQuantity={getBlendSheetDetailResponse.data?.plannedQuantity || 0}
                onOrderDateChange={onOrderDateChange}
                onStartDateChange={onStartDateChange}
                onDueDateChange={onDueDateChange}
                onRemarksChange={onRemarksChange}
                handleRemoveFile={handleRemoveFile}
                handleFileChange={handleFileChange}
                handleDrop={handleDrop}
                files={files}
                viewFile={viewFile}
                blendStatus={'Planned'}
                masterTotalQuantity={masterTotalQuantity}
                 />
            {getBlendSheetDetailResponse.hasError ? (
                <Alert
                    variant="filled"
                    severity="error"
                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
                >
                    {getBlendSheetDetailResponse?.message || 'API Error in duplicate blend sheets'}
                </Alert>
            ) : (
                <>
                        {calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [], selectedSFGItems || [], selectedOtherItem || []) > blendSheetHeaderForm?.actualPlannedQuantity?.value ? (
                            <Grid justifyContent={"center"} alignContent={"center"} p={1}>
                                <Typography variant="body1" sx={{ display: "flex" }}>
                                    <InfoIcon color="primary" />
                                    {`The quantity you can plan for this blend sheet is 0.000`}
                                </Typography>
                            </Grid>
                        ) : (
                            <Grid
                                display={"flex"}
                                justifyContent={"start"}
                                alignContent={"center"}
                                p={1}
                            >
                                <Typography variant="body1" sx={{ display: "flex" }}>
                                    <InfoIcon color="primary" />
                                    {`The quantity you can plan for this blend sheet is ${(
                                        (blendSheetHeaderForm?.actualPlannedQuantity?.value ?? 0) -
                                        calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [], selectedSFGItems || [], selectedOtherItem || [])
                                    ).toFixed(3)
                                        }`}
                                </Typography>
                            </Grid>
                        )}

                    <Paper
                        variant="outlined"
                        sx={{
                            borderWidth: 1.75,
                            p: 2,
                            borderColor: "#99a5adff",
                            mt: 3,
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Blend Balance, Theoritical Blend Balance, Blend Gain
                        </Typography>
                        {selectedBlendBalances && (
                            <BlendBalanceTable
                                blendBalanceDetails={getBlendBalanceByBlendItemResponse.data}
                                initialBlendItems={[]}
                                isView={false}
                                selectedBlendBalances={selectedBlendBalances}
                                onBlendSheetSelect={onBlendSheetBalanceSelect}
                                onBlendBalanceQuantityChange={onBlendBalanceQuantityChange}
                                onDeleteBlendBalace={onDeleteBlendBalace}
                                onSelectItemType={onSelectItemType}
                                selectableBlendSheets={getSelectableBlendSheets} />
                        )}
                        {selectedBlendItem && BOMItems?.bomItems && selectedBlendItem?.plannedQuantity !== 0 && (
                            <Grid container textAlign={"right"} p={2}>
                                <Grid item xs={6} lg={6} p={2} justifyContent={'start'} display='flex'>

                                    <Button
                                        variant="outlined"
                                        sx={{ marginRight: 1 }}
                                        onClick={addNewBlendBalance}
                                    // disabled={} //TODO
                                    >Add Blend Balance <AddIcon fontSize={'inherit'} /></Button>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                    <Paper
                        variant="outlined"
                        sx={{
                            borderWidth: 1.75,
                            p: 2,
                            borderColor: "#99a5adff",
                            mt: 3,
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Semi Finished Goods (SFG)
                        </Typography>

                        <BlendSFGTable
                            onBlendSheetNoSelect={onBlendSheetNoSelect}
                            selectedSfgItems={selectedSFGItems}
                            isView={false}
                            onDeleteSfgItem={onDeleteSfgItem}
                            selectableSFGItems={getSelectableSFGItems.data}
                        />

                        <Grid container textAlign={"right"} p={2}>
                            <Grid item xs={12} lg={12} p={2} justifyContent={'start'} display='flex'>
                                <Button
                                    variant="outlined"
                                    sx={{ marginRight: 1 }}
                                    onClick={addNewSfgItem}
                                    disabled={false}
                                >Add SFG<AddIcon fontSize={'inherit'} /></Button>
                            </Grid>
                        </Grid>

                    </Paper>
                    <Paper
                        variant="outlined"
                        sx={{
                            borderWidth: 1.75,
                            p: 2,
                            borderColor: "#99a5adff",
                            mt: 3,
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Other Items
                        </Typography>

                        {otherBOMItems?.bomItems && otherBOMItemsState && (
                            <BlendOtherItemTable
                                otherBOMDetails={otherBOMItems}
                                selectedWarehouses={selectedOtherItem}
                                setOpen={onOtherItemsOpen}
                                isView={false}
                                toWarehouse={blendSheetHeaderForm.warehouse.value}
                                addLot={addOtherItemLot}
                                onDeleteLot={onDeleteOtherItemLot}
                                onLotSelect={onOtherItemLotSelect}
                                onEnterRequiredQuantity={onEnterOtherItemRequiredQuantity}
                                deleteBlendItem={deleteOtherBlendItem}
                                initialBlendItems={initialOtherBlendItem}
                                onItemSelect={onOtherItemSelect}
                                onSearchOptions={onOtherItemSearchOptions}
                                onFetchOptions={onOtherItemListFetchOptions}
                                itemList={otherItemsMasterListResponse.data.data}
                            />
                        )}

                        {otherBOMItems?.itemCode && (
                            <Grid container textAlign={"right"} p={2}>
                                <Grid item xs={12} lg={12} p={2} justifyContent={'start'} display='flex'>
                                    <Button
                                        variant="outlined"
                                        sx={{ marginRight: 1 }}
                                        onClick={addNewOtherItem}
                                        // disabled={otherItemsMasterListResponse.data.data.every(item => selectedOtherItem.map((item) => item.itemCode).includes(item.itemCode))}
                                        disabled={
                                            // Disable if all available items are already selected
                                            otherItemsMasterListResponse.data.data.every(item =>
                                            selectedOtherItem.map(selected => selected.itemCode).includes(item.itemCode)
                                            ) ||
                                            // OR if there are any incomplete rows (empty item codes)
                                            (otherBOMItems?.bomItems?.some(item => item.code === "" || item.code === null)) ||
                                            // OR if there are no items available at all
                                            otherItemsMasterListResponse.data.data?.length === 0
                                        }
                                    >Add Other Items<AddIcon fontSize={'inherit'} /></Button>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>

                    <Paper
                        variant="outlined"
                        sx={{
                            borderWidth: 1.75,
                            p: 2,
                            borderColor: "#99a5adff",
                            mt: 3,
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Blend Items
                        </Typography>
                        {selectedBlendItem && BOMItems?.bomItems && selectedWarehouses && (
                            <BlendingSheetBomDetails
                                plannedProductQuantity={blendSheetHeaderForm.plannedQuantity.value || 1}
                                blendBOMdetails={BOMItems}
                                selectedWarehouses={selectedWarehouses}
                                addLot={addLot}
                                warehouseList={warehouseListResponse.data}
                                isView={false}
                                onDeleteLot={onDeleteLot}
                                onWarehouseSelect={onWarehouseSelect}
                                toWarehouse={blendSheetHeaderForm.warehouse.value}
                                onLotSelect={onLotSelect}
                                onEnterRequiredQuantity={onEnterRequiredQuantity}
                                setOpen={setOpen}
                                onItemSelect={onItemSelect}
                                initialBlendItems={initialBlendItems}
                                deleteBlendItem={deleteBlendItem}
                                onSearchOptions={onItemSearchOptions}
                                onFetchOptions={onItemListFetchOptions}
                                itemList={itemMasterListResponse.data.data}
                                onBasedQuantityChange={onBasedQuantityChange}
                                grnCheckList={undefined}
                                isFromDuplicate={true}
                                onNestedWarehouseSelect={onNestedWarehouseSelect}
                            />
                        )}
                    </Paper>
                    {(createBlendSheetResponse.hasError && !createBlendSheetResponse.isLoading) && (
                        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
                            <Alert
                                variant="filled"
                                severity="error"
                                sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
                            >
                                {createBlendSheetResponse?.message}
                            </Alert>
                        </Grid>
                    )}

                    {selectedBlendItem && BOMItems?.bomItems && (
                        <Grid container textAlign={"right"} p={2}>
                            <Grid item xs={6} lg={6} p={2} justifyContent={'start'} display='flex'>
                                <Tooltip title='Add New Item to BOM'>
                                    <Button
                                        variant="outlined"
                                        sx={{ marginRight: 1 }}
                                        onClick={addNewItem}
                                        disabled={BOMItems?.bomItems.some((item) => item.code === "")
                                            || BOMItems?.bomItems.some((item) => item.code === null)
                                            || itemMasterListResponse.data.data.length <= 0
                                            || selectedBlendItem?.plannedQuantity === 0
                                            || blendSheetHeaderForm?.actualPlannedQuantity?.value < 0
                                        }
                                    >Add Item <AddIcon fontSize={'inherit'} /></Button>
                                </Tooltip>

                            </Grid>
                            <Grid item xs={6} lg={6} p={2}>
                                <Button
                                    variant="outlined"
                                    sx={{ marginRight: 1 }}
                                    onClick={cancelPlan}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    onClick={createBlendSheetPlan}
                                    disabled={(selectedWarehouses?.some(g => g.error !== "No Error") ||
                                        dayjs(blendSheetHeaderForm?.dueDate?.value) < dayjs(blendSheetHeaderForm?.startDate?.value)
                                        || selectedBlendItem?.plannedQuantity === 0
                                        || selectedWarehouses.some(g => !g.selectedLot?.requiredQuantity)
                                        || (selectedBlendBalances !== null && selectedBlendBalances.some(b => b.isError !== 'No Error')))
                                        || blendSheetHeaderForm?.actualPlannedQuantity.value < selectedBlendItem?.quantity
                                    }
                                >
                                    Plan
                                    {createBlendSheetResponse.isLoading && (
                                        <CircularProgress size={20} color={"info"} />
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    )}

                    <ConfirmationMessage
                        dialogTitle="SUCCEEDED"
                        dialogContentText={
                            <>
                                {createBlendSheetResponse?.data && (
                                    <div>Blend Sheet has been successfully created!</div>
                                )}
                            </>
                        }
                        open={createBlendSheetResponse.isSuccess}
                        onClose={handleClose}
                        showCloseButton={true}
                    />
                </>
            )}

        </Grid>
    )
}
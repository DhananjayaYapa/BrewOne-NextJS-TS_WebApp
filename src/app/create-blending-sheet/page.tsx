'use client'
import HeaderBar from "@/components/headerBar/headerBar"
import { Alert, Button, Grid, CircularProgress, Tooltip, Typography, Box, Paper } from "@mui/material"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import BlendingSheetHeaderBar from "@/components/blendingSheetManagement/blendingSheet/blendingSheetHeaderBar";
import BlendingSheetBomDetails from "@/components/blendingSheetManagement/blendingSheet/bomDetails";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
// import { Auth } from "@aws-amplify/auth";
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import { getBlendDetailBySalesOrderId, getBOMDetailsByBlendItem, getSalesOrderList, getWarehousesByItemCodes, createBlendSheet, getToWarehousesList, getItemMasterList, getUploadPresignedURL, deleteAttachment, getBlendSheetByDetail, getBlendBalanceByBlendItem, getOtherItemMasterList } from "@/redux/action/createBlendSheetAction";
import { BlendBalanceItem, BlendItem, FileData, OtherBlendLotStock, OtherBOMItem, SalesOrder, SelectedOtherItemLotStock, UploadAttachment } from "@/interfaces"
import { resetCreateBlendResponse, resetCreateBlendSheet, resetOtherItemsLotResponse, resetUploadPresignedUrl, setBlendSheetAlreadyCreatedError, setBlendSheetHeaderFormData, setBomItemDetails, setInitialBlendItems, setInitialOtherBlendItems, setItemList, setItemListSearchKey, setItemMasterListPage, setOtherBomItemDetails, setOtherBOMItemsState, setOtherItemList, setOtherItemMasterListPage, setSalesOrderPage, setSalesOrderSearchKey, setSelectableCreateBlendSheets, setSelectedBlendBalances, setSelectedBlendItemCode, setSelectedOtherItemsEdit, setSelectedProduct, setSelectedSalesOrder, setSelectedWarehouses, setUploadFileKeys } from "@/redux/slice/createBlendSheetSlice"
import { LotStock, ProductItem, SelectedWarehouseStock, BlendWarehouse, BOMItem } from "@/interfaces/salesOrder";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
type Props = { params: { view: number } };
import { getCurrentUser } from "aws-amplify/auth";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import dayjs, { Dayjs } from "dayjs";
import { ItemDetail } from "@/interfaces/teaLotById";
import BlendBalanceTable from "@/components/blendingSheetManagement/blendingSheet/blendBalanceTable";
import { BlendBalance } from "@/interfaces";
import {
  calculateAveragePricePerUnit,
  calculateAverageWeight,
  calculateTotalAllocatedQuantity,
  calculateAvailableQuantity,
  calculateWarehouseQuantity
} from "@/utill/blendSheetCalculations";
import { getOtherItemLotsByItemCodes } from "@/redux/action/editBlendSheetAction";
import BlendOtherItemTable from "@/components/blendingSheetManagement/blendingSheet/blendOtherItemTable";

export default function CreateBlendingSheet({ params }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const breadcrumbs = [
    {
      id: 1,
      link: "Blending Sheets",
      route: ROUTES.BLENDING_SHEETS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: "Create Blending Sheet",
      route: "",
    },
  ];

  const [attachmentError, setAttachmentError] = useState<string>("");
  const duplicatedBlendSheet = useSelector(
    (state: RootState) => state.createBlendSheet.duplicatedBlendSheet
  );
  const salesOrderList = useSelector(
    (state: RootState) => state.createBlendSheet.salesOrderListResponse
  );

  const salesOrderListPagination = useSelector(
    (state: RootState) => state.createBlendSheet.salesOrderListRequest
  );

  const salesOrderListIsLoading = useSelector(
    (state: RootState) =>
      state.createBlendSheet.salesOrderListResponse.isLoading
  );

  const productListIsLoading = useSelector(
    (state: RootState) => state.createBlendSheet.blendDetailResponse.isLoading
  );
  const selectedSalesOrder = useSelector(
    (state: RootState) => state.createBlendSheet.selectedSalesOrder
  );

  const selectedProduct = useSelector(
    (state: RootState) => state.createBlendSheet.selectedProduct
  );

  const blendDetail = useSelector(
    (state: RootState) => state.createBlendSheet.blendDetailResponse.data
  );

  // const BOMItemsStock = useSelector(
  //   (state: RootState) => state.createBlendSheet.BOMItemsStock
  // )
  const selectedBlendBalances = useSelector(
    (state: RootState) => state.createBlendSheet.selectedBlendBalances
  );

  const blendSheetHeaderForm = useSelector(
    (state: RootState) => state.createBlendSheet.createBlendSheetHeaderForm
  );

  const BOMItemsResponse = useSelector(
    (state: RootState) => state.createBlendSheet.BOMItemsResponse
  );

  const warehouseListResponse = useSelector(
    (state: RootState) => state.createBlendSheet.warehouseListResponse
  );

  const selectedWarehouses = useSelector(
    (state: RootState) => state.createBlendSheet.selectedWarehouses
  );

  const createBlendSheetResponse = useSelector(
    (state: RootState) => state.createBlendSheet.createBlendSheetResponse
  );

  const selectedBlendItem = useSelector(
    (state: RootState) => state.createBlendSheet.selectedBlendItem
  );

  const itemMasterList = useSelector(
    (state: RootState) => state.createBlendSheet.itemListResponse.data.data
  );

  const itemMasterListResponse = useSelector(
    (state: RootState) => state.createBlendSheet.itemListResponse
  );

  const initialBlendItems = useSelector(
    (state: RootState) => state.createBlendSheet.initialBlendItems
  );

  const itemListPagination = useSelector(
    (state: RootState) => state.createBlendSheet.itemListRequest
  );

  const uploadPresignedURLResponse = useSelector(
    (state: RootState) => state.createBlendSheet.uplaodPresignedURL
  );

  const uploadFileKeys = useSelector(
    (state: RootState) => state.createBlendSheet.uploads
  );

  const getBlendBalanceByBlendItemResponse = useSelector(
    (state: RootState) => state.createBlendSheet.getBlendBalanceByBlendItemResponse
  )

  const getBlendSheetDetailResponse = useSelector(
    (state: RootState) => state.createBlendSheet.getBlendSheetDetailResponse
  )

  const getSelectableBlendSheets = useSelector((state: RootState) => state.createBlendSheet.selectableCreateBlendSheets)
  const blendSheetAlreadyCreatedError = useSelector((state: RootState) => state.createBlendSheet.blendSheetAlreadyCreatedError)

  //other item state variables
  const otherItemsMasterListPagination = useSelector((state: RootState) => state.createBlendSheet.otherItemsMasterListRequest)
  const otherItemsMasterListResponse = useSelector((state: RootState) => state.createBlendSheet.otherItemsMasterListResponse)
  const otherBOMItems = useSelector((state: RootState) => state.createBlendSheet.OtherBOMItems)
  const selectedOtherItem = useSelector((state: RootState) => state.createBlendSheet.selectedOtherItem)
  const initialOtherBlendItem = useSelector((state: RootState) => state.createBlendSheet.initialOtherBlendItem)
  const otherItemsLotResponse = useSelector((state: RootState) => state.createBlendSheet.otherItemsLotsListResponse)
  const otherBOMItemsState = useSelector((state: RootState) => state.createBlendSheet.otherBOMItemsState)


  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [initialPlannedQuantity, setInitialQuantity] = useState<number>(0);

  useEffect(() => {
    dispatch(resetCreateBlendResponse());
    async function fetchData() {
      try {
        // Dispatch your Redux action
        dispatch(getSalesOrderList());

        // Get the current user's details
        const user = await getCurrentUser();
        const { signInDetails } = user;
        setUsername(signInDetails?.loginId || "");
      } catch (error) {
        console.error("Error fetching user or dispatching data:", error);
      }
    }

    fetchData();
    dispatch(getItemMasterList());
    dispatch(getOtherItemMasterList());
  }, []);
  useEffect(() => {
    if (duplicatedBlendSheet) {
      dispatch(getBlendSheetByDetail());
    }
  }, [duplicatedBlendSheet]);

  useEffect(() => {
    if (getBlendSheetDetailResponse?.data) {
      dispatch(getWarehousesByItemCodes(getBlendSheetDetailResponse.data?.blendSheetItems?.map(b => b.code).toString()))
    }
  }, [getBlendSheetDetailResponse])

  useEffect(() => {
    if (BOMItemsResponse.hasError) {
      setTimeout(() => {
        dispatch(resetCreateBlendSheet());
      }, 5000);
    }
  }, [BOMItemsResponse.hasError]);
  useEffect(() => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "salesOrderId",
        value: selectedSalesOrder?.salesOrderId.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "orderDate",
        value: selectedSalesOrder?.orderDate.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "startDate",
        value: selectedSalesOrder?.startDate || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "dueDate",
        value: selectedSalesOrder?.dueDate || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "customerCode",
        value: selectedSalesOrder?.customerCode || "",
      })
    );
  }, [selectedSalesOrder]);

  useEffect(() => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "productItemCode",
        value: selectedProduct?.productItemCode?.toString() || "",
      })
    );
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedBlendItem) {
      dispatch(
        setBlendSheetHeaderFormData({ name: "plannedQuantity", value: null })
      );
      dispatch(
        setBlendSheetHeaderFormData({
          name: "actualPlannedQuantity",
          value: null,
        })
      );
    }
    dispatch(
      setBlendSheetHeaderFormData({
        name: "warehouse",
        value: selectedBlendItem?.warehouseCode?.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "plannedQuantity",
        value: selectedBlendItem?.plannedQuantity || undefined,
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "actualPlannedQuantity",
        value: selectedBlendItem?.plannedQuantity || undefined,
      })
    );
    setInitialQuantity(selectedBlendItem?.plannedQuantity || 0);
    dispatch(getBlendBalanceByBlendItem());
  }, [selectedBlendItem]);

  useEffect(() => {
    if (createBlendSheetResponse.hasError) {
      setTimeout(() => {
        dispatch(resetCreateBlendResponse());
      }, 5000);
    }
  }, [createBlendSheetResponse]);

  useEffect(() => {
    if (BOMItemsResponse.data) {
      dispatch(
        getWarehousesByItemCodes(
          BOMItemsResponse?.data.bomItems
            ?.filter((f) => f.code !== "")
            ?.map((i) => i.code)
            .toString()
        )
      );
      const data1Ids = new Set(
        selectedWarehouses?.map((item) => item.itemCode)
      );
      const initialBlendItems1 = new Set(
        initialBlendItems?.map((item) => item.code)
      );

      const filteredData = BOMItemsResponse.data.bomItems.filter(
        (item) => !data1Ids.has(item.code) && item.code !== ""
      );
      const isNewData = filteredData.filter((item) =>
        initialBlendItems1.has(item.code)
      );

      if (filteredData) {
        let t = selectedWarehouses;
        filteredData?.map((i, ind) => {
          const tempL: SelectedWarehouseStock = {
            ...i,
            index: 1,
            itemCode: i.code,
            isToWarehouseRequired: false,
            fromWarehouse:
              selectedWarehouses.find((item) => item.itemCode === i.code)
                ?.fromWarehouse || null,
            lotOptions: [],
            plannedQuantity: parseFloat(
              (
                i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value
              )?.toFixed(3)
            ),
            remainingQuantity: parseFloat(
              (
                i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value
              )?.toFixed(3)
            ),
            error: "Minimum is planned quantity",
            isCollapsed: false,
            selectedLot:
              selectedWarehouses.find((item) => item.itemCode === i.code)
                ?.selectedLot || null,
          };
          t = t.concat(tempL);
        });
        dispatch(setSelectedWarehouses(t));
      }
    }
  }, [BOMItemsResponse.data]);

  useEffect(() => {
    if (BOMItemsResponse.data && warehouseListResponse.data) {
      // Initialize updatedBOMItemsStock with the current selectedWarehouses
      let updatedBOMItemsStock: SelectedWarehouseStock[] = [
        ...selectedWarehouses,
      ];

      // Iterate over each warehouse and update relevant items
      warehouseListResponse.data.forEach((warehouse) => {
        updatedBOMItemsStock = updatedBOMItemsStock?.map((item) =>
          item.itemCode === warehouse.itemCode &&
            warehouse?.warehouses?.length <= 1
            ? {
              ...item,
              fromWarehouse: warehouse.warehouses[0],
              selectedLot: selectedWarehouses.find(
                (it) => it.itemCode === item.itemCode
              )?.selectedLot
                ? selectedWarehouses.find(
                  (it) => it.itemCode === item.itemCode
                )?.selectedLot || null
                : warehouse?.warehouses[0]?.lots?.length <= 1
                  ? warehouse.warehouses[0].lots[0]
                  : null,
              lotOptions: warehouse?.warehouses[0]?.lots || [],
            }
            : item
        );
      });
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  }, [warehouseListResponse.data]);

  const onSalesOrderSelect = (value: SalesOrder | null) => {
    dispatch(setSelectedSalesOrder(value));
    dispatch(setSelectedProduct(null));
    dispatch(setSelectedBlendItemCode(null));
    dispatch(resetCreateBlendSheet());
  };

  const handleClose = () => {
    if (createBlendSheetResponse.isSuccess) {
      router.push(`/${ROUTES.BLENDING_SHEETS}`);
    }
  };
  const createBlendSheetPlan = () => {
    dispatch(createBlendSheet());
  };

  const onProductSelection = (value: ProductItem | null) => {
    dispatch(setSelectedProduct(value));
    dispatch(setSelectedBlendItemCode(null));
    dispatch(resetCreateBlendSheet());
    if (value) {
      dispatch(getBlendDetailBySalesOrderId());
    }
  };

  const onBlendItemSelect = (value: BlendItem | null) => {
    dispatch(setSelectedBlendItemCode(value))
    dispatch(setBlendSheetAlreadyCreatedError(null))
    // dispatch(resetCreateBlendSheet())
    if (value) {
      if (value.isAlreadyCreated) {
        dispatch(setBlendSheetAlreadyCreatedError('A blend sheet already exists for the entered Sales Order number.'))
      } else {
        dispatch((getBOMDetailsByBlendItem(value.code)))
        dispatch(getToWarehousesList())
      }
    }
  };

  const onPlannedQuantityChangeTotalCalculations = (blendBalancesParam?: BlendBalance[], blendQuantity?: number) => {
    const blendBalance = blendBalancesParam || selectedBlendBalances
    const actualBlendQuantity = blendQuantity || blendSheetHeaderForm.actualPlannedQuantity.value

    const blendBalanceTotal = blendBalance?.reduce((sum: number, item) => sum + (item.quantity || 0), 0) || 0
    const otherBOMItems = selectedOtherItem?.reduce((sum: number, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0) || 0

    const finalPlannedQuantity = actualBlendQuantity - (blendBalanceTotal + otherBOMItems)
    dispatch(setBlendSheetHeaderFormData({name: "plannedQuantity", value: finalPlannedQuantity }));
    onResetBOMItemsLot(finalPlannedQuantity)
  }

  const onPlannedQuantityChange = (value: number) => {

    dispatch(setBlendSheetHeaderFormData({name: "plannedQuantity", value: !isNaN(value) ? value : null,}));
    dispatch(setBlendSheetHeaderFormData({name: "actualPlannedQuantity", value: !isNaN(value) ? value : null,}));

    if(value){
      onPlannedQuantityChangeTotalCalculations(undefined, value)
    }
  };

  const addLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses];

    const previousForm = selectedWarehouses.find(
      (item) => item.itemCode === itemCode && item.index === index
    );
    if (previousForm) {
      updatedBOMItemsStock.push({
        itemCode,
        index: index + 1,
        isToWarehouseRequired: false,
        fromWarehouse: previousForm.fromWarehouse || null,
        selectedLot: null,
        lotOptions:
          previousForm?.lotOptions?.filter(
            (batch) => batch.batchId !== previousForm?.selectedLot?.batchId
          ) || [],
        plannedQuantity: previousForm?.plannedQuantity,
        remainingQuantity:
          previousForm?.plannedQuantity -
          (previousForm?.selectedLot?.requiredQuantity || 0),
        error: "No Error", //TODO
        isCollapsed: true,
      });
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  };

  const onDeleteLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses];
    const indexToDelete = selectedWarehouses.findIndex(
      (item) => item.itemCode === itemCode && item.index === index
    );

    if (indexToDelete !== -1) {
      updatedBOMItemsStock.splice(indexToDelete, 1);
    }
    const totalQuantity = selectedWarehouses
      .filter((item) => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
      .reduce(
        (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
        0
      );

    const updatedBOMItemsStock1 = updatedBOMItemsStock?.map((item) =>
      item.itemCode === itemCode && item.index !== index
        ? {
          ...item,
          error: isOtherError(
            item.plannedQuantity,
            (item?.selectedLot?.requiredQuantity || 0) + totalQuantity
          ),
        }
        : item
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock1));
  };

  const onFetchOptions = () => {
    if (
      salesOrderListPagination?.page &&
      salesOrderList.data.totalPages > salesOrderListPagination?.page
    ) {
      dispatch(setSalesOrderPage(salesOrderListPagination?.page + 1));
      dispatch(getSalesOrderList());
    }
  };


  const onSalesOrderSearchOptions = (value: string) => {
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
    dispatch(setSalesOrderSearchKey(value));
    dispatch(setSalesOrderPage(1));
    dispatch(getSalesOrderList());
    // }
  };

  const isBlendBalanceError = (quantity: number, stock: number) => {
    let errorValue = 'No Error'

    // console.log('quantity balance', {quantity, stock})

    if (selectedBlendBalances) {
      if (quantity > stock) {
        errorValue = "Exceeded Stock";
      } else if (isNaN(quantity) || quantity === 0) {
        errorValue = "Please Enter Required Quantity";
      } else {
      }
    }
    return errorValue
  }



  const onBlendSheetBalanceSelect = (blendSheetNo: string | null, value: BlendBalance) => {
    const updatedBlendBalance = selectedBlendBalances?.map(item =>
      item.blendSheetNo === value.blendSheetNo
        ? {
          ...item,
          blendSheetNo: blendSheetNo,
          price: getBlendBalanceByBlendItemResponse?.data?.find(o => o.warehouseCode === item.warehouseCode &&
            o.masterBlendSheetNo === blendSheetNo)?.price,
          batchId: getBlendBalanceByBlendItemResponse?.data?.find(o => o.warehouseCode === item.warehouseCode &&
            o.masterBlendSheetNo === blendSheetNo)?.batchId
        }
        : item
    );
    dispatch(setSelectedBlendBalances(updatedBlendBalance));
  }

  const onWarehouseSelect = (itemCode: string, value: BlendWarehouse | null, index: number) => {
    if (value) {
      const isMoreExisting = selectedWarehouses?.map(
        (item) => item.itemCode === itemCode
      ).length;
      if (isMoreExisting > 1) {
        const i = BOMItemsResponse.data?.bomItems.find(
          (item) => item.code === itemCode
        );
        const updatedBOMItemsStock = selectedWarehouses.filter(
          (item) => item.itemCode !== itemCode
        );
        updatedBOMItemsStock.push({
          index: 1,
          itemCode: itemCode,
          fromWarehouse: value,
          isToWarehouseRequired: false,
          selectedLot: value.lots.length === 1 ? value.lots[0] : null,
          lotOptions: value.lots,
          plannedQuantity: parseFloat(
            (
              (i?.basedQuantity || 0) *
              blendSheetHeaderForm.plannedQuantity.value
            )?.toFixed(3)
          ),
          remainingQuantity: parseFloat(
            (
              (i?.basedQuantity || 0) *
              blendSheetHeaderForm.plannedQuantity.value
            )?.toFixed(3)
          ),
          error: "Minimum is planned quantity",
          isCollapsed: false,
        });
        dispatch(setSelectedWarehouses(updatedBOMItemsStock));
      } else {
        const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
          item.itemCode === itemCode && item.index === index
            ? {
              ...item,
              fromWarehouse: value,
              selectedLot: value.lots?.length === 1 ? value.lots[0] : null,
              lotOptions: value.lots,
            }
            : item
        );
        dispatch(setSelectedWarehouses(updatedBOMItemsStock));
      }
    }
  };

  const onToWarehouseSelect = (
    itemCode: string,
    value: BlendWarehouse | null,
    index: number
  ) => {
    // if (value) {
    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
          ...item,
          isToWarehouseRequired: value ? false : true,
        }
        : item
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));

    // }
  };

  const setOpen = (value: boolean, itemCode: string, index: number) => {
    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
          ...item,
          isCollapsed: !value,
        }
        : item
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));
  };

  const onLotSelect = (
    itemCode: string,
    value: LotStock | null,
    warehouse: BlendWarehouse | null,
    index: number
  ) => {
    if (warehouse) {
      const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
        item.itemCode === itemCode && item.index === index
          ? {
            ...item,
            selectedLot: value ? {
              ...value,
              price: value?.price,
              weightPerBag: value?.weightPerBag,
              requiredQuantity: "",
              error: "Minimum is planned quantity"
            } : null,

          }
          : item
      );
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  };
  const isError = (
    requiredQuantity: number,
    plannedQuantity: number,
    lotQuantity: number,
    totalQuantity: number
  ) => {
    let err = "No Error";
    // if (requiredQuantity > lotQuantity || requiredQuantity > plannedQuantity) {
    if (requiredQuantity > lotQuantity) {
      err = "Exceeded";
    } else if (requiredQuantity + totalQuantity < plannedQuantity) {
      err = "Minimum is planned quantity";
    }
    // else if ((requiredQuantity + totalQuantity) > plannedQuantity) {
    //   err = "Exceeded"
    // }
    else {
      err = "No Error";
    }
    // console.log('error', requiredQuantity, totalQuantity, plannedQuantity, lotQuantity)
    return err;
  };
  const isOtherError = (plannedQuantity: number, totalQuantity: number) => {
    let err = "No Error";
    if (plannedQuantity > totalQuantity) {
      err = "Minimum is planned quantity";
    }
    //  else if (totalQuantity > plannedQuantity) {
    //   err = "Exceeded"
    // }
    // else {
    //   err = "No Error"
    // }
    // console.log('othererror', plannedQuantity, totalQuantity)
    return err;
  };

  const onEnterRequiredQuantity = (
    requiredQuantity: number,
    itemCode: string,
    warehouse: BlendWarehouse | null,
    lot: LotStock | null,
    index: number,
    plannedQuantity: number
  ) => {
    // console.log(requiredQuantity, 'error log')
    if (warehouse && lot) {
      const value: LotStock = {
        batchId: lot.batchId,
        quantity: lot.quantity,
        requiredQuantity: requiredQuantity,
        boxNo: lot?.boxNo || null,
        price: lot?.price || null,
        weightPerBag: lot?.weightPerBag || null,
      };
      const totalQuantity = selectedWarehouses
        .filter((item) => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
        .reduce(
          (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
          0
        );

      const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
        item.itemCode === itemCode
          ? item.index === index
            ? {
              ...item,
              selectedLot: value,
              remainingQuantity: item.plannedQuantity - requiredQuantity,
              error: isError(
                requiredQuantity,
                plannedQuantity,
                lot.quantity,
                totalQuantity
              ),
            }
            : {
              ...item,
              error: isOtherError(
                parseFloat(
                  blendSheetHeaderForm.plannedQuantity.value?.toFixed(3)
                ),
                totalQuantity + requiredQuantity
              ),
              // isError(requiredQuantity, parseFloat(item.plannedQuantity.toFixed(3)),
              //   item.selectedLot?.quantity || 0, totalQuantity)
            }
          : item
      );
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  };

  const cancelPlan = () => {
    dispatch(setSelectedSalesOrder(null));
    dispatch(setSelectedBlendItemCode(null));
    dispatch(setSelectedProduct(null));
    dispatch(resetCreateBlendSheet());
    router.push(`/${ROUTES.BLENDING_SHEETS}`);
  };
  const addNewItem = () => {
    //TODO
    if (itemMasterListResponse.data.data?.length >= 1) {
      const existingItems = new Set(BOMItemsResponse?.data?.bomItems?.map(item => item.code));
      const existingItemsInNew = new Set(selectedWarehouses?.map(item => item.itemCode));
      const allItems = [...itemMasterListResponse.data.data]
      const filteredItems1 = allItems?.filter((item) => !existingItems.has(item.itemCode))
      const filteredItems = filteredItems1?.filter((item) => !existingItemsInNew.has(item.itemCode))
      const uniqueArr = Array.from(
        new Map(filteredItems.map(item => [item.itemCode, item])).values()
      );
      dispatch(setItemList(uniqueArr))
    }

    const newItem: BOMItem = {
      blendSheetItemId: BOMItemsResponse?.data?.bomItems?.length || 0,
      code: "",
      description: "",
      basedQuantity: 0,

      lots: [],
      isDeletable: true
    };
    if (BOMItemsResponse?.data) {
      const temp = [...BOMItemsResponse.data?.bomItems];
      const temp1 = temp.concat(newItem);
      dispatch(setBomItemDetails(temp1));
    }
  };
  const onItemSelect = (value: ItemDetail | null, index: number) => {
    const previousItemCode = BOMItemsResponse.data?.bomItems.find(
      (item) => item.blendSheetItemId === index
    )?.code;
    const updatedBOMItem = BOMItemsResponse.data?.bomItems?.map((item) =>
      item.code === previousItemCode || item.code === ""
        ? {
          ...item,
          code: value ? value?.itemCode : "",
          description: value ? value?.itemName : "",
          item: value || null,
          basedQuantity: 0,
        }
        : item
    );

    dispatch(setBomItemDetails(updatedBOMItem));
    if (value) {
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
        isCollapsed: false,
      };

      const tempW = [...selectedWarehouses];

      const tempw1 = tempW
        .concat(stock)
        .filter((item) => item.itemCode !== previousItemCode);

      dispatch(setSelectedWarehouses(tempw1));
    }
  };

  const onBasedQuantityChange = (itemCode: string, value: number) => {
    const updatedBOMItem = BOMItemsResponse.data?.bomItems?.map((item) =>
      item.code === itemCode
        ? {
          ...item,
          basedQuantity: value,
        }
        : item
    );
    dispatch(setBomItemDetails(updatedBOMItem));

    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
          ...item,
          plannedQuantity: parseFloat(
            (value * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)
          ),
        }
        : item
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));
  };
  const deleteBlendItem = (row: BOMItem) => {
    const updatedBOMItem = BOMItemsResponse.data?.bomItems.filter(
      (item) => item.code !== row.code
    );

    dispatch(setBomItemDetails(updatedBOMItem));
    dispatch(setInitialBlendItems(updatedBOMItem));
    const updatedBOMItemsStock = selectedWarehouses.filter(
      (item) => item.itemCode !== row.code
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    const itemList = [...itemMasterListResponse.data.data];
    const item: ItemDetail = {
      itemCode: row.code,
      itemName: row.description,
    };
    dispatch(setItemList(itemList.concat(item)));
  };
  const onOrderDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "orderDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };

  const onStartDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "startDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };

  const onDueDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "dueDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };
  const onRemarksChange = (value: string) => {
    dispatch(setBlendSheetHeaderFormData({ name: "remarks", value: value }));
  };

  const onItemSearchOptions = (value: string) => {
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
    dispatch(setItemListSearchKey(value));
    dispatch(setItemMasterListPage(1));
    dispatch(getItemMasterList());
    // }
  };

  const onItemListFetchOptions = () => {
    if (
      itemListPagination?.page &&
      itemMasterListResponse.data.totalPages > itemListPagination?.page
    ) {
      dispatch(setItemMasterListPage(itemListPagination?.page + 1));
      dispatch(getItemMasterList());
    }
  };

  const [files, setFiles] = useState<FileData[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (files.some((x) => x.file?.name === file.name)) {
        setAttachmentError("Cannot upload files with same name");
      } else {
        setAttachmentError("");
        const fileT = {
          file: file,
          url: URL.createObjectURL(file),
        };
        setFiles(files.concat(fileT));
        const attachment: UploadAttachment = {
          filename: file.name,
          filetype: file.type,
        };
        dispatch(getUploadPresignedURL(attachment));
      }
    }
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (files.some((x) => x.file?.name === file.name)) {
        setAttachmentError("Cannot upload files with same name");
      } else {
        setAttachmentError("");
        const fileT = {
          file: file,
          url: URL.createObjectURL(file),
        };
        setFiles(files.concat(fileT));
        const attachment: UploadAttachment = {
          filename: file.name,
          filetype: file.type,
        };
        dispatch(getUploadPresignedURL(attachment));
      }
    }
  };

  const uploadObjectToS3 = async (file: FileData) => {
    try {
      if (uploadPresignedURLResponse.data?.url && file.file) {
        await fetch(uploadPresignedURLResponse.data?.url, {
          method: "PUT",
          body: file?.file,
          headers: {
            "Content-Type": file?.file?.type,
          },
        });

        dispatch(
          setUploadFileKeys(
            uploadFileKeys.concat({
              fileKey: uploadPresignedURLResponse?.data?.fileKey,
            })
          )
        );
        dispatch(resetUploadPresignedUrl());
        console.log("success s3");
      }
    } catch (error) {
      /* empty */
      console.log("failed s3");
    }
  };
  useEffect(() => {
    if (uploadPresignedURLResponse.data) {
      uploadObjectToS3(files[files.length - 1]);
    }
  }, [uploadPresignedURLResponse.data]);

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );

    uploadFileKeys
      .filter((_, index) => index === indexToRemove)
      ?.map((item) => {
        dispatch(deleteAttachment(item.fileKey));
      });
    dispatch(
      setUploadFileKeys((prevFiles: { fileKey: string }[]) =>
        prevFiles.filter((_, index) => index !== indexToRemove)
      )
    );
  };

  useEffect(() => {
    if (uploadPresignedURLResponse.hasError) {
      setTimeout(() => {
        dispatch(resetUploadPresignedUrl());
      }, 2000);
    }
  }, [uploadPresignedURLResponse.hasError]);


  const onResetBOMItemsLot = (updatedPlannedQty?: number ) => {
    const updatedBOMItemsStock = selectedWarehouses?.map((item, index) => {
      if (!item.itemCode) return item;

      const sameItems = selectedWarehouses.filter(
        i => i.itemCode === item.itemCode
      );

      const totalQuantity = sameItems.reduce(
        (sum, i) => sum + (i.selectedLot?.requiredQuantity || 0),
        0
      );

      const plannedQuantity2 = item.plannedQuantity; //16
      const plannedQuantity = (updatedPlannedQty || blendSheetHeaderForm.plannedQuantity.value || 0);

      const requiredQuantity = item.selectedLot?.requiredQuantity || 0;
      const lotQuantity = item.selectedLot?.quantity || 0;

      const bomValue = BOMItemsResponse.data?.bomItems.find((bom) => bom.code === item.itemCode)?.basedQuantity || 0


      let error = "No Error";

      console.log('testing resetBom', { requiredQuantity, lotQuantity, totalQuantity, plannedQuantity, plannedQuantity2, bomValue })

      if (requiredQuantity > lotQuantity) {
        error = "Exceeded"; // individual lot exceeds available
      } else {
        if (plannedQuantity > 0) { //validation won't executed when there's no planned quantity
          const newPlannedQty = bomValue * plannedQuantity
          if (totalQuantity < newPlannedQty) {
            error = "Minimum is planned quantity"; // total across all lots < planned
          }
        }

      }

      return {
        ...item,
        selectedLot: { ...item.selectedLot },
        error
      };

    });
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));

  }

  // #region blend balance

  const addNewBlendBalance = () => {
    const intialBlendBalance: BlendBalance[] = [{
      warehouseCode: "",
      blendSheetNo: "",
      batchId: "",
      quantity: 0,
      price: 0,
      typeId: 0,
      averageWeight: 0
    }]
    if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
      dispatch(
        setSelectedBlendBalances(
          selectedBlendBalances?.concat(intialBlendBalance)
        )
      );
    } else {
      dispatch(setSelectedBlendBalances(intialBlendBalance));
    }
  };

  // const onBlendBalanceSelect = (blendSheetNo: string, rowId: number) => {
  //   const blendSheet = getBlendBalanceByBlendItemResponse.data.find(item => item.masterBlendSheetNo === blendSheetNo)
  //   const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
  //     if (idx !== rowId) return item;
  //     if (!blendSheet) return item;
  //     return {
  //       ...item,
  //       blendSheetNo: blendSheet?.masterBlendSheetNo,
  //       batchId: blendSheet?.batchId,
  //       // quantity: blendSheet?.quantity,
  //       initialQuantity: blendSheet?.quantity,
  //       price: blendSheet?.price,
  //       averageWeight: blendSheet?.averageWeight,
  //       typeId: blendSheet?.typeId,
  //       warehouseCode: blendSheet?.warehouseCode
  //     };
  //   });
  //   dispatch(setSelectedBlendBalances(updatedBlendBalance));
  // }

  // new onBlendBalanceSelect function
  const onBlendBalanceSelect = (blendSheetNo: string, rowId: number) => {
    const blendSheet = getBlendBalanceByBlendItemResponse.data.find(
      item => item.masterBlendSheetNo === blendSheetNo &&
      item.typeId === selectedBlendBalances?.[rowId]?.typeId
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
        averageWeight: blendSheet?.averageWeight,
        typeId: blendSheet?.typeId,
        warehouseCode: blendSheet?.warehouseCode,
        isError: 'Please Enter Required Quantity'
      };
    });

    dispatch(setSelectedBlendBalances(updatedBlendBalance));
  };

  // const onBlendBalanceQuantityChange = (value: BlendBalance, quantity: number) => {
  //   const isErrorValu = isBlendBalanceError(quantity,
  //     getBlendBalanceByBlendItemResponse?.data?.find(m => m.masterBlendSheetNo === value.blendSheetNo)?.quantity || 0)
  //   const updatedBlendBalance = selectedBlendBalances?.map(item =>
  //     item.typeId === value.typeId && item.blendSheetNo === value.blendSheetNo && item.warehouseCode === value.warehouseCode
  //       ? {
  //         ...item,
  //         quantity: quantity,
  //         isError: isErrorValu
  //       }
  //       : item
  //   );
  //   dispatch(setSelectedBlendBalances(updatedBlendBalance));

  //   if (isErrorValu === "No Error" && !isNaN(quantity)) {
  //     const blendBalance = updatedBlendBalance?.map(({ isError, ...rest}) => rest)
  //     onPlannedQuantityChangeTotalCalculations(blendBalance);
  //   }
  // }

  // new onBlendBalanceQuantityChange function
  const onBlendBalanceQuantityChange = (value: BlendBalance, quantity: number) => {
  // Find the blend sheet data that matches BOTH masterBlendSheetNo AND typeId
    const blendSheetData = getBlendBalanceByBlendItemResponse?.data?.find(
      m => m.masterBlendSheetNo === value.blendSheetNo && m.typeId === value.typeId
    );

    const availableQuantity = blendSheetData?.quantity || 0;
    const isErrorValue = isBlendBalanceError(quantity, availableQuantity);

    const updatedBlendBalance = selectedBlendBalances?.map(item =>
      item.typeId === value.typeId &&
      item.blendSheetNo === value.blendSheetNo &&
      item.warehouseCode === value.warehouseCode
        ? {
          ...item,
          quantity: quantity,
          isError: isErrorValue
        }
        : item
    );

    dispatch(setSelectedBlendBalances(updatedBlendBalance));

    if (isErrorValue === "No Error" && !isNaN(quantity)) {
      const blendBalance = updatedBlendBalance?.map(({ isError, ...rest}) => rest)
      onPlannedQuantityChangeTotalCalculations(blendBalance);
    }
  }

   const onDeleteBlendBalace = (value: BlendBalance, rowId: number) => {
    const updatedBlendBalance = selectedBlendBalances?.filter((item, index) => index !== rowId)
    const deletedBlendBalance = selectedBlendBalances?.filter(f => f.blendSheetNo === value.blendSheetNo && f.typeId === value.typeId &&
            f.warehouseCode === value.warehouseCode).reduce((accumulator, currentVal) => accumulator + (!isNaN(currentVal.quantity) ? currentVal.quantity : 0), 0)

    const updatedPlannedQuantity = blendSheetHeaderForm.plannedQuantity.value + (deletedBlendBalance || 0)
    if (selectedBlendBalances) {
      dispatch(setBlendSheetHeaderFormData({
        name: 'plannedQuantity',
        value: updatedPlannedQuantity
      }))
    }

    if (updatedBlendBalance && updatedBlendBalance?.length <= 0) {
      dispatch(setSelectedBlendBalances(null));
    } else {
      dispatch(setSelectedBlendBalances(updatedBlendBalance));
    }
    onResetBOMItemsLot(updatedPlannedQuantity)
  }

  // const onSelectItemType = (value: number, rowId: number) => {

  //   //api response sheets having particular types
  //   const selectableBlendSheets = getBlendBalanceByBlendItemResponse.data.filter((item: BlendBalanceItem) =>
  //     item.typeId === value).map(item => item.masterBlendSheetNo)


  //   const alreadySelectedBlendSheets = selectedBlendBalances?.filter(
  //     (item, index, self) =>
  //       index ===
  //       self.findIndex((obj) => obj.blendSheetNo === item.blendSheetNo && (!obj.warehouseCode || obj.warehouseCode === item.warehouseCode))).map((item) => item.blendSheetNo)


  //   const unusedBlendBal = selectableBlendSheets?.filter(blendNo => !alreadySelectedBlendSheets?.includes(blendNo))

  //   const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
  //     if (idx === rowId) {
  //       return {
  //         warehouseCode: "",
  //         blendSheetNo: "",
  //         batchId: "",
  //         quantity: 0,
  //         price: 0,
  //         typeId: value,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });

  //   dispatch(setSelectedBlendBalances(updatedBlendBalance))
  //   dispatch(setSelectableCreateBlendSheets(unusedBlendBal))
  // }


  // new onSelectItemType function
  const onSelectItemType = (value: number, rowId: number) => {
  // Get all blend sheets for the selected type
  const selectableBlendSheetsByType = getBlendBalanceByBlendItemResponse.data.filter(
    (item: BlendBalanceItem) => item.typeId === value
  ).map(item => item.masterBlendSheetNo);

  // Get already selected blend sheets (excluding the current row being edited)
  // BUT only exclude blend sheets that are selected in the SAME TYPE in other rows
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
    .map(item => item.blendSheetNo)
    .filter(sheetNo => sheetNo !== "" && sheetNo !== null); // Filter out empty strings

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
  dispatch(setSelectableCreateBlendSheets(unusedBlendBal || []));
};

  // #region other item
  const selectedOtherItemTotal: number = useMemo(() => {
    return selectedOtherItem.reduce(
      (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
      0
    );
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
    if (otherBOMItems?.itemCode) {
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

    dispatch(getOtherItemLotsByItemCodes(itemCode))
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
      dispatch(setBlendSheetHeaderFormData({ name: "plannedQuantity", value: blendSheetHeaderForm.plannedQuantity.value + deletedQuantity}));
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

  return (
    <Grid>
      <CatalogueManagementHeader
        title={"Create Blending Sheet"}
        breadcrumbs={breadcrumbs}
        showBorder={false}
      />
      <BlendingSheetHeaderBar
        averageWeight={calculateAverageWeight(selectedWarehouses, selectedBlendBalances || [], [], selectedOtherItem)}
        averagePrice={calculateAveragePricePerUnit(
          selectedWarehouses,
          selectedBlendBalances || [],
          [],
          selectedOtherItem
        )}
        totalQuantity={calculateTotalAllocatedQuantity(
          selectedWarehouses,
          BOMItemsResponse.data,
          selectedBlendBalances || [],
          [],
          selectedOtherItem || []
        )}
        salesOrderList={salesOrderList.data.data}
        salesOrderListIsLoading={salesOrderListIsLoading}
        selectedSalesOrder={selectedSalesOrder}
        onSalesOrderSelect={onSalesOrderSelect}
        onBlendItemSelect={onBlendItemSelect}
        blendDetail={blendDetail}
        blendHeaderForm={blendSheetHeaderForm}
        onProductSelection={onProductSelection}
        selectedProduct={selectedProduct}
        productListIsLoading={productListIsLoading}
        onFetchOptions={onFetchOptions}
        onPlannedQuantityChange={onPlannedQuantityChange}
        selectedBlendItem={selectedBlendItem}
        username={username}
        onSearchOptions={onSalesOrderSearchOptions}
        initialPlannedQuantity={initialPlannedQuantity}
        isView={false}
        isEdit={false}
        onOrderDateChange={onOrderDateChange}
        onStartDateChange={onStartDateChange}
        onDueDateChange={onDueDateChange}
        onRemarksChange={onRemarksChange}
        handleRemoveFile={handleRemoveFile}
        handleFileChange={handleFileChange}
        handleDrop={handleDrop}
        files={files} blendStatus={'Planned'} attachmentError={attachmentError} />
      {blendSheetAlreadyCreatedError ?
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
          >
            {blendSheetAlreadyCreatedError}
          </Alert>
        </Grid>
        : (
          <>
            {selectedBlendItem?.plannedQuantity !== undefined && (BOMItemsResponse.isLoading || warehouseListResponse.isLoading) && (
              <Typography>
                <CircularProgress color="inherit" size={20} />
                Loading BOM Details...
              </Typography>
            )}
            {calculateTotalAllocatedQuantity(selectedWarehouses, BOMItemsResponse.data, selectedBlendBalances || [], [], selectedOtherItem || []) > blendSheetHeaderForm?.actualPlannedQuantity?.value ? (
              <Grid justifyContent={"center"} alignContent={"center"} p={1}>
                <Typography variant="body1" sx={{ display: "flex" }}>
                  <InfoIcon color="primary" />
                  {`The quantity you can plan for this blend sheet is 0.000`}
                </Typography>
              </Grid>
            ): (
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
                        calculateTotalAllocatedQuantity(selectedWarehouses, BOMItemsResponse.data, selectedBlendBalances || [], [], selectedOtherItem || [])
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
                Blend Balance, Theoretical Blend Balance, Blend Gain
              </Typography>
              {selectedBlendBalances && (
                <BlendBalanceTable
                  blendBalanceDetails={getBlendBalanceByBlendItemResponse.data}
                  initialBlendItems={[]}
                  isView={false}
                  selectedBlendBalances={selectedBlendBalances}
                  onBlendSheetSelect={onBlendBalanceSelect}
                  onBlendBalanceQuantityChange={onBlendBalanceQuantityChange}
                  onDeleteBlendBalace={onDeleteBlendBalace}
                  onSelectItemType={onSelectItemType}
                  selectableBlendSheets={getSelectableBlendSheets} />
              )}
              {selectedBlendItem && BOMItemsResponse.data?.bomItems && selectedBlendItem?.plannedQuantity !== 0 && (
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
                      // disabled={otherItemsMasterListResponse.data.data.every(item => selectedOtherItem.map((item) => item.itemCode).includes(item.itemCode)) || otherBOMItems.bomItems.every((filed => field !== ''))}
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
              {selectedBlendItem?.plannedQuantity !== 0 && selectedBlendItem && BOMItemsResponse.data?.bomItems && warehouseListResponse.data && (
                <BlendingSheetBomDetails
                  blendBOMdetails={BOMItemsResponse.data}
                  addLot={addLot}
                  isView={false}
                  onDeleteLot={onDeleteLot}
                  // onToWarehouseSelect={onToWarehouseSelect}
                  // BOMItemsStock={BOMItemsResponse.data}
                  plannedProductQuantity={blendSheetHeaderForm.plannedQuantity.value}
                  warehouseList={warehouseListResponse.data}
                  onWarehouseSelect={onWarehouseSelect}
                  selectedWarehouses={selectedWarehouses}
                  onLotSelect={onLotSelect}
                  onEnterRequiredQuantity={onEnterRequiredQuantity}
                  setOpen={setOpen}
                  onItemSelect={onItemSelect}
                  onBasedQuantityChange={onBasedQuantityChange}
                  initialBlendItems={initialBlendItems}
                  onSearchOptions={onItemSearchOptions}
                  onFetchOptions={onItemListFetchOptions}
                  itemList={itemMasterList}
                  deleteBlendItem={deleteBlendItem}
                  toWarehouse={blendSheetHeaderForm.warehouse.value} grnCheckList={undefined}
                  isFromDuplicate={false}
                  isFromCreate={true}
                />
              )}
            </Paper>
            {(salesOrderList.hasError || BOMItemsResponse.hasError || (createBlendSheetResponse.hasError &&
              !createBlendSheetResponse.isLoading) || selectedBlendItem?.plannedQuantity === 0) && (
                <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
                  // action={<CloseIcon onClick={() => {dispatch(setBuyerErrorAlert(false))}}/>}
                  >
                    {salesOrderList?.message || BOMItemsResponse?.message || createBlendSheetResponse?.message
                      || uploadPresignedURLResponse?.message || ''}
                    {selectedBlendItem?.plannedQuantity === 0 ? "Blend Sheet already created for the selected Blend Item" : ""}
                  </Alert>
                </Grid>
              )}
            {/* <CatalogueTab id={params.view}/> */}
            {selectedBlendItem && BOMItemsResponse.data?.bomItems && selectedBlendItem?.plannedQuantity !== 0 && (
              <Grid container textAlign={"right"} p={2}>
                <Grid item xs={6} lg={6} p={2} justifyContent={'start'} display='flex'>
                  <Tooltip title='Add New Item to BOM'>
                    <Button
                      variant="outlined"
                      sx={{ marginRight: 1 }}
                      onClick={addNewItem}
                      disabled={BOMItemsResponse.data.bomItems.some((item) => item.code === "")
                        || BOMItemsResponse.data.bomItems.some((item) => item.code === null)
                        || itemMasterListResponse.data.data?.length <= 1
                        || blendSheetHeaderForm?.plannedQuantity?.value <= 0}
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
          </>)}

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
    </Grid>
  );
}

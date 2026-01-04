'use client'
import HeaderBar from "@/components/headerBar/headerBar"
import { Alert, Button, Grid, CircularProgress } from "@mui/material"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import PackingSheetHeaderBar from "@/components/packingSheetManagement/packingSheet/packingSheetHeaderBar";
import PackingingSheetBomDetails from "@/components/packingSheetManagement/packingSheet/bomDetails";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { Auth } from "@aws-amplify/auth";

import { getWarehousesByItemCodes, getToWarehousesList } from "@/redux/action/createBlendSheetAction";
import { BlendItem, SalesOrder } from "@/interfaces"
import { resetCreatePackingResponse, resetCreatePackingSheet, setPackingSheetHeaderFormData, setSelectedPackingItemCode, setSelectedProduct,setSelectedWarehouses } from "@/redux/slice/createPackingSheetSlice"
import { setSalesOrderPage, setSalesOrderSearchKey, setSelectedSalesOrder,  } from "@/redux/slice/createPackingSheetSlice"
import { LotStock, ProductItem, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
type Props = { params: { view: number } }
import { getCurrentUser } from 'aws-amplify/auth';
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import dayjs, { Dayjs } from "dayjs";
import { getBOMDetailsByPackingItem, getPackingDetailBySalesOrderId,  createPackingSheet, getSalesOrderList } from "@/redux/action/packingSheetAction";

export default function CreatePackingingSheet({ params }: Props) {
  const dispatch = useDispatch<AppDispatch>();


  const breadcrumbs = [
    {
      id: 1,
      link: "Packing",
      route: ROUTES.PACKING_SHEETS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: 'Create Packing',
      route: "",
    },
  ];
  const salesOrderList = useSelector(
    (state: RootState) => state.createPackingSheet.salesOrderListResponse
  )

  const salesOrderListPagination = useSelector(
    (state: RootState) => state.createPackingSheet.salesOrderListRequest
  )

  const toWarehouseList = useSelector(
    (state: RootState) => state.createPackingSheet.toWarehouseListResponse
  )


  const salesOrderListIsLoading = useSelector(
    (state: RootState) => state.createPackingSheet.salesOrderListResponse.isLoading
  )

  const productListIsLoading = useSelector(
    (state: RootState) => state.createPackingSheet.packingDetailResponse.isLoading
  )
  const selectedSalesOrder = useSelector(
    (state: RootState) => state.createPackingSheet.selectedSalesOrder
  )

  const selectedProduct = useSelector(
    (state: RootState) => state.createPackingSheet.selectedProduct
  )

  const packingDetail = useSelector(
    (state: RootState) => state.createPackingSheet.packingDetailResponse.data
  )

  // const BOMItemsStock = useSelector(
  //   (state: RootState) => state.createPackingSheet.BOMItemsStock
  // )

  const packingSheetHeaderForm = useSelector(
    (state: RootState) => state.createPackingSheet.createPackingSheetHeaderForm
  )

  const BOMItemsResponse = useSelector(
    (state: RootState) => state.createPackingSheet.BOMItemsResponse
  )

  const warehouseListResponse = useSelector(
    (state: RootState) => state.createPackingSheet.warehouseListResponse
  )

  const selectedWarehouses = useSelector(
    (state: RootState) => state.createPackingSheet.selectedWarehouses
  )

  const createPackingSheetResponse = useSelector(
    (state: RootState) => state.createPackingSheet.createPackingSheetResponse
  )

  const selectedPackingItem = useSelector(
    (state: RootState) => state.createPackingSheet.selectedPackingItem
  )

  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [initialPlannedQuantity, setInitialQuantity] = useState<number>(2);
  useEffect(() => {
    async function fetchData() {
      try {
        // Dispatch your Redux action
        dispatch(getSalesOrderList());

        // Get the current user's details
        const user = await getCurrentUser();
        const { signInDetails } = user;
        setUsername(signInDetails?.loginId || "")
      } catch (error) {
        console.error('Error fetching user or dispatching data:', error);
      }
    }

    fetchData();
  }, [])


  useEffect(() => {
    dispatch(setPackingSheetHeaderFormData({ name: 'salesOrderId', value: selectedSalesOrder?.salesOrderId.toString() || "" }))
    dispatch(setPackingSheetHeaderFormData({ name: 'orderDate', value: selectedSalesOrder?.orderDate.toString() || '' }))
    dispatch(setPackingSheetHeaderFormData({ name: 'startDate', value: selectedSalesOrder?.startDate || '' }))
    dispatch(setPackingSheetHeaderFormData({ name: 'dueDate', value: selectedSalesOrder?.dueDate || '' }))
    dispatch(setPackingSheetHeaderFormData({ name: 'customerCode', value: selectedSalesOrder?.customerCode || '' }))
  }, [selectedSalesOrder])

  useEffect(() => {

    dispatch(setPackingSheetHeaderFormData({ name: 'productItemCode', value: selectedProduct?.productItemCode?.toString() || '' }))
  }, [selectedProduct])

  useEffect(() => {

    dispatch(setPackingSheetHeaderFormData({ name: 'warehouse', value: packingDetail?.warehouseCode?.toString() || '' }))
    dispatch(setPackingSheetHeaderFormData({ name: 'plannedQuantity', value: packingDetail?.plannedQuantity?.toString() || '' }))
    setInitialQuantity(packingDetail?.plannedQuantity || 0)

  }, [packingDetail])

  useEffect(() => {
    if (createPackingSheetResponse.hasError) {
      setTimeout(() => {

      dispatch(resetCreatePackingResponse())
            }, 5000);
    }
  }, [createPackingSheetResponse])


  useEffect(() => {
    if (BOMItemsResponse.data) {
      dispatch(getWarehousesByItemCodes(BOMItemsResponse?.data.bomItems?.map((i) => i.code).toString()))

      let t = selectedWarehouses
      BOMItemsResponse.data.bomItems?.map((i, ind) => {
        const tempL: SelectedWarehouseStock = {
          index: 1,
          itemCode: i.code,
          isToWarehouseRequired: false,
          fromWarehouse: null,
          selectedLot: null,
          lotOptions: [],
          plannedQuantity: parseFloat((i.basedQuantity * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          remainingQuantity: parseFloat((i.basedQuantity * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          error: "Minimum is planned quantity",
          isCollapsed: false

        }
        t = t.concat(tempL)

      })
      dispatch(setSelectedWarehouses(t))
    }
  }, [BOMItemsResponse.data])
 useEffect(() => {
    if (warehouseListResponse.data) {
      const updatedBOMItemsStock = selectedWarehouses?.map(item => {
        const itemData = warehouseListResponse?.data?.find(w => w.itemCode === item.itemCode);
        const warehouses = itemData?.warehouses ?? [];
        const selecteWH = (warehouses?.length <= 1
              ? warehouses[0]
              : warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)
            ) || item.fromWarehouse || null
        const lotsLength = selecteWH?.lots?.length || 0
        return {
          ...item,
          fromWarehouse:
            selecteWH,
          selectedLot: lotsLength <= 1
              ? selecteWH?.lots[0]
              : null,
          lotOptions: warehouses.length > 1
            ? lotsLength > 1
              ? warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots
              : warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots[0]
            : warehouses.find(w1 => w1.warehouseCode === warehouses[0].warehouseCode)?.lots
            || []
        };
      });

      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }

  }, [warehouseListResponse.data])

  const onSalesOrderSelect = (value: SalesOrder | null) => {
    dispatch(setSelectedSalesOrder(value))
    dispatch(setSelectedProduct(null))
    dispatch(setSelectedPackingItemCode(null))
    dispatch(resetCreatePackingSheet())
  }

  const handleClose = () => {
    if (createPackingSheetResponse.isSuccess) {
      router.push(ROUTES.PACKING_SHEETS)
    }
  }
  const createPackingSheetPlan = () => {
    dispatch(createPackingSheet())
  }

  const onProductSelection = (value: ProductItem | null) => {
    dispatch(setSelectedProduct(value))
    dispatch(setSelectedPackingItemCode(null))
    dispatch(resetCreatePackingSheet())
    if (value) {
      dispatch(getPackingDetailBySalesOrderId());
      dispatch((getBOMDetailsByPackingItem(value?.productItemCode)))
      dispatch(getToWarehousesList())
    }
  }

  const onPackingItemSelect = (value: BlendItem | null) => {
    dispatch(setSelectedPackingItemCode(value))
    // dispatch(resetCreatePackingSheet())
    if (value) {
      dispatch((getBOMDetailsByPackingItem(value.code)))
      dispatch(getToWarehousesList())
    }
  }

  const onPlannedQuantityChange = (value: number) => {
    dispatch(setPackingSheetHeaderFormData({ name: 'plannedQuantity', value: value.toString() }))
    dispatch(setSelectedWarehouses([]))
    if (BOMItemsResponse?.data?.bomItems) {
      let t: SelectedWarehouseStock[] = []
      BOMItemsResponse?.data.bomItems?.map((i, ind) => {
        const tempL: SelectedWarehouseStock = {
          index: 1,
          itemCode: i.code,
          fromWarehouse: null,
          isToWarehouseRequired: false,
          selectedLot: null,
          lotOptions: [],
          plannedQuantity: parseFloat((i.basedQuantity * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          remainingQuantity: parseFloat((i.basedQuantity * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          error: "Minimum is planned quantity",
          isCollapsed: false

        }
        t = t.concat(tempL)

      })
      dispatch(setSelectedWarehouses(t))
    }

  }
  const addLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses]

    const previousForm = selectedWarehouses.find(item => item.itemCode === itemCode && item.index === index)
    if (previousForm) {
      updatedBOMItemsStock.push({
        itemCode,
        index: index + 1,
        isToWarehouseRequired: false,
        fromWarehouse: previousForm.fromWarehouse || null,
        selectedLot: null,
        lotOptions: previousForm?.lotOptions?.
          filter(batch => batch.batchId !== previousForm?.selectedLot?.batchId) || [],
        plannedQuantity: previousForm?.plannedQuantity,
        remainingQuantity: previousForm?.plannedQuantity - (previousForm?.selectedLot?.requiredQuantity || 0),
        error: "No Error", //TODO
        isCollapsed: true
      });
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
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

    dispatch(setSelectedWarehouses(updatedBOMItemsStock));
  };

  const onFetchOptions = () => {
    if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
      dispatch(setSalesOrderPage(salesOrderListPagination?.page + 1))
      dispatch(getSalesOrderList());
    }
  };

  const onSalesOrderSearchOptions = (value: string) => {
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
    dispatch(setSalesOrderSearchKey(value))
    dispatch(setSalesOrderPage(1))
    dispatch(getSalesOrderList());
    // }
  };

  const onWarehouseSelect = (itemCode: string, value: BlendWarehouse | null, index: number) => {
    if (value) {
      const isMoreExisting = selectedWarehouses?.map(item =>
        item.itemCode === itemCode).length
      if (isMoreExisting > 1) {
        const i = BOMItemsResponse.data?.bomItems.find(item =>
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
          plannedQuantity: parseFloat(((i?.basedQuantity || 0) * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          remainingQuantity: parseFloat(((i?.basedQuantity || 0) * packingSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          error: "Minimum is planned quantity",
          isCollapsed: false
        });
        dispatch(setSelectedWarehouses(updatedBOMItemsStock));
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
        dispatch(setSelectedWarehouses(updatedBOMItemsStock));
      }
    }
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
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));

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
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));

  };

  const onLotSelect = (itemCode: string, value: LotStock | null, warehouse: BlendWarehouse | null, index: number) => {
    if (warehouse) {

      const updatedBOMItemsStock = selectedWarehouses?.map(item =>
        item.itemCode === itemCode
          && item.index === index
          ? {
            ...item,
            selectedLot: value ? {
              batchId: value?.batchId,
              quantity: value?.quantity,
              requiredQuantity: 0,
              boxNo: value?.boxNo
            } : null,

          }
          : item
      );
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  }
  const isError = (requiredQuantity: number, plannedQuantity: number, lotQuantity: number, ) => {
    let err = "No Error"
    if (requiredQuantity > lotQuantity || requiredQuantity > plannedQuantity) {
      err = "Exceeded"
    } else if ((requiredQuantity ) < plannedQuantity) {
      err = "Minimum is planned quantity"
    } else if ((requiredQuantity ) > plannedQuantity) {
      err = "Exceeded"
    } else {
      err = "No Error"
    }
    // console.log('error', requiredQuantity, plannedQuantity, lotQuantity)
    return err
  }
  const onEnterRequiredQuantity = (requiredQuantity: number, itemCode: string, warehouse: BlendWarehouse | null, lot: LotStock | null, index: number, plannedQuantity: number) => {

    if (warehouse && lot) {
      const value: LotStock = {
        batchId: lot.batchId,
        quantity: lot.quantity,
        requiredQuantity: requiredQuantity,
        price: null,
        weightPerBag: null
      }
      let updatedBOMItemsStock = selectedWarehouses?.map(item =>
        item.itemCode === itemCode
          && item.index === index
          ? {
            ...item,
            selectedLot: value,
            remainingQuantity: item.plannedQuantity - requiredQuantity,
            error: isError(requiredQuantity, plannedQuantity, lot.quantity)
          }
          : item
      );
      dispatch(setSelectedWarehouses(updatedBOMItemsStock));
    }
  }
  const cancelPlan = () => {
    dispatch(setSelectedSalesOrder(null))
    dispatch(setSelectedPackingItemCode(null))
    dispatch(setSelectedProduct(null))
    dispatch(resetCreatePackingSheet())
    router.push(ROUTES.PACKING_SHEETS)

  };
  const onOrderDateChange = (date: Dayjs | null) => {
    dispatch(setPackingSheetHeaderFormData({ name: 'orderDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
  }

  const onStartDateChange = (date: Dayjs | null) => {
    dispatch(setPackingSheetHeaderFormData({ name: 'startDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
  }

  const onDueDateChange = (date: Dayjs | null) => {
    dispatch(setPackingSheetHeaderFormData({ name: 'dueDate', value: date?.format('YYYY-MM-DDTHH:mm:ss[Z]') || '' }))
  }
  return (
      
    <Grid>
      <CatalogueManagementHeader
        title={"Create Packing"}
        breadcrumbs={breadcrumbs}
        showBorder={false}
      />
      {/* sheet one test- end */}
      <PackingSheetHeaderBar
        salesOrderList={salesOrderList.data.data}
        salesOrderListIsLoading={salesOrderListIsLoading}
        selectedSalesOrder={selectedSalesOrder}
        onSalesOrderSelect={onSalesOrderSelect}
        onPackingItemSelect={onPackingItemSelect}
        packingDetail={packingDetail}
        packingHeaderForm={packingSheetHeaderForm}
        onProductSelection={onProductSelection}
        selectedProduct={selectedProduct}
        productListIsLoading={productListIsLoading}
        onFetchOptions={onFetchOptions}
        onPlannedQuantityChange={onPlannedQuantityChange}
        selectedPackingItem={packingDetail}
        username={username}
        onSearchOptions={onSalesOrderSearchOptions}
        initialPlannedQuantity={initialPlannedQuantity}
        isView={false}
        isEdit={false}
        onOrderDateChange={onOrderDateChange}
        onStartDateChange={onStartDateChange}
        onDueDateChange={onDueDateChange}
      />

      {packingDetail && BOMItemsResponse.isLoading && (
        <CircularProgress color="primary" size={20} />
      )}
      {packingDetail?.plannedQuantity !== 0 && BOMItemsResponse.data?.bomItems && (
        <PackingingSheetBomDetails
          toWarehouse={packingSheetHeaderForm?.warehouse?.value || "-"}
          toWarehouseList={toWarehouseList.data || []}
          blendBOMdetails={BOMItemsResponse.data}
          addLot={addLot}
          isView={false}
          onDeleteLot={onDeleteLot}
          // BOMItemsStock={BOMItemsResponse.data}
          plannedProductQuantity={packingSheetHeaderForm.plannedQuantity.value || 1}
          warehouseList={warehouseListResponse.data}
          onWarehouseSelect={onWarehouseSelect}
          selectedWarehouses={selectedWarehouses}
          onLotSelect={onLotSelect}
          onEnterRequiredQuantity={onEnterRequiredQuantity}
          setOpen={setOpen}
        // onAdditionalWarehouseSelect={onAdditionalWarehouseSelect}
        // onLotAdditionalSelect={onLotAdditionalSelect}
        // addAdditionalLot={addAdditionalLot}
        />
      )}
      {(salesOrderList.hasError || BOMItemsResponse.hasError || (createPackingSheetResponse.hasError && !createPackingSheetResponse.isLoading)) && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
          // action={<CloseIcon onClick={() => {dispatch(setBuyerErrorAlert(false))}}/>}
          >
            {salesOrderList?.message || BOMItemsResponse?.message || createPackingSheetResponse?.message || ''}
          </Alert>
        </Grid>
      )}
      {packingDetail?.plannedQuantity === 0 && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
          // action={<CloseIcon onClick={() => {dispatch(setBuyerErrorAlert(false))}}/>}
          >
           Packing Sheet already created for the selected Packing Item
          </Alert>
        </Grid>
      )}
      {/* <CatalogueTab id={params.view}/> */}
      {packingDetail?.plannedQuantity >0 && BOMItemsResponse.data?.bomItems && (
        <Grid container textAlign={"right"} p={2}>
          <Grid item xs={12} lg={12} p={2}>
            <Button
              variant="outlined"
              sx={{ marginRight: 1 }}
              onClick={cancelPlan}>Cancel</Button>
            <Button
              variant="contained"
              onClick={createPackingSheetPlan}
               disabled={selectedWarehouses.some(g => g.error !== "No Error") ||
                              ((packingSheetHeaderForm?.plannedQuantity?.value &&
                                packingSheetHeaderForm?.plannedQuantity?.value) > packingDetail?.plannedQuantity)
                              || dayjs(packingSheetHeaderForm?.dueDate?.value) < dayjs(packingSheetHeaderForm?.startDate?.value)
                            ||packingDetail?.plannedQuantity === 0}
             >
              Plan
              {createPackingSheetResponse.isLoading && (
                <CircularProgress size={5} />
              )}
            </Button>
          </Grid>
        </Grid>
      )}
      <ConfirmationMessage
        dialogTitle="SUCCEEDED"
        dialogContentText={
          <>
            {createPackingSheetResponse?.data && (
              <div>Packing Sheet has been successfully created!</div>
            )}
          </>
        }
        open={createPackingSheetResponse.isSuccess}
        onClose={handleClose}
        showCloseButton={true}
      />
    </Grid>
      


  )
}



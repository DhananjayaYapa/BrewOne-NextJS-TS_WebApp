'use client'
import HeaderBar from "@/components/headerBar/headerBar"
import { Alert, Box, Button, fabClasses, Grid, GlobalStyles, CircularProgress } from "@mui/material"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import PackingSheetHeaderBar from "@/components/packingSheetManagement/packingSheet/packingSheetHeaderBar";
import PackingSheetBomDetails from "@/components/packingSheetManagement/packingSheet/bomDetails";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { Auth } from "@aws-amplify/auth";

import { LotStock, SelectedWarehouseStock, BlendWarehouse } from "@/interfaces/salesOrder";
import { useRouter } from "next/navigation";
import { editPackingSheet, getPackingSheetByDetail, getToWarehousesList, getWarehousesByItemCodes, releasePackingSheet } from "@/redux/action/editPackingSheetAction";
import { resetEditResponse, resetReleaseResponse, setPackingSheetHeaderFormData, setIsEdit, setIsRelease, setSelectedPackingSheet, setSelectedEditWarehouses, setIsView } from "@/redux/slice/editPackingSheetSlice";
import dayjs, { Dayjs } from "dayjs";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { PackingSheet } from "@/interfaces";
import { SCREEN_MODES } from "@/constant";
import { devNull } from "node:os";

type Props = {
  params: { view: string };
  searchParams: { mode?: string };
};

export default function PackingSheetView({ params, searchParams }: Props) {
  const screenMode = searchParams.mode ?? 'view';
  const dispatch = useDispatch<AppDispatch>();
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [openReleaseConfirmation, setReleaseOpenConfirmation] = useState<boolean>(false);
  const isEdit = useSelector(
    (state: RootState) => state.editPackingSheet.isEdit
  )

  const breadcrumbs = [
    {
      id: 1,
      link: "Packing Sheets",
      route: "/packing-sheet",
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: isEdit ? 'Edit Packing Sheet' : 'View Packing Sheet',
      route: "",
    },
  ];

  const toWarehouseList = useSelector(
    (state: RootState) => state.editPackingSheet.toWarehouseListResponse
  )

  const selectedSalesOrder = useSelector(
    (state: RootState) => state.editPackingSheet.selectedSalesOrder
  )

  const selectedProduct = useSelector(
    (state: RootState) => state.editPackingSheet.selectedProduct
  )

  const blendDetail = useSelector(
    (state: RootState) => state.editPackingSheet.selectedPackingDetail
  )

  const blendSheetHeaderForm = useSelector(
    (state: RootState) => state.editPackingSheet.editPackingSheetHeaderForm
  )

  const BOMItems = useSelector(
    (state: RootState) => state.editPackingSheet.BOMItems
  )

  const warehouseListResponse = useSelector(
    (state: RootState) => state.editPackingSheet.warehouseListResponse
  )
console.log(warehouseListResponse,'warehouseListResponse')
  const selectedWarehouses = useSelector(
    (state: RootState) => state.editPackingSheet.selectedWarehouses
  )
console.log(warehouseListResponse,'warehouseListResponse')
console.log(selectedWarehouses,warehouseListResponse,'selectedWarehouses')
  const editPackingSheetResponse = useSelector(
    (state: RootState) => state.editPackingSheet.editPackingSheetResponse
  )
  const selectedPackingItem = useSelector(
    (state: RootState) => state.editPackingSheet.selectedPackingItem
  )

  const selectedPackingSheet = useSelector(
    (state: RootState) => state.editPackingSheet.selectedPackingSheet
  )
  console.log(selectedPackingSheet,'RuzaikRismy')

  const getPackingSheetDetailResponse = useSelector(
    (state: RootState) => state.editPackingSheet.getPackingSheetDetailResponse
  )

  const releasePackingSheetResponse = useSelector(
    (state: RootState) => state.editPackingSheet.releasePackingSheetResponse
  )

  const isRelease = useSelector(
    (state: RootState) => state.editPackingSheet.isRelease
  )

  const isView = useSelector(
    (state: RootState) => state.editPackingSheet.isView
  )

  const releaseResponse = useSelector(
    (state: RootState) => state.editPackingSheet.releasePackingSheetResponse
  )
  const router = useRouter();
  useEffect(() => {
    if (editPackingSheetResponse.isSuccess) {
      setOpenConfirmation(false)
    }
  }, [editPackingSheetResponse])
  useEffect(() => {
    if (releaseResponse.hasError) {
      setReleaseOpenConfirmation(false)
    }
  }, [releaseResponse])

  useEffect(() => {
    if (selectedPackingSheet === null) {
      const selectedPackingSheet: PackingSheet = {
        packingSheetId: Number(params.view),
        salesOrderId: 0,
        packingSheetNumber: "",
        packingItemCode: "",
        packingItemDescription: "",
        packingDate: "",
        statusId: 0,
        statusName: "",
        plannedQuantity: 0,
        createdBy: "",
        createdAt: "",
        updatedBy: "",
        updatedAt: ""
      }
      dispatch(setSelectedPackingSheet(selectedPackingSheet))
      dispatch(getPackingSheetByDetail())

      if (screenMode === SCREEN_MODES.EDIT) {
        dispatch(setIsEdit(true))
      }else if(screenMode === SCREEN_MODES.RELEASE){
        dispatch(setIsRelease(true))
      }else{
        dispatch(setIsView(true))
      }
    }

    return(() => {
      dispatch(setIsEdit(false))
      dispatch(setIsRelease(false))
      dispatch(setIsView(false))
    })
  }, [])


  useEffect(() => {
    if (selectedPackingSheet !== null) {
      dispatch(getPackingSheetByDetail())
    }
  }, [selectedPackingSheet])

  useEffect(() => {
    if (selectedSalesOrder !== null) {
      dispatch(setPackingSheetHeaderFormData({ name: 'salesOrderId', value: selectedSalesOrder?.salesOrderId.toString() || "" }))
      dispatch(setPackingSheetHeaderFormData({ name: 'orderDate', value: selectedSalesOrder?.orderDate.toString() || '' }))
      dispatch(setPackingSheetHeaderFormData({ name: 'startDate', value: selectedSalesOrder?.startDate.toString() || '' }))
      dispatch(setPackingSheetHeaderFormData({ name: 'dueDate', value: selectedSalesOrder?.dueDate.toString() || '' }))
      dispatch(setPackingSheetHeaderFormData({ name: 'customerCode', value: selectedSalesOrder?.customerCode || '' }))
    }
  }, [selectedSalesOrder !== null])

  useEffect(() => {

    dispatch(setPackingSheetHeaderFormData({ name: 'productItemCode', value: selectedProduct?.productItemCode?.toString() || '' }));
  }, [selectedProduct])

  useEffect(() => {

    dispatch(setPackingSheetHeaderFormData({ name: 'warehouse', value: selectedPackingItem?.warehouseCode?.toString() || '' }))
    dispatch(setPackingSheetHeaderFormData({ name: 'plannedQuantity', value: selectedPackingItem?.plannedQuantity?.toString() || '' }))
  }, [selectedPackingItem])

  useEffect(() => { //todo
    if (BOMItems?.bomItems) {
      dispatch(getWarehousesByItemCodes(BOMItems?.bomItems?.map((i) => i.code).toString()))
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
          selectedLot: lotsLength <= 1
              ? warehouses.find(w1 => w1.warehouseCode === item.fromWarehouse?.warehouseCode)?.lots[0]
              : null,
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

  const editPackingSheetPlan = () => {
    setOpenConfirmation(true)
  }
  const releasePackingSheetPlan = () => {
    setReleaseOpenConfirmation(true)
  }

  const onPlannedQuantityChange = (value: number) => {
    dispatch(setPackingSheetHeaderFormData({ name: 'plannedQuantity', value: value.toString() }))
    dispatch(setSelectedEditWarehouses([]))
    if (BOMItems?.bomItems) {
      let t: SelectedWarehouseStock[] = []
      BOMItems?.bomItems?.map((i, ind) => {
        const tempL: SelectedWarehouseStock = {
          index: 1,
          itemCode: i.code,
          fromWarehouse: null,
          isToWarehouseRequired: false,
          selectedLot: {
            batchId: "",
            quantity: 0,
            requiredQuantity: 0,
            price: null,
            weightPerBag: null
          },
          lotOptions: [],
          plannedQuantity: parseFloat((i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          remainingQuantity: parseFloat((i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)),
          error: "Minimum is planned quantity",
          isCollapsed: false

        }
        t = t.concat(tempL)

      })
      dispatch(setSelectedEditWarehouses(t))
    }

  }
  const addLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses]

    const previousForm = selectedWarehouses.find(item => item.itemCode === itemCode && item.index === index)
    console.log(previousForm,'previousForm')
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
        isCollapsed: true
      });
      console.log(updatedBOMItemsStock,'updatedBOMItemsStock')
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

    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
  };

  const onFetchOptions = () => {
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

  const onToWarehouseSelect = (itemCode: string, value: BlendWarehouse | null, index: number) => {
    // if (value) {
    const updatedBOMItemsStock = selectedWarehouses?.map(item =>
      item.itemCode === itemCode
        ? {
          ...item,
          toWarehouse: value,
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
          price: value?.price || null,
          weightPerBag: value?.weightPerBag || null
        }
      }
      const updatedBOMItemsStock = selectedWarehouses?.map(item =>
        item.itemCode === itemCode
          && item.index === index
          ? {
            ...item,
            selectedLot: val,
          }
          : item
      );
      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  }

  const isError = (requiredQuantity: number, plannedQuantity: number, lotQuantity: number) => {
    let err = "No Error"
    if (requiredQuantity > lotQuantity || requiredQuantity > plannedQuantity) {
      err = "Exceeded"
    } else if ((requiredQuantity) < plannedQuantity) {
      err = "Minimum is planned quantity"
    } else if ((requiredQuantity) > plannedQuantity) {
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
        price: lot?.price || null,
        weightPerBag: lot?.weightPerBag || null
      }
      // const totalQuantity = parseFloat((selectedWarehouses
      //   .filter(item => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
      //   .reduce((sum, item) => sum + (item.selectedLot?.requiredQuantity || 0), 0))?.toFixed(3));

      const lotQuantity = parseFloat(((warehouseListResponse.data.find(o => o.itemCode === itemCode)?.warehouses?.find(w => w.lots)
        ?.lots?.find(l => l.batchId === lot.batchId)?.quantity || 0) +
        (BOMItems?.bomItems
          ?.find((e: { code: string; }) => e.code === itemCode)?.lots
          ?.find(l => l.batchId === lot?.batchId)?.quantity || 0))?.toFixed(3))

      const updatedBOMItemsStock = selectedWarehouses?.map(item =>
        item.itemCode === itemCode
          && item.index === index
          ? {
            ...item,
            selectedLot: value,
            remainingQuantity: item.plannedQuantity - requiredQuantity,
            error: isError(requiredQuantity, plannedQuantity, lotQuantity)
          }
          : item
      );

      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  }

  const cancelPlan = () => {
    dispatch(setSelectedPackingSheet(null))
    dispatch(setSelectedEditWarehouses([]))
    dispatch(resetEditResponse())
    dispatch(resetReleaseResponse())
    dispatch(setIsEdit(false))
    router.back()

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

  const handleClose = () => {
    if (editPackingSheetResponse.isSuccess) {
      dispatch(setIsEdit(false))
      dispatch(setIsRelease(true))
      setOpenConfirmation(false)
      dispatch(resetEditResponse())
    } else {
      dispatch(setIsRelease(false))
      setReleaseOpenConfirmation(false)
      dispatch(resetReleaseResponse())
      router.back()

    }
  }

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false)
  }

  const handleUpdateConfirmation = () => {
    dispatch(editPackingSheet())
    setOpenConfirmation(false)

  }

  const handleCloseReleaseConfirmation = () => {
    setReleaseOpenConfirmation(false)
  }

  const handleUpdateReleaseConfirmation = () => {
    dispatch(releasePackingSheet())
    setReleaseOpenConfirmation(false)

  }

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const printPlan = () => {
    setIsPrintClicked(true);
    setTimeout(() => {
      window.print();
      setIsPrintClicked(false);
    });
  }

  const packingDetail = {
    packingItemDescription: selectedPackingItem?.description || "",
    packingItemCode: selectedPackingItem?.code || "",
    plannedQuantity: selectedPackingItem?.description || "",
    ...selectedPackingItem
  }


  return (
    <Grid>
      <style jsx global>{`
       @media print {
       body * {
         visibility: hidden;
      }

      .print-only {
        visibility: visible !important;
        display: block !important;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }

      .print-only * {
        visibility: visible !important;
      }

      HeaderBar > *:not(.print-only) {
        display: none !important;
      }

      .MuiTextField-root {
        border: none !important;
      }

      .MuiInputAdornment-root{
        display: none !important;
      }

      .MuiAutocomplete-endAdornment{
        display: none !important;
      }

      .MuiOutlinedInput-notchedOutline {
        border: none !important;
      }

      .MuiPaper-elevation1 {
        box-shadow: none !important;
      }

      .MuiInput-underline:before,
        .MuiInput-underline:after {
          display: none !important;
      }

        /* Override disabled styling */
        .Mui-disabled {
          opacity: 1 !important;
          -webkit-text-fill-color: #000 !important; /* Re-enable black text color */
          color: #000 !important;
          cursor: default !important;
        }

            // ABOVE FIXED
             @page {
                size: A4 landscape;
            }

            html, body {
                width: 100%;
                height: auto;
            }
        }
      `}</style>
      
        <main className='print-only'>
          {!isPrintClicked && (
            <CatalogueManagementHeader
              title={"Packing Sheet"}
              breadcrumbs={breadcrumbs}
              showBorder={false}
            />
          )}
          {selectedSalesOrder && (
            <PackingSheetHeaderBar
              salesOrderList={[]}
              salesOrderListIsLoading={false}
              selectedSalesOrder={selectedSalesOrder}
              isView={isRelease || isView}
              isEdit={isEdit}
              selectedProduct={selectedProduct}
              productListIsLoading={false}
              selectedPackingItem={selectedPackingItem}
              packingDetail={packingDetail}
              onFetchOptions={onFetchOptions}
              packingHeaderForm={blendSheetHeaderForm}
              username={getPackingSheetDetailResponse.data?.createdBy || ""}
              initialPlannedQuantity={getPackingSheetDetailResponse.data?.plannedQuantity || 0}
              onPlannedQuantityChange={onPlannedQuantityChange}
              onOrderDateChange={onOrderDateChange}
              onStartDateChange={onStartDateChange}
              onDueDateChange={onDueDateChange}

            />
          )}
          {selectedPackingItem && BOMItems?.bomItems && selectedWarehouses && (
            <PackingSheetBomDetails
              plannedProductQuantity={blendSheetHeaderForm.plannedQuantity.value || 1}
              toWarehouseList={toWarehouseList.data || []}
              blendBOMdetails={BOMItems}
              selectedWarehouses={selectedWarehouses}
              setOpen={setOpen}
              onWarehouseSelect={onWarehouseSelect}
              warehouseList={warehouseListResponse.data} //todo reset this or move to edit slice
              isView={isRelease || isView}

              addLot={addLot}
              onDeleteLot={onDeleteLot}
              onLotSelect={onLotSelect}
              onEnterRequiredQuantity={onEnterRequiredQuantity}
              toWarehouse={blendSheetHeaderForm?.warehouse?.value || "-"} />
          )}
          {(editPackingSheetResponse.hasError || releasePackingSheetResponse.hasError) && (
            <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
              <Alert
                variant="filled"
                severity="error"
                sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
              // action={<CloseIcon onClick={() => {dispatch(setBuyerErrorAlert(false))}}/>}
              >
                {editPackingSheetResponse?.message || releasePackingSheetResponse?.message || ''}
              </Alert>
            </Grid>
          )}
          {selectedPackingItem && BOMItems?.bomItems && !isView && (
            <Grid container textAlign={"right"} p={2}>
              <Grid item xs={12} lg={12} p={2}>
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={cancelPlan}>Cancel</Button>
                <Button
                  variant="contained"
                  sx={{ marginRight: 1 }}
                  onClick={editPackingSheetPlan}
                  disabled={selectedWarehouses.some(g => g.error !== "No Error")
                    || !isEdit ||
                    dayjs(blendSheetHeaderForm?.dueDate?.value) < dayjs(blendSheetHeaderForm?.startDate?.value)}
                >
                  Save as Planned
                  {editPackingSheetResponse.isLoading && (
                    <CircularProgress size={20} color={"info"} />
                  )}
                </Button>
                <Button
                  variant="contained"
                  onClick={releasePackingSheetPlan}
                  disabled={selectedWarehouses.some(g => g.error !== "No Error") || !isRelease}
                >
                  Release
                  {releasePackingSheetResponse.isLoading && (
                    <CircularProgress size={20} color={"info"} />
                  )}
                </Button>
              </Grid>
            </Grid>
          )}
          {isView && !isPrintClicked && (
            <Grid container textAlign={"right"} p={2}>
              <Grid item xs={12} lg={12} p={2}>
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={printPlan}>
                  Print
                </Button>
              </Grid>
            </Grid>
          )}
          <ConfirmationMessage
            dialogTitle="SUCCEEDED"
            dialogContentText={
              <>
                {editPackingSheetResponse.data && (
                  <div>{editPackingSheetResponse.data}</div>
                )}
                {releasePackingSheetResponse.data && (
                  <div>{releasePackingSheetResponse?.data?.message}
                    Doc Entry Number: {releasePackingSheetResponse?.data?.docEntry}</div>
                )}
              </>
            }
            open={editPackingSheetResponse.isSuccess || releasePackingSheetResponse.isSuccess}
            onClose={handleClose}
            showCloseButton={true}
          />

          <ConfirmationMessage
            dialogTitle="Confirm Update"
            dialogContentText={
              <div>Are you sure you want to update this packing sheet?</div>
            }
            open={openConfirmation}
            onClose={handleCloseConfirmation}
            showCloseButton={true}
            buttons={[
              {
                buttonText: "Confirm",
                onClick: handleUpdateConfirmation,
              },
              {
                buttonText: "Close",
                onClick: handleCloseConfirmation,
                design: 'outlined'
              },
            ]}
          />

          <ConfirmationMessage
            dialogTitle="Confirm Release"
            dialogContentText={
              <div>Please note that you are unable to edit this after you send this packing sheet to the
                SAP. Are you sure you want to continue?</div>
            }
            open={openReleaseConfirmation}
            onClose={handleCloseReleaseConfirmation}
            showCloseButton={true}
            buttons={[
              {
                buttonText: "Confirm",
                onClick: handleUpdateReleaseConfirmation,
              },
              {
                buttonText: "Close",
                onClick: handleCloseReleaseConfirmation,
                design: 'outlined'
              },
            ]}
          />
        </main>
      
    </Grid>
  )
}



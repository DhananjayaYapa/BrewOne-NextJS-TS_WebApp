"use client";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import CreateSendingDeliveryOrderTable from "./createDeliveryOrderTable/createDeliveryOrderTable";
import {
  setdeliveryDateValue,
  setCreateDOPage,
  setCreateDOLimit,
  setTabStatus,
  setSelectedRows,
  resetCreateDeliveryOrderResponse,
  resetCreateDeliveryOrder,
  setErrorAlertOpen,
  setIsSelectAllChecked,
} from "@/redux/slice/sendingDeliveryOrderSlice";
import {
  createSendingDeliveryOrder
} from "@/redux/action/sendingDeliveryOrderAction";
import Styles from "./createDeliveryOrder.module.scss";
import { getDeliveryOrderMasterData } from "@/redux/action/dataAction";
import {
  CreateDeliveryOrderRequest,
  CreateSendingDeliveryOrderRequest,
  DeliveryItem,
  Driver,
  SalesOrder,
  TeaLot,
  Vehicle,
  Warehouse,
} from "@/interfaces";
import {
  resetSelectedOptions,
  setSelectedDriver,
  setSelectedVehicle,
  setSelectedSalesOrder,
} from "@/redux/slice/dataSlice";
import ConfirmationMessage from "../confirmationMessage/confirmationMessage";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
import ViewDeliveryOrder from "../deliveryOrder/deliveryOrderView/deliveryOrderView";
import { getDeliveryItemsById } from "@/redux/action/sendingDeliveryOrderAction";
import { AnyARecord } from "node:dns";
import AsyncSingleAutocomplete from "../common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";
import { setSalesOrderPage, setSalesOrderSearchKey } from "@/redux/slice/createPackingSheetSlice";
import { getSalesOrderList } from "@/redux/action/packingSheetAction";

export default function CreateDeliveryOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const tableHeaderData = [
    {
      id: "code",
      column: "Item Code",
    },
    {
      id: "description",
      column: "Description",
    },
    {
      id: "quantity",
      column: "Quantity",
    }
  ];

  const deliveryItems = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.tableData.data
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.totalCountDO
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.limitDO
  );

  const totalPages = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.totalPagesDO
  );

  const page = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.currentPageDO
  );

  const deliveryDateValue = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.deliveryDateValue
  );

  const deliveryOrderMasterData = useSelector(
    (state: RootState) => state.data.data.deliveryOrderMasterData
  );

  const selectedVehicle = useSelector(
    (state: RootState) => state.data.selectedVehicle
  );

  const selectedDriver = useSelector(
    (state: RootState) => state.data.selectedDriver
  );

  const selectedSalesOrder = useSelector(
    (state: RootState) => state.data.selectedSalesOrder
  );

  const selectedRows = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.selectedRows
  );

  const createDeliveryOrderResponse = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDeliveryOrderResponse
  );

  const errorAlertOpen = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.errorAlertOpen
  );

  const salesOrderList = useSelector(
    (state: RootState) => state.createBlendSheet.salesOrderListResponse
  )

  
  const salesOrderListIsLoading = useSelector(
    (state: RootState) => state.createPackingSheet.salesOrderListResponse.isLoading
  )

    const salesOrderListPagination = useSelector(
    (state: RootState) => state.createPackingSheet.salesOrderListRequest
  )

    const onFetchOptions = () => {
      if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
        dispatch(setSalesOrderPage(salesOrderListPagination?.page + 1))
        dispatch(getSalesOrderList());
      }
    };

  useEffect(() => {
    dispatch(setTabStatus("4"));
    // dispatch(getPurchasedTeaLotDetails());
    dispatch(getDeliveryOrderMasterData());
    dispatch(getSalesOrderList());
  }, [dispatch]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCreateDOPage(newPage));
    dispatch(setTabStatus("4"));
    dispatch(getSalesOrderList());
    // dispatch(getPurchasedTeaLotDetails());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setCreateDOLimit(Number(event.target.value)));
    dispatch(setCreateDOPage(0));
    dispatch(setTabStatus("4"));
    dispatch(getSalesOrderList());
    // dispatch(getPurchasedTeaLotDetails());
  };

  const handleOnCollectionDateChange = (value: Dayjs | null) => {
    dispatch(setdeliveryDateValue(value?.toDate() || undefined));
  };

  const handleVehicleChange = (newValue: Vehicle | null) => {
    if (newValue) {
      dispatch(setSelectedVehicle(newValue));
    } else {
      dispatch(setSelectedVehicle(null));
    }
  };

  const handleDriverChange = (newValue: Driver | null) => {
    if (newValue) {
      dispatch(setSelectedDriver(newValue));
    } else {
      dispatch(setSelectedDriver(null));
    }
  };

  const handleSalesOrderChange = (newValue: SalesOrder | null) => {
    if (newValue) {
      dispatch(setSelectedSalesOrder(newValue));
      dispatch(getDeliveryItemsById(newValue.salesOrderId));
    } else {
      dispatch(setSelectedSalesOrder(null));
    }
  };

  const handleCancelCreateDO = () => {
    dispatch(resetCreateDeliveryOrderResponse());
    dispatch(resetSelectedOptions());
    dispatch(resetCreateDeliveryOrder());
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsSelectAllChecked(false));
     router.push(ROUTES.SENDING_DELIVERY_ORDERS);
  };

  const handleCreateDO = () => {
    if (
      !deliveryDateValue ||
      !selectedVehicle ||
      !selectedDriver ||
      !selectedSalesOrder
    ) {
      dispatch(setErrorAlertOpen(true));
      return;
    }

    const items = deliveryItems.filter((item:any) => selectedRows.includes(item.code))?.map((item:any) => ({
      'itemCode': item.code,
      'itemDescription': item.description,
      'quantity': item.quantity
    }));
    const createDeliveryOrderRequest: CreateSendingDeliveryOrderRequest = {
      deliveryDate: dayjs(deliveryDateValue).format("YYYY-MM-DDTHH:mm:ss")+"Z",
      vehicleId: selectedVehicle?.vehicleId,
      driverId: selectedDriver?.driverId,
      salesOrderId: selectedSalesOrder?.salesOrderId,
      items: [],
    };
    
    createDeliveryOrderRequest.items = items as [];
    dispatch(createSendingDeliveryOrder(createDeliveryOrderRequest));
  };

  const handleClose = () => {
    if (createDeliveryOrderResponse.isSuccess) {
      dispatch(resetCreateDeliveryOrderResponse());
      dispatch(resetCreateDeliveryOrder());
      dispatch(setIsSelectAllChecked(false));
      dispatch(resetSelectedOptions());
      dispatch(setErrorAlertOpen(false));
      router.push(ROUTES.SENDING_DELIVERY_ORDERS);
    }
    if (createDeliveryOrderResponse.hasError) {
      dispatch(resetCreateDeliveryOrderResponse());
    }
  };
  const onSalesOrderSearchOptions = (value: string) => {
    // if (salesOrderListPagination?.page && salesOrderList.data.totalPages > salesOrderListPagination?.page) {
    dispatch(setSalesOrderSearchKey(value))
    dispatch(setSalesOrderPage(1))
    dispatch(getSalesOrderList());
    // }
  };
  return (
    <Grid container>
      <Grid
        container
        item
        alignItems="center"
        justifyContent="space-between"
        p={1}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={4}>
          {/* Date picker for Collection date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Delivery date"
              slotProps={{
                textField: {
                  size: "small",
                  error: !deliveryDateValue && errorAlertOpen,
                  helperText:
                    !deliveryDateValue && errorAlertOpen
                      ? "Please select a deliveryDate date"
                      : "",
                },
              }}
              minDate={dayjs()}
              onChange={handleOnCollectionDateChange}
              sx={{ width: "100%" }}
              value={deliveryDateValue ? dayjs(deliveryDateValue) : null}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          {/* Autocomplete for Vehicle */}
          <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={deliveryOrderMasterData.vehicle}
            limitTags={1}
            size="small"
            value={selectedVehicle || null}
            getOptionLabel={(option: Vehicle) => option.vehicleNumber || ""}
            onChange={(event, value) => handleVehicleChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Vehicle"
                label="Vehicle"
                InputProps={{
                  ...params.InputProps,
                }}
                error={!selectedVehicle && errorAlertOpen}
                helperText={
                  !selectedVehicle && errorAlertOpen
                    ? "Please select a vehicle"
                    : ""
                }
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          {/* Autocomplete for Driver */}
          <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={deliveryOrderMasterData.driver}
            limitTags={1}
            size="small"
            value={selectedDriver || null}
            getOptionLabel={(option: Driver) => option.driverName || ""}
            onChange={(event, value) => handleDriverChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Driver"
                label="Driver"
                InputProps={{
                  ...params.InputProps,
                }}
                error={!selectedDriver && errorAlertOpen}
                helperText={
                  !selectedDriver && errorAlertOpen
                    ? "Please select a driver"
                    : ""
                }
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4} mt={1}>
          {/* Autocomplete for Unloading Warehouse */}
          {/* <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={salesOrderList.data.data}
            limitTags={1}
            size="small"
            value={selectedSalesOrder || null}
            getOptionLabel={(option: any) => option.salesOrderId || ""}
            onChange={(event, value) => handleSalesOrderChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Sales order"
                label="Sales order"
                InputProps={{
                  ...params.InputProps,
                }}
                error={!selectedSalesOrder && errorAlertOpen}
                helperText={
                  !selectedSalesOrder && errorAlertOpen
                    ? "Please select a Sales order"
                    : ""
                }
              />
            )}
          /> */}
           <AsyncSingleAutocomplete
                    fullWidth
                    loading={salesOrderListIsLoading}
                    options={salesOrderList.data.data}
                    placeHolder="Select Sales Order"
                    value={selectedSalesOrder || null}
                    onChange={(value) => handleSalesOrderChange && handleSalesOrderChange(value)}
                    onFetchOptions={onFetchOptions}
                    onSearch={(value) => onSalesOrderSearchOptions && onSalesOrderSearchOptions(value || "")}
                    displayKey={"salesOrderId"}
                  />
        </Grid>
      </Grid>

      <Grid container item m={2}>
        <CreateSendingDeliveryOrderTable
          tableData={deliveryItems?.filter((item:any)=>item.quantity >0) || []}
          tableHeaderData={tableHeaderData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          tableRowCount={tableRowCount}
          totalPages={totalPages}
          onSelectedRowsChange={setSelectedRows}
        />
      </Grid>

      <Box className={Styles.buttongrid}>
        <Button size="large" variant="outlined" onClick={handleCancelCreateDO}>
          CANCEL
        </Button>

        <Button size="large" variant="contained" onClick={handleCreateDO}>
          CREATE
        </Button>
      </Box>

      <ConfirmationMessage
        dialogTitle="SUCCEEDED"
        dialogContentText={
          <>
            {createDeliveryOrderResponse.message && (
              <div>{createDeliveryOrderResponse.message}</div>
            )}
            {createDeliveryOrderResponse.deliveryOrderNumber !== undefined && (
              <div>
                Delivery Order Number:{" "}
                {createDeliveryOrderResponse.deliveryOrderNumber}
              </div>
            )}
            {createDeliveryOrderResponse.deliveryOrderId !== undefined && (
              <div>
                Delivery Order Id: {createDeliveryOrderResponse.deliveryOrderId}
              </div>
            )}
          </>
        }
        open={createDeliveryOrderResponse.isSuccess}
        onClose={handleClose}
        showCloseButton={true}
      />

      <ConfirmationMessage
        dialogTitle="FAILED"
        dialogContentText={createDeliveryOrderResponse.message}
        open={createDeliveryOrderResponse.hasError}
        onClose={handleClose}
        buttons={[
          {
            buttonText: "Close",
            onClick: handleClose,
          },
        ]}
        showCloseButton={false}
      />
    </Grid>
  );
}

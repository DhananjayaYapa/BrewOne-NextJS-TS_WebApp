"use client";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import CreateDeliveryOrderTable from "./createDeliveryOrderTable/createDeliveryOrderTable";
import {
  setCollectionDateValue,
  setCreateDOPage,
  setCreateDOLimit,
  setTabStatus,
  setSelectedRows,
  resetCreateDeliveryOrderResponse,
  resetCreateDeliveryOrder,
  setErrorAlertOpen,
  setIsSelectAllChecked,
} from "@/redux/slice/deliveryOrderSlice";
import {
  createDeliveryOrder,
  getPurchasedTeaLotDetails,
} from "@/redux/action/deliveryOrderAction";
import Styles from "./createDeliveryOrder.module.scss";
import {
  getDeliveryOrderMasterData,
  getDeliverySalesOrderMasterData,
} from "@/redux/action/dataAction";
import {
  CreateDeliveryOrderRequest,
  Driver,
  TeaLot,
  Vehicle,
  Warehouse,
  DeliverySalesOrderMasterData,
} from "@/interfaces";
import {
  resetSelectedOptions,
  setSelectedDriver,
  setSelectedVehicle,
  setSelectedWarehouse,
} from "@/redux/slice/dataSlice";
import ConfirmationMessage from "../confirmationMessage/confirmationMessage";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
import ViewDeliveryOrder from "../deliveryOrder/deliveryOrderView/deliveryOrderView";

export default function CreateDeliveryOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  //   // states
  const [selectedSalesCode, setSelectedSalesCode] =
    useState<DeliverySalesOrderMasterData | null>(null);
  const [salesDate, setSalesDate] = useState<Date | undefined>(undefined);

  const tableHeaderData = [
    {
      id: "lotNo",
      column: "Lot number",
    },
    {
      id: "brokerCode",
      column: "Broker code",
    },
    {
      id: "boxNo",
      column: "Box number",
    },
    {
      id: "purchaseOrderNumber",
      column: "PO number",
    },
    {
      id: "bagCount",
      column: "Bags quantity",
    },
    {
      id: "totalQuantity",
      column: "Quantity",
    },
    {
      id: "storeAddress",
      column: "Store",
    },
    {
      id: "estateName",
      column: "Estate Name",
    },
    {
      id: "invoiceNo",
      column: "Invoice No.",
    },
    {
      id: "grade",
      column: "Grade",
    },
  ];

  const lotDetails = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.tableData.data
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.totalCountDO
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.limitDO
  );

  const totalPages = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.totalPagesDO
  );

  const page = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.currentPageDO
  );

  const collectionDateValue = useSelector(
    (state: RootState) => state.deliveryOrder.collectionDateValue
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

  const selectedWarehouse = useSelector(
    (state: RootState) => state.data.selectedWarehouse
  );

  const selectedRows = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.selectedRows
  );

  const createDeliveryOrderResponse = useSelector(
    (state: RootState) => state.deliveryOrder.createDeliveryOrderResponse
  );

  const errorAlertOpen = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.errorAlertOpen
  );

  const deliverySalesOrderMasterData = useSelector(
    (state: RootState) => state.data.data.deliverySalesOrderMasterData
  );

  useEffect(() => {
    dispatch(setTabStatus("4"));
    // if (selectedSalesCode?.salesCode && salesDate) {
    dispatch(
      getPurchasedTeaLotDetails({
        salesCode: selectedSalesCode?.salesCode,
        salesDate: salesDate
          ? dayjs(salesDate).format("YYYY-MM-DD")
          : undefined,
      })
    );
    // }

    dispatch(getDeliveryOrderMasterData());
    dispatch(getDeliverySalesOrderMasterData());
  }, [dispatch, selectedSalesCode, salesDate]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCreateDOPage(newPage));
    dispatch(setTabStatus("4"));
    dispatch(
      getPurchasedTeaLotDetails({
        salesCode: selectedSalesCode?.salesCode,
        salesDate: salesDate
          ? dayjs(salesDate).format("YYYY-MM-DD")
          : undefined,
      })
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setCreateDOLimit(Number(event.target.value)));
    dispatch(setCreateDOPage(0));
    dispatch(setTabStatus("4"));
    dispatch(
      getPurchasedTeaLotDetails({
        salesCode: selectedSalesCode?.salesCode,
        salesDate: salesDate
          ? dayjs(salesDate).format("YYYY-MM-DD")
          : undefined,
      })
    );
  };

  const handleOnCollectionDateChange = (value: Dayjs | null) => {
    dispatch(setCollectionDateValue(value?.toDate() || undefined));
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

  const handleWarehouseChange = (newValue: Warehouse | null) => {
    if (newValue) {
      dispatch(setSelectedWarehouse(newValue));
    } else {
      dispatch(setSelectedWarehouse(null));
    }
  };

  const handleSalesCodeChange = (
    newValue: DeliverySalesOrderMasterData | null
  ) => {
    if (newValue) {
      setSelectedSalesCode(newValue);
      setSalesDate(undefined);
    } else {
      setSelectedSalesCode(null);
    }
  };

  const handleSalesDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSalesDate(newValue?.toDate() || undefined);
    } else {
      setSalesDate(undefined);
    }
  };

  const handleCancelCreateDO = () => {
    dispatch(resetCreateDeliveryOrderResponse());
    dispatch(resetSelectedOptions());
    dispatch(resetCreateDeliveryOrder());
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsSelectAllChecked(false));
    setSelectedSalesCode(null);
    setSalesDate(undefined);
    router.push(ROUTES.DELIVERY_ORDERS);
  };

  const handleCreateDO = () => {
    if (
      !collectionDateValue ||
      // !selectedVehicle ||
      // !selectedDriver ||
      // !selectedWarehouse
      !salesDate ||
      !selectedSalesCode
    ) {
      dispatch(setErrorAlertOpen(true));
      return;
    }

    const teaLots = selectedRows?.map((lotId) => ({ lotId }));
    const createDeliveryOrderRequest: CreateDeliveryOrderRequest = {
      // customerId: 1,
      collectionDate: dayjs(collectionDateValue).format("YYYY-MM-DD"),
      vehicleId: selectedVehicle?.vehicleId,
      driverId: selectedDriver?.driverId,
      warehouseId: selectedWarehouse?.warehouseId,
      salesCode: selectedSalesCode?.salesCode,
      salesDate: dayjs(salesDate).format("YYYY-MM-DD"),
      teaLots: [],
    };

    createDeliveryOrderRequest.teaLots = teaLots as [];
    dispatch(createDeliveryOrder(createDeliveryOrderRequest));
  };

  const handleClose = () => {
    if (createDeliveryOrderResponse.isSuccess) {
      dispatch(resetCreateDeliveryOrderResponse());
      dispatch(resetCreateDeliveryOrder());
      dispatch(setIsSelectAllChecked(false));
      dispatch(resetSelectedOptions());
      dispatch(setErrorAlertOpen(false));
      setSalesDate(undefined);
      setSelectedSalesCode(null);
      router.push(ROUTES.DELIVERY_ORDERS);
    }
    if (createDeliveryOrderResponse.hasError) {
      dispatch(resetCreateDeliveryOrderResponse());
    }
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
        {/* Autocomplete for Sales code */}
        <Grid item xs={12} md={4} lg={4} mt={1}>
          <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={deliverySalesOrderMasterData}
            limitTags={1}
            size="small"
            value={selectedSalesCode || null}
            getOptionLabel={(option: DeliverySalesOrderMasterData) =>
              option.salesCode || ""
            }
            onChange={(event, value) => handleSalesCodeChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Sales code"
                label={
                  <span>
                    Sales code <span style={{ color: "red" }}>*</span>
                  </span>
                }
                error={!selectedSalesCode && errorAlertOpen}
                helperText={
                  !selectedSalesCode && errorAlertOpen
                    ? "Please select a sales code"
                    : ""
                }
              />
            )}
          />
        </Grid>

        {/* Autocomplete for Sales date */}
        <Grid item xs={12} md={4} lg={4} mt={1}>
          <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={
              selectedSalesCode?.dates?.map((d) => dayjs(d.salesDate)) || []
            }
            limitTags={1}
            size="small"
            value={salesDate ? dayjs(salesDate) : null}
            getOptionLabel={(option: Dayjs) => option.format("YYYY-MM-DD")}
            onChange={(event, value) => handleSalesDateChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Sales date"
                label={
                  <span>
                    Sales date <span style={{ color: "red" }}>*</span>
                  </span>
                }
                error={!salesDate && errorAlertOpen}
                helperText={
                  !salesDate && errorAlertOpen
                    ? "Please select a sales date"
                    : ""
                }
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          {/* Date picker for Collection date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={
                <span>
                  Collection date <span style={{ color: "red" }}>*</span>
                </span>
              }
              slotProps={{
                textField: {
                  size: "small",
                  error: !collectionDateValue && errorAlertOpen,
                  helperText:
                    !collectionDateValue && errorAlertOpen
                      ? "Please select a collection date"
                      : "",
                },
              }}
              minDate={dayjs()}
              onChange={handleOnCollectionDateChange}
              sx={{ width: "100%" }}
              value={collectionDateValue ? dayjs(collectionDateValue) : null}
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
                // error={!selectedVehicle && errorAlertOpen}
                helperText={""}
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
                // error={!selectedDriver && errorAlertOpen}
                helperText={""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4} mt={1}>
          {/* Autocomplete for Unloading Warehouse */}
          <Autocomplete
            fullWidth
            disablePortal
            filterSelectedOptions
            options={deliveryOrderMasterData.warehouse}
            limitTags={1}
            size="small"
            value={selectedWarehouse || null}
            getOptionLabel={(option: Warehouse) => option.warehouseName || ""}
            onChange={(event, value) => handleWarehouseChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Unloading Warehouse"
                label="Unloading Warehouse"
                InputProps={{
                  ...params.InputProps,
                }}
                // error={!selectedWarehouse && errorAlertOpen}
                helperText={""}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container item m={2}>
        <CreateDeliveryOrderTable
          tableData={lotDetails}
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

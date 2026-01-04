"use client";

import HeaderBar from "@/components/headerBar/headerBar"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { DeliveryOrderStatus } from "@/interfaces";
import { Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { getDeliveryOrderStatusList } from "@/redux/action/dataAction";
import { Dayjs } from "dayjs";
import { ROUTES } from "@/constant";
import DeliveryOrderFilter from "@/components/deliveryOrder/deliveryOrderFilter/deliveryOrderFilter";
import DeliveryOrderTable from "@/components/deliveryOrder/deliveryOrderTable/deliveryOrderTable";
import { getDeliveryOrderDetails } from "@/redux/action/deliveryOrderAction";
import {
  resetCreateDeliveryOrder,
  resetFilter,
  setCurrentPage,
  setDeliveryOrderStatusFilterValue,
  setFromDateFilterValue,
  setLimit,
  setSearchText,
  setToDateFilterValue,
} from "@/redux/slice/deliveryOrderSlice";
import DeliveryOrderHeader from "@/components/deliveryOrderHeader/deliveryOrderHeader";
import { resetSelectedOptions } from "@/redux/slice/dataSlice";

export default function DeliveryOrder() {
  const tableHeaderData = [
    {
      id: "doNumber",
      column: "DO Number",
    },
    {
      id: "vehicleNumber",
      column: "Vehicle number",
    },
    {
      id: "collectionDate",
      column: "Collection date",
    },
    {
      id: "warehouseName",
      column: "Unloading warehouse",
    },
    {
      id: "salesDate",
      column: "Sales date",
    },
    {
      id: "salesCode",
      column: "Sales code",
    },
    {
      id: "statusName",
      column: "Status",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const deliveryOrder = useSelector(
    (state: RootState) => state.deliveryOrder.tableData.data
  );
console.log(deliveryOrder,'deliveryOrder')
  const statusList = useSelector(
    (state: RootState) => state.data.data.deliveryOrderStatusList
  );

  const deliveryOrderStatus = useSelector(
    (state: RootState) => state.deliveryOrder.filterValues?.deliveryOrderStatus
  );

  const startDateValue = useSelector(
    (state: RootState) => state.deliveryOrder.filterValues?.fromDate
  );

  const endDateValue = useSelector(
    (state: RootState) => state.deliveryOrder.filterValues?.toDate
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.deliveryOrder.totalCount
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.deliveryOrder.limit
  );

  const totalPages = useSelector(
    (state: RootState) => state.deliveryOrder.totalPages
  );

  const page = useSelector(
    (state: RootState) => state.deliveryOrder.currentPage
  );

  const startDate = useSelector(
    (state: RootState) => state.deliveryOrder.filterValues.fromDate
  );

  useEffect(() => {
    dispatch(getDeliveryOrderDetails());
    dispatch(getDeliveryOrderStatusList());
  }, [dispatch]);

  const handleOnSearch = (value: string) => {
    dispatch(setSearchText(value));
    dispatch(getDeliveryOrderDetails());
  };

  const handleOnDeliveryOrderStatusChange = (
    value: DeliveryOrderStatus[] | null
  ) => {
    dispatch(setDeliveryOrderStatusFilterValue(value));
  };

  const handleOnFromDateChange = (value: Dayjs | null) => {
    dispatch(setFromDateFilterValue(value?.toDate() || null));
  };

  const handleOnToDateChange = (value: Dayjs | null) => {
    dispatch(setToDateFilterValue(value?.toDate() || null));
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCurrentPage(newPage));
    dispatch(getDeliveryOrderDetails());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setLimit(Number(event.target.value)));
    dispatch(setCurrentPage(0));
    dispatch(getDeliveryOrderDetails());
  };

  const handleOnApplyFilter = () => {
    dispatch(setCurrentPage(0));
    dispatch(getDeliveryOrderDetails());
  };

  const handleOnReset = () => {
    dispatch(setCurrentPage(0));
    dispatch(resetFilter());
    dispatch(getDeliveryOrderDetails());
  };
  const router = useRouter();
  const goToCreateDeliveryOrderPage = () => {
    window.location.href = ROUTES.CREATE_DELIVERY_ORDER;
    dispatch(resetFilter());
    dispatch(resetCreateDeliveryOrder());
    dispatch(resetSelectedOptions());
  };

  const breadcrumbs = [
    {
      id: 1,
      link: "Delivery Orders",
      route: ROUTES.DELIVERY_ORDERS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
  ];

  const createDeliveryOrderButton = (
    <Button
      size="large"
      variant="contained"
      color="primary"
      onClick={goToCreateDeliveryOrderPage}
      endIcon={<AddIcon />}
    >
      CREATE DELIVERY ORDER
    </Button>
  );

  return (
    <main>
      
      <DeliveryOrderHeader
        title={"Delivery Orders"}
        breadcrumbs={breadcrumbs}
        component={createDeliveryOrderButton}
      />
      <DeliveryOrderFilter
        onSearch={handleOnSearch}
        onApplyFilter={handleOnApplyFilter}
        onReset={handleOnReset}
        onFromDateChange={handleOnFromDateChange}
        onToDateChange={handleOnToDateChange}
        startDate={startDate || new Date()}
        onStateChange={handleOnDeliveryOrderStatusChange}
        startDateValue={startDateValue}
        endDateValue={endDateValue}
        deliveryOrderStatus={deliveryOrderStatus}
        deliveryOrderStatusList={statusList}
      />
      <Grid m={2}>
        <DeliveryOrderTable
          tableData={deliveryOrder}
          tableHeaderData={tableHeaderData}
          tableRowCount={tableRowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalPages={totalPages}
        />
      </Grid>
    </main>
  );
}

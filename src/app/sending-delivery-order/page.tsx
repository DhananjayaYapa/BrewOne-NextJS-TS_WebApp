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
import DeliveryOrderFilter from "@/components/sendingDeliveryOrder/deliveryOrderFilter/deliveryOrderFilter";
import DeliveryOrderTable from "@/components/sendingDeliveryOrder/deliveryOrderTable/deliveryOrderTable";
import { getSendingDeliveryOrderDetails } from "@/redux/action/sendingDeliveryOrderAction";
import {
  resetCreateDeliveryOrder,
  resetFilter,
  setCurrentPage,
  setDeliveryOrderStatusFilterValue,
  setFromDateFilterValue,
  setLimit,
  setSearchText,
  setToDateFilterValue,
} from "@/redux/slice/sendingDeliveryOrderSlice";
import DeliveryOrderHeader from "@/components/deliveryOrderHeader/deliveryOrderHeader";
import { resetSelectedOptions } from "@/redux/slice/dataSlice";

export default function SendingDeliveryOrder() {
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
      id: "deliveryDate",
      column: "Delivery date",
    },
    {
      id: "statusName",
      column: "Status",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const deliveryOrder = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.tableData.data
  );

  const statusList = useSelector(
    (state: RootState) => state.data.data.deliveryOrderStatusList
  );

  const deliveryOrderStatus = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.filterValues?.deliveryOrderStatus
  );

  const startDateValue = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.filterValues?.fromDate
  );

  const endDateValue = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.filterValues?.toDate
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.totalCount
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.limit
  );

  const totalPages = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.totalPages
  );

  const page = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.currentPage
  );

  const startDate = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.filterValues.fromDate
  );

  useEffect(() => {
    dispatch(getSendingDeliveryOrderDetails());
    dispatch(getDeliveryOrderStatusList());
  }, [dispatch]);

  const handleOnSearch = (value: string) => {
    dispatch(setSearchText(value));
    dispatch(getSendingDeliveryOrderDetails());
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
    dispatch(getSendingDeliveryOrderDetails());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setLimit(Number(event.target.value)));
    dispatch(setCurrentPage(0));
    dispatch(getSendingDeliveryOrderDetails());
  };

  const handleOnApplyFilter = () => {
    dispatch(setCurrentPage(0));
    dispatch(getSendingDeliveryOrderDetails());
  };

  const handleOnReset = () => {
    dispatch(setCurrentPage(0));
    dispatch(resetFilter());
    dispatch(getSendingDeliveryOrderDetails());
  };
  const router = useRouter();
  const goToCreateDeliveryOrderPage = () => {
    window.location.href = ROUTES.CREATE_SENDING_DELIVERY_ORDER;
    dispatch(resetFilter());
    dispatch(resetCreateDeliveryOrder());
    dispatch(resetSelectedOptions());
  };

  const breadcrumbs = [
    {
      id: 1,
      link: "Sending Delivery Orders",
      route: ROUTES.SENDING_DELIVERY_ORDERS,
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
      CREATE SENDING DELIVERY ORDER
    </Button>
  );

  const SDOStatusList = [
    { statusId: 1, statusName: 'SDO Created' },
    { statusId: 2, statusName: 'SDO Completed' },
  ];

  return (
    <main>
      
      <DeliveryOrderHeader
        title={"Sending Delivery Orders"}
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
        deliveryOrderStatusList={SDOStatusList}
      />
      <Grid m={2}>
        <DeliveryOrderTable
          tableData={deliveryOrder || []}
          tableHeaderData={tableHeaderData || []}
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

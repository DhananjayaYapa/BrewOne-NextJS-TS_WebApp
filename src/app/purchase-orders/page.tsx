"use client";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant";
import { PurchaseOrder } from "@/interfaces/purchaseOrder";
import PurchaseOrderFilter from "@/components/purchaseOrder/purchaseOrderFilter/purchaseOrderFilter";
import { getBrokerList, getPurchaseOrderList } from "@/redux/action/purchaseOrdersAction";
import PurchaseOrderTable from "@/components/purchaseOrder/purchaseOrderTable/purchaseOrderTable";
import {
  resetPurchaseOrderFilter,
  setBroker,
  setPurchaseOrderCurrentPage,
  setPurchaseOrderLimit,
  setPurchaseOrderSearchText,
  setPurchaseOrderStatus,
  setSelectedPurchaseOrder,
} from "@/redux/slice/purchaseOrdersSlice";

export default function PurchaseOrders() {
  const tableHeaderData = [
    {
      id: "purchaseOrderId",
      column: "PO ID",
    },
    {
      id: "purchaseOrderNumber",
      column: "PO No",
    },
    {
      id: "salesCode",
      column: "Sales Code",
    },
    {
      id: "catNo",
      column: "Catalogue No.",
    },
    {
      id: "brokerCode",
      column: "Broker Code",
    },
    {
      id: "brokerName",
      column: "Broker Name",
    },
    {
      id: "status",
      column: "Status",
    },
    {
      id: "createdBy",
      column: "Created By",
    },
    {
      id: "rejectReason",
      column: "Reject Reason",
    },
    {
      id: "POStatus",
      column: "PO Status",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const purchaseOrderListResponse = useSelector(
    (state: RootState) => state.purchaseOrderList.purchaseOrderListResponse
  );

  const purchaseOrderListRequest = useSelector(
    (state: RootState) => state.purchaseOrderList.purchaseOrderListRequest
  );

  const brokerList = useSelector(
    (state: RootState) => state.purchaseOrderList.brokerListReponse
  );

  useEffect(() => {
    dispatch(getBrokerList());
    dispatch(getPurchaseOrderList());
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setPurchaseOrderCurrentPage(newPage));
    dispatch(getPurchaseOrderList());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setPurchaseOrderLimit(Number(event.target.value)));
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(getPurchaseOrderList());
  };

  const router = useRouter();

  const onViewPO = (col: PurchaseOrder) => {
    dispatch(setSelectedPurchaseOrder(col));
    //     dispatch(setIsView(true))

    router.push(`purchase-orders/${col.purchaseOrderId}`);
  };

  const onBrokerChange = (broker: string | null) => {
    dispatch(setBroker(broker || undefined));
  };
  const onStatusChange = (broker: string | null) => {
    dispatch(setPurchaseOrderStatus(broker || undefined));
  };
  const onApplyFilter = () => {
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(getPurchaseOrderList());
  };

  const onReset = () => {
    dispatch(setPurchaseOrderCurrentPage(1));
    dispatch(resetPurchaseOrderFilter());
    dispatch(getPurchaseOrderList());
  };

  const onSearch = (value: string) => {
    dispatch(setPurchaseOrderSearchText(value));
    dispatch(getPurchaseOrderList());
  };
  const breadcrumbs = [
    {
      id: 1,
      link: "Purchase Orders",
      route: ROUTES.PURCHASE_ORDERS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
  ];
  return (
    <main>
      <Paper>
        <CatalogueManagementHeader
          title={"Purchase Orders"}
          breadcrumbs={breadcrumbs}
          // component={!isCloseSheetEnabled && createButton}
        />

        <Grid m={1}>
          <PurchaseOrderFilter
            purchaseOrderStatusList={["Pending", "Approved", "Rejected"]}
            purchaseOrderRequest={purchaseOrderListRequest}
            onStatusChange={onStatusChange}
            onApplyFilter={onApplyFilter}
            onReset={onReset}
            onSearch={onSearch}
            brokerCodeList={brokerList?.data.map((broker) => broker.brokerCode)}
            onBrokerChange={onBrokerChange}
          />
          <PurchaseOrderTable
            tableData={purchaseOrderListResponse.data.data}
            tableHeaderData={tableHeaderData}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            page={purchaseOrderListRequest?.page || 0}
            rowsPerPage={purchaseOrderListRequest?.limit || 0}
            tableRowCount={purchaseOrderListResponse.data.totalCount}
            tableDataIsLoading={purchaseOrderListResponse.isLoading}
            onView={onViewPO}
          />
        </Grid>
      </Paper>
    </main>
  );
}

"use client";
import { ROUTES } from "@/constant";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import CreateDeliveryOrder from "@/components/createSendingDeliveryOrder/createDeliveryOrder";
import HeaderBar from "@/components/headerBar/headerBar";

export default function CreateSendingDeliveryOrders() {
  const breadcrumbs = [
    {
      id: 1,
      link: "Sending Delivery Orders",
      route: ROUTES.SENDING_DELIVERY_ORDERS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: "Create Sending Delivery Order",
      route: ROUTES.CREATE_SENDING_DELIVERY_ORDER,
    },
  ];

  return (
    <main>
      
      <CatalogueManagementHeader
        title={"Create Sending Delivery Order"}
        breadcrumbs={breadcrumbs}
      />
      <CreateDeliveryOrder/>
    </main>
  );
}

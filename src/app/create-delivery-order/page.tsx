"use client";
import { ROUTES } from "@/constant";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import CreateDeliveryOrder from "@/components/createDeliveryOrder/createDeliveryOrder";
import HeaderBar from "@/components/headerBar/headerBar";

export default function CreateDeliveryOrders() {
  const breadcrumbs = [
    {
      id: 1,
      link: "Delivery Orders",
      route: ROUTES.DELIVERY_ORDERS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: "Create Delivery Order",
      route: ROUTES.CREATE_DELIVERY_ORDER,
    },
  ];

  return (
    <main>
      
      <CatalogueManagementHeader
        title={"Create Delivery Order"}
        breadcrumbs={breadcrumbs}
      />
      <CreateDeliveryOrder/>
    </main>
  );
}

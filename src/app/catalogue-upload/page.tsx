"use client";
import React from "react";
import styles from "./catalogueUpload.module.scss";
import UploadCatalog from "@/components/uploadCatalog/uploadCatalog";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { ROUTES } from "@/constant";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HeaderBar from "@/components/headerBar/headerBar";

export default function UploadCatalogue() {
  const breadcrumbs = [
    {
      id: 1,
      link: "Catalogue Management",
      route: ROUTES.CATALOGUE_MANAGEMENT,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: "Upload",
      route: ROUTES.UPLOAD_CATALOGUE,
    },
  ];

  return (
    <main className={styles.main}>
      
      <CatalogueManagementHeader
        title={"Upload Catalogue"}
        breadcrumbs={breadcrumbs}
      />
      <UploadCatalog />
    </main>
  );
}

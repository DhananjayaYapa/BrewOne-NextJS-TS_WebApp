"use client"
import {Tabs, Tab,Grid,Box } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CatalogueView from "../catalogueView/catalogueView";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getTabDetails } from "@/redux/action/catalogueAction";
import CatalogDetailsBar from "../catalogDetailsBar/catalogDetailsBar";
import CreatePurchaseOrder from "../createPurchaseOrder/createPurchaseOrder";
import CreateCanisterLabel from "../createCanisterLabel/createCanisterLabel";
import LabelIcon from '@mui/icons-material/Label';
import { resetPaginationData } from "@/redux/slice/gradingSlice";
import { setDataListInitial } from "@/redux/slice/lotDetailsSlice";
import CreateConfirmationNote from "../createConfirmationNote/createConfirmationNote";
import VerifiedIcon from '@mui/icons-material/Verified';

interface CatalogueTab{
  id: number}

export default function CatalogueTab({id}:CatalogueTab) {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => { dispatch(getTabDetails(id))}, [])
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const renderTabContent = (index:any) => {
      dispatch(resetPaginationData())
      dispatch(setDataListInitial())

      switch (index) {
          case 0:
              return <CatalogueView />;
          case 1:
              return <CreatePurchaseOrder />;
          case 2:
              return <CreateCanisterLabel />;
          case 3:
              return <CreateConfirmationNote />
          // case 3:
          //   return <UploadManagementGradingPage />;
          default:
              return null;
      }
  };

  const params = {
    view: id
  }

  return (
    <Grid container direction="column" alignItems="left" mb="1" >
      <CatalogDetailsBar params={params}/>
      <Box sx={{ maxWidth: { xs: 320, sm: 800 }}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="View-Purchasing-Grading tab"
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
        >
          <Tab
            icon={<RemoveRedEyeIcon />}
            label="View"
            iconPosition="start"
            disableRipple
          />
          <Tab
            icon={<ShoppingCartIcon />}
            label="Purchasing"
            iconPosition="start"
            disableRipple
          />
          <Tab
            icon={<LabelIcon />}
            label="Canister"
            iconPosition="start"
            disableRipple
          />
          <Tab
            icon={<VerifiedIcon />}
            label="Confirmation Note"
            iconPosition="start"
            disableRipple
          />
          {/* <Tab
            icon={<FormatAlignLeftIcon />}
            label="Grading"
            iconPosition="start"
            disableRipple
          /> */}
        </Tabs>
      </Box>
      <Grid item xs={12} md={8} lg={6}>
        {renderTabContent(value)}
      </Grid>
    </Grid>
  );
}



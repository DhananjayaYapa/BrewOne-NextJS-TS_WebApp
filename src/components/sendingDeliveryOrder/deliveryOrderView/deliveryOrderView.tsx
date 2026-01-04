"use client";

import {
  Grid,
  TextField,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  Pagination,
  TablePagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CatalogueManagementHeader from "../../catalogueManagementHeader/catalogueManagementHeader";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { DeliveryOrder, SendingDeliveryOrderItem, UpdateSendingDeliveryOrderActionRequest } from "@/interfaces";
import { useEffect, useState } from "react";
import {
  getSendingDeliveryOrderDetailsById,
  updateSendingDeliveryOrderAction,
} from "@/redux/action/sendingDeliveryOrderAction";
import {
  resetUdateDeliverOrderActionResponse,
  setCreateDOLimit,
  setCreateDOPage,
  setIsMarkAsCompleteClicked,
  setSelectedRow,
} from "@/redux/slice/sendingDeliveryOrderSlice";
import GetAppIcon from "@mui/icons-material/GetApp";
import ConfirmationMessage from "../../confirmationMessage/confirmationMessage";
import { ROUTES } from "@/constant";
import dayjs from "dayjs";
import HeaderBar from "@/components/headerBar/headerBar";
import Image from "next/image";
import logo from "../../../assets/brewone-logo.svg";
import CreateDeliveryOrderTable from "@/components/createSendingDeliveryOrder/createDeliveryOrderTable/createDeliveryOrderTable";
export interface ViewDeliveryOrder {
  viewDeliveryOrder?: DeliveryOrder;
  id: number;
}

export default function ViewDeliveryOrder({ id }: ViewDeliveryOrder) {
  const dispatch = useDispatch<AppDispatch>();

  const tableData = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.tableData.data
  );

  const deliveryOrderData = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.deliveryOrderData.deliveryOrder
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.totalCountDO
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.limitDO
  );

  const page = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.currentPageDO
  );

  const updateDeliverOrderActionResponse = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.updateDeliverOrderActionResponse
  );

  const isMarkAsCompleteClicked = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.isMarkAsCompleteClicked
  );

  const lotDetails = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.tableData.data
  );

  const totalPages = useSelector(
    (state: RootState) => state.sendingDeliveryOrder.createDO.totalPagesDO
  );

  const tableHeaderData = [
    {
      id: "code",
      column: "Code",
    },
    {
      id: "description",
      column: "Description",
    },
    {
      id: "quantity",
      column: "Quantity",
    },
  ];

  const breadcrumbs = [
    {
      id: 1,
      link: "Sending Delivery Orders",
      route: `/${ROUTES.SENDING_DELIVERY_ORDERS}`,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: deliveryOrderData.deliveryOrderNumber,
      route: "",
    },
  ];

  useEffect(() => {
    dispatch(getSendingDeliveryOrderDetailsById(id));
    dispatch(setSelectedRow(id));
    // dispatch(getDOCreatedTeaLotDetails());
  }, [dispatch]);

  useEffect(() => {
    console.log("Table data for current page 1 :", tableData);
  }, [tableData]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCreateDOPage(newPage));
    dispatch(setSelectedRow(id));
    // dispatch(getDOCreatedTeaLotDetails());
    console.log("Table data for new page 2 :", tableData);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setCreateDOLimit(Number(event.target.value)));
    dispatch(setCreateDOPage(0));
    dispatch(setSelectedRow(id));
    // dispatch(getDOCreatedTeaLotDetails());
    console.log("Table data for new rows per page 3 :", tableData);
  };

  const handleDOCompletedClick = () => {
    dispatch(setIsMarkAsCompleteClicked(true));
  };

  const printCreatedDO = () => {
    setIsPrintClicked(true);
    setTimeout(() => {
      window.print();
      setIsPrintClicked(false);
    });
  };

  const handleClose = () => {
    dispatch(resetUdateDeliverOrderActionResponse());
    dispatch(getSendingDeliveryOrderDetailsById(id));
  };

  const handleYes = () => {
    const updateSendingDeliveryOrderActionRequestBody: any = {
      statusId: 2,
    };
    dispatch(updateSendingDeliveryOrderAction(updateSendingDeliveryOrderActionRequestBody));
    dispatch(getSendingDeliveryOrderDetailsById(id));
    dispatch(setIsMarkAsCompleteClicked(false));
  };

  const handleNo = () => {
    dispatch(setIsMarkAsCompleteClicked(false));
  };

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  return (
    <>
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

        .no-print{
          display: none !important;
        }

            // ABOVE FIXED
             @page {
                size: A4 portrait;
            }

            html, body {
                width: 100%;
                height: auto;
            }
        }
      `}</style>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ padding: "20px" }}
        className={isPrintClicked ? "print-only" : "no-print"}
      >
        {/* {!isPrintClicked ?  : <Box sx={{ mb: 5 }}></Box>} */}

        {!isPrintClicked ? (
          <CatalogueManagementHeader
            title={`Sending Delivery Order - ${deliveryOrderData.deliveryOrderNumber}`}
            breadcrumbs={breadcrumbs}
            showBorder={true}
          />
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CatalogueManagementHeader
              title={`Sending Delivery Order - ${deliveryOrderData.deliveryOrderNumber}`}
              breadcrumbs={[]}
              showBorder={true}
            />
          </Grid>
        )}

        <Grid
          container
          item
          alignItems="center"
          justifyContent="space-between"
          p={1}
          spacing={1}
          mb={2}
        >
          <Grid item xs={12} md={3} lg={3}>
            <TextField
              size="small"
              label="Delivery date"
              id="delivery-date"
              value={
                deliveryOrderData.deliveryDate
                  ? dayjs(deliveryOrderData.deliveryDate).format("YYYY-MM-DD")
                  : "Collection date"
              }
              defaultValue="Collection date"
              disabled
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <TextField
              size="small"
              label="Vehicle"
              id="vehicle"
              value={deliveryOrderData.vehicleNumber}
              defaultValue="Vehicle"
              disabled
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <TextField
              size="small"
              label="Driver"
              id="driver"
              value={deliveryOrderData.driverName}
              defaultValue="Driver"
              disabled
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} md={3} lg={3} mt={1}>
            <TextField
              size="small"
              label="Delivery Order Number"
              id="do-number"
              value={deliveryOrderData.deliveryOrderNumber}
              defaultValue="Delivery Order Number"
              disabled
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3} mt={1}>
            <TextField
              size="small"
              label="Status"
              id="status"
              value={deliveryOrderData.statusName}
              defaultValue="Select Status"
              disabled
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} md={3} lg={3} mt={1}></Grid>

          <Grid item xs={12} md={3} lg={3} mt={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: { lg: "center" },
              }}
            >
              <Button
                size="medium"
                variant="contained"
                disabled={deliveryOrderData.statusId === 2}
                onClick={handleDOCompletedClick}
                className="no-print"
              >
                Mark as DO Completed
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid container item m={1}>
          <CreateDeliveryOrderTable
            tableData={deliveryOrderData?.items?.map((item:SendingDeliveryOrderItem)=>({code:item.itemCode, description:item.itemDescription, quantity:item.quantity})) || []}
            tableHeaderData={tableHeaderData}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            tableRowCount={tableRowCount}
            totalPages={totalPages}
            showCheckbox={false}
            paginationClassName={"no-print"}
          />
        </Grid>

        <Grid
          container
          xs={12}
          md={12}
          lg={12}
          justifyContent="flex-end"
          alignItems="center"
          mt={1}
          className="no-print"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: { lg: "center" },
              m: "20px",
            }}
          >
            <Button
              size="medium"
              variant="outlined"
              onClick={printCreatedDO}
              className="no-print"
            >
              Print
            </Button>
          </Box>
        </Grid>

        <ConfirmationMessage
          dialogTitle="SUCCEEDED"
          dialogContentText={updateDeliverOrderActionResponse.message}
          open={updateDeliverOrderActionResponse.isSuccess}
          onClose={handleClose}
          showCloseButton={true}
        />

        <ConfirmationMessage
          dialogTitle="FAILED"
          dialogContentText={updateDeliverOrderActionResponse.message}
          open={updateDeliverOrderActionResponse.hasError}
          onClose={handleClose}
          showCloseButton={true}
        />

        <ConfirmationMessage
          dialogContentText="Do you want to mark as Completed?"
          open={isMarkAsCompleteClicked}
          onClose={handleClose}
          buttons={[
            {
              buttonText: "Yes",
              onClick: handleYes,
            },
            {
              buttonText: "No",
              onClick: handleNo,
            },
          ]}
          showCloseButton={false}
        />
      </Grid>
    </>
  );
}

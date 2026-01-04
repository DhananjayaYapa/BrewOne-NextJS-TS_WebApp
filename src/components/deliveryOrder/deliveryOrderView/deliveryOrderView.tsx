"use client";

import { Grid, TextField, Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CatalogueManagementHeader from "../../catalogueManagementHeader/catalogueManagementHeader";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { DeliveryOrder, UpdateDeliveryOrderActionRequest } from "@/interfaces";
import { useEffect, useRef, useState } from "react"; // Added useRef
import {
  getDOCreatedTeaLotDetails,
  getDeliveryOrderAckReport,
  getDeliveryOrderDetailsById,
  updateDeliveryOrderAction,
} from "@/redux/action/deliveryOrderAction";
import {
  resetUdateDeliverOrderActionResponse,
  setCreateDOLimit,
  setCreateDOPage,
  setIsMarkAsCompleteClicked,
  setSelectedRow,
} from "@/redux/slice/deliveryOrderSlice";
import ConfirmationMessage from "../../confirmationMessage/confirmationMessage";
import { ROUTES } from "@/constant";
import dayjs from "dayjs";
import CreateDeliveryOrderTable from "@/components/createDeliveryOrder/createDeliveryOrderTable/createDeliveryOrderTable";
import DeliveryOrderPrintView from "./deliveryOrderPrintView";
import GetAppIcon from "@mui/icons-material/GetApp";
import { generatePDF } from "../../../utill/pdfGenerator";

export interface ViewDeliveryOrder {
  viewDeliveryOrder?: DeliveryOrder;
  id: number;
}

export default function ViewDeliveryOrder({ id }: ViewDeliveryOrder) {
  const dispatch = useDispatch<AppDispatch>();
  const printViewRef = useRef<HTMLDivElement>(null); // Ref for the print view

  const tableData = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.tableData.data
  );

  const deliveryOrderData = useSelector(
    (state: RootState) => state.deliveryOrder.deliveryOrderData.deliveryOrder
  );

  const tableRowCount = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.totalCountDO
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.limitDO
  );

  const page = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.currentPageDO
  );

  const updateDeliverOrderActionResponse = useSelector(
    (state: RootState) => state.deliveryOrder.updateDeliverOrderActionResponse
  );

  const isMarkAsCompleteClicked = useSelector(
    (state: RootState) => state.deliveryOrder.isMarkAsCompleteClicked
  );

  const lotDetails = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.tableData.data
  );
  const totalPages = useSelector(
    (state: RootState) => state.deliveryOrder.createDO.totalPagesDO
  );

  const deliveryOrderAckReportData = useSelector(
    (state: RootState) =>
      state.deliveryOrder.deliveryOrderAckReportData.deliveryOrderAckReport
  );

  const breadcrumbs = [
    {
      id: 1,
      link: "Delivery Orders",
      route: `/${ROUTES.DELIVERY_ORDERS}`,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: deliveryOrderData.deliveryOrderNumber,
      route: "",
    },
  ];

  useEffect(() => {
    dispatch(getDeliveryOrderDetailsById(id));
    dispatch(setSelectedRow(id));
    dispatch(getDOCreatedTeaLotDetails());
    dispatch(getDeliveryOrderAckReport(id));
  }, [dispatch, id]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    dispatch(setCreateDOPage(newPage));
    dispatch(setSelectedRow(id));
    dispatch(getDOCreatedTeaLotDetails());
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setCreateDOLimit(Number(event.target.value)));
    dispatch(setCreateDOPage(0));
    dispatch(setSelectedRow(id));
    dispatch(getDOCreatedTeaLotDetails());
  };

  const handleDOCompletedClick = () => {
    dispatch(setIsMarkAsCompleteClicked(true));
  };

  const handleClose = () => {
    dispatch(resetUdateDeliverOrderActionResponse());
    dispatch(getDeliveryOrderDetailsById(id));
  };

  const handleYes = () => {
    const updateDeliveryOrderActionRequest: UpdateDeliveryOrderActionRequest = {
      customerId: 1,
      statusId: 2,
    };
    dispatch(updateDeliveryOrderAction(updateDeliveryOrderActionRequest));
    dispatch(getDeliveryOrderDetailsById(id));
    dispatch(setIsMarkAsCompleteClicked(false));
  };

  const handleNo = () => {
    dispatch(setIsMarkAsCompleteClicked(false));
  };

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const printCreatedDO = () => {
    setIsPrintClicked(true);
    setTimeout(() => {
      window.print();
      setIsPrintClicked(false);
    }, 500);
  };

  const downloadAsPDF = async () => {
    if (!printViewRef.current) return;

    setIsDownloading(true);

    try {
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20px";

      // Clone the print view content
      const contentToPrint = printViewRef.current.cloneNode(
        true
      ) as HTMLElement;
      tempContainer.appendChild(contentToPrint);
      document.body.appendChild(tempContainer);

      // Generate PDF
      const filename = `Delivery-Note-${deliveryOrderData.deliveryOrderNumber}`;
      await generatePDF(tempContainer, filename);

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* PRINT STYLES */}
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
            background: white;
            padding: 20px;
          }
          .print-only * {
            visibility: visible !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          html,
          body {
            width: 100%;
            height: auto;
            font-family: Arial, sans-serif;
          }
        }
      `}</style>

      {/* Hidden print view for PDF generation */}
      <Box sx={{ display: "none" }}>
        <div ref={printViewRef}>
          <DeliveryOrderPrintView
            deliveryOrderAckReportData={deliveryOrderAckReportData}
          />
        </div>
      </Box>

      {/* NORMAL VIEW */}
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ padding: "20px" }}
        className="no-print"
      >
        <CatalogueManagementHeader
          title={`Delivery Order - ${deliveryOrderData.deliveryOrderNumber}`}
          breadcrumbs={breadcrumbs}
          showBorder={true}
        />

        {/* Top Fields */}
        <Grid container item alignItems="center" spacing={2} mb={2}>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Sales code"
              value={deliveryOrderData.salesCode || ""}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Sales date"
              value={
                deliveryOrderData.salesDate
                  ? dayjs(deliveryOrderData.salesDate).format("YYYY-MM-DD")
                  : ""
              }
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Collection date"
              value={
                deliveryOrderData.collectionDate
                  ? dayjs(deliveryOrderData.collectionDate).format("YYYY-MM-DD")
                  : ""
              }
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Vehicle"
              value={deliveryOrderData.vehicleNumber || ""}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Driver"
              value={deliveryOrderData.driverName || ""}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Delivery Order Number"
              value={deliveryOrderData.deliveryOrderNumber || ""}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Tooltip title={deliveryOrderData.warehouseName}>
              <TextField
                size="small"
                label="Unloading Warehouse"
                value={deliveryOrderData.warehouseName || ""}
                disabled
                fullWidth
              />
            </Tooltip>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              label="Status"
              value={deliveryOrderData.statusName || ""}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="medium"
                variant="contained"
                disabled={deliveryOrderData.statusId === 2}
                onClick={handleDOCompletedClick}
              >
                Mark as DO Completed
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* TABLE */}
        <Grid container item>
          <CreateDeliveryOrderTable
            tableData={lotDetails}
            tableHeaderData={[
              { id: "lotNo", column: "Lot number" },
              { id: "brokerCode", column: "Broker code" },
              { id: "boxNo", column: "Box number" },
              { id: "purchaseOrderNumber", column: "PO number" },
              { id: "bagCount", column: "Bags quantity" },
              { id: "totalQuantity", column: "Quantity" },
              { id: "storeAddress", column: "Store" },
              { id: "estateName", column: "Estate Name" },
              { id: "invoiceNo", column: "Invoice No." },
              { id: "grade", column: "Grade" },
            ]}
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

        {/* ACTION BUTTONS */}
        <Grid container justifyContent="flex-end" mt={2} spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={printCreatedDO}>
              Print
            </Button>
            <Button
              variant="outlined"
              onClick={downloadAsPDF}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* PRINT-ONLY VIEW */}
      {isPrintClicked && (
        <Box className="print-only">
          <DeliveryOrderPrintView
            deliveryOrderAckReportData={deliveryOrderAckReportData}
          />
        </Box>
      )}

      {/* CONFIRMATION DIALOGS */}
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
    </>
  );
}

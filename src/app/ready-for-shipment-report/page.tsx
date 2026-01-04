'use client';

import { getBlendShipmentReport } from "@/redux/action/readyForShipmentAction";
import { clearShipmentReport } from "@/redux/slice/readyForShipmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import ReadyForShipmentReportFilter from "@/components/reports/readyForShipmentReport/readyForShipmentFilter";
import ReadyForShipmentReportTable from "@/components/reports/readyForShipmentReport/ReadyForShipmentReportTable";
import { Grid, Paper, Typography, Box, Button, Alert } from "@mui/material";
import { Dayjs } from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { generateReadyForShipmentPDF } from '@/components/reports/readyForShipmentReport/pdfGenerator';

export default function ReadyForShipmentReport() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use useSelector to get data from Redux store
  const { data, loading, error } = useSelector((state: RootState) => state.readyForShipment);
  
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  // Flatten the nested data structure and ensure array type
  const flattenedData = Array.isArray(data?.[0]) ? data[0] : Array.isArray(data) ? data : [];

  const handleGenerateReport = () => {
    if (!fromDate || !toDate) {
      setAlertMessage("Please select both from and to dates");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    const payload = {
      startDate: fromDate.format("YYYY-MM-DD"),
      endDate: toDate.format("YYYY-MM-DD"),
    };

    // Hide previous alerts when generating new report
    setShowAlert(false);
    
    // Dispatch the Redux async thunk
    dispatch(getBlendShipmentReport(payload));
  };

  // Show alerts based on API response
  useEffect(() => {
    if (!loading && data) {
      if (flattenedData.length > 0) {
        setAlertMessage(`Shipment report data has been generated successfully! Found ${flattenedData.length} records.`);
        setAlertSeverity("success");
        setShowAlert(true);
        
        // Auto hide success alert after 5 seconds
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      } else if (flattenedData.length === 0 && fromDate && toDate) {
        setAlertMessage(`No shipment report data available for the selected date range (${fromDate.format('YYYY-MM-DD')} to ${toDate.format('YYYY-MM-DD')}). Please try different dates.`);
        setAlertSeverity("info");
        setShowAlert(true);
      }
    }
  }, [data, loading, flattenedData]);

  // Show error alerts from Redux
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertSeverity("error");
      setShowAlert(true);
    }
  }, [error]);

  const handleResetAll = () => {
    setFromDate(null);
    setToDate(null);
    // Clear the data when resetting
    dispatch(clearShipmentReport());
    setAlertMessage("All filters and data have been reset");
    setAlertSeverity("info");
    setShowAlert(true);
    
    // Auto hide reset alert after 3 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  const handleDownload = () => {
    if (!flattenedData || flattenedData.length === 0) {
      setAlertMessage("No data available to download");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    try {
      const formattedData = flattenedData.map(item => ({
        ...item,
        salesContractNo: item.salesContractNo?.toString() || ''
      }));
      
      const pdfDoc = generateReadyForShipmentPDF(formattedData, {
        title: 'Ready For Shipment Report',
        fromDate: fromDate?.format('YYYY-MM-DD') || '',
        toDate: toDate?.format('YYYY-MM-DD') || '',
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Ready_For_Shipment_Report_${timestamp}.pdf`;

      // Save the PDF
      pdfDoc.save(filename);
      
      // Show download success message
      setAlertMessage("Report downloaded successfully!");
      setAlertSeverity("success");
      setShowAlert(true);
      
      // Auto hide download success alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      // console.error('Error generating PDF:', error);
      setAlertMessage("Error generating PDF");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handlePrint = () => {
    if (!flattenedData || flattenedData.length === 0) {
      setAlertMessage("No data available to print");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    try {
      const formattedData = flattenedData.map(item => ({
        ...item,
        salesContractNo: item.salesContractNo?.toString() || ''
      }));

      const pdfDoc = generateReadyForShipmentPDF(formattedData, {
        title: 'Ready For Shipment Report',
        fromDate: fromDate?.format('YYYY-MM-DD') || '',
        toDate: toDate?.format('YYYY-MM-DD') || '',
        // generatedBy: 'ADMIN'
      });

      // Open print dialog
      const pdfBlob = pdfDoc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
      // Show print success message
      setAlertMessage("Report sent to printer successfully!");
      setAlertSeverity("success");
      setShowAlert(true);
      
      // Auto hide print success alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      // console.error('Error printing PDF:', error);
      setAlertMessage("Error printing PDF");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <main>
      <Paper elevation={2} sx={{ p: 2, m: 1, borderRadius: 2 }}>
        <CatalogueManagementHeader
          title="Ready For Shipment Report"
          breadcrumbs={[{ id: 1, link: "Ready For Shipment Report", route: "/" }]}
        />
        {showAlert && (
          <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
            <Alert
              variant="filled"
              severity={alertSeverity}
              onClose={handleCloseAlert}
              sx={{
                marginBottom: 1,
                fontWeight: "400",
                borderRadius: "16px",
                width: "100%",
              }}
            >
              {alertMessage}
            </Alert>
          </Grid>
        )}

        <Grid m={1}>
          <ReadyForShipmentReportFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onGenerateReport={handleGenerateReport}
            onResetAll={handleResetAll}
            onDownload={handleDownload}
            onPrint={handlePrint}
            isGenerating={loading}
          />
        </Grid>

        <Grid m={2} style={{ marginTop: "1rem" }}>
          {loading ? (
            <Typography textAlign="center">Loading...</Typography>
          ) : error ? (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          ) : Array.isArray(flattenedData) && flattenedData.length > 0 ? (
            <ReadyForShipmentReportTable data={flattenedData} />
          ) : (
            <Typography textAlign="center" color="textSecondary">
              No shipment data available.
            </Typography>
          )}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 3,
            pb: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            size="medium"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={loading || !Array.isArray(flattenedData) || !flattenedData.length}
            sx={{
              minWidth: 200,
              fontWeight: "500",
              borderRadius: 2,
              py: 1,
              borderWidth: 2,
              "&:hover": { borderWidth: 2, backgroundColor: "primary.light", color: "white" },
            }}
          >
            DOWNLOAD REPORT
          </Button>

          <Button
            size="medium"
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={loading || !Array.isArray(flattenedData) || !flattenedData.length}
            sx={{
              minWidth: 200,
              fontWeight: "500",
              borderRadius: 2,
              py: 1,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.15)", backgroundColor: "primary.dark" },
            }}
          >
            PRINT REPORT
          </Button>
        </Box>
      </Paper>
    </main>
  );
}
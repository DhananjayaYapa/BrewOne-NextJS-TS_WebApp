import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportMeta {
  title: string;
  fromDate: string;
  toDate: string;
}

export const generateReadyForShipmentPDF = (
  data: any[],
  meta: ReportMeta
) => {
  const doc = new jsPDF("p", "pt", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const rightAlign = pageWidth - 40;

  // ---- Header ----
  doc.setFontSize(9);
  doc.text("BrewOne", 40, 40);
  doc.text(new Date().toISOString().slice(0, 19).replace("T", " "), rightAlign, 40, { align: "right" });

  doc.setFontSize(10);


  doc.setFontSize(11);
  // Main title
  doc.setFontSize(11);
  doc.text("HVA FOODS PLC", pageWidth / 2, 60, { align: "center" });

  // Report title
  doc.text("Ready for Shipment Blends as at", pageWidth / 2, 75, { align: "center" });

  // Sub-line (beautifully styled date range)
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`${meta.fromDate}  —  ${meta.toDate}`, pageWidth / 2, 90, { align: "center" });

  // Reset color for rest of content
  doc.setTextColor(0);


  // ---- Table Header ----
  interface TableRow {
    blendNo: string;
    standard: string;
    salesContractNo: string;
    customer: string;
    quantity: string;
    averagePrice: string;
    value: string;
  }

  const columns: { header: string; dataKey: keyof TableRow }[] = [
    { header: "Blend No", dataKey: "blendNo" },
    { header: "Standard", dataKey: "standard" },
    { header: "Contract No", dataKey: "salesContractNo" },
    { header: "Customer", dataKey: "customer" },
    { header: "Ship Qty kg", dataKey: "quantity" },
    { header: "Average Price /kg", dataKey: "averagePrice" },
    { header: "Ship Value", dataKey: "value" },
  ];

  // ---- Table Body ----
  const tableData: TableRow[] = data.map((item) => ({
    blendNo: item.blendSheetNo || "-",
    standard: item.productDescription || "-",
    salesContractNo: item.salesContractNo || "-",
    customer: item.customer || "-",
    quantity: item.quantity ? Number(item.quantity).toFixed(2) : "0.00",
    averagePrice: item.averagePrice ? Number(item.averagePrice).toFixed(2) : "0.00",
    value: item.value ? Number(item.value).toFixed(2) : "0.00",
  }));

  autoTable(doc, {
    startY: 110,
    head: [columns.map((col) => col.header)],
    body: tableData.map((row) => columns.map((col) => row[col.dataKey])),
    styles: {
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
      halign: 'center'
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 20,
      halign: "center",
      fontStyle: "bold",
    },
    // to make particular columns alignment ajustments
    // columnStyles: {
    //   4: { halign: "left" }, // Ship Qty
    //   5: { halign: "left" }, // Average Price
    //   6: { halign: "left" }, // Ship Value
    // },
    margin: { top: 110, left: 40, right: 40 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.pages.length - 1;
      doc.setFontSize(9);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageWidth - 40, { align: "center" });
    },
  });

  // ---- Footer ----
  const generatedText = `Generated on: ${new Date().toLocaleString()}`;
  doc.setFontSize(9);
  doc.text(generatedText, 40, doc.internal.pageSize.getHeight() - 20);

  return doc;
};

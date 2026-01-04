import { Blend, BlendBalance, BlendItem, BlendSheetHeaderForm, FileData, ProductItem, SalesOrder, SelectedWarehouseStock } from "@/interfaces";
import { Autocomplete, Box, CircularProgress, Grid, IconButton, Link, List, ListItem, TextField, Tooltip, Typography } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from '@mui/icons-material/Close';

import DeleteIcon from "@mui/icons-material/Delete";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";
import { useState } from "react";
import { itemMasterService } from "@/service/ItemMasterService";

export interface BlendingSheetHeaderBarProps {
  salesOrderList: SalesOrder[]
  salesOrderListIsLoading: boolean
  selectedSalesOrder: SalesOrder | null
  selectedProduct: ProductItem | null;
  onSalesOrderSelect?: (value: SalesOrder | null) => void;
  onBlendItemSelect?: (value: BlendItem | null) => void;
  blendDetail: Blend | null;
  productListIsLoading: boolean;
  blendHeaderForm: BlendSheetHeaderForm | null
  onProductSelection?: (value: ProductItem | null) => void;
  onFetchOptions?: () => void
  onPlannedQuantityChange: (value: number) => void;
  selectedBlendItem: BlendItem | null,
  username: string;
  onSearchOptions?: (value: string) => void
  initialPlannedQuantity: number
  isView: boolean
  isEdit: boolean
  onOrderDateChange: (value: Dayjs | null) => void
  onStartDateChange: (value: Dayjs | null) => void
  onDueDateChange: (value: Dayjs | null) => void
  onRemarksChange: (value: string) => void
  handleRemoveFile: (indexToRemove: number) => void
  handleFileChange: (event: any) => void
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void
  files: FileData[]
  viewFile?: (fileKey: string) => void
  blendStatus: string
  attachmentError: string
  averageWeight: number
  averagePrice: number
  masterTotalQuantity?:number // default total
  totalQuantity:number
}

export default function BlendingSheetHeaderBar(props: BlendingSheetHeaderBarProps) {
  const {
    salesOrderList,
    selectedSalesOrder,
    onSalesOrderSelect,
    blendDetail,
    onProductSelection,
    selectedProduct,
    salesOrderListIsLoading,
    productListIsLoading,
    blendHeaderForm,
    selectedBlendItem,
    onFetchOptions,
    onBlendItemSelect,
    onPlannedQuantityChange,
    username,
    onSearchOptions,
    initialPlannedQuantity,
    isEdit,
    isView,
    onOrderDateChange,
    onStartDateChange,
    onDueDateChange,
    onRemarksChange,
    handleRemoveFile,
    handleFileChange,
    handleDrop,
    files,
    viewFile,
    blendStatus,
    attachmentError,
    averageWeight,
    averagePrice,
    masterTotalQuantity,
    totalQuantity
  } = props
  const GridField = ({ label, value }: { label: string; value: string }) => (
    <Grid xs={12} md={2} sm={2} p={1}>
      <Typography variant="h6">{label}</Typography>
      <Tooltip title={value}>
        <TextField
          variant="standard"
          value={value}
          type="text"
          fullWidth
          disabled
        />
      </Tooltip>
    </Grid>
  );

  const blendQuantity = masterTotalQuantity || selectedBlendItem?.quantity
console.log(blendHeaderForm,'blendHeaderForm')
  return (
    <Grid container direction="row" alignItems="left">
      <Grid xs={12} md={2} sm={2} p={1}>
        {/* {salesOrderList} */}

        <Typography variant="h6">Sales Contract No.</Typography>
        <AsyncSingleAutocomplete
          fullWidth
          loading={salesOrderListIsLoading}
          options={salesOrderList}
          placeHolder="Select Sales Contract No"
          value={selectedSalesOrder || null}
          onChange={(value) => onSalesOrderSelect && onSalesOrderSelect(value)}
          onFetchOptions={() => onFetchOptions && onFetchOptions()}
          onSearch={(value) => onSearchOptions && onSearchOptions(value || "")}
          displayKey={"salesOrderId"}
          disabled={isEdit || isView}
        />
      </Grid>
      {/* {selectedSalesOrder && ( */}
      <Grid xs={12} md={2} sm={2} p={1}>

        <Typography variant="h6">FG Product Code</Typography>
        <Autocomplete
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select FG Product Code "
            // label="Product No"
            />
          )}
          options={selectedSalesOrder?.productItems || []}
          size="small"
          value={selectedProduct}
          getOptionLabel={(option) => option.productItemCode || ""}
          //   isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
          onChange={(event, value) => onProductSelection && onProductSelection(value)}
          disabled={isEdit || isView || !selectedSalesOrder || selectedSalesOrder === undefined}
        />
      </Grid>
      {/* )} */}
      <GridField label="Sales Contract Quantity" value={selectedProduct?.salesContractQuantity?.toString() || '-'} />


      {/* {!productListIsLoading && selectedSalesOrder && blendDetail && ( */}
      <Grid xs={12} md={2} sm={2} p={1}>

        <Typography variant="h6">Blend Item Product Code</Typography>
        <Autocomplete
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Blend Item Product Code "
            // label="Product No"
            />
          )}
          options={blendDetail?.blendItems || []}
          size="small"
          value={selectedBlendItem || null}
          getOptionLabel={(option) => option.code || ""}
          loading={productListIsLoading}
          //   isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
          onChange={(event, value) => onBlendItemSelect && onBlendItemSelect(value)}
          disabled={isEdit || isView || (!selectedProduct || (!selectedSalesOrder))}
        />
      </Grid>

      <GridField label="Product Description" value={selectedBlendItem?.description || ""} />
      <GridField label="Blend Quantity" value={blendQuantity?.toString() || ""} />
      {/* )} */}
      {/* <Grid container> */}
      {/* {productListIsLoading && (
        <CircularProgress color="inherit" size={20} />
      )} */}
      {/* { ( */}
      {/* <> */}
      {/* <GridField label="Product No." value="productNo" /> */}
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Due Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // label="Due Date"
            slotProps={{
              textField: {
                size: "small",
                error: dayjs(blendHeaderForm?.dueDate?.value).startOf('day')
                  .isBefore(dayjs(blendHeaderForm?.startDate?.value).startOf('day')) ? true : false,
                helperText: dayjs(blendHeaderForm?.dueDate?.value).startOf('day')
                  .isBefore(dayjs(blendHeaderForm?.startDate?.value).startOf('day')) ? "Due date must be later than or the same as start date " : ""
              }
            }}
            onChange={onDueDateChange}
            sx={{ width: "100%" }}
            value={dayjs(blendHeaderForm?.dueDate?.value)}
            minDate={dayjs(blendHeaderForm?.startDate?.value)}
            disabled={isView || (productListIsLoading && !selectedSalesOrder && !blendDetail)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Order Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // label="Order"
            slotProps={{ textField: { size: "small", error: false } }}
            onChange={onOrderDateChange}
            sx={{ width: "100%" }}
            value={dayjs(blendHeaderForm?.orderDate?.value)}
            disabled={isView || (productListIsLoading && !selectedSalesOrder && !blendDetail)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Start Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // label="Start Date"
            slotProps={{ textField: { size: "small", error: false } }}
            onChange={onStartDateChange}
            sx={{ width: "100%" }}
            minDate={dayjs()}
            value={dayjs(blendHeaderForm?.startDate?.value)}
            disabled={isView || (productListIsLoading && !selectedSalesOrder && !blendDetail)}
          />
        </LocalizationProvider>
      </Grid>



      {/* )} */}
      {/* {!productListIsLoading && selectedBlendItem && blendDetail && selectedProduct && ( */}
      <>

        <GridField label="Warehouse" value={selectedBlendItem?.warehouseCode || ""} />
        <Grid xs={12} md={2} sm={2} p={1}>
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>Blend Planned Quantity (Kgs)</Typography>
          <TextField
            variant="standard"
            fullWidth
            value={blendHeaderForm?.actualPlannedQuantity?.value}
            type="number"
            onChange={(e) => onPlannedQuantityChange(parseFloat(e.target.value))}
            error={(blendHeaderForm?.actualPlannedQuantity?.value && blendQuantity) &&
              blendHeaderForm?.actualPlannedQuantity?.value < blendQuantity ? true :
              blendHeaderForm?.actualPlannedQuantity?.value === 0 ? true : false}
            helperText={(blendHeaderForm?.actualPlannedQuantity?.value && blendQuantity) &&
              blendHeaderForm?.actualPlannedQuantity?.value < blendQuantity ? `Cannot be lesser than ${blendQuantity}` :
              blendHeaderForm?.actualPlannedQuantity?.value === 0 ? 'Minimum is blend quantity value' : ""}
            InputProps={{
              inputProps: { step: 0.001, min: 0.001, max: parseFloat(initialPlannedQuantity?.toFixed(3)) }, // Set min and max constraints
            }}
            disabled={isView || isEdit || (productListIsLoading && !selectedSalesOrder && !blendDetail)}
          />
        </Grid>

        <GridField
          label="Total Allocated Quantity"
          value={
            Number.isNaN(totalQuantity) ? "-" : totalQuantity?.toFixed(3)
          }
        />
        <GridField
          label="Average Weight"
          value={
            Number.isNaN(averageWeight) ? "-" : averageWeight?.toFixed(3)
          }
        />
        <GridField
          label="Average Price"
          value={
            Number.isNaN(averagePrice) ? "-" : averagePrice?.toFixed(3)
          }
        />

        <GridField label="Customer" value={selectedSalesOrder?.customerCode || ''} />

        <GridField label="User" value={username} />
        <Grid xs={12} md={4} sm={4} p={1}>
        </Grid>
        <Grid xs={12} md={6} sm={6} p={1}>

          <Typography variant="h6">Attachments</Typography>
          <Box
            sx={{
              width: "100%",
              border: "2px dashed #1976d2",
              borderRadius: 2,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "action.hover" },
              p: 2,
            }}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()} // Prevents default behavior
          >
            {!isView && (
              <Typography>
                Drag & drop a file here or{" "}
                <label htmlFor="file-upload" style={{ color: "#1976d2", cursor: "pointer" }}>
                  <strong>click to select</strong>
                  <UploadFileIcon />
                </label>
              </Typography>
            )}
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* File List in 3 Columns */}
            <Grid container sx={{ mt: 1 }}>
              {files?.length <= 0 && isView && (
                <Typography variant="h6">No Attachments</Typography>
              )}
              {files?.map((file, index) => (
                <Grid item xs={12} sm={4} md={4} key={index} textAlign={"left"} alignItems={"center"} flexDirection={"row"} display={"flex"}>
                  {(isView || isEdit) && (
                    <Typography variant="body2" sx={{ textDecoration: 'underline' }}
                      onClick={(e) => {
                        if (file?.fileKey && viewFile) {
                          viewFile(file.fileKey);
                        } else {
                          const newTab = window.open(file?.url, "_blank");
                          if (newTab) {
                            newTab.focus();
                          }
                        }
                      }}>{file?.file?.name || file?.fileKey?.split('/').pop()}
                    </Typography>
                  )}
                  {!isView && !isEdit && (
                    <Link href={file.url} target="_blank" rel="noopener noreferrer">
                      {file?.file?.name || file?.fileKey?.split('/').pop()}
                    </Link>
                  )}
                  {!isView && (
                    <IconButton color="secondary" sx={{ fontSize: "10px !important", marginLeft: '2px' }}
                      onClick={(e) => handleRemoveFile(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
          <Typography color="error">{attachmentError}</Typography>

          {/* <input
              type="file"
              // ref={fileInputRef}
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <IconButton onClick={clickFileChange} disabled={isView}>
              <UploadFileIcon />
            </IconButton> */}

        </Grid>

        <Grid xs={12} md={4} sm={4} p={1}>
          <Typography variant="h6">Remarks</Typography>
          <Tooltip title={blendHeaderForm?.remarks?.value} placement="bottom">
            <TextField
              variant="standard"
              fullWidth
              value={blendHeaderForm?.remarks?.value}
              onChange={(e) => onRemarksChange(e.target.value)}
              multiline
              maxRows={5}
              rows={blendHeaderForm?.remarks?.value && blendHeaderForm?.remarks?.value?.length > 50 ? 5 : 1}
              disabled={isView}
            />
          </Tooltip>
        </Grid>

        <GridField label="Status" value={blendStatus?.charAt(0).toUpperCase() + blendStatus?.slice(1).toLowerCase()?.toLowerCase()} />

      </>
    </Grid>
  );
}

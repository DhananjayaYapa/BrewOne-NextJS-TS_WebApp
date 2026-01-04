import {
  Blend,
  BlendBalance,
  BlendItem,
  BlendSheetHeaderForm,
  FileData,
  ProductItem,
  SalesOrder,
  SelectedWarehouseStock,
} from "@/interfaces";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";
import { useState } from "react";
import { itemMasterService } from "@/service/ItemMasterService";

export interface TeaBoardSheetHeaderProps {
  salesOrderList: SalesOrder[];
  salesOrderListIsLoading: boolean;
  selectedSalesOrder: SalesOrder | null;
  selectedProduct: ProductItem | null;
  onSalesOrderSelect?: (value: SalesOrder | null) => void;
  onBlendItemSelect?: (value: BlendItem | null) => void;
  blendDetail: Blend | null;
  productListIsLoading: boolean;
  blendHeaderForm: BlendSheetHeaderForm | null;
  onProductSelection?: (value: ProductItem | null) => void;
  onFetchOptions?: () => void;
  onPlannedQuantityChange: (value: number) => void;
  selectedBlendItem: BlendItem | null;
  username: string;
  onSearchOptions?: (value: string) => void;
  initialPlannedQuantity: number;
  isView: boolean;
  isEdit: boolean;
  onOrderDateChange: (value: Dayjs | null) => void;
  onStartDateChange: (value: Dayjs | null) => void;
  onDueDateChange: (value: Dayjs | null) => void;
  onRemarksChange: (value: string) => void;
  handleRemoveFile: (indexToRemove: number) => void;
  handleFileChange: (event: any) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  files: FileData[];
  viewFile?: (fileKey: string) => void;
  blendStatus: string;
  attachmentError: string;
  averageWeight: number;
  averagePrice: number;
  masterTotalQuantity?:number // default total
  totalQuantity:number
}

export default function TeaBoardSheetHeader(props: TeaBoardSheetHeaderProps) {
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
    totalQuantity,
  } = props;
  const GridField = ({
    label,
    value,
    disabled,
  }: {
    label: string;
    value: string;
    disabled?: boolean;
  }) => (
    <Grid xs={12} md={2} sm={2} p={1}>
      <Typography variant="h6">{label}</Typography>
      <Tooltip title={value}>
        <TextField
          variant="standard"
          value={value}
          type="text"
          fullWidth
          disabled={disabled}
        />
      </Tooltip>
    </Grid>
  );

  const blendQuantity = masterTotalQuantity?.toString() || selectedBlendItem?.quantity?.toString()

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
          disabled
        />
      </Grid>
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">FG Product Code</Typography>
        <Autocomplete
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select FG Product Code "
            />
          )}
          options={selectedSalesOrder?.productItems || []}
          size="small"
          value={selectedProduct}
          getOptionLabel={(option) => option.productItemCode || ""}
          onChange={(event, value) =>
            onProductSelection && onProductSelection(value)
          }
          disabled
        />
      </Grid>
      <GridField
        label="Sales Contract Quantity"
        value={selectedProduct?.salesContractQuantity?.toString() || "-"}
        disabled={true}
      />

      {/* {!productListIsLoading && selectedSalesOrder && blendDetail && ( */}
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Blend Item Product Code</Typography>
        <Autocomplete
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Blend Item Product Code "
            />
          )}
          options={blendDetail?.blendItems || []}
          size="small"
          value={selectedBlendItem || null}
          getOptionLabel={(option) => option.code || ""}
          loading={productListIsLoading}
          onChange={(event, value) =>
            onBlendItemSelect && onBlendItemSelect(value)
          }
          disabled={isEdit || isView || !selectedProduct || !selectedSalesOrder}
        />
      </Grid>

      <GridField
        label="Product Description"
        value={selectedBlendItem?.description || ""}
        disabled={true}
      />
      <GridField
        label="Blend Quantity"
        value={blendQuantity || ""}
        disabled={true}
      />
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Due Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: {
                size: "small",
                error: dayjs(blendHeaderForm?.dueDate?.value)
                  .startOf("day")
                  .isBefore(
                    dayjs(blendHeaderForm?.startDate?.value).startOf("day")
                  )
                  ? true
                  : false,
                helperText: dayjs(blendHeaderForm?.dueDate?.value)
                  .startOf("day")
                  .isBefore(
                    dayjs(blendHeaderForm?.startDate?.value).startOf("day")
                  )
                  ? "Due date must be later than or the same as start date "
                  : "",
              },
            }}
            onChange={onDueDateChange}
            sx={{ width: "100%" }}
            value={dayjs(blendHeaderForm?.dueDate?.value)}
            minDate={dayjs(blendHeaderForm?.startDate?.value)}
            disabled={
              isView ||
              (productListIsLoading && !selectedSalesOrder && !blendDetail)
            }
          />
        </LocalizationProvider>
      </Grid>
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Order Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: "small", error: false } }}
            onChange={onOrderDateChange}
            sx={{ width: "100%" }}
            value={dayjs(blendHeaderForm?.orderDate?.value)}
            disabled={
              isView ||
              (productListIsLoading && !selectedSalesOrder && !blendDetail)
            }
          />
        </LocalizationProvider>
      </Grid>
      <Grid xs={12} md={2} sm={2} p={1}>
        <Typography variant="h6">Start Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: "small", error: false } }}
            onChange={onStartDateChange}
            sx={{ width: "100%" }}
            minDate={dayjs()}
            value={dayjs(blendHeaderForm?.startDate?.value)}
            disabled={
              isView ||
              (productListIsLoading && !selectedSalesOrder && !blendDetail)
            }
          />
        </LocalizationProvider>
      </Grid>
      <>
        <GridField
          label="Warehouse"
          value={selectedBlendItem?.warehouseCode || ""}
          disabled={true}
        />
        <Grid xs={12} md={2} sm={2} p={1}>
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Blend Planned Quantity (Kgs)
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            value={Number(
              blendHeaderForm?.actualPlannedQuantity?.value
            ).toFixed(2)}
            type="number"
            onChange={(e) =>
              onPlannedQuantityChange(parseFloat(e.target.value))
            }
            error={
              blendHeaderForm?.plannedQuantity?.value &&
              blendHeaderForm?.plannedQuantity?.value > initialPlannedQuantity
                ? true
                : blendHeaderForm?.plannedQuantity.error && blendDetail
                ? true
                : undefined
            }
            helperText={
              blendHeaderForm?.plannedQuantity?.value &&
              blendHeaderForm?.plannedQuantity?.value > initialPlannedQuantity
                ? `Cannot be greater than ${initialPlannedQuantity}`
                : blendDetail
                ? blendHeaderForm?.plannedQuantity.error
                : ""
            }
            InputProps={{
              inputProps: {
                step: 0.001,
                min: 0.001,
                max: parseFloat(initialPlannedQuantity?.toFixed(3)),
              },
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
          value={Number.isNaN(averageWeight) ? "-" : averageWeight?.toFixed(3)}
        />
        <GridField
          label="Average Price"
          value={Number.isNaN(averagePrice) ? "-" : averagePrice?.toFixed(3)}
        />

        <GridField
          label="Customer"
          value={selectedSalesOrder?.customerCode || ""}
          disabled={true}
        />

        <GridField label="User" value={username} disabled={true} />
        <Grid xs={12} md={4} sm={4} p={1}></Grid>
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
            onDragOver={(event) => event.preventDefault()}
          >
            {!isView && (
              <Typography>
                Drag & drop a file here or{" "}
                <label
                  htmlFor="file-upload"
                  style={{ color: "#1976d2", cursor: "pointer" }}
                >
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
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={index}
                  textAlign={"left"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  display={"flex"}
                >
                  {(isView || isEdit) && (
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "underline" }}
                      onClick={(e) => {
                        if (file?.fileKey && viewFile) {
                          viewFile(file.fileKey);
                        } else {
                          const newTab = window.open(file?.url, "_blank");
                          if (newTab) {
                            newTab.focus();
                          }
                        }
                      }}
                    >
                      {file?.file?.name || file?.fileKey?.split("/").pop()}
                    </Typography>
                  )}
                  {!isView && !isEdit && (
                    <Link
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file?.file?.name || file?.fileKey?.split("/").pop()}
                    </Link>
                  )}
                  {!isView && (
                    <IconButton
                      color="secondary"
                      sx={{ fontSize: "10px !important", marginLeft: "2px" }}
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
              rows={
                blendHeaderForm?.remarks?.value &&
                blendHeaderForm?.remarks?.value?.length > 50
                  ? 5
                  : 1
              }
            />
          </Tooltip>
        </Grid>

        <GridField
          label="Status"
          value={
            blendStatus?.charAt(0).toUpperCase() +
            blendStatus?.slice(1).toLowerCase()?.toLowerCase()
          }
          disabled={true}
        />
      </>
    </Grid>
  );
}

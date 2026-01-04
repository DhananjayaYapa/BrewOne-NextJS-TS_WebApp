import { Blend, BlendItem, BlendSheetHeaderForm, PackingData, PackingSheetHeaderForm, ProductItem, SalesOrder } from "@/interfaces";
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AsyncSingleAutocomplete from "@/components/common/AsyncSingleAutocomplete/AsyncSingleAutocomplete";

export interface packingSheetHeaderBarProps {
  salesOrderList: SalesOrder[]
  salesOrderListIsLoading: boolean
  selectedSalesOrder: SalesOrder | null
  selectedProduct: ProductItem | null;
  onSalesOrderSelect?: (value: SalesOrder | null) => void;
  onPackingItemSelect?: (value: BlendItem | null) => void;
  packingDetail: PackingData | null;
  productListIsLoading: boolean;
  packingHeaderForm: PackingSheetHeaderForm | null
  onProductSelection?: (value: ProductItem | null) => void;
  onFetchOptions: () => void
  onPlannedQuantityChange: (value: number) => void;
  selectedPackingItem: BlendItem | null,
  username: string;
  onSearchOptions?: (value: string) => void
  initialPlannedQuantity: number
  isView: boolean
  isEdit: boolean
  onOrderDateChange: (value: Dayjs | null) => void
  onStartDateChange: (value: Dayjs | null) => void
  onDueDateChange: (value: Dayjs | null) => void
}

export default function packingSheetHeaderBar(props: packingSheetHeaderBarProps) {
  const {
    salesOrderList,
    selectedSalesOrder,
    onSalesOrderSelect,
    packingDetail,
    onProductSelection,
    selectedProduct,
    salesOrderListIsLoading,
    productListIsLoading,
    packingHeaderForm,
    selectedPackingItem,
    onFetchOptions,
    onPlannedQuantityChange,
    username,
    onSearchOptions,
    initialPlannedQuantity,
    isEdit,
    isView,
    onOrderDateChange,
    onStartDateChange,
    onDueDateChange
  } = props
  const GridField = ({ label, value }: { label: string; value: string }) => (
    <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
      <Typography variant="h6">{label}</Typography>
      <TextField
        variant="standard"
        value={value}
        type="text"
        fullWidth
        disabled
        multiline
      />
    </Grid>
  );


  return (
    <Grid container direction="row" alignItems="left">
      <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
        {/* {salesOrderList} */}

        <Typography variant="h6">Sales Order</Typography>
        <AsyncSingleAutocomplete
          fullWidth
          loading={salesOrderListIsLoading}
          options={salesOrderList}
          placeHolder="Select Sales Order"
          value={selectedSalesOrder || null}
          onChange={(value) => onSalesOrderSelect && onSalesOrderSelect(value)}
          onFetchOptions={onFetchOptions}
          onSearch={(value) => onSearchOptions && onSearchOptions(value || "")}
          displayKey={"salesOrderId"}
          disabled={isEdit || isView}
        />
      </Grid>
      {/* {selectedSalesOrder && ( */}
        <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>

          <Typography variant="h6">Packing Item Code</Typography>
          <Autocomplete
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Item Product Code "
                fullWidth
              // label="Product No"
              />
            )}
            options={selectedSalesOrder?.productItems || []}
            size="small"
            value={selectedProduct}
            getOptionLabel={(option) => option.productItemCode || ""}
            //   isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
            onChange={(event, value) => onProductSelection && onProductSelection(value)}
            disabled={!selectedSalesOrder || isEdit || isView}
          />
        </Grid>
      {/* )}
      {productListIsLoading && (
        <CircularProgress color="inherit" size={20} />
      )} */}

      {/* {!productListIsLoading && selectedSalesOrder && packingDetail && (
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
            options={packingDetail?.blendItems}
            size="small"
            value={selectedPackingItem || null}
            getOptionLabel={(option) => option.code || ""}
            //   isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
            onChange={(event, value) => onBlendItemSelect && onBlendItemSelect(value)}
            disabled={isEdit  || isView}
          />
        </Grid>
      )} */}
      {/* <Grid container> */}
      {/* {!productListIsLoading && selectedSalesOrder && packingDetail && (
        <> */}
          <GridField label="Status" value={'Planned'} />
          {/* <GridField label="Product No." value="productNo" /> */}

          <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
            <Typography variant="h6">Order Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // label="Order"
                slotProps={{ textField: { size: "small", error: false } }}
                onChange={onOrderDateChange}
                sx={{ width: "100%" }}
                value={dayjs(packingHeaderForm?.orderDate?.value)}
                disabled={!selectedSalesOrder || !packingDetail || isView}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
            <Typography variant="h6">Start Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // label="Start Date"
                slotProps={{ textField: { size: "small", error: false } }}
                onChange={onStartDateChange}
                sx={{ width: "100%" }}
                minDate={dayjs()}
                value={dayjs(packingHeaderForm?.startDate?.value)}
                disabled={!selectedSalesOrder || !packingDetail || isView}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
            <Typography variant="h6">Due Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // label="Due Date"
                slotProps={{
                  textField: {
                    size: "small",
                    error: dayjs(packingHeaderForm?.dueDate?.value) < dayjs(packingHeaderForm?.startDate?.value) ? true : false,
                    helperText: dayjs(packingHeaderForm?.dueDate?.value) < dayjs(packingHeaderForm?.startDate?.value) ? "Due date must be later than or the same as start date " : ""
                  }
                }}
                onChange={onDueDateChange}
                sx={{ width: "100%" }}
                value={dayjs(packingHeaderForm?.dueDate?.value)}
                minDate={dayjs(packingHeaderForm?.startDate?.value)}
                disabled={!selectedSalesOrder || !packingDetail || isView}
              />
            </LocalizationProvider>
          </Grid>


          <GridField label="User" value={username} />
          <GridField label="Customer" value={selectedSalesOrder?.customerCode || ''} />
        {/* </> */}
      {/* )} */}
      {/* {!productListIsLoading && packingDetail && selectedProduct && (
        <> */}
          <GridField label="Product Description" value={packingDetail?.packingItemDescription || ""} />
          <GridField label="Warehouse" value={packingDetail?.warehouseCode || ""} />
          <Grid xs={12} md={isView ? 4 : 2} sm={isView ? 4 : 2} p={1}>
            <Typography variant="h6">SO Planned Quantity</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={packingDetail?.plannedQuantity}
              type="number"
              onChange={(e) => onPlannedQuantityChange(parseFloat(e.target.value))}
              error={packingHeaderForm?.plannedQuantity?.value && packingHeaderForm?.plannedQuantity?.value > initialPlannedQuantity ? true : undefined}
              helperText={packingHeaderForm?.plannedQuantity?.value && packingHeaderForm?.plannedQuantity?.value > initialPlannedQuantity ? `Cannot be greater than ${initialPlannedQuantity}` : ""}
              InputProps={{
                inputProps: { step: 0.001, min: 0, max: parseFloat(initialPlannedQuantity.toFixed(3)) }, // Set min and max constraints
              }}
              disabled={!packingDetail || !selectedProduct || isView || isEdit}
            />
          </Grid>
          {/* <Grid xs={12} md={2} sm={2} p={1}>

        <Typography variant="h6">Warehouse</Typography>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select warehouse"
            // label="Warehouse"
            />
          )}
          options={[]}
          size="small"
          value={packingHeaderForm?.warehouseCode?.value}
        // getOptionLabel={(option) => option.code || ""}
        //   isOptionEqualToValue={(option, value) => option.statusName === value?.statusName}
        // onChange={(event, value) => onProductSelection(value)}
        />
      </Grid> */}
      {/* </Grid> */}

    </Grid>
  );
}

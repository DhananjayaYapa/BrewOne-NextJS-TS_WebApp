"use client";

import { Alert, Autocomplete, Box, Button, Grid, TextField, Tooltip } from "@mui/material";
import { API_MESSAGES, EDIT_LOT_FIELD_ERRORS, FIELD_LABELS, UserRolesInterface } from "@/constant";
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { MasterData, TeaLotById } from "@/interfaces/teaLotById";
import AppButton from "@/components/common/AppButton/AppButton";
import SkeletonBar from "@/components/common/Skeleton/skeleton";
import CloseIcon from '@mui/icons-material/Close';
import { LotForm } from "@/interfaces";

interface LotDetails {
  userRole: UserRolesInterface | undefined;
  isEdit: boolean
  isLoading: boolean
  hasError: boolean
  lotDetail: TeaLotById | null
  isEditClicked: boolean
  isDisabled: boolean
  lotDetailForm: LotForm
  masterData: MasterData
  onHandleChange: (key: string, value: string) => void;
  handleEditClick: () => void
  handleSaveChanges: () => void;
  handleCancel: () => void;
  isUnsavedChanged: boolean;
  isUnsavedChangesOnCancel: boolean
  handleCancelConfirm: () => void;
  handleRemainCancel: () => void;
  hasAPIError: string | undefined
}
export default function LotDetails(props: LotDetails) {
  const {
    isEdit,
    userRole,
    isLoading,
    hasError,
    lotDetail,
    isEditClicked,
    isDisabled,
    lotDetailForm,
    masterData,
    onHandleChange,
    handleEditClick,
    handleSaveChanges,
    handleCancel,
    isUnsavedChanged,
    isUnsavedChangesOnCancel,
    handleCancelConfirm,
    handleRemainCancel,
    hasAPIError
  } = props

  return (
    <div>
      <Box width="100%" sx={{ border: "1px solid #005893" }} p={2}>
        {isLoading ? (
          <SkeletonBar />
        ) : hasError ? (
          <p>{API_MESSAGES.FAILED_GET}</p>
        ) : (
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.LOT_NO}
                value={lotDetail?.lotNo ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.LOT_NO}
                disabled
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.BOX_NUMBER}
                value={lotDetail?.boxNo ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.BOX_NUMBER}
                disabled
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4} gap={2}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.STATUS}
                value={lotDetail?.statusName ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.STATUS}
                disabled
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={masterData?.standard?.find((item) => item.standardId === Number(lotDetailForm?.standardId.value)) || null}
                onChange={(event, value) => { onHandleChange('standardId', value?.standardId?.toString() || "") }}
                getOptionLabel={(option) => option.standardName || ""}
                isOptionEqualToValue={(option, value) => option.standardId === Number(value)}
                options={masterData.standard}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.STANDARD}
                    placeholder={FIELD_LABELS.STANDARD}
                    required={lotDetailForm?.standardId.isRequired}
                    error={!!lotDetailForm?.standardId.error}
                    helperText={lotDetailForm?.standardId.error !== '' ? lotDetailForm?.standardId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                value={masterData?.break?.find((item) => item.breakId === Number(lotDetailForm?.breakId.value)) || null}
                onChange={(event, value) => { onHandleChange('breakId', value?.breakId?.toString() || "") }}
                options={masterData?.break}
                getOptionLabel={(option) => option.breakName || ""}
                isOptionEqualToValue={(option, value) => option.breakId === Number(value.breakId)}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.BREAK}
                    placeholder={FIELD_LABELS.BREAK}
                    required={lotDetailForm?.breakId.isRequired}
                    error={!!lotDetailForm?.breakId.error}
                    helperText={lotDetailForm?.breakId.error !== '' ? lotDetailForm?.breakId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>



            <Grid item lg={4} md={4} xs={4} gap={1} display='flex'>
              <TextField
                fullWidth
                size="small"
                inputMode='numeric'
                id="outlined-required"
                label={FIELD_LABELS.NO_OF_BAGS}
                value={lotDetailForm?.bagCount.value ?? ""}
                onChange={(e) => { onHandleChange('bagCount', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.NO_OF_BAGS}
                InputProps={{
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: "^[0-9]+$",
                  }
                }}
                disabled={isDisabled}
                required={lotDetailForm?.bagCount.isRequired}
                helperText={lotDetailForm?.bagCount.error !== '' ? lotDetailForm?.bagCount.error : ''}
                error={!!lotDetailForm?.bagCount.error}
              />

              <TextField
                fullWidth
                size="small"
                inputMode='decimal'
                id="outlined-required"
                label={FIELD_LABELS.WEIGHT_OF_BAG}
                value={lotDetailForm?.weightPerBag?.value ?? ""}
                onChange={(e) => {
                  const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                  if (regex.test(e.target.value) || e.target.value === "") {
                    onHandleChange("weightPerBag", e.target.value);
                  }
                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    type: "text",
                    inputMode: 'decimal',
                    pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                    onClick: (e) => e.currentTarget.select(),
                  },
                }}
                placeholder={FIELD_LABELS.WEIGHT_OF_BAG}
                disabled={isDisabled}
                required={lotDetailForm?.weightPerBag.isRequired}
                helperText={lotDetailForm?.weightPerBag.error !== '' ? lotDetailForm?.weightPerBag.error : ''}
                error={!!lotDetailForm?.weightPerBag.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal

                value={Number(lotDetailForm?.estateCode.value) || null}
                // onChange={(event, value) => { onHandleChange('estateId', value?.estateId?.toString() || "") }}
                // getOptionLabel={(option) => option. || ""}
                // isOptionEqualToValue={(option, value) => option.estateId === Number(value.estateId)}
                options={[]}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.ESTATE_CODE}
                    placeholder={FIELD_LABELS.ESTATE_CODE}
                    required={lotDetailForm?.estateId.isRequired}
                    error={!!lotDetailForm?.estateId.error}
                    helperText={lotDetailForm?.estateId.error !== '' ? lotDetailForm?.estateId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.ESTATE_NAME}
                value={lotDetail?.estateName ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.ESTATE_NAME}
                disabled
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.NET_QUANTITY}
                value={lotDetailForm?.netQuantity.value ?? ""}
                onChange={(e) => {
                  onHandleChange("netQuantity", e.target.value);

                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.NET_QUANTITY}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={masterData?.grade?.find((item) => item.gradeId === Number(lotDetailForm?.gradeId.value)) || null}
                onChange={(event, value) => { onHandleChange('gradeId', value?.gradeId?.toString() || "") }}
                options={masterData?.grade}
                getOptionLabel={(option) => option.gradeCode || ""}
                isOptionEqualToValue={(option, value) => option.gradeId === Number(value)}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.GRADE}
                    placeholder={FIELD_LABELS.GRADE}
                    required={false}
                    error={!!lotDetailForm?.gradeId.error}
                    helperText={lotDetailForm?.gradeId.error !== '' ? lotDetailForm?.gradeId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4} gap={1} display='flex'>
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={masterData?.chestType?.find((item) => item.chestTypeId === Number(lotDetailForm?.chestTypeId.value)) || null}
                onChange={(event, value) => { onHandleChange('chestTypeId', value?.chestTypeId?.toString() || "") }}
                getOptionLabel={(option) => option.chestTypeName || ""}
                isOptionEqualToValue={(option, value) => option.chestTypeId === Number(value)}
                options={masterData.chestType}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.CHEST_TYPE}
                    placeholder={FIELD_LABELS.CHEST_TYPE}
                    required={lotDetailForm?.chestTypeId.isRequired}
                    error={!!lotDetailForm?.chestTypeId.error}
                    helperText={lotDetailForm?.chestTypeId.error !== '' ? lotDetailForm?.chestTypeId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />


            </Grid>
            <Grid item lg={4} md={4} xs={4} gap={1} display='flex'>
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={masterData?.sackType?.find((item) => item.sackTypeId === Number(lotDetailForm?.sackTypeId.value)) || null}
                onChange={(event, value) => { onHandleChange('chestTypeId', value?.sackTypeId?.toString() || "") }}
                getOptionLabel={(option) => option.sackTypeName || ""}
                isOptionEqualToValue={(option, value) => option.sackTypeId === Number(value)}
                options={masterData.sackType}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.SACK_TYPE}
                    placeholder={FIELD_LABELS.SACK_TYPE}
                    required={lotDetailForm?.sackTypeId.isRequired}
                    error={!!lotDetailForm?.sackTypeId.error}
                    helperText={lotDetailForm?.sackTypeId.error !== '' ? lotDetailForm?.sackTypeId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                id="outlined-required"
                size="small"
                label={FIELD_LABELS.PO_NUMBER}
                value={lotDetailForm?.purchaseOrderNumber.value ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.PO_NUMBER}
                disabled
              // required={lotDetailForm?.purchaseOrderNo.isRequired}
              // error={!!lotDetailForm?.purchaseOrderNo.error}
              // helperText={lotDetailForm?.purchaseOrderNo.error !== '' ? lotDetailForm?.purchaseOrderNo.error : ''}
              />
            </Grid>







            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.STORE_ADDRESS}
                value={lotDetailForm?.storeAddress.value ?? ""}
                onChange={(event) => onHandleChange("storeAddress", event.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.STORE_ADDRESS}
                required={lotDetailForm?.storeAddress.isRequired}
                helperText={lotDetailForm?.storeAddress.error !== '' ? lotDetailForm?.storeAddress.error : ''}
                error={!!lotDetailForm?.storeAddress.error}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.MAIN_BUYER}
                value={lotDetailForm?.buyer?.value ?? ""}
                onChange={(e) => { onHandleChange('buyer', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={lotDetailForm?.buyer.isRequired}
                placeholder={FIELD_LABELS.MAIN_BUYER}
                error={!!lotDetailForm?.buyer.error}
                helperText={lotDetailForm?.buyer.error !== '' ? lotDetailForm?.buyer.error : ''}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.CONTRACT_NO}
                value={lotDetailForm.contractNumber?.value ?? ""}
                // onChange={(e) => { onHandleLotOnChange('contractNumber', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                // required={lotDetailForm.contractNumber.isRequired}
                placeholder={FIELD_LABELS.CONTRACT_NO}
                // helperText={lotDetailForm.contractNumber.error !== '' ? lotDetailForm.contractNumber.error : ''}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={masterData?.elevation?.find((item) => item.elevationId === Number(lotDetailForm?.elevationId.value)) || null}
                onChange={(event, value) => { onHandleChange('elevationId', value?.elevationId?.toString() || "") }}
                getOptionLabel={(option) => option.elevationName || ""}
                isOptionEqualToValue={(option, value) => option.elevationId === Number(value)}
                options={masterData.elevation}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.ELEVATION}
                    placeholder={FIELD_LABELS.ELEVATION}
                    required={lotDetailForm?.elevationId.isRequired}
                    error={!!lotDetailForm?.elevationId.error}
                    helperText={lotDetailForm?.elevationId.error !== '' ? lotDetailForm?.elevationId.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                inputMode='decimal'
                id="outlined-required"
                label={FIELD_LABELS.PRICE}
                value={Number(lotDetailForm?.price.value) ?? "0"}
                onChange={(e) => {
                  const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                  if (regex.test(e.target.value) || e.target.value === "") {
                    onHandleChange("price", e.target.value);
                  }
                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    type: "text",
                    inputMode: 'decimal',
                    pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                    onClick: (e) => e.currentTarget.select(),
                  },
                }}
                placeholder={FIELD_LABELS.PRICE}
                disabled={isDisabled}
                required={lotDetailForm?.price.isRequired}
                helperText={lotDetailForm?.price.error !== '' ? lotDetailForm?.price.error : ''}
                error={!!lotDetailForm?.price.error}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.VALUE}
                variant="outlined"
                value={lotDetailForm?.value?.value ?? ""}
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.VALUE}
                disabled
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                inputMode='decimal'
                id="outlined-required"
                label={FIELD_LABELS.ALLOWANCE}
                value={lotDetailForm?.allowance.value ?? ""}
                onChange={(e) => {
                  const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                  if (regex.test(e.target.value) || e.target.value === "") {
                    onHandleChange("allowance", e.target.value);
                  }
                }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    type: "text",
                    inputMode: 'decimal',
                    pattern: "^[0-9]*\\.?[0-9]{0,2}$",
                    onClick: (e) => e.currentTarget.select(),
                  },
                }}
                placeholder={FIELD_LABELS.ALLOWANCE}
                disabled={isDisabled}
                required={lotDetailForm?.allowance.isRequired}
                helperText={lotDetailForm?.allowance.error !== '' ? lotDetailForm?.allowance.error : ''}
                error={!!lotDetailForm?.allowance.error}
              />
            </Grid>



            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                inputMode='numeric'
                id="outlined-required"
                value={lotDetailForm?.sampleCount?.value ?? ""}
                label={FIELD_LABELS.SAMPLES_RECEIVED}
                onChange={(e) => { onHandleChange('sampleCount', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    pattern: "^[0-9]+$",
                    type: 'numeric',
                    onClick: (e) => e.currentTarget.select()
                  }
                }}
                placeholder={FIELD_LABELS.SAMPLES_RECEIVED}
                disabled={isDisabled}
                required={lotDetailForm?.sampleCount.isRequired}
                helperText={lotDetailForm?.sampleCount.error !== '' ? lotDetailForm?.sampleCount.error : ''}
                error={!!lotDetailForm?.sampleCount.error}
              />
            </Grid>




            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputMode='numeric'
                id="outlined-required"
                value={lotDetailForm?.deliveryDatesCount?.value ?? ""}
                label={FIELD_LABELS.NO_OF_DELIVERY_DAYS}
                onChange={(e) => { onHandleChange('deliveryDatesCount', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    pattern: "^[0-9]+$",
                    type: 'numeric',
                    onClick: (e) => e.currentTarget.select()
                  }
                }}
                placeholder={FIELD_LABELS.NO_OF_DELIVERY_DAYS}
                disabled={isDisabled}
                required={lotDetailForm?.deliveryDatesCount.isRequired}
                helperText={lotDetailForm?.deliveryDatesCount.error !== '' ? lotDetailForm?.deliveryDatesCount.error : ''}
                error={!!lotDetailForm?.deliveryDatesCount.error}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={isDisabled}
                  format="YYYY-MM-DD"
                  value={dayjs(lotDetailForm?.postingDate?.value)}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "outlined",
                      id: "outlined-required",
                      error: !!lotDetailForm?.postingDate.error,
                      required: lotDetailForm?.postingDate.isRequired,
                      helperText: lotDetailForm?.postingDate.error !== '' ? lotDetailForm?.postingDate.error : '',
                      fullWidth: true,
                    }
                  }}
                  onChange={(value) => onHandleChange('postingDate', value?.toString() || "")}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={masterData?.itemDetail?.find((item) => item?.itemCode === lotDetailForm?.itemCode.value) || null}
                onChange={(event, value) => { onHandleChange('itemType', value?.itemCode?.toString() || "") }}
                getOptionLabel={(option) => option.itemCode || ""}
                isOptionEqualToValue={(option, value) => option.itemCode === value.itemCode}
                options={masterData.itemDetail || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.ITEM_CODE}
                    placeholder={FIELD_LABELS.ITEM_CODE}
                    required={lotDetailForm?.itemCode.isRequired}
                    error={!!lotDetailForm?.itemCode.error}
                    helperText={lotDetailForm?.itemCode.error !== '' ? lotDetailForm?.itemCode.error : ''}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>



            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                id="outlined-required"
                label={FIELD_LABELS.INVOICE_NUMBER}
                value={lotDetailForm?.invoiceNo.value ?? ""}
                onChange={(e) => { onHandleChange('invoiceNo', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={lotDetailForm?.invoiceNo.isRequired}
                placeholder={FIELD_LABELS.INVOICE_NUMBER}
                error={!!lotDetailForm?.invoiceNo.error}
                helperText={lotDetailForm?.invoiceNo.error !== '' ? lotDetailForm?.invoiceNo.error : ''}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={lotDetailForm.paymentType?.value ?? null}
                options={masterData.paymentType?.map((payment) => ({
                  label: payment.paymentType,
                  value: payment.paymentTypeId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.PAYMENT}
                    placeholder={FIELD_LABELS.PAYMENT}
                  />
                )}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.ITEM_NAME}
                value={masterData?.itemDetail?.find((item) => item?.itemCode === lotDetailForm?.itemCode.value)?.itemName || null}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.ITEM_NAME}
                disabled
              />
            </Grid>


            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.REMARKS}
                value={lotDetailForm?.remarks?.value ?? ""}
                onChange={(e) => { onHandleChange('remarks', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={lotDetailForm?.remarks.isRequired}
                placeholder={FIELD_LABELS.REMARKS}
                error={!!lotDetailForm?.remarks.error}
                helperText={lotDetailForm?.remarks.error !== '' ? lotDetailForm?.remarks.error : ''}
                disabled={isDisabled}
              />
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              gap={1}
              mt={3}
            >


            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              gap={1}
              mt={1}
            >
              {isUnsavedChangesOnCancel && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
                  action={
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                    >
                      <Button
                        onClick={handleCancelConfirm}
                        color="inherit" size="small"
                        sx={{ borderRadius: "16px", marginRight: "10px" }} variant="outlined"
                      >
                        yes
                      </Button>
                      <Button
                        onClick={handleRemainCancel}
                        color="inherit"
                        size="small"
                        sx={{ borderRadius: "16px", marginRight: "10px" }}
                        variant="outlined"
                      >
                        no
                      </Button>
                    </Grid>
                  }
                >
                  {EDIT_LOT_FIELD_ERRORS.CANCEL_MESSAGE}
                </Alert>
              )}
              {isUnsavedChanged && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px" }}
                // action={
                //   <CloseIcon onClick={() => } />
                // }
                >
                  {EDIT_LOT_FIELD_ERRORS.SAVE_CHANGES}
                </Alert>

              )}
              {hasAPIError && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px" }}
                // action={
                //   <CloseIcon onClick={() => } />
                // }
                >
                  {hasAPIError}
                </Alert>

              )}

            </Grid>
            {/* Edit Button */}
            {isEdit && !isEditClicked && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                gap={1}
                mt={2}
              >
                <AppButton
                  buttonText={"Edit"}
                  size={"medium"}
                  variant={"contained"}
                  color={"primary"}
                  borderRadius="40px"
                  onClick={handleEditClick}
                  endIcon={<EditIcon />}
                />
              </Grid>
            )}
            {/* Save Changes and cancel */}
            {isEdit && isEditClicked && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                gap={1}
                mt={2}
              >
                <AppButton
                  buttonText={"Cancel"}
                  size={"medium"}
                  variant={"outlined"}
                  color={"primary"}
                  borderRadius="40px"
                  onClick={handleCancel}
                />
                <AppButton
                  // isLoading={editLoading}
                  buttonText={"save changes"}
                  size={"medium"}
                  variant={"contained"}
                  color={"primary"}
                  borderRadius="40px"
                  onClick={handleSaveChanges}
                />
              </Grid>
            )}


          </Grid>
        )
        }
      </Box >
    </div >
  )
}

'use client'
import { FIELD_LABELS } from '@/constant'
import { Autocomplete, Box, Grid, TextField, Tooltip } from '@mui/material'
import React from 'react'
import { Break, ChestType, Elevation, Grade, ItemDetail, MasterData, Payment, SackType, Standard } from '@/interfaces/teaLotById';
import { CreateCatalogueHeaderForm, CreateCatalogueLotForm, DropDownOptionDto } from '@/interfaces';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export interface CreateCatalogueLotFormProps {
  lotForm: CreateCatalogueLotForm
  headerForm: CreateCatalogueHeaderForm
  masterDetails: MasterData | null
  onHandleLotOnChange: (key: string, value: string | DropDownOptionDto | number | Dayjs | null) => void
  onHandleLotsNoOnChange: (key: string, value: string | null) => void
}
export default function CreateCatalogueLot({
  lotForm,
  headerForm,
  masterDetails,
  onHandleLotOnChange,
  onHandleLotsNoOnChange
}: CreateCatalogueLotFormProps) {

  const chestTypeOptions = masterDetails?.chestType?.map((chestType: ChestType) => ({
    label: chestType.chestTypeName,
    value: chestType.chestTypeId
  })) || [];
  const sackTypeOptions = masterDetails?.sackType?.map((sackType: SackType) => ({
    label: sackType.sackTypeName,
    value: sackType.sackTypeId
  })) || [];
  const breakTypeOptions = masterDetails?.break?.map((breakType: Break) => ({
    label: breakType.breakName,
    value: breakType.breakId
  })) || [];
  const gradeTypeOptions = masterDetails?.grade?.map((gradeType: Grade) => ({
    label: gradeType.gradeCode,
    value: gradeType.gradeId
  })) || [];
  const elevationTypeOptions = masterDetails?.elevation?.map((elevationType: Elevation) => ({
    label: elevationType.elevationName,
    value: elevationType.elevationId
  })) || [];
  const standardTypeOptions = masterDetails?.standard?.map((standardType: Standard) => ({
    label: standardType.standardName,
    value: standardType.standardId
  })) || [];
  const itemTypeOptions = masterDetails?.itemDetail?.map((itemType: ItemDetail) => ({
    label: itemType.itemCode,
    value: itemType.itemCode
  })) || [];
  const paymentTypeOptions = masterDetails?.paymentType?.map((paymentType: Payment) => ({
    label: paymentType.paymentType,
    value: paymentType.paymentTypeId
  })) || [];

  const handleChange = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.match(/[^0-9]/)) {
      event.preventDefault();
    }

    if (key === 'noOfBags' || key === 'noOfDeliveryDays' || key === 'sampleCount') {
      const number = Number.isNaN(Number(event.target.value)) ? '' : Number(event.target.value);
      onHandleLotOnChange(key, number)
    } else {
      onHandleLotOnChange(key, event.target.value)
    }
  }

  return (
    <div>
      <Box width="100%" sx={{ border: "1px solid #005893" }} p={2}>
        <Grid container display='flex' spacing={2}>
          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              inputMode='numeric'
              label={FIELD_LABELS.LOT_NO}
              value={lotForm.lotNo?.value ?? ""}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  onHandleLotsNoOnChange("lotNo", e.target.value);
                }
              }}
              variant="outlined"
              InputProps={{
                inputProps: {
                  pattern: "^[0-9]+$",
                  type: 'numeric',
                  onClick: (e) => e.currentTarget.select()
                }
              }}
              required={lotForm.lotNo.isRequired}
              helperText={lotForm.lotNo.error !== '' ? lotForm.lotNo.error : ''}
              error={!!lotForm.lotNo.error}
              disabled={!!lotForm.lotNo.disable}
              InputLabelProps={{ shrink: true }}
              placeholder={FIELD_LABELS.LOT_NO}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              label={FIELD_LABELS.INVOICE_NUMBER}
              value={lotForm.invoiceNo.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('invoiceNo', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.invoiceNo.isRequired}
              placeholder={FIELD_LABELS.INVOICE_NUMBER}
              error={!!lotForm.invoiceNo.error}
              helperText={lotForm.invoiceNo.error !== '' ? lotForm.invoiceNo.error : ''}
              disabled={lotForm.invoiceNo.disable}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12} >
            <Autocomplete
              size="small"
              value={lotForm.standardType.value}
              options={standardTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('standardType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.STANDARD}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.STANDARD}
                  disabled={lotForm.standardType.disable}
                  required={lotForm.standardType.isRequired}
                  error={!!lotForm.standardType.error}
                  helperText={lotForm.standardType.error !== '' ? lotForm.standardType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              label={FIELD_LABELS.ESTATE_CODE}
              value={lotForm.estateCode.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('estateCode', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.estateCode.isRequired}
              placeholder={FIELD_LABELS.ESTATE_CODE}
              error={!!lotForm.estateCode.error}
              helperText={lotForm.estateCode.error !== '' ? lotForm.estateCode.error : ''}
              disabled={lotForm.estateCode.disable}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              label={FIELD_LABELS.ESTATE_NAME}
              value={lotForm.estateName.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('estateName', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.estateName.isRequired}
              placeholder={FIELD_LABELS.ESTATE_NAME}
              error={!!lotForm.estateName.error}
              helperText={lotForm.estateName.error !== '' ? lotForm.estateName.error : ''}
              disabled={lotForm.estateName.disable}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12} >
            <Autocomplete
              size="small"
              value={lotForm.itemType.value}
              options={itemTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('itemType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.ITEM_CODE}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.ITEM_CODE}
                  disabled={lotForm.itemType.disable}
                  required={lotForm.itemType.isRequired}
                  error={!!lotForm.itemType.error}
                  helperText={lotForm.itemType.error !== '' ? lotForm.itemType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              size="small"
              value={lotForm.grade.value}
              onChange={(e, value) => onHandleLotOnChange('grade', value)}
              options={gradeTypeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.GRADE}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.GRADE}
                  disabled={lotForm.grade.disable}
                  required={lotForm.grade.isRequired}
                  error={!!lotForm.grade.error}
                  helperText={lotForm.grade.error !== '' ? lotForm.grade.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              size="small"
              value={lotForm.chestType.value}
              options={chestTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('chestType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.CHEST_TYPE}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.CHEST_TYPE}
                  disabled={lotForm.chestType.disable}
                  required={lotForm.chestType.isRequired}
                  error={!!lotForm.chestType.error}
                  helperText={lotForm.chestType.error !== '' ? lotForm.chestType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
            <TextField
              fullWidth
              id="outlined-required"
              size="small"
              label={FIELD_LABELS.ITEM_NAME}
              value={masterDetails?.itemDetail?.filter((item) => item.itemCode === lotForm.itemType.value?.value)[0]?.itemName ?? ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder={FIELD_LABELS.ITEM_NAME}
              disabled
              required={false}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              size="small"
              value={lotForm.sackType.value}
              onChange={(e, value) => onHandleLotOnChange('sackType', value)}
              options={sackTypeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.SACK_TYPE}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.SACK_TYPE}
                  disabled={lotForm.sackType.disable}
                  required={lotForm.sackType.isRequired}
                  error={!!lotForm.sackType.error}
                  helperText={lotForm.sackType.error !== '' ? lotForm.sackType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12} >
            <Autocomplete
              size="small"
              value={lotForm.elevationType.value}
              options={elevationTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('elevationType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.ELEVATION}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.ELEVATION}
                  disabled={lotForm.elevationType.disable}
                  required={lotForm.elevationType.isRequired}
                  error={!!lotForm.elevationType.error}
                  helperText={lotForm.elevationType.error !== '' ? lotForm.elevationType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              size="small"
              value={lotForm.breakType.value}
              options={breakTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('breakType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.BREAK}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.BREAK}
                  disabled={lotForm.breakType.disable}
                  required={lotForm.breakType.isRequired}
                  error={!!lotForm.breakType.error}
                  helperText={lotForm.breakType.error !== '' ? lotForm.breakType.error : ''}
                />
              )}
            />
          </Grid>

          <Grid item lg={12} md={12} xs={12} />

          <Grid item lg={4} md={4} xs={12}>
            <Tooltip title={lotForm.storeAddress.value} placement="top">
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              label={FIELD_LABELS.STORE_ADDRESS}
              value={lotForm.storeAddress.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('storeAddress', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.storeAddress.isRequired}
              placeholder={FIELD_LABELS.STORE_ADDRESS}
              error={!!lotForm.storeAddress.error}
              helperText={lotForm.storeAddress.error !== '' ? lotForm.storeAddress.error : ''}
              disabled={lotForm.storeAddress.disable}
            />
            </Tooltip>
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
          <Tooltip title={lotForm.mainBuyer.value} placement="top">
            <TextField
              fullWidth
              size="small"
              id="outlined-required"
              label={FIELD_LABELS.MAIN_BUYER}
              value={lotForm.mainBuyer.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('mainBuyer', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.mainBuyer.isRequired}
              placeholder={FIELD_LABELS.MAIN_BUYER}
              error={!!lotForm.mainBuyer.error}
              helperText={lotForm.mainBuyer.error !== '' ? lotForm.mainBuyer.error : ''}
              disabled={lotForm.mainBuyer.disable}
            />
            </Tooltip>
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
          <Tooltip title={lotForm.contractNo.value} placement="top">
            <TextField
              size="small"
              fullWidth
              id="outlined-required"
              label={FIELD_LABELS.CONTRACT_NO}
              value={lotForm.contractNo.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('contractNo', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.contractNo.isRequired}
              placeholder={FIELD_LABELS.CONTRACT_NO}
              error={!!lotForm.contractNo.error}
              helperText={lotForm.contractNo.error !== '' ? lotForm.contractNo.error : ''}
              disabled={lotForm.contractNo.disable}
            />
            </Tooltip>
          </Grid>

          <Grid item lg={12} md={12} xs={12} />

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              // inputMode='numeric'
              id="outlined-required"
              label={FIELD_LABELS.NO_OF_BAGS}
              value={lotForm.noOfBags.value ?? ""}
              onChange={(e) => { handleChange('noOfBags', e) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder={FIELD_LABELS.NO_OF_BAGS}
              InputProps={{
                inputProps: {
                  // inputMode: 'numeric',
                  pattern: "^[0-9]+$",
                }
              }}
              disabled={lotForm.noOfBags.disable}
              required={lotForm.noOfBags.isRequired}
              helperText={lotForm.noOfBags.error !== '' ? lotForm.noOfBags.error : ''}
              error={!!lotForm.noOfBags.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              inputMode='decimal'
              id="outlined-required"
              label={FIELD_LABELS.WEIGHT_OF_BAG}
              value={lotForm.weightOfBag.value ?? ""}
              onChange={(e) => {
                const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                if (regex.test(e.target.value) || e.target.value === "") {
                  handleChange("weightOfBag", e);
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
              disabled={lotForm.weightOfBag.disable}
              required={lotForm.weightOfBag.isRequired}
              helperText={lotForm.weightOfBag.error !== '' ? lotForm.weightOfBag.error : ''}
              error={!!lotForm.weightOfBag.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              type="number"
              inputMode='numeric'
              id="outlined-required"
              label={FIELD_LABELS.NET_QUANTITY}
              value={(lotForm.netQuantity.value)?.toFixed(2) ?? ""}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder={FIELD_LABELS.NET_QUANTITY}
              InputProps={{
                inputProps: {
                  type: 'number',
                  step: 0.001,
                  min: 0.000,
                }
              }}
              disabled={lotForm.netQuantity.disable}
              required={lotForm.netQuantity.isRequired}
              helperText={lotForm.netQuantity.error !== '' ? lotForm.netQuantity.error : ''}
              error={!!lotForm.netQuantity.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
            <TextField
              fullWidth
              size="small"
              inputMode='decimal'
              id="outlined-required"
              label={FIELD_LABELS.ALLOWANCE}
              value={lotForm.allowance.value ?? ""}
              onChange={(e) => {
                const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                if (regex.test(e.target.value) || e.target.value === "") {
                  handleChange("allowance", e);
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
              disabled={lotForm.allowance.disable}
              required={lotForm.allowance.isRequired}
              helperText={lotForm.allowance.error !== '' ? lotForm.allowance.error : ''}
              error={!!lotForm.allowance.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
            <TextField
              fullWidth
              size="small"
              inputMode='decimal'
              id="outlined-required"
              label={FIELD_LABELS.PRICE}
              value={lotForm.price.value ?? ""}
              onChange={(e) => {
                const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                if (regex.test(e.target.value) || e.target.value === "") {
                  handleChange("price", e);
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
              disabled={lotForm.price.disable}
              required={lotForm.price.isRequired}
              helperText={lotForm.price.error !== '' ? lotForm.price.error : ''}
              error={!!lotForm.price.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              size="small"
              fullWidth
              id="outlined-required"
              label={FIELD_LABELS.VALUE}
              // value={editLotForm.valueNumber.value?.toFixed(2) ?? ""}
              value={
                lotForm.valueNumber.value !== null && lotForm.valueNumber.value !== undefined
                  ? lotForm.valueNumber.value?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  : ""
              }
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder={FIELD_LABELS.VALUE}
              required={lotForm.valueNumber.isRequired}
              helperText={lotForm.valueNumber.error !== '' ? lotForm.valueNumber.error : ''}
              error={!!lotForm.valueNumber.error}
              disabled
            />
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={lotForm.postingDate.disable}
                format="YYYY-MM-DD"
                label={FIELD_LABELS.POSTING_DATE}
                value={dayjs(lotForm.postingDate.value)}
                minDate={dayjs(headerForm.salesDate.value) ?? null}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                    id: "outlined-required",
                    error: !!lotForm.postingDate.error,
                    required: lotForm.postingDate.isRequired,
                    helperText: lotForm.postingDate.error !== '' ? lotForm.postingDate.error : '',
                    fullWidth: true,
                  }
                }}
                onChange={(value) => onHandleLotOnChange('postingDate', value)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <Autocomplete
              size="small"
              value={lotForm.paymentType.value}
              options={paymentTypeOptions}
              onChange={(e, value) => onHandleLotOnChange('paymentType', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={FIELD_LABELS.PAYMENT}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.PAYMENT}
                  disabled={lotForm.paymentType.disable}
                  required={lotForm.paymentType.isRequired}
                  error={!!lotForm.paymentType.error}
                  helperText={lotForm.paymentType.error !== '' ? lotForm.paymentType.error : ''}
                />
              )}
            />
          </Grid>

          < Grid item lg={4} md={4} xs={4}>
            <TextField
              fullWidth
              size="small"
              inputMode='numeric'
              id="outlined-required"
              value={lotForm.sampleCount.value ?? ""}
              label={FIELD_LABELS.SAMPLES_RECEIVED}
              onChange={(e) => { handleChange('sampleCount', e) }}
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
              disabled={lotForm.sampleCount.disable}
              required={lotForm.sampleCount.isRequired}
              helperText={lotForm.sampleCount.error !== '' ? lotForm.sampleCount.error : ''}
              error={!!lotForm.sampleCount.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              type="number"
              inputMode='numeric'
              id="outlined-required"
              value={lotForm.noOfDeliveryDays.value ?? ""}
              label={FIELD_LABELS.NO_OF_DELIVERY_DAYS}
              onChange={(e) => { handleChange('noOfDeliveryDays', e) }}
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
              disabled={lotForm.noOfDeliveryDays.disable}
              required={lotForm.noOfDeliveryDays.isRequired}
              helperText={lotForm.noOfDeliveryDays.error !== '' ? lotForm.noOfDeliveryDays.error : ''}
              error={!!lotForm.noOfDeliveryDays.error}
            />
          </Grid>

          <Grid item lg={4} md={4} xs={4}>
          <Tooltip title={lotForm.remarks.value} placement="top">
            <TextField
              size="small"
              fullWidth
              id="outlined-required"
              label={FIELD_LABELS.REMARKS}
              value={lotForm.remarks.value ?? ""}
              onChange={(e) => { onHandleLotOnChange('remarks', e.target.value) }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              required={lotForm.remarks.isRequired}
              placeholder={FIELD_LABELS.REMARKS}
              error={!!lotForm.remarks.error}
              helperText={lotForm.remarks.error !== '' ? lotForm.remarks.error : ''}
              disabled={lotForm.remarks.disable}
            />
            </Tooltip>
          </Grid>
        </Grid>
      </Box >
    </div >
  )
}
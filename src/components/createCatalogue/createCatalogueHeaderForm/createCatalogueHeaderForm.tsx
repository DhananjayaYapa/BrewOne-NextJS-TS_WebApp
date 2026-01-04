'use client'
import { Broker, DropDownOptionDto } from '@/interfaces'
import { CatalogueTypeList, CreateCatalogueHeaderForm } from '@/interfaces/catalogue'
import { Autocomplete, Grid, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'

export interface CreateCatalogueHeaderFormProps {
    headerForm: CreateCatalogueHeaderForm
    brokerDetails: Broker[]
    catalogueTypes: CatalogueTypeList[]
    onHandleHeaderOnChange: (key: string, value: string | DropDownOptionDto | Dayjs | number | null) => void
    onHandleCatalogueTypeChange: (key: string, value: DropDownOptionDto | null) => void
    isHeaderFormDisabled: boolean
}
export default function CreateCatalogueHeader({
    headerForm, brokerDetails, catalogueTypes, onHandleHeaderOnChange, onHandleCatalogueTypeChange, isHeaderFormDisabled
}: CreateCatalogueHeaderFormProps) {
    const catalogueTypeOptions = catalogueTypes?.map((catalogueType: CatalogueTypeList) => ({
        label: catalogueType.typeName,
        value: catalogueType.typeId
    })).filter((catalogueType) => catalogueType.value !== 1) || [];

    const brokerOptions = brokerDetails?.map((broker: Broker) => ({
        label: broker.brokerCode,
        value: broker.brokerCode
    })) || [];

    return (
        <Grid container direction="row" justifyContent="center" spacing={2}>
            <Grid item xl={3} xs={3}>
                <Typography variant="h6">Catalogue Type</Typography>
                <Autocomplete
                    size="small"
                    disabled={headerForm.catalogueType.disable || isHeaderFormDisabled}
                    options={catalogueTypeOptions}
                    value={headerForm.catalogueType.value}
                    onChange={(e, value) => onHandleCatalogueTypeChange('catalogueType', value)}
                    sx={{
                        "& .MuiAutocomplete-popupIndicatorOpen": {
                            transform: "none",
                        },
                    }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            variant="standard"
                            InputProps={{
                                ...params.InputProps,
                            }}
                            error={!!headerForm.catalogueType.error}
                            helperText={headerForm.catalogueType.error !== '' ? headerForm.catalogueType.error : ''}
                        />
                    )}
                />
            </Grid>

            <Grid item xl={3} xs={3}>
                <Typography variant="h6">Broker Code</Typography>
                <Autocomplete
                    size="small"
                    options={brokerOptions}
                    disabled={headerForm.brokerCode.disable || isHeaderFormDisabled}
                    value={headerForm.brokerCode.value}
                    onChange={(e, value) => onHandleHeaderOnChange('brokerCode', value)}
                    sx={{
                        "& .MuiAutocomplete-popupIndicatorOpen": {
                            transform: "none",
                        },
                    }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            variant="standard"
                            InputProps={{
                                ...params.InputProps,
                            }}
                            error={!!headerForm.brokerCode.error}
                            helperText={headerForm.brokerCode.error !== '' ? headerForm.brokerCode.error : ''}
                        />
                    )}
                />
            </Grid>

            <Grid item xl={3} xs={3}>
                <Typography variant="h6">Sales Code</Typography>
                <TextField
                    fullWidth
                    size="small"
                    id="outlined-required"
                    type="number"
                    value={headerForm.salesCode.value ?? ""}
                    error={!!headerForm.salesCode.error}
                    helperText={headerForm.salesCode.error !== '' ? headerForm.salesCode.error : ''}
                    variant="standard"
                    required={headerForm.salesCode.isRequired}
                    InputLabelProps={{ shrink: true }}
                    disabled={headerForm.salesCode.disable || headerForm.brokerCode.value === null || isHeaderFormDisabled} />
            </Grid>

            <Grid item xl={3} xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Typography variant="h6">Sales Date</Typography>
                    <DatePicker
                        disabled={headerForm.salesDate.disable || isHeaderFormDisabled}
                        format="YYYY-MM-DD"
                        maxDate={dayjs()}
                        value={dayjs(headerForm.salesDate.value)}
                        slotProps={{
                            textField: {
                                size: "small",
                                variant: "standard",
                                error: !!headerForm.salesDate.error,
                                required: headerForm.salesDate.isRequired,
                                helperText: headerForm.salesDate.error !== '' ? headerForm.salesDate.error : '',
                            }
                        }}
                        onChange={(value) => onHandleHeaderOnChange('salesDate', value)}
                        sx={{ width: "100%" }}
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
    )
}

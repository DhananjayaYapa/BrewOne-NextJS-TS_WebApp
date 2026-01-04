'use client'

import CatalogueManagementHeader from '@/components/catalogueManagementHeader/catalogueManagementHeader'
import HeaderBar from '@/components/headerBar/headerBar'
import { DATE_FORMAT, ROUTES } from '@/constant';
import React, { useEffect, useState } from 'react'
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreateCatalogueTable from '@/components/createCatalogue/createCatalogueTable/createCatalogueTable';
import { Alert, Button, CircularProgress, Divider, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CreateCatalogueHeader from '@/components/createCatalogue/createCatalogueHeaderForm/createCatalogueHeaderForm';
import { getBrokers } from '@/redux/action/brokerAction';
import { createCatalogue, getCatalogueTypeList } from '@/redux/action/createCatalogueAction';
import dayjs, { Dayjs } from 'dayjs';
import {
    addLotForm, clearAllAlert, clearLotForm, deleteLotForm, handlePostHeader, resetCatalogState, resetCatalogueResponse, setChangeHeaderFields, setChangeLotFields,
    setCreateCatalogueCurrentPage, setEditLotForm, setLimit, validateCatalogueHeaderForm, validateCatalogueLotForm
} from '@/redux/slice/createCatalogueSlice';
import { AddLotFormNewDto, AddPayloadLotFormDto, CreateCatalogRequest, DropDownOptionDto, PostHandleHeaderDto } from '@/interfaces';
import { getMaterData } from '@/redux/action/teaLotDetailsAction';
import CreateCatalogueLot from '@/components/createCatalogue/createCatalogueLotForm/createCatalogueLotForm';
import { formValidator } from '@/utill/common/formValidator/main';
import ConfirmationMessage from '@/components/confirmationMessage/confirmationMessage';
import { useRouter } from 'next/navigation';
import AppAlert from '@/components/common/AppAlert/AppAlert';

export default function CatalogueCreate() {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const headerForm = useSelector((state: RootState) => state.createCatalogue.createCatalogueHeaderForm);
    const lotForm = useSelector((state: RootState) => state.createCatalogue.createCatalogueLotForm)
    const catalogueTypes = useSelector((state: RootState) => state.createCatalogue.catalogueTypeList)
    const brokerDetails = useSelector((state: RootState) => state.broker.data.brokerData)
    const masterDetails = useSelector((state: RootState) => state.lotDetails.masterData)

    const isHeaderFormDisabled = useSelector((state: RootState) => state.createCatalogue.headerFormState)
    const lotTable = useSelector((state: RootState) => state.createCatalogue.lotDetails)
    const brokerCode = useSelector((state: RootState) => state.createCatalogue.brokerCode)
    const typeId = useSelector((state: RootState) => state.createCatalogue.typeId)
    const salesCode = useSelector((state: RootState) => state.createCatalogue.salesCode)
    const salesDate = useSelector((state: RootState) => state.createCatalogue.salesDate)
    const createCatalogResponse = useSelector((state: RootState) => state.createCatalogue.catalogueResponseData)
    const createLoading = useSelector((state: RootState) => state.createCatalogue.catalogueResponseData.isLoading)
    const addAlert = useSelector((state: RootState) => state.createCatalogue.addALert)
    const editAlert = useSelector((state: RootState) => state.createCatalogue.editAlert)
    const deleteAlert = useSelector((state: RootState) => state.createCatalogue.deleteAlert)

    const currentPage = useSelector((state: RootState) => state.createCatalogue.currentPage)
    const rowLimit = useSelector((state: RootState) => state.createCatalogue.limit)

    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false)
    const [selectedLotNo, setSelectedLotNo] = useState<string>("")

    const onSubmitCatalogue = () => {
        const createCatalogRequest: CreateCatalogRequest = {
            brokerCode: brokerCode,
            salesCode: salesCode,
            salesDate: salesDate,
            typeId: typeId,
            lots: lotTable
        }
        dispatch(createCatalogue(createCatalogRequest));
    }

    const handleConfirmation = () => {
        setOpenConfirmation(!openConfirmation)
    }

    const handleUpdateConfirmation = () => {
        dispatch(deleteLotForm(selectedLotNo))
        setOpenConfirmation(false)
        setSelectedLotNo("")
    }

    const handleLotNoForDelete = (lotNo: string) => {
        setSelectedLotNo(lotNo)
        handleConfirmation()
    }

    const resetLotForm = () => {
        dispatch(clearLotForm())
        dispatch(setEditLotForm(false))
    }

    const handleLotNoForEdit = (lotNo: string) => {
        const selectedItem = lotTable.find((lot) => lot.lotNo === lotNo);
        const _grade = masterDetails.grade.find((grade) => grade.gradeId === selectedItem?.gradeId)
        const _break = masterDetails.break.find((breakType) => breakType.breakId === selectedItem?.breakId)
        const _chest = masterDetails.chestType.find((chest) => chest.chestTypeId === selectedItem?.chestTypeId)
        const _sack = masterDetails.sackType.find((sack) => sack.sackTypeId === selectedItem?.sackTypeId)
        const _elevation = masterDetails.elevation.find((elevation) => elevation.elevationId === selectedItem?.elevationId)
        const _standard = masterDetails.standard.find((standard) => standard.standardId === selectedItem?.standardId)
        const _itemCode = masterDetails.itemDetail.find((item) => item.itemCode === selectedItem?.itemCode)
        const _payment = masterDetails.paymentType.find((payment) => payment.paymentTypeId === Number(selectedItem?.paymentTypeId))

        const editFormObj = {
            ...lotForm,
            lotNo: {
                ...lotForm.lotNo,
                value: lotNo,
                disable: true,
            },
            invoiceNo: {
                ...lotForm.invoiceNo,
                value: selectedItem?.invoiceNo
            },
            estateCode: {
                ...lotForm.estateCode,
                value: selectedItem?.estateCode
            },
            estateName: {
                ...lotForm.estateName,
                value: selectedItem?.estateName
            },
            grade: {
                ...lotForm.grade,
                ..._grade && {
                    value: { label: _grade?.gradeCode, value: _grade?.gradeId }
                }
            },
            noOfBags: {
                ...lotForm.bagsCount,
                value: selectedItem?.bagsCount
            },
            chestType: {
                ...lotForm.chestType,
                ..._chest && {
                    value: { label: _chest?.chestTypeName, value: _chest?.chestTypeId }
                }
            },
            weightOfBag: {
                ...lotForm.weightOfBag,
                value: selectedItem?.weightPerBag
            },
            netQuantity: {
                ...lotForm.netQuantity,
                ...selectedItem?.bagsCount && selectedItem?.weightPerBag &&{
                    value: (selectedItem?.bagsCount * selectedItem?.weightPerBag - (selectedItem?.allowance || 0))
                }
            },
            sackType: {
                ...lotForm.sackType,
                ..._sack && {
                    value: { label: _sack?.sackTypeName, value: _sack?.sackTypeName }
                }
            },
            breakType: {
                ...lotForm.breakType,
                ..._break && {
                    value: { label: _break?.breakName, value: _break?.breakId }
                }
            },
            noOfDeliveryDays: {
                ...lotForm.noOfDeliveryDays,
                ...selectedItem?.noOfDeliveryDates && {
                    value: selectedItem?.noOfDeliveryDates
                }
            },
            elevationType: {
                ...lotForm.elevationType,
                ..._elevation && {
                    value: { label: _elevation?.elevationName, value: _elevation?.elevationId }
                }
            },
            itemType: {
                ...lotForm.itemType,
                value: { label: _itemCode?.itemCode, value: _itemCode?.itemCode }
            },
            standardType: {
                ...lotForm.standardType,
                ..._standard && {
                    value: { label: _standard?.standardName, value: _standard?.standardId }
                }
            },
            contractNo: {
                ...lotForm.contractNo,
                value: selectedItem?.contractNumber
            },
            storeAddress: {
                ...lotForm.storeAddress,
                value: selectedItem?.storeAddress
            },
            mainBuyer: {
                ...lotForm.mainBuyer,
                value: selectedItem?.mainBuyer
            },
            allowance: {
                ...lotForm.allowance,
                ...selectedItem?.allowance && {
                    value: selectedItem?.allowance
                }
            },
            price: {
                ...lotForm.price,
                value: selectedItem?.price
            },
            valueNumber: {
                ...lotForm.valueNumber,
                ...selectedItem?.price && selectedItem.weightPerBag && selectedItem.bagsCount && {
                    value: (selectedItem?.weightPerBag * selectedItem.bagsCount) * selectedItem?.price
                }
            },
            paymentType: {
                ...lotForm.paymentType,
                ..._payment && {
                    value: { label: _payment?.paymentType, value: _payment?.paymentTypeId }
                }
            },
            sampleCount: {
                ...lotForm.sampleCount,
                value: selectedItem?.sampleCount
            },
            postingDate: {
                ...lotForm.postingDate,
                value: selectedItem?.postingDate
            },
            remarks: {
                ...lotForm.remarks,
                value: selectedItem?.remarks
            },
        }
        dispatch(clearLotForm())
        dispatch(setChangeLotFields(editFormObj))
        dispatch(setEditLotForm(true))
    }

    const breadcrumbs = [
        {
            id: 1,
            link: "Catalogue Management",
            route: ROUTES.CATALOGUE_MANAGEMENT,
            icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
        },
        {
            id: 2,
            link: "Create",
            route: ROUTES.CREATE_CATALOGUE,
        },
    ];

    useEffect(() => {
        dispatch(getCatalogueTypeList())
        dispatch(getMaterData())
    }, [])

    useEffect(() => {
        onHandleLotOnChange('itemType', {
            label: masterDetails?.itemDetail[0]?.itemCode,
            value: masterDetails?.itemDetail[0]?.itemCode
        })
    }, [masterDetails?.itemDetail])

    useEffect(() => {
        if(!lotForm?.itemType?.value){
        onHandleLotOnChange('itemType', {
            label: masterDetails?.itemDetail[0]?.itemCode,
            value: masterDetails?.itemDetail[0]?.itemCode
        })
    }
    }, [lotForm, masterDetails])

    const onHandleHeaderOnChange = (key: string, value: string | DropDownOptionDto | number | Dayjs | null) => {
        const formFieldObj = {
            ...headerForm,
            [key]: {
                ...headerForm[key as keyof typeof headerForm],
                value,
                error: null,
            }
        };
        dispatch(setChangeHeaderFields(formFieldObj));
    };

    const onHandleCatalogueTypeChange = (key: string, value: DropDownOptionDto | null) => {
        const salesCodeValue = catalogueTypes.find((catalogue) => catalogue.typeId === value?.value)?.allowedSalesCode;
        const catalogType_salesCode_Obj = {
            ...headerForm,
            catalogueType: {
                ...headerForm.catalogueType,
                value,
                error: null,
            },
            brokerCode: {
                ...headerForm.brokerCode,
                value: null,
                error: null,
            },
            salesCode: {
                ...headerForm.salesCode,
                value: salesCodeValue,
                error: null,
            }
        }
        dispatch(setChangeHeaderFields(catalogType_salesCode_Obj))
        dispatch(getBrokers())
    }

    const onHandleLotsNoOnChange = (key: string, value: string | null) => {
        let errorMsg = null
        const lotsCodes = lotTable?.map((lot) => lot.lotNo)
        const isNewLotCode = value ? lotsCodes.includes(value) : false;

        if (isNewLotCode) {
            errorMsg = 'Lot No Already Added'
        }

        const lotCodeFieldObj = {
            ...lotForm,
            [key]: {
                ...lotForm[key as keyof typeof lotForm],
                value,
                error: errorMsg
            }
        }

        dispatch(setChangeLotFields(lotCodeFieldObj))
    }

    const onHandleLotOnChange = (key: string, value: string | DropDownOptionDto | number | Dayjs | null) => {
        let finalError = undefined
        let finalValue = null
        switch (key) {
            case 'noOfBags':
                if (lotForm.weightOfBag.value) {
                    let allowanceValue = (lotForm.allowance.value) ? lotForm.allowance.value : 0
                    finalError = undefined
                    finalValue = ((Number(lotForm.weightOfBag.value) * Number(value)) - (lotForm?.allowance?.value || 0))
                }
                const bagCountObj = {
                    ...lotForm,
                    noOfBags: {
                        ...lotForm.noOfBags,
                        value: value === 0 ? null : value,
                        error: null
                    },
                    netQuantity: {
                        ...lotForm.netQuantity,
                        value: finalValue,
                        error: finalError
                    },
                    valueNumber: {
                        ...lotForm.valueNumber,
                        value: lotForm.price.value && finalValue ? finalValue * Number(lotForm.price.value) : null
                    },
                    allowance:{
                        ...lotForm.allowance,
                        validators: {
                          min: 0,
                          max: (Number(lotForm?.weightOfBag?.value) * Number(value) - 1)
                        },
                        error: lotForm?.allowance?.value && lotForm?.allowance?.value > Number(lotForm?.weightOfBag?.value) * Number(value) ? 'Cannot be greater than net quantity' : null
                    }
                }
                dispatch(setChangeLotFields(bagCountObj));
                break;
            case 'weightOfBag':
                if (lotForm.noOfBags.value) {
                    let allowanceValue = (lotForm.allowance.value) ? lotForm.allowance.value : 0
                    finalError = undefined
                    finalValue = parseFloat(((Number(lotForm.noOfBags.value) * Number(value) ) - (lotForm?.allowance?.value || 0) )?.toFixed(2))
                }
                const weightOfBagObj = {
                    ...lotForm,
                    weightOfBag: {
                        ...lotForm.weightOfBag,
                        value,
                        error: null
                    },
                    netQuantity: {
                        ...lotForm.netQuantity,
                        value: finalValue,
                        error: finalError
                    },
                    valueNumber: {
                        ...lotForm.valueNumber,
                        value: lotForm.price.value && finalValue ? finalValue * Number(lotForm.price.value) : null
                    },
                    allowance:{
                        ...lotForm.allowance,
                        validators: {
                          min: 0,
                          max: (Number(value) * Number(lotForm?.noOfBags?.value) - 1)
                        },
                        error: lotForm?.allowance?.value && lotForm?.allowance?.value > Number(value) * Number(lotForm?.noOfBags?.value) ? 'Cannot be greater than net quantity' : null
                    }
                }
                dispatch(setChangeLotFields(weightOfBagObj));
                break;
            case 'price':
                if (lotForm.netQuantity.value) {
                    finalError = undefined
                    finalValue = lotForm.netQuantity.value * Number(value)
                }
                const priceObj = {
                    ...lotForm,
                    price: {
                        ...lotForm.price,
                        value,
                        error: null
                    },
                    valueNumber: {
                        ...lotForm.valueNumber,
                        value: finalValue,
                        error: finalError
                    }
                }
                dispatch(setChangeLotFields(priceObj));
                break;
            case 'allowance':
                    if (lotForm.allowance.value) {
                      finalError = undefined
                      finalValue = lotForm.allowance.value
                    }
                      let allowance: number = Number(value)
                      const netQuantity = lotForm.netQuantity.value
                      let allowanceObj = {
                      ...lotForm,
                      allowance: {
                        ...lotForm.allowance,
                        value,
                        error: null
                      },
                      netQuantity: {
                        ...lotForm.netQuantity,
                        value:
                       (((lotForm?.weightOfBag?.value || 0) *  (lotForm?.noOfBags?.value || 0)) - allowance),
                        error: finalError
                    }
                    }

                    dispatch(setChangeLotFields(allowanceObj));
                    if ((lotForm?.weightOfBag?.value &&
                      lotForm?.noOfBags?.value &&
                      allowance >= (Number(lotForm?.weightOfBag?.value) * Number(lotForm?.noOfBags?.value)))) {

                    let  errAllowanceObj = {
                      ...lotForm,
                      allowance: {
                        ...lotForm.allowance,
                        value: allowance,
                        validators: {
                          min: 0,
                          max: (Number(lotForm?.weightOfBag?.value) * Number(lotForm?.noOfBags?.value) -1)
                        },
                        error: 'Cannot be greater than net quantity'
                      }

                    }

                    dispatch(setChangeLotFields(errAllowanceObj));
                    }

                    break;

                default:
                const formFieldObj = {
                    ...lotForm,
                    [key]: {
                        ...lotForm[key as keyof typeof lotForm],
                        value,
                        error: null,
                    }
                };
                dispatch(setChangeLotFields(formFieldObj));
        }
    }

    const onsubmit = async () => {
        const [validateData, isValid] = await formValidator(headerForm);
        dispatch(validateCatalogueHeaderForm(validateData))

        if (!isHeaderFormDisabled) {
            if (isValid) {
                const obj: PostHandleHeaderDto = {
                    brokerCode: headerForm.brokerCode.value?.value?.toString() || "",
                    customerId: 1,
                    typeId: Number(headerForm.catalogueType.value?.value) || 0,
                    salesCode: headerForm.salesCode.value || "",
                    salesDate: dayjs(headerForm.salesDate.value).format('YYYY-MM-DD')
                }
                dispatch(handlePostHeader(obj))
            }
        }

        const [validateLotData, isLotValid] = await formValidator(lotForm);
        dispatch(validateCatalogueLotForm(validateLotData))
        if (isValid && isLotValid) {
            const lotObj: AddLotFormNewDto = {
                lotNo: lotForm.lotNo.value || "", //R
                estateCode: lotForm.estateCode.value || undefined,
                estateName: lotForm.estateName.value || undefined,
                invoiceNo: lotForm.invoiceNo.value || undefined,
                gradeId: Number(lotForm.grade.value?.value) || undefined,
                mainBuyer: lotForm.mainBuyer.value || undefined,
                contractNumber: lotForm.contractNo.value || undefined,
                bagsCount: lotForm.noOfBags.value || 0, //R
                weightPerBag: lotForm.weightOfBag.value || 0, //R
                chestTypeId: lotForm.chestType.value?.value ? Number(lotForm.chestType.value?.value) : undefined,
                sackTypeId: lotForm.sackType.value?.value ? Number(lotForm.sackType.value?.value) : undefined,
                breakId: lotForm.breakType.value?.value ? Number(lotForm.breakType.value?.value) : undefined,
                elevationId: lotForm.elevationType.value?.value ? Number(lotForm.elevationType.value?.value) : undefined,
                allowance: lotForm.allowance.value || undefined,
                standardId: lotForm.standardType.value?.value ? Number(lotForm.standardType.value?.value) : undefined,
                storeAddress: lotForm.storeAddress.value || undefined,
                itemCode: lotForm.itemType.value?.value ? lotForm.itemType.value?.value.toString() : undefined, //R
                sampleCount: lotForm.sampleCount.value || undefined,
                price: lotForm.price.value || 0, //R
                postingDate: dayjs(lotForm.postingDate.value).format(DATE_FORMAT), //R
                paymentTypeId: lotForm.paymentType.value?.value?.toString() || '', //R
                noOfDeliveryDates: lotForm.noOfDeliveryDays.value || undefined,
                remarks: lotForm.remarks.value || undefined,
            }
            const lotFinalObj: AddPayloadLotFormDto = {
                data: lotObj,
            }
            dispatch(addLotForm(lotFinalObj))
            dispatch(clearLotForm())
        }
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(setLimit(Number(event.target.value)));
        dispatch(setCreateCatalogueCurrentPage(0));
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        dispatch(setCreateCatalogueCurrentPage(newPage - 1))
    }

    useEffect(() => {
        if (createCatalogResponse.isSuccess) {
            dispatch(resetCatalogState())
            setTimeout(() => {
                router.push(ROUTES.CATALOGUE_MANAGEMENT);
            }, 2000);
        }
        if (createCatalogResponse.hasError) {
            setTimeout(() => {
                dispatch(resetCatalogueResponse())
            }, 2000);
        }
    }, [dispatch, router, createCatalogResponse]);

    const onCancel = () => {
        dispatch(resetCatalogState())
        dispatch(setEditLotForm(false))
        router.push(ROUTES.CATALOGUE_MANAGEMENT);
    }

    const onClearAlert = () => {
        dispatch(clearAllAlert())
    }

    return (
        <main>

                <CatalogueManagementHeader
                    title={'Create New Catalogue'}
                    breadcrumbs={breadcrumbs} />
                <Grid container>
                    <Grid item xs={12} lg={12} p={2}>
                        <CreateCatalogueHeader
                            headerForm={headerForm}
                            brokerDetails={brokerDetails}
                            catalogueTypes={catalogueTypes}
                            onHandleHeaderOnChange={onHandleHeaderOnChange}
                            onHandleCatalogueTypeChange={onHandleCatalogueTypeChange}
                            isHeaderFormDisabled={isHeaderFormDisabled}
                        />
                    </Grid>
                    <Grid item xs={4} lg={4}>
                        <CreateCatalogueTable
                            lotTable={lotTable}
                            resetLotForm={resetLotForm}
                            handleLotNoForDelete={handleLotNoForDelete}
                            handleLotNoForEdit={handleLotNoForEdit}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            page={currentPage}
                            rowsPerPage={rowLimit}
                            tableRowCount={lotTable.length}
                        />
                    </Grid>
                    <Grid item xs={8} lg={8} mt={1.5}>
                        <CreateCatalogueLot
                            lotForm={lotForm}
                            headerForm={headerForm}
                            masterDetails={masterDetails || null}
                            onHandleLotOnChange={onHandleLotOnChange}
                            onHandleLotsNoOnChange={onHandleLotsNoOnChange}
                        />
                        {addAlert && (
                            <AppAlert
                                openState={addAlert}
                                severity='success'
                                alertText='Lot Added Successfully'
                                onClose={onClearAlert} />
                        )}
                        {deleteAlert && (
                            <AppAlert
                                openState={deleteAlert}
                                severity='success'
                                alertText='Lot Deleted Successfully'
                                onClose={onClearAlert} />
                        )}
                        {editAlert && (
                            <AppAlert
                                openState={editAlert}
                                severity='success'
                                alertText='Lot Updated Successfully'
                                onClose={onClearAlert} />
                        )}
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' mt={2} gap={2}>
                            <Button variant='contained' onClick={resetLotForm}>Clear</Button>
                            <Button variant='contained' onClick={onsubmit}>Save Changes</Button>
                        </Grid>
                        {createCatalogResponse.hasError === true && (
                            <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                                <Alert
                                    variant="filled"
                                    severity="error"
                                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                                >
                                    {createCatalogResponse.message}
                                </Alert>
                            </Grid>
                        )}
                        {createCatalogResponse.isSuccess === true && (
                            <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                                <Alert
                                    variant="filled"
                                    severity="success"
                                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                                >
                                    {createCatalogResponse.message}
                                </Alert>
                            </Grid>
                        )}
                        <Divider sx={{ marginTop: '10px' }} />
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' gap={2} mt={5} mb={5}>
                            <Button
                                variant='contained'
                                onClick={onCancel}
                                sx={{ p: '10' }}>
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                disabled={lotTable.length < 1}
                                onClick={onSubmitCatalogue}
                                sx={{ p: '10' }}>
                                {createLoading && (
                                    <CircularProgress size="12px" sx={{ color: 'white', marginRight: '10px' }} />
                                )}
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <ConfirmationMessage
                    dialogTitle="Confirm Delete"
                    dialogContentText={
                        <div>Are you sure you want to delete lot {selectedLotNo}?</div>
                    }
                    open={openConfirmation}
                    onClose={handleConfirmation}
                    showCloseButton={true}
                    buttons={[
                        {
                            buttonText: "Delete",
                            onClick: handleUpdateConfirmation,
                        },
                        {
                            buttonText: "Close",
                            onClick: handleConfirmation,
                            design: 'outlined'
                        },
                    ]}
                />
            </main>
    )
}
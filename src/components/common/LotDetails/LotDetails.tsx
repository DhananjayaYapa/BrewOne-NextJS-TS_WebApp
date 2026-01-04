"use client";

import { Alert, Autocomplete, Box, Button, Grid, TextField, Tooltip } from "@mui/material";
import AppButton from "../AppButton/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getMaterData, getTeaLotDetailsById, updateTeaLotDetailsById, } from "@/redux/action/teaLotDetailsAction";
import {
  setIsEdit, setShowEditIcon, setIsLeaveOn, setEditLotForm, validateEditLotForm, setEditLotFormPersist,
  resetEditLotForm,
  resetEditResponse
} from "@/redux/slice/lotDetailsSlice";
import SkeletonBar from "../Skeleton/skeleton";
import { API_MESSAGES, DATE_FORMAT, EDIT_LOT_FIELD_ERRORS, FEATURES, FIELD_LABELS, UserRolesInterface } from "@/constant";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { getTeaLotDetails } from "@/redux/action/gradingAction";
import { DropDownOptionDto } from "@/interfaces";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs";
import { formValidator } from "@/utill/common/formValidator/main";
import { updateTeaLotDetails } from "@/interfaces/teaLotById";

export default function LotDetails() {
  const dispatch = useDispatch<AppDispatch>();

  const lotDetails = useSelector((state: RootState) => state.lotDetails.data);
  const isLoading = useSelector((state: RootState) => state.lotDetails.isLoading);
  const hasError = useSelector((state: RootState) => state.lotDetails.hasError);

  const catalogueDetails = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue); //HEADER
  const masterData = useSelector((state: RootState) => state.lotDetails.masterData);
  const isEdit = useSelector((state: RootState) => state.lotDetails.isEdit);
  const showEditIcon = useSelector((state: RootState) => state.lotDetails.showEditIcon);
  const isLeaveOn = useSelector((state: RootState) => state.lotDetails.isLeaveOn);
  const editLotForm = useSelector((state: RootState) => state.lotDetails.lotDetailsForm)
  const editLoading = useSelector((state: RootState) => state.lotDetails.editLoading)
  const editCatalogueResponse = useSelector((state: RootState) => state.lotDetails.editResponseData)
  const featureList = useSelector((state: RootState) => state.auth.currentUserFeatureList)

  const [onCancel, setOnCancel] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMaterData())
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetEditResponse())
      // dispatch(getTeaLotDetailsById());
    }, 3000);
  }, [dispatch, editCatalogueResponse]);

  useEffect(() => {
    if (lotDetails) {
      const lotObj = {
        ...editLotForm,
        lotNo: {
          ...editLotForm.lotNo,
          value: lotDetails.lotNo
        },
        boxNo: {
          ...editLotForm.boxNo,
          value: lotDetails.boxNo
        },
        statusName: {
          ...editLotForm.statusName,
          value: lotDetails.statusName
        },
        breakType: { //OPTIONAL DROPDOWN
          ...editLotForm.breakType,
          ...(lotDetails.breakId && lotDetails.breakName && {
            value: {
              label: lotDetails.breakName,
              value: lotDetails.breakId
            }
          }),
          ...(lotDetails.breakId === null && lotDetails.breakName === null && {
            value: undefined
          })
        },
        grade: {  //OPTIONAL DROPDOWN
          ...editLotForm.grade,
          ...(lotDetails.gradeCode && lotDetails.gradeId && {
            value: {
              label: lotDetails.gradeCode,
              value: lotDetails.gradeId
            }
          }),
          ...(lotDetails.gradeCode === null && lotDetails.gradeId === null && {
            value: undefined
          })
        },
        bagCount: {
          ...editLotForm.bagCount,
          value: lotDetails.bagCount
        },
        weightPerBag: {
          ...editLotForm.weightPerBag,
          value: lotDetails?.weightPerBag?.toString()
        },
        estateCode: {
          ...editLotForm.estateCode,
          value: lotDetails.estateCode
        },
        estateName: {
          ...editLotForm.estateName,
          value: lotDetails.estateName
        },
        standard: {  //OPTIONAL DROPDOWN
          ...editLotForm.standard,
          ...(lotDetails.standardName && lotDetails.standardId && {
            value: {
              label: lotDetails.standardName,
              value: lotDetails.standardId
            }
          }),
          ...(lotDetails.standardName === null && lotDetails.standardId === null && {
            value: undefined
          })
        },
        purchaseOrderNo: {
          ...editLotForm.purchaseOrderNo,
          value: lotDetails.purchaseOrderNumber
        },
        chest: {  //OPTIONAL DROPDOWN
          ...editLotForm.chest,
          ...(lotDetails.chestTypeDescription && lotDetails.chestTypeId && {
            value: {
              label: lotDetails.chestTypeDescription,
              value: lotDetails.chestTypeId
            }
          }),
          ...(lotDetails.chestTypeDescription === null && lotDetails.chestTypeId === null && {
            value: undefined
          })
        },
        sack: { //OPTIONAL DROPDOWN
          ...editLotForm.sack,
          ...(lotDetails.sackTypeName && lotDetails.sackTypeId && {
            value: {
              label: lotDetails.sackTypeName,
              value: lotDetails.sackTypeId
            }
          }),
          ...(lotDetails.sackTypeName === null && lotDetails.sackTypeId === null && {
            value: undefined
          })
        },
        netQuantity: {
          ...editLotForm.netQuantity,
          value: lotDetails.netQuantity
        },
        storeAddress: {
          ...editLotForm.storeAddress,
          value: lotDetails.storeAddress
        },
        buyer: {
          ...editLotForm.buyer,
          value: lotDetails.buyer
        },
        allowance: {
          ...editLotForm.allowance,
          value: lotDetails.allowance?.toString()
        },
        elevation: {  //OPTIONAL DROPDOWN
          ...editLotForm.elevation,
          ...(lotDetails.elevationName && lotDetails.elevationId && {
            value: {
              label: lotDetails.elevationName,
              value: lotDetails.elevationId
            }
          }),
          ...(lotDetails.elevationName === null && lotDetails.elevationId === null && {
            value: undefined
          })
        },
        sampleCount: {
          ...editLotForm.sampleCount,
          value: lotDetails.sampleCount
        },
        price: {
          ...editLotForm.price,
          value: lotDetails.price?.toString()
        },
        deliveryDatesCount: {
          ...editLotForm.deliveryDatesCount,
          value: lotDetails.deliveryDatesCount
        },
        itemType: { //mandatory in create DROPDOWN
          ...editLotForm.itemType,
          ...(lotDetails.itemCode && lotDetails.itemName && {
            value: {
              label: lotDetails.itemCode,
              value: lotDetails.itemCode
            }
          }),
          ...(lotDetails.itemCode === null && lotDetails.itemName === null && {
            value: undefined
          })
        },
        valueNumber: {
          ...editLotForm.valueNumber,
          value: lotDetails.value
        },
        invoiceNo: {
          ...editLotForm.invoiceNo,
          value: lotDetails.invoiceNo
        },
        postingDate: {
          ...editLotForm.postingDate,
          value: new Date(catalogueDetails.salesDate) > new Date() ? 
          catalogueDetails.salesDate : 
          lotDetails.postingDate || new Date()
        },
        remarks: {
          ...editLotForm.remarks,
          value: lotDetails.remarks
        },
        contractNumber: {
          ...editLotForm.contractNumber,
          value: lotDetails.contractNumber
        },
        paymentType: { //mandatory in create DROPDOWN
          ...editLotForm.paymentType,
          ...(lotDetails.paymentType && lotDetails.paymentTypeId && {
            value: { label: lotDetails.paymentType, value: lotDetails.paymentTypeId }
          }),
          ...(lotDetails.paymentType === null && lotDetails.paymentTypeId === null && {
            value: undefined
          })
        },
      }
      dispatch(setEditLotForm(lotObj))
      dispatch(setEditLotFormPersist(lotObj))
    }
  }, [lotDetails, dispatch]);

  const onHandleLotOnChange = (key: string, value: string | DropDownOptionDto | number | Dayjs | null) => {
    let finalError = undefined
    let finalValue = null
    switch (key) {
      case 'bagCount':
        if (editLotForm.weightPerBag.value) {
          finalError = undefined
          finalValue = (Number(editLotForm.weightPerBag.value) * Number(value))?.toFixed(2)
        }
        const bagCountObj = {
          ...editLotForm,
          bagCount: {
            ...editLotForm.bagCount,
            value,
            error: null
          },
          netQuantity: {
            ...editLotForm.netQuantity,
            value: finalValue,
            error: finalError
          },
          valueNumber: {
            ...editLotForm.valueNumber,
            value: editLotForm.price.value && finalValue ? Number(finalValue) * Number(editLotForm.price.value) : null
          },
          allowance:{
            ...editLotForm.allowance,
            validators: {
              min: 0,
              max: (Number(editLotForm?.weightPerBag?.value) * Number(value) - 1)
            },
            error: editLotForm?.allowance?.value && editLotForm?.allowance?.value > Number(editLotForm?.weightPerBag?.value) * Number(value) ? 'Cannot be greater than net quantity' : null
          }
          
        }
        dispatch(setEditLotForm(bagCountObj));
        break;
      case 'weightPerBag':
        let quantityError = undefined
        let quantityValue = null

        if (editLotForm.bagCount.value) {
          quantityError = undefined
          quantityValue = (Number(editLotForm.bagCount.value) * Number(value))?.toFixed(2)
        }
        const weightPerBagObj = {
          ...editLotForm,
          weightPerBag: {
            ...editLotForm.weightPerBag,
            value,
            error: null
          },
          netQuantity: {
            ...editLotForm.netQuantity,
            value: quantityValue,
            error: quantityError
          },
          valueNumber: {
            ...editLotForm.valueNumber,
            value: editLotForm.price.value && quantityValue ? Number(quantityValue) * Number(editLotForm.price.value) : null
          },
           allowance:{
            ...editLotForm.allowance,
            validators: {
              min: 0,
              max: (Number(value) * Number(editLotForm?.bagCount?.value) -1)
            },
            error: editLotForm?.allowance?.value && editLotForm?.allowance?.value > Number(value) * Number(editLotForm?.bagCount?.value) ? 'Cannot be greater than net quantity' : null
          }
        }
        dispatch(setEditLotForm(weightPerBagObj));
        break;
      case 'price':
        if (editLotForm.netQuantity.value) {
          finalError = undefined
          finalValue = editLotForm.netQuantity.value * Number(value)
        }
        const priceObj = {
          ...editLotForm,
          price: {
            ...editLotForm.price,
            value,
            error: null
          },
          valueNumber: {
            ...editLotForm.valueNumber,
            value: finalValue,
            error: finalError
          }
        }
        dispatch(setEditLotForm(priceObj));
        break;
      case 'allowance':
        if (editLotForm.allowance.value) {
          finalError = undefined
          finalValue = editLotForm.allowance.value
        }
          let allowance: number = Number(value) 
          let allowanceObj = {
          ...editLotForm,
          allowance: {
            ...editLotForm.allowance,
            value,
            error: null
          }
        }
        
        dispatch(setEditLotForm(allowanceObj));
        if ((editLotForm?.weightPerBag.value &&  
          editLotForm?.bagCount?.value && 
          allowance >= (editLotForm?.weightPerBag?.value * editLotForm?.bagCount?.value))) {
        let  errAllowanceObj = {
          ...editLotForm,
          allowance: {
            ...editLotForm.allowance,
            value: allowance,
            validators: {
              min: 0,
              max: (editLotForm?.weightPerBag?.value * editLotForm?.bagCount?.value - 1)
            },
            error: 'Cannot be greater than net quantity'
          }
          
        }
        
        dispatch(setEditLotForm(errAllowanceObj));
        }
        
        break;
      default:
        const formFieldObj = {
          ...editLotForm,
          [key]: {
            ...editLotForm[key as keyof typeof editLotForm],
            value,
            error: null,
          }
        };
        dispatch(setEditLotForm(formFieldObj));
    }
  }

  const handleSave = async () => {
    dispatch(setIsLeaveOn(false)) // HANDLE THIS

    const [validateData, isValid] = await formValidator(editLotForm);
    dispatch(validateEditLotForm(validateData))
    if (isValid) {
      const updateTeaLot: updateTeaLotDetails = {
        estateCode: lotDetails.estateCode !== editLotForm.estateCode.value
          ? (editLotForm.estateCode.value === ""
            ? null
            : editLotForm.estateCode.value)
          : undefined,
        estateName: lotDetails.estateName !== editLotForm.estateName.value
          ? (editLotForm.estateName.value === ""
            ? null
            : editLotForm.estateName.value)
          : undefined,
        storeAddress: lotDetails.storeAddress !== editLotForm.storeAddress.value
          ? (editLotForm.storeAddress.value === ""
            ? null
            : editLotForm.storeAddress.value)
          : undefined,
        buyer: lotDetails.buyer !== editLotForm.buyer.value
          ? (editLotForm.buyer.value === ""
            ? null
            : editLotForm.buyer.value)
          : undefined,
        contractNo: lotDetails.contractNumber !== editLotForm.contractNumber.value
          ? (editLotForm.contractNumber.value === ""
            ? null :
            editLotForm.contractNumber.value)
          : undefined,
        allowance: lotDetails.allowance !== editLotForm.allowance.value
          ? (editLotForm.allowance.value?.toString() == ""
            ? null
            : editLotForm.allowance.value)
          : undefined,
        sampleCount: lotDetails.sampleCount !== editLotForm.sampleCount.value
          ? (editLotForm.sampleCount.value === 0
            ? null
            : editLotForm.sampleCount.value)
          : undefined,
        noOfDeliveryDays: lotDetails.deliveryDatesCount !== editLotForm.deliveryDatesCount.value
          ? (editLotForm.deliveryDatesCount.value === 0
            ? null
            : editLotForm.deliveryDatesCount.value)
          : undefined,
        invoiceNo: lotDetails.invoiceNo !== editLotForm.invoiceNo.value
          ? (editLotForm.invoiceNo.value === ""
            ? null
            : editLotForm.invoiceNo.value)
          : undefined,
        remarks: lotDetails.remarks !== editLotForm.remarks.value
          ? (editLotForm.remarks.value === ""
            ? null
            : editLotForm.remarks.value)
          : undefined,
        standardId: lotDetails.standardId != editLotForm.standard.value?.value
          ? (editLotForm.standard.value?.value !== undefined && editLotForm.standard.value?.value !== null
            ? Number(editLotForm.standard.value?.value)
            : null)
          : undefined,
        gradeId: lotDetails.gradeId != editLotForm.grade.value?.value
          ? (editLotForm.grade.value?.value !== undefined && editLotForm.grade.value?.value !== null
            ? editLotForm.grade.value?.value.toString()
            : null)
          : undefined,
        breakId: lotDetails.breakId != editLotForm.breakType.value?.value
          ? (editLotForm.breakType.value?.value !== undefined && editLotForm.breakType.value?.value !== null
            ? Number(editLotForm.breakType.value?.value)
            : null)
          : undefined,
        elevationId: lotDetails.elevationId != editLotForm.elevation.value?.value
          ? (editLotForm.elevation.value?.value !== undefined && editLotForm.elevation.value?.value !== null
            ? Number(editLotForm.elevation.value?.value)
            : null)
          : undefined,
        chestTypeId: lotDetails.chestTypeId != editLotForm.chest.value?.value
          ? (editLotForm.chest.value?.value !== undefined && editLotForm.chest.value?.value !== null
            ? Number(editLotForm.chest.value?.value)
            : null)
          : undefined,
        sackTypeId: lotDetails.sackTypeId != editLotForm.sack.value?.value
          ? (editLotForm.sack.value?.value !== undefined && editLotForm.sack.value?.value !== null
            ? Number(editLotForm.sack.value?.value)
            : null)
          : undefined,
        bagCount: editLotForm.bagCount.value || 0,
        weightPerBag: editLotForm.weightPerBag.value || 0,
        itemCode: editLotForm.itemType.value?.label || "",
        price: editLotForm.price.value || 0,
        postingDate: dayjs(editLotForm.postingDate.value).add(5.5, 'h').toDate(),
        paymentTypeId: Number(editLotForm.paymentType.value?.value) || 0,
      }
      dispatch(updateTeaLotDetailsById(updateTeaLot)).then(() => {
        dispatch(getTeaLotDetailsById());
        dispatch(getTeaLotDetails());
        dispatch(setIsEdit(false));
        dispatch(setShowEditIcon(true));
      })
    }
  };

  const handleCancel = () => {
    dispatch(setIsEdit(false))
    dispatch(setShowEditIcon(true))
    setOnCancel(false)
    dispatch(resetEditLotForm())
    dispatch(getTeaLotDetailsById());
  }

  const handleEdit = () => {
    dispatch(setIsEdit(true));
    dispatch(setShowEditIcon(false))
    
    onHandleLotOnChange('itemType', lotDetails.itemCode ? 
      {
              label:  lotDetails.itemCode,
              value:  lotDetails.itemCode
            }
            : {
              label:  masterData.itemDetail[0].itemCode,
              value:  masterData.itemDetail[0].itemCode
            } )
    
  }

  const handleChange = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.match(/[^0-9]/)) {
      event.preventDefault();
    }

    if (key === 'bagCount' || key === 'sampleCount' || key === 'deliveryDatesCount') {
      const number = Number.isNaN(Number(event.target.value)) ? '' : Number(event.target.value);
      onHandleLotOnChange(key, number)
    } else {
      onHandleLotOnChange(key, event.target.value)
    }
  }
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
                value={editLotForm.lotNo.value ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.LOT_NO}
                disabled
                required={editLotForm.lotNo.isRequired}
                error={!!editLotForm.lotNo.error}
                helperText={editLotForm.lotNo.error !== '' ? editLotForm.lotNo.error : ''}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.BOX_NUMBER}
                value={editLotForm.boxNo.value ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.BOX_NUMBER}
                disabled={editLotForm.boxNo.disable}
                required={editLotForm.boxNo.isRequired}
                error={!!editLotForm.boxNo.error}
                helperText={editLotForm.boxNo.error !== '' ? editLotForm.boxNo.error : ''}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4} gap={2}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.STATUS}
                value={editLotForm.statusName.value ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.STATUS}
                disabled={editLotForm.statusName.disable}
                required={editLotForm.statusName.isRequired}
                error={!!editLotForm.statusName.error}
                helperText={editLotForm.statusName.error !== '' ? editLotForm.statusName.error : ''}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={editLotForm.standard.value}
                onChange={(event, value) => { onHandleLotOnChange('standard', value) }}
                options={masterData.standard?.map((standard) => ({
                  label: standard.standardName,
                  value: standard.standardId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.STANDARD}
                    placeholder={FIELD_LABELS.STANDARD}
                    required={editLotForm.standard.isRequired}
                    error={!!editLotForm.standard.error}
                    helperText={editLotForm.standard.error !== '' ? editLotForm.standard.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                value={editLotForm.breakType.value}
                onChange={(event, value) => { onHandleLotOnChange('breakType', value) }}
                options={masterData.break?.map((breakType) => ({
                  label: breakType.breakName,
                  value: breakType.breakId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.BREAK}
                    placeholder={FIELD_LABELS.BREAK}
                    required={editLotForm.breakType.isRequired}
                    error={!!editLotForm.breakType.error}
                    helperText={editLotForm.breakType.error !== '' ? editLotForm.breakType.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>


            <Grid item lg={4} md={4} xs={4} gap={1} display='flex'>
              <TextField
                fullWidth
                size="small"
                inputMode='numeric'
                id="outlined-required"
                label={FIELD_LABELS.NO_OF_BAGS}
                value={editLotForm.bagCount.value ?? ""}
                onChange={(e) => { handleChange('bagCount', e) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.NO_OF_BAGS}
                InputProps={{
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: "^[0-9]+$",
                  }
                }}
                disabled={!!showEditIcon}
                required={editLotForm.bagCount.isRequired}
                helperText={editLotForm.bagCount.error !== '' ? editLotForm.bagCount.error : ''}
                error={!!editLotForm.bagCount.error}
              />

              <TextField
                fullWidth
                size="small"
                inputMode='decimal'
                id="outlined-required"
                label={FIELD_LABELS.WEIGHT_OF_BAG}
                value={editLotForm.weightPerBag.value ?? ""}
                onChange={(e) => {
                  const regex = /^[0-9]*\.?[0-9]{0,2}$/;
                  if (regex.test(e.target.value) || e.target.value === "") {
                    handleChange("weightPerBag", e);
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
                disabled={!!showEditIcon}
                required={editLotForm.weightPerBag.isRequired}
                helperText={editLotForm.weightPerBag.error !== '' ? editLotForm.weightPerBag.error : ''}
                error={!!editLotForm.weightPerBag.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                id="outlined-required"
                label={FIELD_LABELS.ESTATE_CODE}
                value={editLotForm.estateCode.value ?? ""}
                onChange={(e) => { onHandleLotOnChange('estateCode', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={editLotForm.estateCode.isRequired}
                placeholder={FIELD_LABELS.ESTATE_CODE}
                error={!!editLotForm.estateCode.error}
                helperText={editLotForm.estateCode.error !== '' ? editLotForm.estateCode.error : ''}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              <TextField
                fullWidth
                size="small"
                id="outlined-required"
                label={FIELD_LABELS.ESTATE_NAME}
                value={editLotForm.estateName.value ?? ""}
                onChange={(e) => { onHandleLotOnChange('estateName', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={editLotForm.estateName.isRequired}
                placeholder={FIELD_LABELS.ESTATE_NAME}
                error={!!editLotForm.estateName.error}
                helperText={editLotForm.estateName.error !== '' ? editLotForm.estateName.error : ''}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.NET_QUANTITY}
                value={editLotForm.netQuantity.value && editLotForm?.weightPerBag.value && editLotForm?.bagCount.value ? ((editLotForm?.weightPerBag.value * editLotForm?.bagCount.value) - (editLotForm?.allowance?.value || 0)) : ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.NET_QUANTITY}
                disabled
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={editLotForm.grade.value}
                onChange={(event, value) => { onHandleLotOnChange('grade', value) }}
                options={masterData.grade?.map((grade) => ({
                  label: grade.gradeCode,
                  value: grade.gradeId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.GRADE}
                    placeholder={FIELD_LABELS.GRADE}
                    required={editLotForm.grade.isRequired}
                    error={!!editLotForm.grade.error}
                    helperText={editLotForm.grade.error !== '' ? editLotForm.grade.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4} gap={1} display='flex'>
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={editLotForm.chest.value}
                onChange={(event, value) => { onHandleLotOnChange('chest', value) }}
                options={masterData.chestType?.map((chest) => ({
                  label: chest.chestTypeDescription,
                  value: chest.chestTypeId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.CHEST_TYPE}
                    placeholder={FIELD_LABELS.CHEST_TYPE}
                    required={editLotForm.chest.isRequired}
                    error={!!editLotForm.chest.error}
                    helperText={editLotForm.chest.error !== '' ? editLotForm.chest.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />

            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={editLotForm.sack.value}
                onChange={(event, value) => { onHandleLotOnChange('sack', value) }}
                options={masterData.sackType?.map((sack) => ({
                  label: sack.sackTypeName,
                  value: sack.sackTypeId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.SACK_TYPE}
                    placeholder={FIELD_LABELS.SACK_TYPE}
                    required={editLotForm.sack.isRequired}
                    error={!!editLotForm.sack.error}
                    helperText={editLotForm.sack.error !== '' ? editLotForm.sack.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                id="outlined-required"
                size="small"
                label={FIELD_LABELS.PO_NUMBER}
                value={editLotForm.purchaseOrderNo.value ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.PO_NUMBER}
                disabled
                required={editLotForm.purchaseOrderNo.isRequired}
                error={!!editLotForm.purchaseOrderNo.error}
                helperText={editLotForm.purchaseOrderNo.error !== '' ? editLotForm.purchaseOrderNo.error : ''}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Tooltip title={editLotForm.storeAddress.value} placement="top">
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-required"
                  label={FIELD_LABELS.STORE_ADDRESS}
                  value={editLotForm.storeAddress.value ?? ""}
                  onChange={(event) => onHandleLotOnChange("storeAddress", event.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder={FIELD_LABELS.STORE_ADDRESS}
                  required={editLotForm.storeAddress.isRequired}
                  helperText={editLotForm.storeAddress.error !== '' ? editLotForm.storeAddress.error : ''}
                  error={!!editLotForm.storeAddress.error}
                  disabled={!!showEditIcon}
                />
              </Tooltip>
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Tooltip title={editLotForm.buyer.value} placement="top">
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-required"
                  label={FIELD_LABELS.MAIN_BUYER}
                  value={editLotForm.buyer.value ?? ""}
                  onChange={(e) => { onHandleLotOnChange('buyer', e.target.value) }}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required={editLotForm.buyer.isRequired}
                  placeholder={FIELD_LABELS.MAIN_BUYER}
                  error={!!editLotForm.buyer.error}
                  helperText={editLotForm.buyer.error !== '' ? editLotForm.buyer.error : ''}
                  disabled={!!showEditIcon}
                />
              </Tooltip>
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Tooltip title={editLotForm.contractNumber.value} placement="top">
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-required"
                  label={FIELD_LABELS.CONTRACT_NO}
                  value={editLotForm.contractNumber.value ?? ""}
                  onChange={(e) => { onHandleLotOnChange('contractNumber', e.target.value) }}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required={editLotForm.contractNumber.isRequired}
                  placeholder={FIELD_LABELS.CONTRACT_NO}
                  error={!!editLotForm.contractNumber.error}
                  helperText={editLotForm.contractNumber.error !== '' ? editLotForm.contractNumber.error : ''}
                  disabled={!!showEditIcon}
                />
              </Tooltip>
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={editLotForm.elevation.value}
                onChange={(event, value) => { onHandleLotOnChange('elevation', value) }}
                options={masterData.elevation?.map((elevation) => ({
                  label: elevation.elevationName,
                  value: elevation.elevationId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.ELEVATION}
                    placeholder={FIELD_LABELS.ELEVATION}
                    required={editLotForm.elevation.isRequired}
                    error={!!editLotForm.elevation.error}
                    helperText={editLotForm.elevation.error !== '' ? editLotForm.elevation.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>


            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                inputMode='decimal'
                id="outlined-required"
                label={FIELD_LABELS.PRICE}
                value={editLotForm.price.value ?? ""}
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
                disabled={!!showEditIcon}
                required={editLotForm.price.isRequired}
                helperText={editLotForm.price.error !== '' ? editLotForm.price.error : ''}
                error={!!editLotForm.price.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.VALUE}
                // value={editLotForm.valueNumber.value?.toFixed(2) ?? ""}
                value={
                  editLotForm.valueNumber.value !== null && editLotForm.valueNumber.value !== undefined
                    ? editLotForm.valueNumber.value?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    : ""
                }
                variant="outlined"
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
                value={editLotForm.allowance.value ?? ""}
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
                    min: 0,
                    max:editLotForm?.weightPerBag.value &&  editLotForm?.bagCount?.value && ((editLotForm?.weightPerBag.value * editLotForm?.bagCount.value) - 1)
                  },
                }}
                placeholder={FIELD_LABELS.ALLOWANCE}
                disabled={!!showEditIcon}
                required={editLotForm.allowance.isRequired}
                helperText={editLotForm.allowance.error !== '' ? editLotForm.allowance.error : ''}
                error={!!editLotForm.allowance.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                inputMode='numeric'
                id="outlined-required"
                value={editLotForm.sampleCount.value ?? ""}
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
                disabled={!!showEditIcon}
                required={editLotForm.sampleCount.isRequired}
                helperText={editLotForm.sampleCount.error !== '' ? editLotForm.sampleCount.error : ''}
                error={!!editLotForm.sampleCount.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputMode='numeric'
                id="outlined-required"
                value={editLotForm.deliveryDatesCount.value ?? ""}
                label={FIELD_LABELS.NO_OF_DELIVERY_DAYS}
                onChange={(e) => { handleChange('deliveryDatesCount', e) }}
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
                disabled={!!showEditIcon}
                required={editLotForm.deliveryDatesCount.isRequired}
                helperText={editLotForm.deliveryDatesCount.error !== '' ? editLotForm.deliveryDatesCount.error : ''}
                error={!!editLotForm.deliveryDatesCount.error}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={!!showEditIcon}
                  format="YYYY-MM-DD"
                  label={FIELD_LABELS.POSTING_DATE}
                  value={dayjs(editLotForm.postingDate.value)}
                  minDate={dayjs(catalogueDetails.salesDate) ?? null}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "outlined",
                      id: "outlined-required",
                      error: !!editLotForm.postingDate.error,
                      required: editLotForm.postingDate.isRequired,
                      helperText: editLotForm.postingDate.error !== '' ? editLotForm.postingDate.error : '',
                      fullWidth: true,
                    }
                  }}
                  onChange={(value) => onHandleLotOnChange('postingDate', value)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={editLotForm.itemType.value ?? null}
                onChange={(event, value) => { onHandleLotOnChange('itemType', value) }}
                options={masterData.itemDetail?.map((item) => ({
                  label: item.itemCode,
                  value: item.itemCode
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.ITEM_CODE}
                    placeholder={FIELD_LABELS.ITEM_CODE}
                    required={editLotForm.itemType.isRequired}
                    error={!!editLotForm.itemType.error}
                    helperText={editLotForm.itemType.error !== '' ? editLotForm.itemType.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                fullWidth
                size="small"
                id="outlined-required"
                label={FIELD_LABELS.INVOICE_NUMBER}
                value={editLotForm.invoiceNo.value ?? ""}
                onChange={(e) => { onHandleLotOnChange('invoiceNo', e.target.value) }}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required={editLotForm.invoiceNo.isRequired}
                placeholder={FIELD_LABELS.INVOICE_NUMBER}
                error={!!editLotForm.invoiceNo.error}
                helperText={editLotForm.invoiceNo.error !== '' ? editLotForm.invoiceNo.error : ''}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <Autocomplete
                size="small"
                disablePortal
                value={editLotForm.paymentType.value}
                onChange={(event, value) => { onHandleLotOnChange('paymentType', value) }}
                options={masterData.paymentType?.map((payment) => ({
                  label: payment.paymentType,
                  value: payment.paymentTypeId
                })) || []}
                renderInput={(params) => (
                  <TextField {...params}
                    label={FIELD_LABELS.PAYMENT}
                    placeholder={FIELD_LABELS.PAYMENT}
                    required={editLotForm.paymentType.isRequired}
                    error={!!editLotForm.paymentType.error}
                    helperText={editLotForm.paymentType.error !== '' ? editLotForm.paymentType.error : ''}
                  />
                )}
                disabled={!!showEditIcon}
              />
            </Grid>

            <Grid item lg={4} md={4} xs={4}>
              <TextField
                size="small"
                fullWidth
                id="outlined-required"
                label={FIELD_LABELS.ITEM_NAME}
                value={masterData.itemDetail.filter((item) => item.itemCode === editLotForm.itemType.value?.value)[0]?.itemName ?? ""}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={FIELD_LABELS.ITEM_NAME}
                disabled
              />
            </Grid>

            {/* <Grid item lg={4} md={4} xs={4} /> */}

            <Grid item lg={4} md={4} xs={4}>
              <Tooltip title={editLotForm.remarks.value} placement="top">
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-required"
                  label={FIELD_LABELS.REMARKS}
                  value={editLotForm.remarks.value ?? ""}
                  onChange={(e) => { onHandleLotOnChange('remarks', e.target.value) }}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required={editLotForm.remarks.isRequired}
                  placeholder={FIELD_LABELS.REMARKS}
                  error={!!editLotForm.remarks.error}
                  helperText={editLotForm.remarks.error !== '' ? editLotForm.remarks.error : ''}
                  disabled={!!showEditIcon}
                />
              </Tooltip>
            </Grid>


            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              gap={1}
              mt={3}
            >
              {onCancel && (
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
                        onClick={handleCancel}
                        color="inherit" size="small"
                        sx={{ borderRadius: "16px", marginRight: "10px" }} variant="outlined"
                      >
                        yes
                      </Button>
                      <Button
                        onClick={() => { setOnCancel(false) }}
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

              {isLeaveOn && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
                  action={
                    <CloseIcon onClick={() => { dispatch(setIsLeaveOn(false)) }} />
                  }
                >
                  {EDIT_LOT_FIELD_ERRORS.SAVE_CHANGES}
                </Alert>

              )}
              {editCatalogueResponse.hasError === true && (
                <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                  >
                    {editCatalogueResponse.message}
                  </Alert>
                </Grid>
              )}
              {editCatalogueResponse.isSuccess === true && (
                <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                  <Alert
                    variant="filled"
                    severity="success"
                    sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                  >
                    {editCatalogueResponse.message}
                  </Alert>
                </Grid>
              )}
            </Grid>

            {showEditIcon && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                gap={1}
                mt={2}
              >
                {featureList?.includes(FEATURES.EDIT_TEA_LOTS) && (
                  <AppButton
                  buttonText={"Edit"}
                  size={"medium"}
                  variant={"contained"}
                  color={"primary"}
                  borderRadius="40px"
                  onClick={handleEdit}
                  endIcon={<EditIcon />}
                  disabled={
                    lotDetails.statusId === 4 ||
                    lotDetails.statusId === 5 ||
                    lotDetails.statusId === 6 ||
                    catalogueDetails.statusId === 2 ||
                    catalogueDetails.statusId === 3 ||
                    lotDetails.purchaseOrderId !== null
                  }
                />
                )}
              </Grid>
            )}

            {isEdit && (
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
                  onClick={() => { setOnCancel(true); dispatch(setIsLeaveOn(false)) }}
                />
                <AppButton
                  isLoading={editLoading}
                  buttonText={"save changes"}
                  size={"medium"}
                  variant={"contained"}
                  color={"primary"}
                  borderRadius="40px"
                  onClick={handleSave}
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

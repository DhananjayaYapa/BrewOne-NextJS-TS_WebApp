'use client'
import HeaderBar from "@/components/headerBar/headerBar"
import { Alert, Button, Grid, GlobalStyles, Typography, TextField, Paper } from "@mui/material"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import BlendingSheetHeaderBar from "@/components/blendingSheetManagement/blendingSheet/blendingSheetHeaderBar";
import BlendingSheetBomDetails from "@/components/blendingSheetManagement/blendingSheet/bomDetails";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Props = { params: { view: BlendSheet } }
import { getViewPresignedURL } from "@/redux/action/editBlendSheetAction";
import { BLEND_SHEET_STATUS, FEATURES, ROUTES } from "@/constant";
import { BlendBalance, BlendSheet, OtherBlendLotStock, OtherBOMItem } from "@/interfaces";
import { FileData } from "@/interfaces";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { approveBlendSheet, getBlendBalanceByBlendItem, getBlendSheetByDetail, rejectBlendSheet } from "@/redux/action/blendSheetApprovalsAction";
import { resetApproveResponse, resetRejectResponse, setBlendSheetHeaderFormData, setRejectReason, setSelectedBlendSheet, setSelectedWarehouses } from "@/redux/slice/blendSheetApprovalSlice";
import { resetViewPresignedURL } from "@/redux/slice/editBlendSheetSlice";
import { mapBlendStatusCode } from "@/utill/common/formValidator/util";
import BlendBalanceTable from "@/components/blendingSheetManagement/blendingSheet/blendBalanceTable";
import { calculateAverageWeight, calculateAveragePricePerUnit, calculateTotalAllocatedQuantity } from "@/utill/blendSheetCalculations";
import BlendSFGTable from "@/components/blendingSheetManagement/blendingSheet/blendSFGTable";
import BlendOtherItemTable from "@/components/blendingSheetManagement/blendingSheet/blendOtherItemTable";
import { ItemDetail } from "@/interfaces/teaLotById";

export default function BlendingSheetApprovalView({ params }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const breadcrumbs = [
    {
      id: 1,
      link: "Blending Sheet Approval",
      route: `/${ROUTES.BLEND_SHEET_APPROVALS}`,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: 'View Blending Sheet',
      route: "",
    },
  ];
  const featureList = useSelector(
    (state: RootState) => state.auth.currentUserFeatureList
  )
  const blendSheetDetail = useSelector(
    (state: RootState) => state.blendSheetApprovals.getBlendSheetDetailResponse
  )

  const headerDetails = useSelector(
    (state: RootState) => state.blendSheetApprovals.viewBlendSheetHeaderForm
  )

  const salesOrder = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedSalesOrder
  )

  const selectedProduct = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedProduct
  )

  const selectedBlendItem = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedBlendItem
  )

  const getBlendSheetDetailResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.getBlendSheetDetailResponse
  )

  const blendDetail = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedBlendDetail
  )

  const selectedWarehouses = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedWarehouses,
  );

  const BOMItems = useSelector(
    (state: RootState) => state.blendSheetApprovals.BOMItems,
  );

  const uploads = useSelector(
    (state: RootState) => state.blendSheetApprovals.uploads,
  );


  const selectedBlendSheet = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedBlendSheet
  )

  const selectedSalesOrder = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedSalesOrder
  )

  const rejectReason = useSelector(
    (state: RootState) => state.blendSheetApprovals.rejectReason,
  );

  const selectedBlendBalances = useSelector(
    (state: RootState) => state.blendSheetApprovals.selectedBlendBalances,
  );

  const getBlendBalanceByBlendItemResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.getBlendBalanceByBlendItemResponse
  )


  const [openApprovalConfirmation, setOpenApprovalConfirmation] = useState<boolean>(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState<boolean>(false);

  const approveBlendSheetResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.approveBlendSheetResponse,
  );

  const rejectBlendSheetResponse = useSelector(
    (state: RootState) => state.blendSheetApprovals.rejectBlendSheetResponse,
  );

  const viewPresignedURL = useSelector(
    (state: RootState) => state.editBlendSheet.viewPreSignedURLResponse
  )

  //other items redux variables
  const selectedOtherItem = useSelector((state: RootState) => state.editBlendSheet.selectedOtherItem)
  const otherBOMItems = useSelector((state: RootState) => state.editBlendSheet.OtherBOMItems);

  //sfg item redux variables
  const selectedSFGItems = useSelector((state: RootState) => state.editBlendSheet.selectedSFGItems)

  const router = useRouter();

  useEffect(() => {
    if (!selectedBlendSheet) {
      const temp: BlendSheet = {
        blendSheetId: Number(params.view),
        salesOrderId: 0,
        productItemCode: "",
        blendNumber: "",
        blendItemCode: "",
        blendItemDescription: "",
        blendDate: "",
        statusId: 0,
        statusName: "",
        plannedQuantity: 0,
        createdBy: "",
        createdAt: "",
        updatedBy: "",
        updatedAt: "",
        approval: null
      }
      dispatch(setSelectedBlendSheet(temp))
    }
  }, [])

  useEffect(() => {
    if (viewPresignedURL.data) {
      const newTab = window.open(viewPresignedURL.data.url, "_blank");

      if (newTab) {
        newTab.focus();
        dispatch(resetViewPresignedURL())
      }
    }

  }, [viewPresignedURL])

  useEffect(() => {
    if (getBlendSheetDetailResponse) {
      if (getBlendSheetDetailResponse.data?.attachments) {
        const attachments = getBlendSheetDetailResponse.data?.attachments?.map((item) => {
          return {
            file: null,
            url: item.fileKey,
            fileKey: item.fileKey
          }

        })
        setFiles(attachments)
      }
      dispatch(setBlendSheetHeaderFormData({ name: 'orderDate', value: getBlendSheetDetailResponse.data?.orderDate.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'startDate', value: getBlendSheetDetailResponse.data?.startDate.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'dueDate', value: getBlendSheetDetailResponse.data?.dueDate.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'remarks', value: getBlendSheetDetailResponse.data?.remarks || '' }))
    }

  }, [getBlendSheetDetailResponse])

  useEffect(() => {
    if (selectedSalesOrder !== null) {
      dispatch(setBlendSheetHeaderFormData({ name: 'salesOrderId', value: selectedSalesOrder?.salesOrderId?.toString() || "" }))
      dispatch(setBlendSheetHeaderFormData({ name: 'orderDate', value: selectedSalesOrder?.orderDate?.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'startDate', value: selectedSalesOrder?.startDate?.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'dueDate', value: selectedSalesOrder?.dueDate?.toString() || '' }))
      dispatch(setBlendSheetHeaderFormData({ name: 'customerCode', value: selectedSalesOrder?.customerCode || '' }))
    }
  }, [selectedSalesOrder !== null])

  useEffect(() => {

  }, [selectedProduct])

  useEffect(() => {
    dispatch(setBlendSheetHeaderFormData({ name: 'warehouse', value: selectedBlendItem?.warehouseCode?.toString() || '' }))
    dispatch(setBlendSheetHeaderFormData({ name: 'actualPlannedQuantity', value: selectedBlendItem?.plannedQuantity || null }))
    const blendBalanceSum = selectedBlendBalances && selectedBlendBalances?.length > 0
      ? selectedBlendBalances.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
    if (selectedBlendItem) {

      dispatch(getBlendBalanceByBlendItem())
      dispatch(setBlendSheetHeaderFormData({ name: 'plannedQuantity', value: (selectedBlendItem?.plannedQuantity) - blendBalanceSum || '' }))
    }
  }, [selectedBlendItem])
  useEffect(() => {
    if (selectedBlendSheet !== null) {
      dispatch(getBlendSheetByDetail())
    }
  }, [selectedBlendSheet])
  const [files, setFiles] = useState<FileData[]>([]);

  const setOpen = (value: boolean, itemCode: string, index: number) => {

    const updatedBOMItemsStock = selectedWarehouses?.map(item =>
      item.itemCode === itemCode
        ? {
          ...item,
          isCollapsed: !value
        }
        : item
    );
    dispatch(setSelectedWarehouses(updatedBOMItemsStock));

  };

  const viewFile = (fileKey: string) => {
    dispatch(getViewPresignedURL(fileKey))
  }
  useEffect(() => {
    if (viewPresignedURL.hasError) {
      setTimeout(() => {
        dispatch(resetViewPresignedURL())
      }, 5000);
    }
  }, [viewPresignedURL.hasError])

  useEffect(() => {
    if (approveBlendSheetResponse.isSuccess) {
      setOpenApprovalConfirmation(false)
      setTimeout(() => {
        dispatch(resetApproveResponse())
      dispatch(getBlendSheetByDetail())
      router.push(`/${ROUTES.BLEND_SHEET_APPROVALS}`)
      }, 2000);
      // dispatch(getAllBlendSheets())

    }
    if (approveBlendSheetResponse.hasError) {
      setOpenApprovalConfirmation(false)
      setTimeout(() => {
        dispatch(resetApproveResponse())
      }, 1000);

      dispatch(getBlendSheetByDetail())
    }
  }, [approveBlendSheetResponse])

  useEffect(() => {
    if (rejectBlendSheetResponse.isSuccess || rejectBlendSheetResponse.hasError) {
      setOpenRejectConfirmation(false)
      dispatch(getBlendSheetByDetail())
      dispatch(setRejectReason(null))
      setTimeout(() => {
        dispatch(resetRejectResponse())
      }, 2000);

    }
    if (rejectBlendSheetResponse.isSuccess) {

      router.push(ROUTES.BLEND_SHEET_APPROVALS)
    }
  }, [rejectBlendSheetResponse])

  const approveRequest = () => {
    dispatch(approveBlendSheet())

  };

  const rejectRequest = () => {
    if (rejectReason) {
      dispatch(rejectBlendSheet())
    }
  };

  const handleOnApproveRequest = () => {
    // dispatch(setSelectedBlendSheet(col))
    setOpenApprovalConfirmation(true)
  };

  const handleOnRejectRequest = () => {
    setOpenRejectConfirmation(true)
    // dispatch(setSelectedBlendSheet(col))
  };

  const closeApprovalConfirmation = () => {
    setOpenApprovalConfirmation(false)
    dispatch(setSelectedBlendSheet(null))
  };

  const closeRejectReason = () => {
    setOpenRejectConfirmation(false)
    dispatch(setSelectedBlendSheet(null))
  };

  const onChangeRejectReason = (reason: string) => {
    dispatch(setRejectReason(reason))
  };
  type BlendSheetStatusKey = keyof typeof BLEND_SHEET_STATUS;


  return (
    <Grid>
      <GlobalStyles
        styles={{
          '@media print': {
            '@page': {
              size: 'landscape',
              margin: '1in',
            },
          },
        }}
      />

      <CatalogueManagementHeader
        title={`Blending Sheet - ${getBlendSheetDetailResponse.data?.blendSheetNo || ''}`}
        breadcrumbs={breadcrumbs}
        showBorder={false}
        component={getBlendSheetDetailResponse.data?.approval?.status === "PENDING" &&
          <Grid container textAlign={"right"} m={0}>
            <Grid item xs={12} lg={12} pb={1}>
              {featureList && featureList?.includes(FEATURES.APPROVE_BLEND_SHEET) &&
                <Button
                  variant="contained"
                  sx={{ marginRight: 1 }}
                  onClick={handleOnApproveRequest}
                >
                  Approve
                </Button>
              }
              {featureList?.includes(FEATURES.REJECT_BLEND_SHEET) &&
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={handleOnRejectRequest}
                >
                  Reject
                </Button>
              }
            </Grid>
          </Grid>
        }
      />

      {(viewPresignedURL.hasError || rejectBlendSheetResponse.hasError || approveBlendSheetResponse.hasError) && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
          >
            {viewPresignedURL?.message || rejectBlendSheetResponse?.message ||
              approveBlendSheetResponse?.message || 'Error in API'}
          </Alert>
        </Grid>
      )}
      {(rejectBlendSheetResponse.isSuccess || approveBlendSheetResponse.isSuccess) && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="success"
            sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "100%" }}
          >
            {rejectBlendSheetResponse?.data?.message ||
              approveBlendSheetResponse?.data?.message || 'Error in API'}
          </Alert>
        </Grid>
      )}
      {salesOrder && (
        <BlendingSheetHeaderBar
          salesOrderList={[]}
          salesOrderListIsLoading={false}
          selectedSalesOrder={salesOrder}
          isView={true}
          isEdit={false}
          selectedProduct={selectedProduct}
          productListIsLoading={false}
          selectedBlendItem={selectedBlendItem}
          blendDetail={blendDetail}
          onFetchOptions={function (): void {
            throw new Error("Function not implemented.");
          } }
          blendHeaderForm={headerDetails}
          username={getBlendSheetDetailResponse.data?.createdBy || ""}
          initialPlannedQuantity={selectedBlendItem?.plannedQuantity || 0}
          onPlannedQuantityChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          onOrderDateChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          onStartDateChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          onDueDateChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          onRemarksChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          handleRemoveFile={function (): void {
            throw new Error("Function not implemented.");
          } }
          handleFileChange={function (): void {
            throw new Error("Function not implemented.");
          } }
          handleDrop={function (): void {
            throw new Error("Function not implemented.");
          } }
          files={files}
          viewFile={viewFile}
          blendStatus={(Object.keys(BLEND_SHEET_STATUS) as BlendSheetStatusKey[]).find(
            key => BLEND_SHEET_STATUS[key] === getBlendSheetDetailResponse?.data?.statusId
          ) || "Planned"} attachmentError={""}
           averageWeight={calculateAverageWeight(selectedWarehouses, selectedBlendBalances  || [], selectedSFGItems || [] , selectedOtherItem || [])}
          averagePrice={calculateAveragePricePerUnit(selectedWarehouses, selectedBlendBalances || [], selectedSFGItems|| [], selectedOtherItem || [])}
          totalQuantity={calculateTotalAllocatedQuantity(selectedWarehouses,BOMItems,selectedBlendBalances || [], selectedSFGItems || [], selectedOtherItem || [])}
                     />
      )}

      {selectedBlendBalances && (
        <Paper
          variant="outlined"
          sx={{ borderWidth: 1.75, p: 2, borderColor: "#99a5adff", mt: 3 }}
        >
          <Typography variant="h3" gutterBottom>
            Blend Balance, Theoretical Blend Balance, Blend Gain
          </Typography>
          <BlendBalanceTable
            blendBalanceDetails={getBlendBalanceByBlendItemResponse.data}
            initialBlendItems={[]}
            isView={true}
            selectedBlendBalances={selectedBlendBalances}
            onBlendBalanceQuantityChange={function (value: BlendBalance, quantity: number): void {
              throw new Error("Function not implemented.");
            }}
            onBlendSheetSelect={function (blendSheetNo: string, id: number): void {
              throw new Error("Function not implemented.");
            }}
            onDeleteBlendBalace={function (value: BlendBalance, rowId: number): void {
              throw new Error("Function not implemented.");
            }}
            onSelectItemType={function (value: number): void {
              throw new Error("Function not implemented.");
            }}
            selectableBlendSheets={[]} />
        </Paper>
      )}

      {selectedSFGItems.length > 0 && (
        <Paper
          variant="outlined"
          sx={{ borderWidth: 1.75, p: 2, borderColor: "#99a5adff", mt: 3 }}
        >
          <Typography variant="h3" gutterBottom>
            Semi Finished Goods (SFG)
          </Typography>

          <BlendSFGTable
            selectedSfgItems={selectedSFGItems}
            isView={true} onBlendSheetNoSelect={function (blendSheetNo: string): void {
              throw new Error("Function not implemented.");
            }} onDeleteSfgItem={function (blendsheetNo: string): void {
              throw new Error("Function not implemented.");
            }} selectableSFGItems={[]} />
        </Paper>
      )}

      {otherBOMItems && otherBOMItems?.bomItems.length > 0 && (
        <Paper
          variant="outlined"
          sx={{ borderWidth: 1.75, p: 2, borderColor: "#99a5adff", mt: 3 }}
        >
          <Typography variant="h3" gutterBottom>
            Other Items
          </Typography>

          <BlendOtherItemTable
            otherBOMDetails={otherBOMItems}
            selectedWarehouses={selectedOtherItem}
            isView={true}
            toWarehouse={selectedBlendItem?.warehouseCode || '0'}
            setOpen={function (value: boolean, itemCode: string, index: number): void {
              throw new Error("Function not implemented.");
            } }
            addLot={function (itemCode: string, index: number): void {
              throw new Error("Function not implemented.");
            } }
            onDeleteLot={function (itemCode: string, index: number): void {
              throw new Error("Function not implemented.");
            } }
            onLotSelect={function (itemCode: string, value: OtherBlendLotStock | null, index: number): void {
              throw new Error("Function not implemented.");
            } }
            onEnterRequiredQuantity={function (requiredQuantity: number, itemCode: string, lot: OtherBlendLotStock | null, index: number): void {
              throw new Error("Function not implemented.");
            } }
            deleteBlendItem={function (row: OtherBOMItem, index: number): void {
              throw new Error("Function not implemented.");
            } }
            initialBlendItems={otherBOMItems.bomItems}
            onItemSelect={function (value: ItemDetail | null, index: number): void {
              throw new Error("Function not implemented.");
            } }
            onSearchOptions={function (value: string): void {
              throw new Error("Function not implemented.");
            } }
            onFetchOptions={function (): void {
              throw new Error("Function not implemented.");
            } }
            itemList={[]} />
        </Paper>
      )}


      {selectedBlendItem && BOMItems?.bomItems && selectedWarehouses && (
        <Paper
          variant="outlined"
          sx={{ borderWidth: 1.75, p: 2, borderColor: "#99a5adff", mt: 3 }}>
          <Typography variant="h3" gutterBottom>
            Blend Items
          </Typography>
          <BlendingSheetBomDetails
            plannedProductQuantity={selectedBlendItem.plannedQuantity || 1}
            blendBOMdetails={BOMItems}
            selectedWarehouses={selectedWarehouses}
            setOpen={setOpen}
            onWarehouseSelect={function (): void {
              throw new Error("Function not implemented.");
            }}
            warehouseList={[]} //todo reset this or move to edit slice
            isView={true}
            toWarehouse={selectedBlendItem.warehouseCode}
            addLot={function (): void {
              throw new Error("Function not implemented.");
            }}
            onDeleteLot={function (): void {
              throw new Error("Function not implemented.");
            }}
            onLotSelect={function (): void {
              throw new Error("Function not implemented.");
            }}
            onEnterRequiredQuantity={function (): void {
              throw new Error("Function not implemented.");
            }}
            deleteBlendItem={function (): void {
              throw new Error("Function not implemented.");
            }}
            initialBlendItems={BOMItems.bomItems}
            onItemSelect={function (): void {
              throw new Error("Function not implemented.");
            }}
            onSearchOptions={function (): void {
              throw new Error("Function not implemented.");
            }}
            itemList={[]}
            onBasedQuantityChange={function (): void {
              throw new Error("Function not implemented.");
            }} onFetchOptions={function (): void {
              throw new Error("Function not implemented.");
            }} grnCheckList={undefined} />
        </Paper>
      )}

      <ConfirmationMessage
        dialogTitle="Confirm Approval"
        dialogContentText={
          <div>Are you sure you want to approve this blending sheet?</div>
        }
        open={openApprovalConfirmation}
        onClose={closeApprovalConfirmation}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm",
            onClick: approveRequest,
            isLoading: approveBlendSheetResponse.isLoading
          },
          {
            buttonText: "Close",
            onClick: closeApprovalConfirmation,
            design: 'outlined'
          },
        ]}
      />

      <ConfirmationMessage
        dialogTitle="Confirm Rejection"
        dialogContentText={
          <Grid>
            <Typography sx={{ mb: 2 }}>Are you sure you want to reject this blending sheet?
            </Typography>
            <TextField
              variant="standard"
              fullWidth
              value={rejectReason}
              error={!rejectReason}
              helperText={!rejectReason && "Reject Reason is required"}

              label="Reject Reason"
              onChange={(e) => onChangeRejectReason((e.target.value))}
            />
          </Grid>
        }
        open={openRejectConfirmation}
        onClose={closeRejectReason}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm",
            onClick: rejectRequest,
            isLoading: rejectBlendSheetResponse.isLoading
          },
          {
            buttonText: "Close",
            onClick: closeRejectReason,
            design: 'outlined'
          },
        ]}
      />



    </Grid>

  )
}



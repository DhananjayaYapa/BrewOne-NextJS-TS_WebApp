"use client";
import HeaderBar from "@/components/headerBar/headerBar";
import {
  Alert,
  Box,
  Button,
  Tooltip,
  Grid,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import BlendingSheetHeaderBar from "@/components/blendingSheetManagement/blendingSheet/blendingSheetHeaderBar";
import BlendingSheetBomDetails from "@/components/blendingSheetManagement/blendingSheet/bomDetails";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import { useCallback, useEffect, useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { json2xml } from "xml-js";
// import { Auth } from "@aws-amplify/auth";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import {
  LotStock,
  SelectedWarehouseStock,
  BlendWarehouse,
  BOMItem,
} from "@/interfaces/salesOrder";
import { useRouter } from "next/navigation";
import {
  createBlendSheetApprovalRequest,
  deleteAttachment,
  editBlendSheet,
  getBlendBalanceByBlendItem,
  getBlendSheetByDetail,
  getItemMasterList,
  getOtherItemLotsByItemCodes,
  getOtherItemMasterList,
  getToWarehousesList,
  getUploadPresignedURL,
  getViewPresignedURL,
  getWarehousesByItemCodes,
  releaseBlendSheet,
} from "@/redux/action/editBlendSheetAction";
import {
  resetEditResponse,
  resetUploadPresignedUrl,
  resetViewPresignedURL,
  setBlendSheetHeaderFormData,
  setBomItemDetails,
  setDeletedFileKeys,
  setInitialBlendItems,
  setIsEdit,
  setIsRelease,
  setItemList,
  setItemListSearchKey,
  setItemMasterListPage,
  setSelectedBlendSheet,
  setSelectedEditWarehouses,
  setUploadFileKeys,
  resetWarehouseListResponse,
  resetRequestBlendSheetResponse,
  setIsView,
  setSelectedBlendBalances,
  resetGetBlendBalanceByItemResponse,
  resetReleaseResponse,
  setSelectableBlendSheets,
  setOtherItemMasterListPage,
  setOtherItemList,
  setOtherBomItemDetails,
  setInitialOtherBlendItems,
  resetOtherItemsLotResponse,
  setSelectedOtherItemsEdit,
  setOtherBOMItemsState,
  setSelectedSFGItems,
} from "@/redux/slice/editBlendSheetSlice";
import dayjs, { Dayjs } from "dayjs";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { BLEND_SHEET_STATUS, ROUTES, SCREEN_MODES } from "@/constant";
import {
  BlendBalance,
  BlendBalanceItem,
  BlendSFGItem,
  BlendSheet,
  OtherBlendItem,
  OtherBlendLotStock,
  OtherBlendWarehouse,
  OtherBOMItem,
  SelectedOtherItemLotStock,
  SelectedOtherItemWarehouseStock,
} from "@/interfaces";
import { ItemDetail } from "@/interfaces/teaLotById";
import { FileData, UploadAttachment } from "@/interfaces";
import { mapBlendStatusCode } from "@/utill/common/formValidator/util";
import BlendBalanceTable from "@/components/blendingSheetManagement/blendingSheet/blendBalanceTable";
import BlendingSheetPrintView from "@/components/blendingSheetManagement/blendingSheetPrintView/blendingSheetPrintView";
import {
  getAllSFGItemsByMasterBlendNo,
  getPrintBlendSheet,
} from "@/redux/action/blendAction";
import {
  calculateAvailableQuantity,
  calculateAveragePricePerUnit,
  calculateAverageWeight,
  calculateTotalAllocatedQuantity,
  calculateWarehouseQuantity,
} from "@/utill/blendSheetCalculations";
import BlendOtherItemTable from "@/components/blendingSheetManagement/blendingSheet/blendOtherItemTable";
import BlendSFGTable from "@/components/blendingSheetManagement/blendingSheet/blendSFGTable";
import { update } from "lodash";

type Props = {
  params: { view: BlendSheet };
  searchParams: { mode?: string };
};
export default function BlendingSheetView({ params, searchParams }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const screenMode = searchParams.mode ?? "view";

  const [attachmentError, setAttachmentError] = useState<string>("");
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [forStoreCheck, setForStoreCheck] = useState<boolean>(false);
  const [showSFG, setShowSFG] = useState<boolean>(false);
  const [openReleaseConfirmation, setReleaseOpenConfirmation] =
    useState<boolean>(false);
  const [
    openRequestForApprovalConfirmation,
    setRequestForApprovalConfirmation,
  ] = useState<boolean>(false);
  const isEdit = useSelector((state: RootState) => state.editBlendSheet.isEdit);
  const selectedSalesOrder = useSelector(
    (state: RootState) => state.editBlendSheet.selectedSalesOrder
  );

  const selectedProduct = useSelector(
    (state: RootState) => state.editBlendSheet.selectedProduct
  );

  const blendDetail = useSelector(
    (state: RootState) => state.editBlendSheet.selectedBlendDetail
  );

  const blendSheetHeaderForm = useSelector(
    (state: RootState) => state.editBlendSheet.editBlendSheetHeaderForm
  );

  const BOMItems = useSelector(
    (state: RootState) => state.editBlendSheet.BOMItems
  );

  const warehouseListResponse = useSelector(
    (state: RootState) => state.editBlendSheet.warehouseListResponse
  );

  const selectedWarehouses = useSelector(
    (state: RootState) => state.editBlendSheet.selectedWarehouses
  );

  const editBlendSheetResponse = useSelector(
    (state: RootState) => state.editBlendSheet.editBlendSheetResponse
  );
  const selectedBlendItem = useSelector(
    (state: RootState) => state.editBlendSheet.selectedBlendItem
  );

  const selectedBlendSheet = useSelector(
    (state: RootState) => state.editBlendSheet.selectedBlendSheet
  );

  const getBlendSheetDetailResponse = useSelector(
    (state: RootState) => state.editBlendSheet.getBlendSheetDetailResponse
  );

  const releaseBlendSheetResponse = useSelector(
    (state: RootState) => state.editBlendSheet.releaseBlendSheetResponse
  );

  const requestBlendSheetApprovalResponse = useSelector(
    (state: RootState) => state.editBlendSheet.requestBlendSheetApprovalResponse
  );

  const isRelease = useSelector(
    (state: RootState) => state.editBlendSheet.isRelease
  );

  const isView = useSelector((state: RootState) => state.editBlendSheet.isView);

  const initialBlendItems = useSelector(
    (state: RootState) => state.editBlendSheet.initialBlendItems
  );

  const itemMasterListResponse = useSelector(
    (state: RootState) => state.editBlendSheet.itemListResponse
  );
  const itemListPagination = useSelector(
    (state: RootState) => state.editBlendSheet.itemListRequest
  );

  const viewPresignedURL = useSelector(
    (state: RootState) => state.editBlendSheet.viewPreSignedURLResponse
  );

  const selectedBlendBalances = useSelector(
    (state: RootState) => state.editBlendSheet.selectedBlendBalances
  );

  // TODO: changed Structure
  const getBlendBalanceByBlendItemResponse = useSelector(
    (state: RootState) =>
      state.editBlendSheet.getBlendBalanceByBlendItemResponse
  );

  const getSelectableBlendSheets = useSelector(
    (state: RootState) => state.editBlendSheet.selectableBlendSheets
  );
  const masterTotalQuantity = useSelector(
    (state: RootState) => state.editBlendSheet.masterTotalQuantity
  );

  const printBlendData = useSelector(
    (state: RootState) => state.editBlendSheet.getPrintBlendSheetResponse.data
  );

  //other item redux variables
  const otherItemsMasterListPagination = useSelector(
    (state: RootState) => state.editBlendSheet.otherItemsMasterListRequest
  );
  const otherItemsMasterListResponse = useSelector(
    (state: RootState) => state.editBlendSheet.otherItemsMasterListResponse
  );
  const otherBOMItems = useSelector(
    (state: RootState) => state.editBlendSheet.OtherBOMItems
  );
  const selectedOtherItem = useSelector(
    (state: RootState) => state.editBlendSheet.selectedOtherItem
  );
  const initialOtherBlendItem = useSelector(
    (state: RootState) => state.editBlendSheet.initialOtherBlendItem
  );
  const otherItemsLotResponse = useSelector(
    (state: RootState) => state.editBlendSheet.otherItemsLotsListResponse
  ); // NEW API, called after selecting other items
  const otherBOMItemsState = useSelector(
    (state: RootState) => state.editBlendSheet.otherBOMItemsState
  );

  //sfg item redux variables
  const selectedSFGItems = useSelector(
    (state: RootState) => state.editBlendSheet.selectedSFGItems
  );
  const getSelectableSFGItems = useSelector(
    (state: RootState) => state.editBlendSheet.getSFGItemsResponse
  );

  const router = useRouter();

  useEffect(() => {
    dispatch(getItemMasterList());
    dispatch(getOtherItemMasterList());
    if (!selectedBlendItem) {
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
        approval: null,
      };
      dispatch(setSelectedBlendSheet(temp));

      if (screenMode === SCREEN_MODES.EDIT) {
        dispatch(setIsEdit(true));
        dispatch(setIsView(false));
      } else if (screenMode === SCREEN_MODES.RELEASE) {
        dispatch(setIsRelease(true));
        dispatch(setIsView(false));
      } else {
        dispatch(setIsView(true));
      }
    }

    return () => {
      dispatch(resetRequestBlendSheetResponse());
    };
  }, []);

  useEffect(() => {
    if (viewPresignedURL.data) {
      const newTab = window.open(viewPresignedURL.data.url, "_blank");

      if (newTab) {
        newTab.focus();
        dispatch(resetViewPresignedURL());
      }
    }
  }, [viewPresignedURL]);

  useEffect(() => {
    if (getBlendBalanceByBlendItemResponse.hasError) {
      setTimeout(() => {
        dispatch(resetGetBlendBalanceByItemResponse());
      }, 3000);
    }
  }, [getBlendBalanceByBlendItemResponse]);

  useEffect(() => {
    if (editBlendSheetResponse.isSuccess) {
      setOpenConfirmation(false);
    }
  }, [editBlendSheetResponse]);

  useEffect(() => {
    if (selectedBlendSheet !== null) {
      dispatch(getBlendSheetByDetail());
    }
  }, [selectedBlendSheet]);

  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    if (getBlendSheetDetailResponse.data?.attachments) {
      const attachments = getBlendSheetDetailResponse.data?.attachments?.map(
        (item) => {
          return {
            file: null,
            url: item.fileKey,
            fileKey: item.fileKey,
          };
        }
      );
      setFiles(attachments);
    }
    dispatch(
      setBlendSheetHeaderFormData({
        name: "orderDate",
        value: getBlendSheetDetailResponse.data?.orderDate.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "startDate",
        value: getBlendSheetDetailResponse.data?.startDate.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "dueDate",
        value: getBlendSheetDetailResponse.data?.dueDate.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "remarks",
        value: getBlendSheetDetailResponse.data?.remarks || "",
      })
    );
  }, [getBlendSheetDetailResponse]);

  useEffect(() => {
    if (releaseBlendSheetResponse.hasError) {
      setReleaseOpenConfirmation(false);
      setTimeout(() => {
        dispatch(resetReleaseResponse());
        dispatch(getBlendSheetByDetail());
      }, 5000);
    }
    if (releaseBlendSheetResponse.isSuccess) {
      setReleaseOpenConfirmation(false);
      dispatch(getBlendSheetByDetail());
      setTimeout(() => {
        dispatch(resetReleaseResponse());
      }, 3000);
    }
  }, [releaseBlendSheetResponse]);

  useEffect(() => {
    if (editBlendSheetResponse.hasError) {
      setRequestForApprovalConfirmation(false);
      setTimeout(() => {
        dispatch(resetEditResponse());
      }, 5000);
    }

    if (
      editBlendSheetResponse.isSuccess &&
      openRequestForApprovalConfirmation
    ) {
      // dispatch(resetRequestBlendSheetResponse())  //BugFix-694
      dispatch(createBlendSheetApprovalRequest());
      setRequestForApprovalConfirmation(false);
      dispatch(resetEditResponse()); //BugFix-694
    }
  }, [editBlendSheetResponse]);

  useEffect(() => {
    if (requestBlendSheetApprovalResponse.isSuccess) {
      setRequestForApprovalConfirmation(false);
      dispatch(getBlendSheetByDetail());
      dispatch(setIsEdit(false));
      dispatch(setIsView(true)); // BugFix-695
      setTimeout(() => {
        dispatch(resetRequestBlendSheetResponse());
      }, 5000);
    }
    if (requestBlendSheetApprovalResponse.hasError) {
      setRequestForApprovalConfirmation(false);
      //TODO: PERSIST GRN VALIDATION STATE
      dispatch(getBlendSheetByDetail());

      setTimeout(() => {
        dispatch(resetRequestBlendSheetResponse());
      }, 5000);
    }
  }, [requestBlendSheetApprovalResponse]);

  useEffect(() => {
    if (selectedSalesOrder !== null) {
      dispatch(
        setBlendSheetHeaderFormData({
          name: "salesOrderId",
          value: selectedSalesOrder?.salesOrderId?.toString() || "",
        })
      );
      dispatch(
        setBlendSheetHeaderFormData({
          name: "orderDate",
          value: selectedSalesOrder?.orderDate?.toString() || "",
        })
      );
      dispatch(
        setBlendSheetHeaderFormData({
          name: "startDate",
          value: selectedSalesOrder?.startDate?.toString() || "",
        })
      );
      dispatch(
        setBlendSheetHeaderFormData({
          name: "dueDate",
          value: selectedSalesOrder?.dueDate?.toString() || "",
        })
      );
      dispatch(
        setBlendSheetHeaderFormData({
          name: "customerCode",
          value: selectedSalesOrder?.customerCode || "",
        })
      );
    }
  }, [selectedSalesOrder !== null]);

  useEffect(() => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "productItemCode",
        value: selectedProduct?.productItemCode?.toString() || "",
      })
    );
  }, [selectedProduct]);

  useEffect(() => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "warehouse",
        value: selectedBlendItem?.warehouseCode?.toString() || "",
      })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "actualPlannedQuantity",
        value: selectedBlendItem?.plannedQuantity || 0,
      })
    );

    const blendBalanceSum =
      selectedBlendBalances && selectedBlendBalances?.length > 0
        ? selectedBlendBalances.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          )
        : 0;
    if (selectedBlendItem) {
      dispatch(getBlendBalanceByBlendItem());
      dispatch(
        setBlendSheetHeaderFormData({
          name: "plannedQuantity",
          value: selectedBlendItem?.plannedQuantity - blendBalanceSum || 0,
        })
      );
    }
  }, [selectedBlendItem]);

  useEffect(() => {
    if (BOMItems?.bomItems) {
      dispatch(
        getWarehousesByItemCodes(
          BOMItems?.bomItems
            ?.filter((f) => f.code !== "")
            ?.map((i) => i.code)
            ?.toString()
        )
      );
      dispatch(getToWarehousesList());
    }
  }, [BOMItems?.bomItems]);

  useEffect(() => {
    if (warehouseListResponse.data) {
      const updatedBOMItemsStock = selectedWarehouses?.map((item) => {
        const itemData = warehouseListResponse?.data?.find(
          (w) => w.itemCode === item.itemCode
        );
        const warehouses = itemData?.warehouses ?? [];
        const lotsLength =
          warehouses.find(
            (w1) => w1.warehouseCode === item.fromWarehouse?.warehouseCode
          )?.lots?.length || 0;
        return {
          ...item,
          fromWarehouse:
            (warehouses?.length <= 1
              ? warehouses[0]
              : warehouses.find(
                  (w1) => w1.warehouseCode === item.fromWarehouse?.warehouseCode
                )) ||
            item.fromWarehouse ||
            null,

          lotOptions:
            warehouses.length > 1
              ? lotsLength > 1
                ? warehouses.find(
                    (w1) =>
                      w1.warehouseCode === item.fromWarehouse?.warehouseCode
                  )?.lots
                : warehouses.find(
                    (w1) =>
                      w1.warehouseCode === item.fromWarehouse?.warehouseCode
                  )?.lots[0]
              : warehouses.find(
                  (w1) => w1.warehouseCode === warehouses[0].warehouseCode
                )?.lots || [],
        };
      });

      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  }, [warehouseListResponse.data]);

  const editBlendSheetPlan = () => {
    setOpenConfirmation(!openConfirmation);
  };
  const releaseBlendSheetPlan = () => {
    setReleaseOpenConfirmation(true);
  };

  const requestApproval = () => {
    setRequestForApprovalConfirmation(true);
  };

  const onPlannedQuantityChange = (value: number) => {
    dispatch(
      setBlendSheetHeaderFormData({ name: "plannedQuantity", value: value })
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "actualPlannedQuantity",
        value: value,
      })
    );
    if (value) {
      onPlannedQuantityChangeTotalCalculations(undefined, value);
    }
    // dispatch(setSelectedEditWarehouses([]));
    // if (BOMItems?.bomItems) {
    //   let t: SelectedWarehouseStock[] = [];
    //   BOMItems?.bomItems?.map((i, ind) => {
    //     const tempL: SelectedWarehouseStock = {
    //       index: 1,
    //       itemCode: i.code,
    //       fromWarehouse: null,
    //       isToWarehouseRequired: false,
    //       selectedLot: {
    //         batchId: "",
    //         quantity: 0,
    //         requiredQuantity: 0,
    //         price: null,
    //         weightPerBag: null,
    //       },
    //       lotOptions: [],
    //       plannedQuantity: parseFloat(
    //         (
    //           i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value
    //         )?.toFixed(3)
    //       ),
    //       remainingQuantity: parseFloat(
    //         (
    //           i.basedQuantity * blendSheetHeaderForm.plannedQuantity.value
    //         )?.toFixed(3)
    //       ),
    //       error: "Minimum is planned quantity",
    //       isCollapsed: false,
    //     };
    //     t = t.concat(tempL);
    //   });
    //   dispatch(setSelectedEditWarehouses(t));
    // }
  };
  const addLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses];

    const previousForm = selectedWarehouses.find(
      (item) => item.itemCode === itemCode && item.index === index
    );
    if (previousForm) {
      updatedBOMItemsStock.push({
        itemCode,
        index: index + 1,
        fromWarehouse: previousForm.fromWarehouse || null,
        selectedLot: null,
        isToWarehouseRequired: false,
        lotOptions:
          previousForm?.lotOptions?.filter(
            (batch) => batch.batchId !== previousForm?.selectedLot?.batchId
          ) || [],
        plannedQuantity: previousForm?.plannedQuantity,
        remainingQuantity:
          previousForm?.plannedQuantity -
          (previousForm?.selectedLot?.requiredQuantity || 0),
        error: "No Error", //TODO
        isCollapsed: true,
      });
      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  };

  const onDeleteLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedWarehouses];
    const indexToDelete = selectedWarehouses.findIndex(
      (item) => item.itemCode === itemCode && item.index === index
    );

    if (indexToDelete !== -1) {
      updatedBOMItemsStock.splice(indexToDelete, 1);
    }
    const updatedBOMItemsStock1 = updatedBOMItemsStock?.map((item) =>
      item.itemCode === itemCode && item.index !== index
        ? {
            ...item,
            error: "Minimum Planned Quantity",
          }
        : item
    );
    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock1));
  };

  const onWarehouseSelect = (
    itemCode: string,
    value: BlendWarehouse | null,
    index: number
  ) => {
    if (value) {
      const isMoreExisting = selectedWarehouses?.map(
        (item) => item.itemCode === itemCode
      ).length;
      if (isMoreExisting > 1) {
        const i = BOMItems?.bomItems?.find((item) => item.code === itemCode);
        const updatedBOMItemsStock = selectedWarehouses.filter(
          (item) => item.itemCode !== itemCode
        );
        updatedBOMItemsStock.push({
          index: 1,
          itemCode: itemCode,
          fromWarehouse: value,
          isToWarehouseRequired: false,
          selectedLot: null,
          lotOptions: value.lots,
          plannedQuantity: parseFloat(
            (
              (i?.basedQuantity || 0) *
              blendSheetHeaderForm.plannedQuantity.value
            )?.toFixed(3)
          ),
          remainingQuantity: parseFloat(
            (
              (i?.basedQuantity || 0) *
              blendSheetHeaderForm.plannedQuantity.value
            )?.toFixed(3)
          ),
          error: "Minimum is planned quantity",
          isCollapsed: false,
        });
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
      } else {
        const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
          item.itemCode === itemCode && item.index === index
            ? {
                ...item,
                fromWarehouse: value,
                selectedLot: null,
                lotOptions: value.lots,
              }
            : item
        );
        dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
      }
    }
  };

  const onToWarehouseSelect = (
    itemCode: string,
    value: BlendWarehouse | null,
    index: number
  ) => {
    // if (value) {
    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
            ...item,
            isToWarehouseRequired: value ? false : true,
          }
        : item
    );
    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));

    // }
  };

  const setOpen = (value: boolean, itemCode: string, index: number) => {
    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
            ...item,
            isCollapsed: !value,
          }
        : item
    );
    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
  };

  const onLotSelect = (
    itemCode: string,
    value: LotStock | null,
    warehouse: BlendWarehouse | null,
    index: number
  ) => {
    if (warehouse) {
      let val: LotStock | null = null;
      if (value) {
        val = {
          batchId: value?.batchId,
          quantity: value?.quantity,
          requiredQuantity: 0,
          boxNo: value?.boxNo,
          price: value?.price,
          weightPerBag: value?.weightPerBag,
        };
      }
      const totalQuantity = parseFloat(
        selectedWarehouses
          .filter((item) => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
          .reduce(
            (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
            0
          )
          ?.toFixed(3)
      );

      const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
        item.itemCode === itemCode && item.index === index
          ? {
              ...item,
              selectedLot: val,
              error: "Minimum is planned quantity",
            }
          : item
      );
      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  };

  const isError = (
    requiredQuantity: number,
    plannedQuantity: number,
    lotQuantity: number,
    totalQuantity: number
  ) => {
    let err = "No Error";

    if (blendSheetHeaderForm.plannedQuantity.value < 1) {
      if (requiredQuantity > lotQuantity) {
        err = "Exceeded";
      } else if (requiredQuantity === 0) {
        err = "Minimum is planned quantity";
      } else {
        err = "No Error";
      }
    } else {
      if (requiredQuantity > lotQuantity) {
        err = "Exceeded";
      } else if (requiredQuantity + totalQuantity < plannedQuantity) {
        err = "Minimum is planned quantity";
      } else {
        err = "No Error";
      }
    }

    return err;
  };

  const isOtherError = (
    plannedQuantity: number,
    totalQuantity: number,
    lotQuantity: number,
    requiredQuantity: number
  ) => {
    let err = "No Error";

    if (blendSheetHeaderForm.plannedQuantity.value < 1) {
      // console.log(
      //   "testing testing",
      //   requiredQuantity,
      //   lotQuantity,
      //   plannedQuantity,
      //   totalQuantity
      // );

      if (requiredQuantity > lotQuantity) {
        err = "Exceeded";
      } else if (requiredQuantity === 0) {
        err = "Minimum is planned quantity";
      } else {
        err = "No Error";
      }
    } else {
      if (plannedQuantity > totalQuantity) {
        err = "Minimum is planned quantity";
      } else {
        err = "No Error";
      }
    }

    return err;
  };

  const onEnterRequiredQuantity = (
    requiredQuantity: number,
    itemCode: string,
    warehouse: BlendWarehouse | null,
    lot: LotStock | null,
    index: number,
    plannedQuantity: number
  ) => {
    if (warehouse && lot) {
      const value: LotStock = {
        batchId: lot.batchId,
        quantity: lot.quantity,
        requiredQuantity: requiredQuantity,
        boxNo: lot.boxNo,
        price: lot.price,
        weightPerBag: lot.weightPerBag,
      };
      const totalQuantity = parseFloat(
        selectedWarehouses
          .filter((item) => item.itemCode === itemCode && item.index !== index) // Filter items by itemCode
          .reduce(
            (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
            0
          )
          ?.toFixed(3)
      );

      const lotQuantity = parseFloat(
        (
          (warehouseListResponse.data
            .find((o) => o.itemCode === itemCode)
            ?.warehouses?.find((w) => w.lots)
            ?.lots?.find((l) => l.batchId === lot.batchId)?.quantity || 0) +
          (BOMItems?.bomItems
            ?.find((e: { code: string }) => e.code === itemCode)
            ?.lots?.find((l) => l.batchId === lot?.batchId)?.quantity || 0)
        )?.toFixed(3)
      );

      const updatedBOMItemsStock = selectedWarehouses?.map(
        (item) =>
          item.itemCode === itemCode
            ? item.index === index
              ? {
                  ...item,
                  selectedLot: value,
                  remainingQuantity: item.plannedQuantity - requiredQuantity,
                  error: isError(
                    blendSheetHeaderForm.plannedQuantity.value < 1
                      ? item.selectedLot?.requiredQuantity !== undefined
                        ? item.selectedLot.requiredQuantity
                        : 0
                      : requiredQuantity || 0,
                    plannedQuantity,
                    lotQuantity,
                    totalQuantity
                  ),
                }
              : {
                  ...item,
                  error: isOtherError(
                    parseFloat(
                      blendSheetHeaderForm.plannedQuantity.value?.toFixed(3)
                    ),
                    totalQuantity + requiredQuantity,
                    lotQuantity,
                    requiredQuantity
                  ),
                }
            : item // question: used or unused?
      );

      dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    }
  };

  const cancelPlan = () => {
    dispatch(setSelectedBlendSheet(null));
    dispatch(setSelectedEditWarehouses([]));
    dispatch(setSelectedOtherItemsEdit([]));
    dispatch(resetEditResponse());
    dispatch(resetRequestBlendSheetResponse());
    router.back();
  };

  const onOrderDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "orderDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };

  const onStartDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "startDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };

  const onDueDateChange = (date: Dayjs | null) => {
    dispatch(
      setBlendSheetHeaderFormData({
        name: "dueDate",
        value: date?.format("YYYY-MM-DDTHH:mm:ss[Z]") || "",
      })
    );
  };

  const onRemarksChange = (remark: string) => {
    dispatch(setBlendSheetHeaderFormData({ name: "remarks", value: remark }));
  };

  const handleClose = () => {
    if (editBlendSheetResponse.isSuccess) {
      dispatch(setIsEdit(false));
      dispatch(setIsRelease(true));
      setOpenConfirmation(false);
      dispatch(resetEditResponse());
      setRequestForApprovalConfirmation(false);
    } else {
      // setRequestForApprovalConfirmatikon(false)
      dispatch(setIsRelease(false));
      dispatch(resetRequestBlendSheetResponse());
      router.back();
    }
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleUpdateConfirmation = () => {
    deletedAttachments?.map((item) => {
      dispatch(deleteAttachment(item.fileKey));
      dispatch(
        setDeletedFileKeys((prevFiles: { fileKey: string }[]) =>
          prevFiles.filter((i, index) => i.fileKey !== item.fileKey)
        )
      );
    });
    dispatch(editBlendSheet()); // edit blend first call
    dispatch(resetRequestBlendSheetResponse()); //BugFix-694
    setOpenConfirmation(false);
  };

  const handleCloseReleaseConfirmation = () => {
    setReleaseOpenConfirmation(false);
  };

  const handleUpdateReleaseConfirmation = () => {
    dispatch(releaseBlendSheet());
  };

  const handleCloseRequestApprovalConfirmation = () => {
    setRequestForApprovalConfirmation(false);
  };

  const handleUpdateRequestApprovalConfirmation = () => {
    handleUpdateConfirmation();
  };

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const printPlan = () => {
    setIsPrintClicked(true);
    dispatch(getPrintBlendSheet());
    setTimeout(() => {
      window.print();
      setIsPrintClicked(false);
    }, 3000);
  };
  const goToHistoryLogsPage = () => {
    dispatch(setSelectedBlendSheet(selectedBlendItem));
    router.push(
      `${params.view}/${ROUTES.CHANGE_LOG}?blend=${getBlendSheetDetailResponse.data?.blendSheetNo}`
    );
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);
  const handleClickDownloadMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDownloadMenu = () => {
    setAnchorEl(null);
  };

  const downloadXML = () => {
    try {
      // Format the data with properly formatted dates
      const formattedData = {
        ...getBlendSheetDetailResponse?.data,
        orderDate: getBlendSheetDetailResponse?.data?.orderDate
          ? new Date(
              getBlendSheetDetailResponse.data.orderDate
            ).toLocaleDateString()
          : "",
        startDate: getBlendSheetDetailResponse?.data?.startDate
          ? new Date(
              getBlendSheetDetailResponse.data.startDate
            ).toLocaleDateString()
          : "",
        dueDate: getBlendSheetDetailResponse?.data?.dueDate
          ? new Date(
              getBlendSheetDetailResponse.data.dueDate
            ).toLocaleDateString()
          : "",
        updatedAt: getBlendSheetDetailResponse?.data?.updatedAt
          ? new Date(
              getBlendSheetDetailResponse.data.updatedAt
            ).toLocaleString()
          : "",
        createdAt: getBlendSheetDetailResponse?.data?.createdAt
          ? new Date(
              getBlendSheetDetailResponse.data.createdAt
            ).toLocaleString()
          : "",
      };

      // Directly pass the JSON object instead of stringifying it
      const xmlData = json2xml(JSON.stringify({ BlendSheet: formattedData }), {
        compact: true,
        spaces: 2,
      });

      // Create a Blob
      const blob = new Blob([xmlData], { type: "application/xml" });

      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const timestamp = new Date()
        .toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        .replace(/[/,:\s]/g, "-")
        .replace(/--/g, "-");
      link.download = `${getBlendSheetDetailResponse?.data?.blendSheetNo}_${timestamp}.xml`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error generating XML:", error);
    }
  };

  const downloadCSV = () => {
    const jsonData = getBlendSheetDetailResponse?.data;
    // Store CSV rows
    const csvData: any[] = [];
    if (jsonData) {
      csvData.push([
        "Blend ID",
        "Blend Sheet",
        "Sales Contract No",
        "FG Product Code",
        "Order Date",
        "Start Date",
        "Due Date",
        "Customer",
        "Blend Item Product Code",
        "Blend Item Type",
        "Product Description",
        "SO Planned Quantity (Kgs)",
        "Warehouse",
        "Status",
        "Created By",
        "Created At",
        "Updated By",
        "Updated At",
        "Remarks",
      ]);

      csvData.push([
        jsonData.blendId,
        jsonData.blendSheetNo,
        jsonData.salesOrderId,
        jsonData.productItemCode,
        jsonData.orderDate
          ? new Date(jsonData.orderDate).toLocaleDateString()
          : "",
        jsonData.startDate
          ? new Date(jsonData.startDate).toLocaleDateString()
          : "",
        jsonData.dueDate ? new Date(jsonData.dueDate).toLocaleDateString() : "",
        jsonData.customerCode,
        jsonData.blendItemCode,
        jsonData.blendItemType,
        jsonData.blendItemDescription,
        jsonData.plannedQuantity,
        jsonData.warehouseCode,
        mapBlendStatusCode(jsonData.statusId),
        jsonData.createdBy,
        jsonData.createdAt ? new Date(jsonData.createdAt).toLocaleString() : "",
        jsonData.updatedBy,
        jsonData.updatedAt ? new Date(jsonData.updatedAt).toLocaleString() : "",
        jsonData.remarks,
      ]);

      // Attachments Section
      if (jsonData.attachments.length > 0) {
        csvData.push([]); // Empty row for separation
        csvData.push(["Attachments"]);
        csvData.push(["File Key"]);

        jsonData.attachments.forEach((attachment) => {
          csvData.push([attachment.fileKey]);
        });
      }

      // Blend Sheet Items Section
      if (jsonData.blendSheetItems.length > 0) {
        csvData.push([]); // Empty row for separation
        csvData.push(["Blend Sheet Items"]);
        csvData.push([
          "Blend Sheet Item ID",
          "Item Code",
          "Item Description",
          "Based Quantity",
          "From Warehouse",
        ]);

        jsonData.blendSheetItems.forEach((item) => {
          csvData.push([
            item.blendSheetItemId,
            item.code,
            item.description,
            item.basedQuantity,
            item?.lots[0]?.fromWarehouseCode,
          ]);

          // Lots Section for each Blend Sheet Item
          if (item.lots.length > 0) {
            csvData.push(["", "Lots"]);
            csvData.push([
              "",
              "Lot No",
              "Box No",
              "Stock Available",
              "Required Quantity",
              "To Warehouse",
            ]);

            item.lots.forEach((lot) => {
              csvData.push([
                "",
                lot.batchId,
                lot.boxNo,
                lot.quantity.toFixed(3),
                lot.quantity,
                jsonData.warehouseCode,
              ]);
            });
          }
          csvData.push([]);
        });
      }

      // Convert to CSV string
      const csvString = unparse(csvData, { quotes: true });

      // Create and download CSV file
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const timestamp = new Date()
        .toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        .replace(/[/,:\s]/g, "-")
        .replace(/--/g, "-");
      saveAs(blob, `${jsonData.blendSheetNo}_${timestamp}.csv`);
    }
  };
  const addNewItem = () => {
    //TODO
    if (itemMasterListResponse.data.data?.length > 0) {
      const existingItems = new Set(
        BOMItems?.bomItems?.map((item) => item.code)
      );
      const allItems = [...itemMasterListResponse.data.data];
      const filteredItems = allItems.filter(
        (item) => !existingItems.has(item.itemCode)
      );
      dispatch(setItemList(filteredItems));
    }

    const newItem: BOMItem = {
      // blendSheetItemId: (BOMItems?.bomItems?.length || 0) + 1,
      code: "",
      description: "",
      basedQuantity: 0,

      lots: [],
      isDeletable: true,
    };
    if (BOMItems?.bomItems && BOMItems?.bomItems?.length > 0) {
      const temp = [...BOMItems?.bomItems];
      const temp1 = temp.concat(newItem);
      dispatch(setBomItemDetails(temp1));
    } else {
      dispatch(setBomItemDetails([newItem]));
    }
  };

  const onItemSelect = (value: ItemDetail | null, index: number) => {
    const previousItemCode = BOMItems?.bomItems.find(
      (item) => item.blendSheetItemId === index + 1
    )?.code;
    const updatedBOMItem = BOMItems?.bomItems?.map((item) =>
      item.code === previousItemCode || item.code === ""
        ? {
            ...item,
            code: value ? value?.itemCode : "",
            description: value ? value?.itemName : "",
            item: value || null,
            basedQuantity: 0,
          }
        : item
    );

    dispatch(setBomItemDetails(updatedBOMItem));

    if (value) {
      const itemList = [...itemMasterListResponse.data.data];

      dispatch(
        setItemList(itemList.filter((item) => item.itemCode !== value.itemCode))
      );

      const tempW = [...selectedWarehouses];
      const stock: SelectedWarehouseStock = {
        index: 1,
        itemCode: value?.itemCode || "",
        isToWarehouseRequired: false,
        fromWarehouse: null,
        selectedLot: null,
        lotOptions: [],
        plannedQuantity: 0,
        remainingQuantity: 0,
        error: "Minimum is planned quantity",
        isCollapsed: false,
      };
      let tempw1 = tempW
        .concat(stock)
        .filter((item) => item.itemCode !== previousItemCode);

      dispatch(setSelectedEditWarehouses(tempw1));
    }
  };

  const onBasedQuantityChange = (itemCode: string, value: number) => {
    const updatedBOMItem = BOMItems?.bomItems?.map((item) =>
      item.code === itemCode
        ? {
            ...item,
            basedQuantity: value,
          }
        : item
    );
    dispatch(setBomItemDetails(updatedBOMItem));

    const updatedBOMItemsStock = selectedWarehouses?.map((item) =>
      item.itemCode === itemCode
        ? {
            ...item,
            plannedQuantity: parseFloat(
              (value * blendSheetHeaderForm.plannedQuantity.value)?.toFixed(3)
            ),
          }
        : item
    );
    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
  };
  const deleteBlendItem = (row: BOMItem) => {
    const updatedBOMItem = BOMItems?.bomItems.filter(
      (item) => item.code !== row.code
    );

    dispatch(setBomItemDetails(updatedBOMItem));
    dispatch(setInitialBlendItems(updatedBOMItem));
    const updatedBOMItemsStock = selectedWarehouses.filter(
      (item) => item.itemCode !== row.code
    );
    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
    const itemList = [...itemMasterListResponse.data.data];
    const item: ItemDetail = {
      itemCode: row.code,
      itemName: row.description,
    };
    dispatch(setItemList(itemList.concat(item)));
  };

  const onItemSearchOptions = (value: string) => {
    dispatch(setItemListSearchKey(value));
    if (
      itemListPagination?.page &&
      itemMasterListResponse?.data?.totalPages > itemListPagination?.page &&
      value !== ""
    ) {
      dispatch(setItemMasterListPage(1));
      dispatch(getItemMasterList());
    }
  };

  const onItemListFetchOptions = () => {
    if (
      itemListPagination?.page &&
      itemMasterListResponse.data.totalPages > itemListPagination?.page
    ) {
      dispatch(setItemMasterListPage(itemListPagination?.page + 1));
      dispatch(getItemMasterList());
    }
  };

  const viewFile = (fileKey: string) => {
    dispatch(getViewPresignedURL(fileKey));
  };
  const uploadPresignedURLResponse = useSelector(
    (state: RootState) => state.editBlendSheet.uplaodPresignedURL
  );
  const uploadFileKeys = useSelector(
    (state: RootState) => state.editBlendSheet.uploads
  );

  const deletedAttachments = useSelector(
    (state: RootState) => state.editBlendSheet.deletedAttachments
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (files.some((x) => x.file?.name === file.name)) {
        setAttachmentError("Cannot upload files with same name");
      } else {
        setAttachmentError("");
        const fileT = {
          file: file,
          url: URL.createObjectURL(file),
        };
        setFiles(files.concat(fileT));
        const attachment: UploadAttachment = {
          filename: file.name,
          filetype: file.type,
        };
        dispatch(getUploadPresignedURL(attachment));
      }
    }
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (files.some((x) => x.file?.name === file.name)) {
        setAttachmentError("Cannot upload files with same name");
      } else {
        setAttachmentError("");
        const fileT = {
          file: file,
          url: URL.createObjectURL(file),
        };
        setFiles(files.concat(fileT));
        const attachment: UploadAttachment = {
          filename: file.name,
          filetype: file.type,
        };
        dispatch(getUploadPresignedURL(attachment));
      }
    }
  };

  const uploadObjectToS3 = async (file: FileData) => {
    try {
      if (uploadPresignedURLResponse.data?.url && file.file) {
        await fetch(uploadPresignedURLResponse.data?.url, {
          method: "PUT",
          body: file?.file,
          headers: {
            "Content-Type": file?.file?.type,
          },
        });

        dispatch(
          setUploadFileKeys(
            uploadFileKeys.concat({
              fileKey: uploadPresignedURLResponse?.data?.fileKey,
            })
          )
        );
        dispatch(resetUploadPresignedUrl());
        console.log("success s3");
      }
    } catch (error) {
      /* empty */
      console.log("failed s3");
    }
  };
  useEffect(() => {
    if (uploadPresignedURLResponse.data) {
      uploadObjectToS3(files[files.length - 1]);
    }
  }, [uploadPresignedURLResponse.data]);

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    if (uploadFileKeys[indexToRemove]) {
      const deletedAttachment = uploadFileKeys[indexToRemove];
      dispatch(
        setDeletedFileKeys(deletedAttachments?.concat(deletedAttachment))
      );
      dispatch(
        setUploadFileKeys(
          uploadFileKeys.filter((_, index) => index !== indexToRemove)
        )
      );
    }
  };

  useEffect(() => {
    if (viewPresignedURL.hasError) {
      setTimeout(() => {
        dispatch(resetViewPresignedURL());
      }, 5000);
    }
  }, [viewPresignedURL.hasError]);

  useEffect(() => {
    if (uploadPresignedURLResponse.hasError) {
      setTimeout(() => {
        dispatch(resetUploadPresignedUrl());
      }, 5000);
    }
  }, [uploadPresignedURLResponse.hasError]);

  useEffect(() => {
    if (warehouseListResponse.hasError) {
      setTimeout(() => {
        dispatch(resetWarehouseListResponse());
      }, 5000);
    }
  }, [warehouseListResponse]);

  const breadcrumbs = [
    {
      id: 1,
      link: "Blending Sheets",
      route: "/blending-sheet",
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: isEdit
        ? "Edit Blending Sheet"
        : isRelease
        ? "Release Blending Sheet"
        : "View Blending Sheet",
      route: "",
    },
  ];
  type BlendSheetStatusKey = keyof typeof BLEND_SHEET_STATUS;

  const onPlannedQuantityChangeTotalCalculations = (
    blendBalancesParam?: BlendBalance[],
    blendQuantity?: number
  ) => {
    const blendBalance = blendBalancesParam || selectedBlendBalances;
    const actualBlendQuantity =
      blendQuantity || blendSheetHeaderForm.actualPlannedQuantity.value;

    const blendBalanceTotal =
      blendBalance?.reduce(
        (sum: number, item) => sum + (item.quantity || 0),
        0
      ) || 0;

    const otherBOMItems =
      selectedOtherItem?.reduce(
        (sum: number, item) => sum + (item.selectedLot?.requiredQuantity || 0),
        0
      ) || 0;

    const sfgItems =
      selectedSFGItems?.reduce(
        (sum: number, item) => sum + (item.quantity || 0),
        0
      ) || 0;

    const updatedPlanned =
      actualBlendQuantity - (blendBalanceTotal + otherBOMItems + sfgItems);
    dispatch(
      setBlendSheetHeaderFormData({
        name: "plannedQuantity",
        value: updatedPlanned,
      })
    );
    onResetBOMItemsLot(updatedPlanned);
  };

  const onResetBOMItemsLot = (updatedPlanned?: number) => {
    const getBasedQuantity = (itemCode: string) => {
      const master = BOMItems?.bomItems.find((b) => b.code === itemCode);
      return master ? master.basedQuantity || 0 : 0;
    };

    const updatedBOMItemsStock = selectedWarehouses?.map((item) => {
      if (!item.itemCode) return item;

      // All rows with the same itemCode
      const sameItems = selectedWarehouses.filter(
        (i) => i.itemCode === item.itemCode
      );

      // Total requiredQuantity across same items
      const totalQuantity = sameItems.reduce(
        (sum, i) => sum + (i.selectedLot?.requiredQuantity || 0),
        0
      );

      const baseQuantity = getBasedQuantity(item.itemCode) || 0;
      const planned =
        updatedPlanned || blendSheetHeaderForm.plannedQuantity.value;

      const plannedQuantity = baseQuantity * planned;

      const requiredQuantity = item.selectedLot?.requiredQuantity || 0;
      const lotQuantity = item.selectedLot?.quantity || 0;

      let error: "Exceeded" | "Minimum is planned quantity" | "No Error" =
        "No Error";

      if (plannedQuantity < 1) {
        //NEW CASE
        if (requiredQuantity > lotQuantity) {
          error = "Exceeded";
        } else if (requiredQuantity === 0) {
          error = "Minimum is planned quantity";
        }
      } else {
        if (requiredQuantity > lotQuantity) {
          error = "Exceeded"; // individual lot exceeds available
        } else if (totalQuantity < plannedQuantity) {
          error = "Minimum is planned quantity"; // total across all lots < planned
        }
      }

      return {
        ...item,
        selectedLot: { ...item.selectedLot },
        error,
      };
    });

    dispatch(setSelectedEditWarehouses(updatedBOMItemsStock));
  };

  // #region Blend Balance
  // const onSelectItemType = (value: number, rowId: number) => {
  //   //api response sheets having particular types
  //   const selectableBlendSheets = getBlendBalanceByBlendItemResponse.data
  //     .filter((item: BlendBalanceItem) => item.typeId === value)
  //     .map((item) => item.masterBlendSheetNo);

  //   const alreadySelectedBlendSheets = selectedBlendBalances
  //     ?.filter(
  //       (item, index, self) =>
  //         index ===
  //         self.findIndex(
  //           (obj) =>
  //             obj.blendSheetNo === item.blendSheetNo &&
  //             (!obj?.warehouseCode ||
  //               obj?.warehouseCode === item?.warehouseCode)
  //         )
  //     )
  //     .map((item) => item.blendSheetNo);

  //   const unusedBlendBal = selectableBlendSheets?.filter(
  //     (blendNo) => !alreadySelectedBlendSheets?.includes(blendNo)
  //   );

  //   const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
  //     if (idx === rowId) {
  //       return {
  //         warehouseCode: "",
  //         blendSheetNo: "",
  //         batchId: "",
  //         quantity: 0,
  //         price: 0,
  //         typeId: value,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });

  //   dispatch(setSelectedBlendBalances(updatedBlendBalance));
  //   dispatch(setSelectableBlendSheets(unusedBlendBal));
  // };

  // new edit onSelectItemType function
  const onSelectItemType = (value: number, rowId: number) => {
  // Get all blend sheets for the selected type
    const selectableBlendSheets = getBlendBalanceByBlendItemResponse.data
      .filter((item: BlendBalanceItem) => item.typeId === value)
      .map((item) => item.masterBlendSheetNo);

    // Get already selected blend sheets (excluding the current row being edited)
    // BUT only exclude blend sheets that are selected in the SAME TYPE in other rows
    const alreadySelectedBlendSheets = selectedBlendBalances
      ?.filter((item, index) => index !== rowId && item.typeId === value) // Exclude current row AND only same type
      ?.filter(
        (item, index, self) =>
            index ===
            self.findIndex(
            (obj) =>
                obj.blendSheetNo === item.blendSheetNo &&
                (!obj?.warehouseCode || obj?.warehouseCode === item?.warehouseCode)
            )
      )
      .map((item) => item.blendSheetNo)
      .filter(sheetNo => sheetNo !== "" && sheetNo !== null);

    const unusedBlendBal = selectableBlendSheets?.filter(
      (blendNo) => !alreadySelectedBlendSheets?.includes(blendNo)
    );

    const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
      if (idx === rowId) {
        return {
          warehouseCode: "",
          blendSheetNo: "",
          batchId: "",
          quantity: 0,
          price: 0,
          typeId: value,
          averageWeight: 0,
          isNew: item.isNew,
          isError: 'Please Enter Required Quantity'
        };
      } else {
        return item;
      }
    });

    dispatch(setSelectedBlendBalances(updatedBlendBalance));
    dispatch(setSelectableBlendSheets(unusedBlendBal));
  };

  // const onBlendBalanceQuantityChange = (
  //   value: BlendBalance,
  //   quantity: number,
  //   updatedFullQty?: number
  // ) => {
  //   const isErrorValu = isBlendBalanceError(
  //     quantity,
  //     getBlendBalanceByBlendItemResponse?.data?.find(
  //       (m) => m?.masterBlendSheetNo == value?.blendSheetNo
  //     )?.quantity || 0,
  //     updatedFullQty || 0
  //   );
  //   const updatedBlendBalance = selectedBlendBalances?.map((item) =>
  //     item.blendSheetNo === value.blendSheetNo
  //       ? {
  //           ...item,
  //           quantity: quantity,
  //           isError: isErrorValu,
  //         }
  //       : item
  //   );

  //   dispatch(setSelectedBlendBalances(updatedBlendBalance));
  //   if (isErrorValu === "No Error" && !isNaN(quantity)) {
  //     const blendBalance = updatedBlendBalance?.map(
  //       ({ isError, ...rest }) => rest
  //     );
  //     onPlannedQuantityChangeTotalCalculations(blendBalance);
  //   }
  // };

  // new edit onBlendBalanceQuantityChange function
  const onBlendBalanceQuantityChange = (
  value: BlendBalance,
  quantity: number,
  updatedFullQty?: number
  ) => {
    // Find the blend sheet data that matches BOTH masterBlendSheetNo AND typeId
    const blendSheetData = getBlendBalanceByBlendItemResponse?.data?.find(
      m => m.masterBlendSheetNo === value.blendSheetNo && m.typeId === value.typeId
    );

    const availableQuantity = blendSheetData?.quantity || 0;
    const isErrorValue = isBlendBalanceError(
      quantity,
      availableQuantity,
      updatedFullQty || 0
    );

    const updatedBlendBalance = selectedBlendBalances?.map((item) =>
      item.blendSheetNo === value.blendSheetNo && item.typeId === value.typeId
        ? {
            ...item,
            quantity: quantity,
            isError: isErrorValue,
          }
        : item
    );

    dispatch(setSelectedBlendBalances(updatedBlendBalance));

    if (isErrorValue === "No Error" && !isNaN(quantity)) {
      const blendBalance = updatedBlendBalance?.map(
        ({ isError, ...rest }) => rest
      );
      onPlannedQuantityChangeTotalCalculations(blendBalance);
    }
  };

  // const onBlendSheetBalanceSelect = (blendSheetNo: string, rowId: number) => {
  //   const blendSheet = getBlendBalanceByBlendItemResponse.data.find(
  //     (item) => item.masterBlendSheetNo === blendSheetNo
  //   );
  //   const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
  //     if (idx !== rowId) return item;
  //     if (!blendSheet) return item;
  //     return {
  //       ...item,
  //       blendSheetNo: blendSheet?.masterBlendSheetNo,
  //       batchId: blendSheet?.batchId,
  //       // quantity: blendSheet?.quantity,
  //       initialQuantity: blendSheet?.quantity,
  //       price: blendSheet?.price,
  //       typeId: blendSheet?.typeId,
  //       warehouseCode: blendSheet?.warehouseCode,
  //       averageWeight: blendSheet?.averageWeight,
  //     };
  //   });
  //   dispatch(setSelectedBlendBalances(updatedBlendBalance));
  // };

  // new edit onBlendSheetBalanceSelect function
  const onBlendSheetBalanceSelect = (blendSheetNo: string, rowId: number) => {
    const currentRowType = selectedBlendBalances?.[rowId]?.typeId;

    const blendSheet = getBlendBalanceByBlendItemResponse.data.find(
      (item) => item.masterBlendSheetNo === blendSheetNo &&
      item.typeId === currentRowType
    );

    const updatedBlendBalance = selectedBlendBalances?.map((item, idx) => {
      if (idx !== rowId) return item;
      if (!blendSheet) return item;
      return {
        ...item,
        blendSheetNo: blendSheet?.masterBlendSheetNo,
        batchId: blendSheet?.batchId,
        initialQuantity: blendSheet?.quantity,
        price: blendSheet?.price,
        typeId: blendSheet?.typeId,
        warehouseCode: blendSheet?.warehouseCode,
        averageWeight: blendSheet?.averageWeight,
      };
    });
    dispatch(setSelectedBlendBalances(updatedBlendBalance));
  };

  const isBlendBalanceError = (quantity: number, stock: number, updatedFullQty: number) => {
    // console.log(quantity, stock,'error check')
    let errorValue = "No Error";

    if (selectedBlendBalances) {
      if (quantity > updatedFullQty) {
        errorValue = "Exceeded Stock";
      } else if (isNaN(quantity) || quantity === 0) {
        errorValue = "Please Enter Required Quantity";
      } else {
      }
    }
    return errorValue;
  };

  //TODO: Check
  // const onDeleteBlendBalace = (value: BlendBalance, rowId: number) => {
  //   const updatedBlendBalance = selectedBlendBalances?.filter(
  //     (item, index) => index !== rowId
  //   );
  //   const deletedBlendBalance = selectedBlendBalances
  //     ?.filter(
  //       (f) =>
  //         f.blendSheetNo === value.blendSheetNo &&
  //         f.typeId === value.typeId &&
  //         f.warehouseCode === value.warehouseCode
  //     )
  //     .reduce(
  //       (accumulator, currentVal) =>
  //         accumulator + (!isNaN(currentVal.quantity) ? currentVal.quantity : 0),
  //       0
  //     );

  //   const updatedPlannedQuantity =
  //     blendSheetHeaderForm.plannedQuantity.value + (deletedBlendBalance || 0);
  //   if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
  //     dispatch(
  //       setBlendSheetHeaderFormData({
  //         name: "plannedQuantity",
  //         value: updatedPlannedQuantity,
  //       })
  //     );
  //   }
  //   if (updatedBlendBalance && updatedBlendBalance?.length <= 0) {
  //     dispatch(setSelectedBlendBalances(null));
  //   } else {
  //     dispatch(setSelectedBlendBalances(updatedBlendBalance));
  //   }
  //   onResetBOMItemsLot(updatedPlannedQuantity);
  // };

  // new edit onDeleteBlendBalace function
  const onDeleteBlendBalace = (value: BlendBalance, rowId: number) => {
    const updatedBlendBalance = selectedBlendBalances?.filter(
      (item, index) => index !== rowId
    );

    const deletedBlendBalance = selectedBlendBalances
      ?.filter(
        (f) =>
          f.blendSheetNo === value.blendSheetNo &&
          f.typeId === value.typeId &&
          f.warehouseCode === value.warehouseCode
      )
      .reduce(
        (accumulator, currentVal) =>
          accumulator + (!isNaN(currentVal.quantity) ? currentVal.quantity : 0),
        0
      );

    const updatedPlannedQuantity =
      blendSheetHeaderForm.plannedQuantity.value + (deletedBlendBalance || 0);

    if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
      dispatch(
        setBlendSheetHeaderFormData({
          name: "plannedQuantity",
          value: updatedPlannedQuantity,
        })
      );
    }

    if (updatedBlendBalance && updatedBlendBalance?.length <= 0) {
      dispatch(setSelectedBlendBalances(null));
    } else {
      dispatch(setSelectedBlendBalances(updatedBlendBalance));
    }

    onResetBOMItemsLot(updatedPlannedQuantity);
  };


  const addNewBlendBalance = () => {
    const intialBlendBalance: BlendBalance[] = [
      {
        warehouseCode: "",
        blendSheetNo: "",
        batchId: "",
        quantity: 0,
        price: 0,
        typeId: 0,
        averageWeight: 0,
        isNew: true
      },
    ];
    if (selectedBlendBalances && selectedBlendBalances?.length > 0) {
      dispatch(
        setSelectedBlendBalances(
          selectedBlendBalances?.concat(intialBlendBalance)
        )
      );
    } else {
      dispatch(setSelectedBlendBalances(intialBlendBalance));
    }
  };

  const clearApprovalResponse = () => {
    dispatch(resetRequestBlendSheetResponse());
    dispatch(resetEditResponse());
  };

  // #region other items
  const selectedOtherItemTotal = useMemo(() => {
    return selectedOtherItem.reduce(
      (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
      0
    );
  }, [selectedOtherItem]);

  useEffect(() => {
    if (selectedOtherItemTotal > 0) {
      onPlannedQuantityChangeTotalCalculations();
    }
  }, [selectedOtherItemTotal, selectedOtherItem]);

  useEffect(() => {
    if (otherItemsLotResponse.data) {
      const updatedBOMItemsStock = selectedOtherItem?.map((item) => {
        const itemData = otherItemsLotResponse?.data?.find(
          (w) => w.itemCode === item.itemCode
        );
        const lotOptions = itemData?.lots;

        return {
          ...item,
          lotOptions: lotOptions || [],
        };
      });

      dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    }
  }, [otherItemsLotResponse.data]);

  //Check 3, when item gets selected this get's triggered it in view, initial setup
  useEffect(() => {
    if (otherBOMItems?.bomItems) {
      dispatch(
        getOtherItemLotsByItemCodes(
          otherBOMItems?.bomItems
            ?.filter((f) => f.code !== "")
            ?.map((i) => i.code)
            ?.toString()
        )
      );
    }
  }, [otherBOMItems?.bomItems]);

  useEffect(() => {
    if (otherItemsLotResponse.hasError) {
      setTimeout(() => {
        dispatch(resetOtherItemsLotResponse());
      }, 5000);
    }
  }, [otherItemsLotResponse]);

  const addNewOtherItem = () => {
    dispatch(setOtherBOMItemsState(true));
    if (otherItemsMasterListResponse.data.data?.length > 0) {
      const existingItems = new Set(
        otherBOMItems?.bomItems?.map((item) => item.code)
      );
      const allItems = [...otherItemsMasterListResponse.data.data];
      const filteredItems = allItems.filter(
        (item) => !existingItems.has(item.itemCode)
      );
      dispatch(setOtherItemList(filteredItems));
    }

    const newItem: OtherBOMItem = {
      // blendSheetItemId: (BOMItems?.bomItems?.length || 0) + 1,
      code: "",
      description: "",
      lots: [],
    };
    if (otherBOMItems?.bomItems && otherBOMItems?.bomItems?.length > 0) {
      const temp = [...otherBOMItems?.bomItems];
      const temp1 = temp.concat(newItem);
      dispatch(setOtherBomItemDetails(temp1));
    } else {
      dispatch(setOtherBomItemDetails([newItem]));
    }
  };

  const onOtherItemsOpen = (
    value: boolean,
    itemCode: string,
    index: number
  ) => {
    const updatedBOMItemsStock = selectedOtherItem?.map((item) =>
      item.itemCode === itemCode
        ? {
            ...item,
            isCollapsed: !value,
          }
        : item
    );
    dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
  };

  const addOtherItemLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedOtherItem];

    const previousForm = selectedOtherItem.find(
      (item) => item.itemCode === itemCode && item.index === index
    );
    if (previousForm) {
      updatedBOMItemsStock.push({
        itemCode,
        index: index + 1,
        selectedLot: null,
        isToWarehouseRequired: false,
        lotOptions:
          previousForm?.lotOptions?.filter(
            (batch) => batch.batchId !== previousForm?.selectedLot?.batchId
          ) || [],
        plannedQuantity: previousForm?.plannedQuantity,
        remainingQuantity: 0,
        error: "No Error", //TODO
        isCollapsed: true,
      });
      dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    }
  };

  const onDeleteOtherItemLot = (itemCode: string, index: number) => {
    const updatedBOMItemsStock = [...selectedOtherItem];
    const indexToDelete = selectedOtherItem.findIndex(
      (item) => item.itemCode === itemCode && item.index === index
    );

    if (indexToDelete !== -1) {
      updatedBOMItemsStock.splice(indexToDelete, 1);
    }
    const updatedBOMItemsStock1 = updatedBOMItemsStock?.map((item) =>
      item.itemCode === itemCode && item.index !== index
        ? {
            ...item,
            error: "Minimum Planned Quantity",
          }
        : item
    );
    dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock1));
  };

  const onOtherItemLotSelect = (
    itemCode: string,
    value: OtherBlendLotStock | null,
    index: number
  ) => {
    let val: OtherBlendLotStock | null = null;
    if (value) {
      val = {
        batchId: value?.batchId,
        quantity: value?.quantity,
        requiredQuantity: 0,
        boxNo: value?.boxNo,
        price: value?.price,
        weightPerBag: value?.weightPerBag,
        warehouseCode: value?.warehouseCode,
      };
    }

    const updatedBOMItemsStock = selectedOtherItem?.map((item) =>
      item.itemCode === itemCode && item.index === index
        ? {
            ...item,
            selectedLot: val,
            error: "Should be greater than 0",
          }
        : item
    );
    dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
  };

  const otherItemQuantityError = (
    requiredQuantity: number,
    lot: OtherBlendLotStock | undefined
  ): string => {
    let err = "No Error";
    if (lot) {
      if (requiredQuantity > lot?.quantity) {
        err = "Exceeded";
      }
      if (requiredQuantity === 0) {
        err = "Should be greater than 0";
      }
    }
    return err;
  };

  const onEnterOtherItemRequiredQuantity = (
    requiredQuantity: number,
    itemCode: string,
    lot: OtherBlendLotStock | null,
    index: number
  ) => {
    if (lot) {
      const value: OtherBlendLotStock = {
        batchId: lot.batchId,
        quantity: lot.quantity,
        requiredQuantity: requiredQuantity,
        boxNo: lot.boxNo,
        price: lot.price,
        weightPerBag: lot.weightPerBag,
        warehouseCode: lot.warehouseCode,
      };

      const updatedBOMItemsStock = selectedOtherItem?.map((item) =>
        item.itemCode === itemCode
          ? item.index === index
            ? {
                ...item,
                selectedLot: value,
                remainingQuantity: item.plannedQuantity - requiredQuantity,
                error: otherItemQuantityError(requiredQuantity, lot),
              }
            : {
                ...item,
              }
          : item
      );
      dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    }
  };

  const deleteOtherBlendItem = (row: OtherBOMItem, index: number) => {
    const updatedBOMItem = otherBOMItems?.bomItems.filter(
      (item) => item.code !== row.code
    );

    dispatch(setOtherBomItemDetails(updatedBOMItem));
    dispatch(setInitialOtherBlendItems(updatedBOMItem));
    const updatedBOMItemsStock = selectedOtherItem.filter(
      (item) => item.itemCode !== row.code
    );
    dispatch(setSelectedOtherItemsEdit(updatedBOMItemsStock));
    const itemList = [...otherItemsMasterListResponse.data.data];
    const item: ItemDetail = {
      itemCode: row.code,
      itemName: row.description,
    };
    dispatch(setOtherItemList(itemList.concat(item)));
    if (updatedBOMItem) {
      if (otherBOMItems?.bomItems.length === 1) {
        dispatch(setOtherBOMItemsState(false));
      }
    }

    const deletedQuantity = selectedOtherItem
      .filter((item) => item.itemCode === row.code)
      .reduce(
        (sum, item) => sum + (item.selectedLot?.requiredQuantity || 0),
        0
      );

    if (deletedQuantity > 0) {
      dispatch(
        setBlendSheetHeaderFormData({
          name: "plannedQuantity",
          value: blendSheetHeaderForm.plannedQuantity.value + deletedQuantity,
        })
      );
      onResetBOMItemsLot();
    }
  };

  const onOtherItemSelect = (value: ItemDetail | null, index: number) => {
    const previousItemCode = otherBOMItems?.bomItems.find(
      (item) => item.code === value?.itemCode
    );

    const updatedBOMItem = otherBOMItems?.bomItems?.map((item) =>
      item.code === previousItemCode?.code || item.code === ""
        ? {
            ...item,
            code: value ? value?.itemCode : "",
            description: value ? value?.itemName : "",
            item: value || null,
          }
        : item
    );

    dispatch(setOtherBomItemDetails(updatedBOMItem));

    if (value) {
      const itemList = [...otherItemsMasterListResponse.data.data];

      dispatch(
        setOtherItemList(
          itemList.filter((item) => item.itemCode !== value.itemCode)
        )
      );

      const tempW = [...selectedOtherItem];
      const stock: SelectedOtherItemLotStock = {
        index: 1,
        itemCode: value?.itemCode || "",
        isToWarehouseRequired: false,
        // fromWarehouse: null,
        selectedLot: null,
        lotOptions: [],
        plannedQuantity: 0,
        remainingQuantity: 0,
        error: "Should be greater than 0",
        isCollapsed: false,
      };
      let tempw1 = tempW
        .concat(stock)
        .filter((item) => item.itemCode !== previousItemCode?.code);

      dispatch(setSelectedOtherItemsEdit(tempw1));
    }
  };

  const onOtherItemSearchOptions = (value: string) => {
    dispatch(setItemListSearchKey(value));
    if (
      otherItemsMasterListPagination?.page &&
      otherItemsMasterListResponse?.data?.totalPages >
        otherItemsMasterListPagination?.page &&
      value !== ""
    ) {
      dispatch(setOtherItemMasterListPage(1));
      dispatch(getOtherItemMasterList());
    }
  };

  const onOtherItemListFetchOptions = () => {
    if (
      otherItemsMasterListPagination?.page &&
      otherItemsMasterListResponse.data.totalPages >
        otherItemsMasterListPagination?.page
    ) {
      dispatch(
        setOtherItemMasterListPage(otherItemsMasterListPagination?.page + 1)
      );
      dispatch(getOtherItemMasterList());
    }
  };

  // #region SFG Items
  const selectedSFGTotal: number = useMemo(() => {
    return selectedSFGItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [selectedSFGItems]);

  useEffect(() => {
    if (selectedSFGTotal > 0) {
      onPlannedQuantityChangeTotalCalculations();
    }
  }, [selectedSFGTotal, selectedSFGItems]);

  const onBlendSheetNoSelect = (blendSheetNo: string) => {
    const SFGBlend = getSelectableSFGItems.data.find(
      (item) => item.blendSheetNo === blendSheetNo
    );
    if (!SFGBlend) return;

    const sfgItem = {
      batchId: SFGBlend.batchId,
      blendSheetNo: SFGBlend.blendSheetNo,
      price: SFGBlend.price,
      quantity: SFGBlend.quantity,
      warehouseCode: SFGBlend.warehouseCode,
      averageWeight: SFGBlend.averageWeight,
    };

    dispatch(
      setSelectedSFGItems([
        ...selectedSFGItems.filter((item) => item.blendSheetNo),
        sfgItem,
      ])
    );
  };

  const onDeleteSfgItem = (blendSheetNo: string) => {
    const updatedItems = selectedSFGItems.filter(
      (item) => item.blendSheetNo !== blendSheetNo
    );
    const deletedItem = selectedSFGItems.find(
      (item) => item.blendSheetNo === blendSheetNo
    );
    dispatch(
      setBlendSheetHeaderFormData({
        name: "plannedQuantity",
        value:
          blendSheetHeaderForm.plannedQuantity.value +
          (deletedItem?.quantity || 0),
      })
    );
    onResetBOMItemsLot();
    dispatch(setSelectedSFGItems(updatedItems));
  };

  const addNewSfgItem = () => {
    const newSfgItem: BlendSFGItem = {
      batchId: "",
      blendSheetNo: "",
      price: 0,
      quantity: 0,
      warehouseCode: "",
      averageWeight: 0,
    };
    if (selectedSFGItems && selectedSFGItems.length > 0) {
      dispatch(setSelectedSFGItems([...selectedSFGItems, newSfgItem]));
    } else {
      dispatch(setSelectedSFGItems([newSfgItem]));
    }
  };

  useEffect(() => {
    if (blendDetail !== null) {
      dispatch(getAllSFGItemsByMasterBlendNo(blendDetail.masterBlendSheetNo));
    }
  }, [blendDetail]);

  // mount on effect function to show or hide initial SFG
  useEffect(() => {
    const isInitialParam = (searchParams as any)?.isInitial ?? null;
    const shouldShowSFG = isInitialParam === "false";
    setShowSFG(shouldShowSFG);
  }, [searchParams]);

  return (
    <Grid>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .no-print {
            visibility: hidden !important;
            display: none !important;
          }

          .print-only {
            visibility: visible !important;
            display: block !important;
            font-size: 12px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin-top: 0 !important;
          }

          .print-only * {
            visibility: visible !important;
          }

          .signature-content {
            break-inside: avoid !important;
          }

          // ABOVE FIXED
          @page {
            size: A4 landscape;
          }

          html,
          body {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
      {/* {!isPrintClicked ?  : <Box sx={{ mb: 5 }}></Box>} */}

      <CatalogueManagementHeader
        title={`Blending Sheet - ${
          getBlendSheetDetailResponse.data?.blendSheetNo || ""
        }`}
        breadcrumbs={breadcrumbs}
        showBorder={false}
        component={
          isView && (
            <Button
              size="large"
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
              onClick={goToHistoryLogsPage}
            >
              CHANGE LOGS
            </Button>
          )
        }
      />
      {selectedSalesOrder && (
        <BlendingSheetHeaderBar
          averageWeight={calculateAverageWeight(
            selectedWarehouses,
            selectedBlendBalances || [],
            selectedSFGItems || [],
            selectedOtherItem || []
          )}
          averagePrice={calculateAveragePricePerUnit(
            selectedWarehouses,
            selectedBlendBalances || [],
            selectedSFGItems || [],
            selectedOtherItem || []
          )}
          totalQuantity={calculateTotalAllocatedQuantity(
            selectedWarehouses,
            BOMItems,
            selectedBlendBalances || [],
            selectedSFGItems || [],
            selectedOtherItem || []
          )}
          salesOrderList={[]}
          attachmentError={attachmentError}
          salesOrderListIsLoading={false}
          selectedSalesOrder={selectedSalesOrder}
          isView={isView || isRelease}
          isEdit={isEdit}
          selectedProduct={selectedProduct}
          productListIsLoading={false}
          selectedBlendItem={selectedBlendItem}
          blendDetail={blendDetail}
          blendHeaderForm={blendSheetHeaderForm}
          username={getBlendSheetDetailResponse.data?.createdBy || ""}
          initialPlannedQuantity={
            getBlendSheetDetailResponse.data?.plannedQuantity || 0
          }
          onPlannedQuantityChange={onPlannedQuantityChange}
          onOrderDateChange={onOrderDateChange}
          onStartDateChange={onStartDateChange}
          onDueDateChange={onDueDateChange}
          onRemarksChange={onRemarksChange}
          handleRemoveFile={handleRemoveFile}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          files={files}
          viewFile={viewFile}
          blendStatus={
            (Object.keys(BLEND_SHEET_STATUS) as BlendSheetStatusKey[]).find(
              (key) =>
                BLEND_SHEET_STATUS[key] ===
                getBlendSheetDetailResponse?.data?.statusId
            ) || "Planned"
          }
          masterTotalQuantity={masterTotalQuantity}
        />
      )}
      {calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [], selectedSFGItems || [], selectedOtherItem || []) > blendSheetHeaderForm?.actualPlannedQuantity?.value ? (
        <Grid justifyContent={"center"} alignContent={"center"} p={1}>
          <Typography variant="body1" sx={{ display: "flex" }}>
            <InfoIcon color="primary" />
            {`The quantity you can plan for this blend sheet is 0.000`}
          </Typography>
        </Grid>
      ) : (
        <Grid
          display={"flex"}
          justifyContent={"start"}
          alignContent={"center"}
          p={1}
        >
          <Typography variant="body1" sx={{ display: "flex" }}>
            <InfoIcon color="primary" />
            {`The quantity you can plan for this blend sheet is ${(
              blendSheetHeaderForm?.actualPlannedQuantity?.value -
              calculateTotalAllocatedQuantity(selectedWarehouses, BOMItems, selectedBlendBalances || [], selectedSFGItems || [], selectedOtherItem || [])
            ).toFixed(3)
              }`}
          </Typography>
        </Grid>
      )}
      <Paper
        variant="outlined"
        sx={{
          borderWidth: 1.75,
          p: 2,
          borderColor: "#99a5adff",
          mt: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Blend Balance, Theoretical Blend Balance, Blend Gain
        </Typography>
        {selectedBlendBalances && (
          <BlendBalanceTable
            blendBalanceDetails={getBlendBalanceByBlendItemResponse.data}
            initialBlendItems={[]}
            isView={!isEdit || isRelease}
            selectedBlendBalances={selectedBlendBalances} //Parent
            onBlendBalanceQuantityChange={onBlendBalanceQuantityChange}
            onBlendSheetSelect={onBlendSheetBalanceSelect}
            onDeleteBlendBalace={onDeleteBlendBalace}
            onSelectItemType={onSelectItemType}
            selectableBlendSheets={getSelectableBlendSheets}
            blendBalanceErrors={requestBlendSheetApprovalResponse.blendInfo}
            isFrom='editViewBlendSheet'
          />
        )}

        {!isRelease &&
          !isView &&
          selectedBlendItem &&
          BOMItems?.bomItems &&
          selectedBlendItem?.plannedQuantity !== 0 && (
            <Grid container textAlign={"right"} p={2}>
              <Grid
                item
                xs={12}
                lg={12}
                p={2}
                justifyContent={"start"}
                display="flex"
              >
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={addNewBlendBalance}
                  disabled={isView} //TODO
                >
                  Add Blend Balance <AddIcon fontSize={"inherit"} />
                </Button>
              </Grid>
            </Grid>
          )}
      </Paper>

      {showSFG && (
        <Paper
          variant="outlined"
          sx={{
            borderWidth: 1.75,
            p: 2,
            borderColor: "#99a5adff",
            mt: 3,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Semi Finished Goods (SFG)
          </Typography>

          <BlendSFGTable
            onBlendSheetNoSelect={onBlendSheetNoSelect}
            selectedSfgItems={selectedSFGItems}
            isView={isView}
            onDeleteSfgItem={onDeleteSfgItem}
            selectableSFGItems={getSelectableSFGItems.data}
          />

          {!isRelease && !isView && (
            <Grid container textAlign={"right"} p={2}>
              <Grid
                item
                xs={12}
                lg={12}
                p={2}
                justifyContent={"start"}
                display="flex"
              >
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={addNewSfgItem}
                  disabled={isView}
                >
                  Add SFG
                  <AddIcon fontSize={"inherit"} />
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderWidth: 1.75,
          p: 2,
          borderColor: "#99a5adff",
          mt: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Other Items
        </Typography>

        {otherBOMItems?.bomItems && otherBOMItemsState && (
          <BlendOtherItemTable
            otherBOMDetails={otherBOMItems}
            selectedWarehouses={selectedOtherItem}
            setOpen={onOtherItemsOpen}
            // onWarehouseSelect={onOtherItemsWarehouseSelect}
            // warehouseList={otherItemsWarehouseResponse.data}
            isView={isView || isRelease}
            toWarehouse={blendSheetHeaderForm.warehouse.value}
            addLot={addOtherItemLot}
            onDeleteLot={onDeleteOtherItemLot}
            onLotSelect={onOtherItemLotSelect}
            onEnterRequiredQuantity={onEnterOtherItemRequiredQuantity}
            deleteBlendItem={deleteOtherBlendItem}
            initialBlendItems={initialOtherBlendItem}
            onItemSelect={onOtherItemSelect}
            onSearchOptions={onOtherItemSearchOptions}
            onFetchOptions={onOtherItemListFetchOptions}
            itemList={otherItemsMasterListResponse.data.data}
            // onBasedQuantityChange={onBasedQuantityChange}
          />
        )}

        {!isRelease && !isView && otherBOMItems?.bomItems && (
          <Grid container textAlign={"right"} p={2}>
            <Grid
              item
              xs={12}
              lg={12}
              p={2}
              justifyContent={"start"}
              display="flex"
            >
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={addNewOtherItem}
                // disabled={isView || otherItemsMasterListResponse.data.data.every(item => selectedOtherItem.map((item) => item.itemCode).includes(item.itemCode))}
                disabled={
                  isView ||
                  // Disable if all available items are already selected
                  otherItemsMasterListResponse.data.data.every((item) =>
                    selectedOtherItem
                      .map((selected) => selected.itemCode)
                      .includes(item.itemCode)
                  ) ||
                  // OR if there are any incomplete rows (empty item codes)
                  otherBOMItems?.bomItems?.some(
                    (item) => item.code === "" || item.code === null
                  ) ||
                  // OR if there are no items available at all
                  otherItemsMasterListResponse.data.data?.length === 0
                }
              >
                Add Other Items
                <AddIcon fontSize={"inherit"} />
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          borderWidth: 1.75,
          p: 2,
          borderColor: "#99a5adff",
          mt: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Blend Items
        </Typography>

        {selectedBlendItem && BOMItems?.bomItems && selectedWarehouses && (
          <BlendingSheetBomDetails
            plannedProductQuantity={
              blendSheetHeaderForm.plannedQuantity.value || 1
            }
            // toWarehouseList={toWarehouseList.data || []}
            blendBOMdetails={BOMItems}
            selectedWarehouses={selectedWarehouses}
            setOpen={setOpen}
            // onToWarehouseSelect={onToWarehouseSelect}
            onWarehouseSelect={onWarehouseSelect}
            warehouseList={warehouseListResponse.data} //todo reset this or move to edit slice
            isView={isView || isRelease}
            toWarehouse={blendSheetHeaderForm.warehouse.value}
            addLot={addLot}
            onDeleteLot={onDeleteLot}
            onLotSelect={onLotSelect}
            onEnterRequiredQuantity={onEnterRequiredQuantity}
            deleteBlendItem={deleteBlendItem}
            initialBlendItems={initialBlendItems}
            onItemSelect={onItemSelect}
            onSearchOptions={onItemSearchOptions}
            onFetchOptions={onItemListFetchOptions}
            itemList={itemMasterListResponse.data.data}
            onBasedQuantityChange={onBasedQuantityChange}
            grnCheckList={requestBlendSheetApprovalResponse.extraInfo}
          />
        )}
      </Paper>
      {(editBlendSheetResponse.hasError ||
        requestBlendSheetApprovalResponse.hasError ||
        warehouseListResponse.hasError ||
        viewPresignedURL.hasError ||
        uploadPresignedURLResponse.hasError ||
        getBlendBalanceByBlendItemResponse.hasError ||
        releaseBlendSheetResponse.hasError) && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="error"
            onClose={clearApprovalResponse} // BugFix-694
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {editBlendSheetResponse?.message ||
              requestBlendSheetApprovalResponse?.message ||
              warehouseListResponse?.message ||
              viewPresignedURL?.message ||
              uploadPresignedURLResponse?.message ||
              getBlendBalanceByBlendItemResponse?.message ||
              releaseBlendSheetResponse?.message ||
              "Error in API"}
          </Alert>
        </Grid>
      )}
      {(requestBlendSheetApprovalResponse.isSuccess ||
        releaseBlendSheetResponse.isSuccess) && (
        <Grid item xs={12} lg={12} textAlign={"center"} p={2}>
          <Alert
            variant="filled"
            severity="success"
            sx={{
              marginBottom: 1,
              fontWeight: "400",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            {requestBlendSheetApprovalResponse?.message ||
              releaseBlendSheetResponse?.data?.message ||
              "Error in API"}
          </Alert>
        </Grid>
      )}
      {selectedBlendItem && BOMItems?.bomItems && !isView && (
        <Grid container textAlign={"right"} p={1}>
          <Grid
            item
            xs={5}
            md={5}
            lg={5}
            p={1}
            alignItems={"start"}
            display="flex"
          >
            {!isRelease && (
              <Tooltip title="Add New Item to BOM">
                <Button
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                  onClick={addNewItem}
                  disabled={
                    BOMItems?.bomItems.some((item) => item.code === "") ||
                    BOMItems?.bomItems.some((item) => item.code === null) ||
                    itemMasterListResponse.data.data.length <= 0 ||
                    selectedBlendItem?.plannedQuantity === 0 ||
                    blendSheetHeaderForm?.actualPlannedQuantity?.value < 0
                  }
                >
                  Add Item
                  <AddIcon fontSize={"inherit"} />
                </Button>
              </Tooltip>
            )}
          </Grid>
          <Grid
            item
            xs={7}
            md={7}
            lg={7}
            p={1}
            display="flex"
            justifyContent={"end"}
          >
            {!isRelease && (
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={cancelPlan}
              >
                Cancel
              </Button>
            )}
            {!isRelease && (
              <Button
                variant="contained"
                sx={{ marginRight: 1 }}
                onClick={editBlendSheetPlan}
                disabled={
                  selectedWarehouses.some((g) => g.error !== "No Error") ||
                  dayjs(blendSheetHeaderForm?.dueDate?.value) <
                    dayjs(blendSheetHeaderForm?.startDate?.value) ||
                  selectedBlendSheet?.approval?.status === "PENDING" ||
                  requestBlendSheetApprovalResponse.isSuccess ||
                  getBlendSheetDetailResponse.data?.approval?.status ===
                    "PENDING" ||
                  selectedWarehouses.some(
                    (g) => !g.selectedLot?.requiredQuantity
                  ) ||
                  selectedBlendItem?.plannedQuantity === 0 ||
                  selectedWarehouses.some(
                    (g) => !g.selectedLot?.requiredQuantity
                  ) ||
                  (selectedBlendBalances !== null &&
                    selectedBlendBalances.some(
                      (b) => b.isError !== "No Error"
                    )) ||
                  selectedOtherItem.some((item) => item.error !== "No Error") ||
                  blendSheetHeaderForm?.actualPlannedQuantity.value <
                    masterTotalQuantity
                }
              >
                Save as Planned
                {editBlendSheetResponse.isLoading &&
                  !openRequestForApprovalConfirmation && (
                    <CircularProgress size={20} color={"info"} />
                  )}
              </Button>
            )}
            {!isRelease &&
              selectedBlendSheet &&
              selectedBlendSheet?.statusId !== BLEND_SHEET_STATUS.RELEASED &&
              selectedBlendSheet?.approval?.status !== "APPROVED" && (
                <Button
                  variant="contained"
                  onClick={requestApproval}
                  disabled={
                    dayjs(blendSheetHeaderForm?.dueDate?.value) <
                      dayjs(blendSheetHeaderForm?.startDate?.value) ||
                    selectedWarehouses.some((g) => g.error !== "No Error") ||
                    getBlendSheetDetailResponse.data?.approval?.status ===
                      "PENDING" ||
                    selectedOtherItem.some(
                      (item) => item.error !== "No Error"
                    ) ||
                    blendSheetHeaderForm?.actualPlannedQuantity.value <
                      masterTotalQuantity
                  }
                >
                  {requestBlendSheetApprovalResponse.isLoading && (
                    <CircularProgress size={20} color={"info"} />
                  )}
                  Request Approval
                </Button>
              )}
            {getBlendSheetDetailResponse?.data?.statusId ===
              BLEND_SHEET_STATUS.PLANNED &&
              getBlendSheetDetailResponse?.data?.approval?.status ===
                "APPROVED" && (
                <Button
                  variant="contained"
                  onClick={releaseBlendSheetPlan}
                  disabled={
                    selectedWarehouses.some((g) => g.error !== "No Error") ||
                    getBlendSheetDetailResponse?.data?.approval?.status !==
                      "APPROVED"
                  }
                >
                  Release
                  {releaseBlendSheetResponse.isLoading && (
                    <CircularProgress size={20} color={"secondary"} />
                  )}
                </Button>
              )}
          </Grid>
        </Grid>
      )}
      {isView && !isPrintClicked && (
        <Grid container textAlign={"right"} p={2}>
          <Grid item xs={12} lg={12} p={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={forStoreCheck}
                  onChange={(e) => setForStoreCheck(e.target.checked)}
                  color="primary"
                />
              }
              label="For Store"
            />
            <Button
              variant="outlined"
              sx={{ marginRight: 1 }}
              onClick={handleClickDownloadMenu}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Download
            </Button>
            <Menu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={openDownloadMenu}
              onClose={handleCloseDownloadMenu}
            >
              <MenuItem onClick={downloadCSV} disableRipple>
                {/* <EditIcon /> */}
                Download CSV
              </MenuItem>
              <MenuItem onClick={downloadXML} disableRipple>
                {/* <FileCopyIcon /> */}
                Download XML
              </MenuItem>
            </Menu>
            <Button
              variant="outlined"
              sx={{ marginRight: 1 }}
              onClick={printPlan}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      )}
      <ConfirmationMessage
        dialogTitle="SUCCEEDED"
        dialogContentText={
          <>
            {editBlendSheetResponse.data &&
              openRequestForApprovalConfirmation && (
                <div>{editBlendSheetResponse.data}</div>
              )}
          </>
        }
        open={openRequestForApprovalConfirmation}
        onClose={handleClose}
        showCloseButton={true}
      />

      <ConfirmationMessage
        dialogTitle="Confirm Update"
        dialogContentText={
          <div>Are you sure you want to update this blend sheet?</div>
        }
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm",
            onClick: handleUpdateConfirmation,
          },
          {
            buttonText: "Close",
            onClick: handleCloseConfirmation,
            design: "outlined",
          },
        ]}
      />

      <ConfirmationMessage
        dialogTitle="Confirm Approval Request"
        dialogContentText={
          <div>
            Please note that you cannot edit this Blend Sheet after you request
            approval. Are you sure you want to continue?
          </div>
        }
        open={openRequestForApprovalConfirmation}
        onClose={handleCloseRequestApprovalConfirmation}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm",
            onClick: handleUpdateRequestApprovalConfirmation,
            isLoading:
              editBlendSheetResponse.isLoading ||
              requestBlendSheetApprovalResponse.isLoading,
          },
          {
            buttonText: "Close",
            onClick: handleCloseRequestApprovalConfirmation,
            design: "outlined",
          },
        ]}
      />

      <ConfirmationMessage
        dialogTitle="Confirm Release"
        dialogContentText={
          <div>Are you sure you want to release this Blend Sheet?</div>
        }
        open={openReleaseConfirmation}
        onClose={handleCloseReleaseConfirmation}
        showCloseButton={true}
        buttons={[
          {
            buttonText: "Confirm",
            onClick: handleUpdateReleaseConfirmation,
            isLoading: releaseBlendSheetResponse.isLoading,
          },
          {
            buttonText: "Close",
            onClick: handleCloseReleaseConfirmation,
            design: "outlined",
          },
        ]}
      />
      {isPrintClicked && (
        <Box
          mt={isPrintClicked ? 100 : 0}
          className={isPrintClicked ? "print-only" : "no-print"}
        >
          <BlendingSheetPrintView
            data={printBlendData}
            forStore={forStoreCheck}
          />
        </Box>
      )}
    </Grid>
  );
}

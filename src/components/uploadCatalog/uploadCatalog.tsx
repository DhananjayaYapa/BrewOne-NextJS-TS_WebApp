"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Styles from "./uploadCatalog.module.scss";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetUploadErrorResponse,
  resetUploadResponse,
  setCatalogueSerialNo,
  setCsvData,
  // setDuplicatedLotNos,
  setErrorAlertOpen,
  setErrorDialogMessage,
  setFile,
  setFileName,
  setFileSize,
  setInvalidBrokerCodes,
  setIrrelevantValueCount,
  setIsBrokerSelected,
  setIsError,
  setIsFieldsVisible,
  setIsSuccess,
  setIsSuccessfullyUploaded,
  setIsUploadButtonClick,
  setIsUploadFailed,
  setIsUploaded,
  setNullValuesCount,
  setSearchBy,
  setSelectedBrokerCode,
  setSelectedBrokerName,
  setSuccessDialogMessage,
  setTotalLinesCount,
  setInvalidDates,
  setInvalidData,
  resetInvlalidData,
  setInputSalesCode,
  resetFileFormat,
} from "@/redux/slice/uploadCatalogueSlice";
import { UploadCatalogRequest } from "@/interfaces/catalogue";
import {
  getTextFileCodesByBrokerCode,
  getTextFileFormatByBrokerCode,
  uploadCatalogue,
} from "@/redux/action/uploadCatalogueAction";
import { getBrokers } from "@/redux/action/brokerAction";
import { Broker, FieldValue, TextFile, TextFileCodes } from "@/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { CATALOGUE_TYPES, ROUTES, UPLOAD_FORMATS_COLUMNS } from "@/constant";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";
import dayjs from "dayjs";
import moment from "moment";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export interface uploadCatalogProps {
  broker?: FieldValue<Broker | null> | null;
}

export default function UploadCatalog(props: uploadCatalogProps) {
  let { broker } = props;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const searchBy = useSelector(
    (state: RootState) => state.uploadCatalog.searchBy
  );

  const isFieldsVisible = useSelector(
    (state: RootState) => state.uploadCatalog.isFieldsVisible
  );

  const selectedBrokerCode = useSelector(
    (state: RootState) => state.uploadCatalog.selectedBrokerCode
  );

  const selectedBrokerName = useSelector(
    (state: RootState) => state.uploadCatalog.selectedBrokerName
  );

  const isBrokerSelected = useSelector(
    (state: RootState) => state.uploadCatalog.isBrokerSelected
  );

  const totalLinesCount = useSelector(
    (state: RootState) => state.uploadCatalog.totalLinesCount
  );

  const nullValuesCount = useSelector(
    (state: RootState) => state.uploadCatalog.nullValuesCount
  );

  const irrelevantValueCount = useSelector(
    (state: RootState) => state.uploadCatalog.irrelevantValueCount
  );

  const invalidData = useSelector(
    (state: RootState) => state.uploadCatalog.invalidData
  );

  const invalidBrokerCodes = useSelector(
    (state: RootState) => state.uploadCatalog.invalidBrokerCodes
  );

  const fileSize = useSelector(
    (state: RootState) => state.uploadCatalog.fileSize
  );

  const fileName = useSelector(
    (state: RootState) => state.uploadCatalog.fileName
  );

  // const duplicatedLotNos = useSelector(
  //   (state: RootState) => state.uploadCatalog.duplicatedLotNos
  // );

  const invalidDates = useSelector(
    (state: RootState) => state.uploadCatalog.invalidDates
  );

  const isUploadFailed = useSelector(
    (state: RootState) => state.uploadCatalog.isUploadFailed
  );

  const file = useSelector((state: RootState) => state.uploadCatalog.file);

  const isUploaded = useSelector(
    (state: RootState) => state.uploadCatalog.isUploaded
  );

  const inputSalesCode = useSelector(
    (state: RootState) => state.uploadCatalog.inputSalesCode
  );

  const isError = useSelector(
    (state: RootState) => state.uploadCatalog.isError
  );

  const isSuccess = useSelector(
    (state: RootState) => state.uploadCatalog.isSuccess
  );

  const errorAlertOpen = useSelector(
    (state: RootState) => state.uploadCatalog.errorAlertOpen
  );
  console.log(errorAlertOpen, "errorAlertOpen");
  const isUploadButtonClick = useSelector(
    (state: RootState) => state.uploadCatalog.isUploadButtonClick
  );

  const uploadCatalogResponse = useSelector(
    (state: RootState) => state.uploadCatalog.uploadCatalogueResponse
  );

  const catalogueSerialNo = useSelector(
    (state: RootState) => state.uploadCatalog.catalogueSerialNo
  );

  const errorDialogMessage = useSelector(
    (state: RootState) => state.uploadCatalog.errorDialogMessage
  );

  const successDialogMessage = useSelector(
    (state: RootState) => state.uploadCatalog.successDialogMessage
  );

  const brokers = useSelector(
    (state: RootState) => state.broker.data.brokerData
  );

  const csvData = useSelector(
    (state: RootState) => state.uploadCatalog.csvData
  );
  const textFieldFormat = useSelector(
    (state: RootState) => state.uploadCatalog.textFieldFormatResponse
  );

  const textFileCodes = useSelector(
    (state: RootState) => state.uploadCatalog.textFileCodesResponse
  );

  useEffect(() => {
    dispatch(getBrokers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrokerCode) {
      dispatch(getTextFileFormatByBrokerCode());
      dispatch(getTextFileCodesByBrokerCode());
    }
  }, [selectedBrokerCode]);

  const [isSalesCodeExist, setIsSalesCodeExist] = useState<boolean>(false);
  useEffect(() => {
    if (
      textFieldFormat.data?.length > 1 &&
      textFieldFormat?.data?.find(
        (text) => text.columnName === UPLOAD_FORMATS_COLUMNS.SALES_CODE
      ) === undefined &&
      selectedBrokerCode
    ) {
      setIsSalesCodeExist(true);
    }
  }, [textFieldFormat.data?.length > 1, dispatch]);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [usedSerialNumbers, setUsedSerialNumbers] = useState(new Set<string>());
  const [search, setSearch] = useState<FieldValue<Broker | null> | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (uploadCatalogResponse.hasError) {
      dispatch(setIsError(true));
      dispatch(setErrorDialogMessage(uploadCatalogResponse.message || ""));
    }
    if (uploadCatalogResponse.isSuccess) {
      dispatch(setIsSuccess(true));
      dispatch(setIsError(false));
      dispatch(setSuccessDialogMessage(uploadCatalogResponse.message || ""));

      setTimeout(() => {
        router.push(`/${ROUTES.CATALOGUE_MANAGEMENT}`);
        dispatch(setIsSuccess(false));
        dispatch(setIsError(false));
        dispatch(resetUploadResponse());
      }, 2000);
      dispatch(setIsSuccessfullyUploaded(true));
    }
  }, [dispatch, router, uploadCatalogResponse]);

  const handleSearchByChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = event.target.value;
    dispatch(setSearchBy(selectedOption));
    dispatch(setIsBrokerSelected(true));
    dispatch(setIsFieldsVisible(false));
    setErrorMessage("");
    dispatch(setErrorAlertOpen(false));

    const fieldavalue = {
      value: null,
      error: null,
    };
    setSearch(fieldavalue);
    dispatch(setCsvData([]));
    dispatch(setIsUploaded(false));
    dispatch(setNullValuesCount([]));
    dispatch(setTotalLinesCount(0));
    dispatch(setInvalidBrokerCodes([]));
    dispatch(setInvalidDates([]));
    dispatch(resetInvlalidData());
    dispatch(setIrrelevantValueCount(0));
    // dispatch(setDuplicatedLotNos(null));
    dispatch(setIsUploadFailed(false));
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsError(false));
    dispatch(setFileName(""));
  };

  const handleAutocompleteChange = (value: Broker | null) => {
    dispatch(resetFileFormat());
    setIsSalesCodeExist(false);
    if (value) {
      dispatch(setSelectedBrokerCode(value.brokerCode || ""));
      dispatch(setSelectedBrokerName(value.brokerName || ""));
      dispatch(setIsFieldsVisible(true));
      const fieldavalue = {
        value: value,
        error: null,
      };
      setSearch(fieldavalue);
      dispatch(setErrorAlertOpen(false));
      setErrorMessage("");
    } else {
      dispatch(setSelectedBrokerCode(""));
      dispatch(setSelectedBrokerName(""));
      dispatch(setIsFieldsVisible(false));
      const fieldavalue = {
        value: null,
        error: null,
      };
      setSearch(fieldavalue);
      setErrorMessage("Please select Broker Name or Broker Code");
    }
    dispatch(setCsvData([]));
    dispatch(setIsUploaded(false));
    dispatch(setNullValuesCount([]));
    dispatch(setTotalLinesCount(0));
    dispatch(setInvalidBrokerCodes([]));
    dispatch(setInvalidDates([]));
    dispatch(resetInvlalidData());

    dispatch(setIrrelevantValueCount(0));
    // dispatch(setDuplicatedLotNos(null));
    dispatch(setIsUploadFailed(false));
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsError(false));
    dispatch(setFileName(""));
  };

  const handleFileUploadClick = () => {
    if (isBrokerSelected && isFieldsVisible) {
      openFileDialog();
    } else {
      dispatch(setErrorAlertOpen(true));
    }
  };

  const onSalesCodeChange = (value: string) => {
    dispatch(setInputSalesCode(value));
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      setErrorMessage("");
      if (!isBrokerSelected || !isFieldsVisible) {
        dispatch(setErrorAlertOpen(true));
        return;
      }

      const file = acceptedFiles[0];
      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      if (fileSizeInMB > 20) {
        alert("File size should be less than or equal to 20MB.");
        return;
      }
      const fileSizeInMBRounded = fileSizeInMB.toFixed(2);
      dispatch(setFileSize(`${fileSizeInMBRounded} mb`));
      dispatch(setFileName(file.name));
      dispatch(setFile(file));
      dispatch(setIsUploaded(true));
    },
    accept: {
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    noClick: true,
  });

  const generateCatalogueSerialNo = () => {
    const uuidValue = uuidv4();
    const generatedSerialNo = `CAT-${uuidValue}`;

    if (!usedSerialNumbers.has(generatedSerialNo)) {
      dispatch(setCatalogueSerialNo(generatedSerialNo));
      usedSerialNumbers.add(generatedSerialNo);
    } else {
      generateCatalogueSerialNo();
    }
  };

  const extractHeaderIndices = (headers: string[] = []) => {
    return headers.reduce(
      (indices: { [key: string]: number }, header, index) => {
        const key = header.trim().toLowerCase();
        indices[key] = index;
        return indices;
      },
      {}
    );
  };

  const headers = textFieldFormat.data?.map((x) => x.columnName);
  const headerIndices = extractHeaderIndices(headers);
  const brokerCodeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.BROKER_CODE];
  const salesCodeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.SALES_CODE];
  const salesDateIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.SALES_DATE];
  const lotNoIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.LOT_NO];
  const estateCodeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.ESTATE_CODE];
  const estateNameIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.ESTATE_NAME];
  const invoiceNoIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.INVOICE_NO];
  const gradeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.GRADE];
  const bagsCountIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.NO_OF_BAGS];
  const weightPerBagIndex =
    headerIndices[UPLOAD_FORMATS_COLUMNS.ONE_BAG_WEIGHT];
  const sackTypeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.PAPER_SACK];
  const chestTypeIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.CHEST_TYPE];
  const breakIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.BREAK];
  const totalQuantityIndex =
    headerIndices[UPLOAD_FORMATS_COLUMNS.TOTAL_QUANTITY];
  const noOfDeliveryDatesIndex =
    headerIndices[UPLOAD_FORMATS_COLUMNS.NO_OF_DELIVERY_DATES];
  const storeAddressIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.STORE_ADDRESS];
  const allowanceIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.ALLOWANCE];
  const elevationIndex = headerIndices[UPLOAD_FORMATS_COLUMNS.ELEVATION];

  const handleSaveUploadCatalogue = (event: {
    currentTarget: { disabled: boolean };
  }) => {
    // if (!errorAlertOpen && buttonClicked) return;
    setButtonClicked(true);
    const uploadCatalogRequest: UploadCatalogRequest = {
      brokerCode: selectedBrokerCode,
      typeId: CATALOGUE_TYPES.AUCTION,
      salesCode: !isSalesCodeExist
        ? csvData[0][salesCodeIndex]
        : inputSalesCode || csvData[0][salesCodeIndex],
      salesDate:
        formatDate(csvData[0][salesDateIndex]) === "Invalid date"
          ? new Date().toLocaleDateString("sv-SE")
          : formatDate(csvData[0][salesDateIndex]),
      lots: csvData?.map((row) => ({
        invoiceNo: row[invoiceNoIndex],
        lotNo: row[lotNoIndex],
        estateCode: row[estateCodeIndex] || undefined,
        estateName: row[estateNameIndex] || undefined,
        grade: row[gradeIndex] || undefined,
        bagsCount: Number(row[bagsCountIndex]),
        WeightPerBag: Number(row[weightPerBagIndex]),
        chestType: row[chestTypeIndex] || undefined,
        sackType: row[sackTypeIndex] || undefined,
        break: row[breakIndex] || undefined,
        elevation: row[elevationIndex] || undefined,
        storeAddress: row[storeAddressIndex] || undefined,
        allowance: Number(row[allowanceIndex]) || undefined,
        netQuantity: Number(row[totalQuantityIndex]),
        noOfDeliveryDates: Number(row[noOfDeliveryDatesIndex]) || undefined,
      })),
    };

    dispatch(uploadCatalogue(uploadCatalogRequest));
  };
  const formatDate = (dateString: string): string => {
    const inputFormats = [
      "D/M/YYYY",
      "DD/MM/YYYY",
      "DD/MM/YY",
      "YYYY-MM-DD",
      "MM-DD-YY",
      "DD-MM-YY",
      "YYYY/MM/DD",
      "YYMMDD",
    ];

    const date = moment(dateString, inputFormats, true);

    if (date.isValid()) {
      return date.format("YYYY-MM-DD");
    } else {
      return "Invalid date";
    }
  };
  const importCSV = () => {
    dispatch(setIsUploadButtonClick(true));
  };

  const validateMasterData = (
    dataArray: string[][],
    columnName: string,
    textFileCodes: TextFileCodes[],
    columnIndex: number
  ) => {
    const txtValues = dataArray?.map((row) => row[columnIndex]);
    console.log(dataArray, columnName, textFileCodes, columnIndex, "dataArray");
    console.log(txtValues, "txtValues");
    // const filteredValues = txtValues.filter(b => b)
    const masterCodes = textFileCodes
      ?.find((item) => item.columnName === columnName)
      ?.items?.map((b) => b.itemCode.toLowerCase().toString());
    console.log(masterCodes, "masterCodes");
    const masterCodeValues = textFileCodes
      ?.find((item) => item.columnName === columnName)
      ?.items?.map((b) => b.value.toLowerCase().toString());
    console.log(masterCodeValues, "masterCodeValues");
    if (masterCodeValues || masterCodes) {
      const invalidValues = txtValues
        ?.map((code, index) => ({ code, index }))
        ?.filter(
          (item) =>
            !masterCodes?.includes(item.code?.toLowerCase()) &&
            !masterCodeValues?.includes(item.code?.toLowerCase())
        )
        ?.filter((item) => item.code);

      return invalidValues;
    } else {
      const emptyArr: { code: number; index: number }[] = [];
      return emptyArr;
    }
  };
  const replaceCodeValues = (
    dataArray: string[][],
    columnName: string,
    textFileCodes: TextFileCodes[],
    columnIndex: number
  ) => {
    const masterItems =
      textFileCodes?.find((item) => item.columnName === columnName)?.items ||
      [];

    // Create a mapping of itemCode → value
    const masterCodeMap = masterItems.reduce((acc, { itemCode, value }) => {
      acc[itemCode?.toLowerCase()] = value;
      return acc;
    }, {} as Record<string, string>);

    // Define column index where the replacement should happen
    const replaceColumnIndex = columnIndex; // Set the correct index

    const updatedDataArray = dataArray.map((row) => {
      return row.map((value, index) =>
        index === replaceColumnIndex
          ? masterCodeMap[value?.toLowerCase()]
          : value
      );
    });
    return updatedDataArray;
  };
  const handleConfirmationFile = () => {
    dispatch(setIsUploadButtonClick(false));
    Papa.parse(file, {
      beforeFirstChunk: function (chunk) {
        let col_character_lengths = textFieldFormat?.data;

        let rows = chunk.trim().split("\n"); // Split into lines
        let columnData = rows?.map((row) => {
          let columns: string[] = [];
          // Loop through column lengths and slice the row accordingly
          if (col_character_lengths)
            col_character_lengths.forEach((txt: TextFile, index: number) => {
              let colData = row.substring(txt.start - 1, txt.end - 1).trim(); // row.substring(startIndex, endIndex).trim();
              if (col_character_lengths.length - 1 > index) {
                columns.push(colData + "++++"); // Append '---' after each column
              } else {
                columns.push(colData);
              }
            });

          return columns.join(""); // Join all columns into one string
        });
        return columnData.join("\n").toString();
      },
      delimiter: "++++",
      chunkSize: 3,
      newline: "\n",
      // dynamicTyping: true,
      skipEmptyLines: true,
      header: false,
      complete: function (responses) {
        dispatch(setIsUploaded(true));
        if (responses) {
          const dataArray = responses?.data as string[][];

          const result: any[] = [];
          if (textFileCodes?.data) {
            const masterDataColumnIndices = [
              { key: UPLOAD_FORMATS_COLUMNS.BREAK, index: breakIndex },
              { key: UPLOAD_FORMATS_COLUMNS.PAPER_SACK, index: sackTypeIndex },
              { key: UPLOAD_FORMATS_COLUMNS.ELEVATION, index: elevationIndex },
              { key: UPLOAD_FORMATS_COLUMNS.CHEST_TYPE, index: chestTypeIndex },
              { key: UPLOAD_FORMATS_COLUMNS.GRADE, index: gradeIndex },
            ];

            const processedData = masterDataColumnIndices.reduce(
              (updatedData, { key, index }) =>
                replaceCodeValues(updatedData, key, textFileCodes?.data, index),
              dataArray
            );

            processedData.forEach((row) => {
              if (row.every((v) => !v)) return; // skip fully empty rows

              if (row[bagsCountIndex] && !row[lotNoIndex]) {
                // case 1: new row with bags count, no lot number
                const prev = result[result.length - 1];
                if (prev) {
                  const newRow = prev.map((val: any, idx: number) =>
                    row[idx] ? row[idx] : val
                  );
                  result.push(newRow);
                }
              } else if (row[storeAddressIndex] && !row[lotNoIndex]) {
                // case 2: merge address into previous row
                const prev = result[result.length - 1];
                if (prev) {
                  prev[storeAddressIndex] = prev[storeAddressIndex]
                    ? prev[storeAddressIndex] + " " + row[storeAddressIndex]
                    : row[storeAddressIndex];
                }
              } else {
                // normal row → fill blanks from previous
                const prev = result[result.length - 1];
                const filled = row.map((val, idx) =>
                  val ? val : prev ? prev[idx] : ""
                );
                result.push(filled);
              }
            });
            dispatch(setCsvData(result as unknown as string[]));
          }
          // console.log(responses.data as string[], 'csv')
          const headers = textFieldFormat.data;
          if (headers) {
            const IndexBrokerCode = headers.findIndex(
              (header) =>
                header.columnName.toLowerCase() ===
                UPLOAD_FORMATS_COLUMNS.BROKER_CODE
            );
            const brokerCodes = dataArray?.map((row) => row[IndexBrokerCode]);

            const filteredBrokerCodes = brokerCodes.filter(
              (brokerCode) => brokerCode
            );
            const lowerCaseSelectedBrokerCode =
              selectedBrokerCode.toLowerCase();

            const invalidBrokerCodes = filteredBrokerCodes
              .map((brokerCode, index) => ({ brokerCode, index }))
              .filter(
                (brokerCode) =>
                  brokerCode?.brokerCode?.toLowerCase() !==
                  lowerCaseSelectedBrokerCode
              );
            dispatch(setInvalidBrokerCodes(invalidBrokerCodes));

            if (textFileCodes?.data) {
              const validationColumns = [
                {
                  key: "Break",
                  column: UPLOAD_FORMATS_COLUMNS.BREAK,
                  index: breakIndex,
                },
                {
                  key: "SackType",
                  column: UPLOAD_FORMATS_COLUMNS.PAPER_SACK,
                  index: sackTypeIndex,
                },
                {
                  key: "ChestType",
                  column: UPLOAD_FORMATS_COLUMNS.CHEST_TYPE,
                  index: chestTypeIndex,
                },
                {
                  key: "Elevation",
                  column: UPLOAD_FORMATS_COLUMNS.ELEVATION,
                  index: elevationIndex,
                },
                {
                  key: "Grade",
                  column: UPLOAD_FORMATS_COLUMNS.GRADE,
                  index: gradeIndex,
                },
              ];

              validationColumns.forEach(({ key, column, index }) => {
                dispatch(
                  setInvalidData({
                    key,
                    data: validateMasterData(
                      dataArray,
                      column,
                      textFileCodes.data,
                      index
                    ),
                  })
                );
              });
            }

            // check null values
            // const indicesToCheck = [
            //   salesCodeIndex,
            //   salesDateIndex,
            //   lotNoIndex,
            //   bagsCountIndex,
            //   weightPerBagIndex,
            //   totalQuantityIndex,
            // ];

            // const nullValues = dataArray
            //   ?.map((b, index) => {
            //     const nullCount = indicesToCheck.reduce((sum, idx) => sum + (b[idx] === "" ? 1 : 0), 0);
            //     return nullCount > 0 ? { index, nullCount } : null;
            //   })
            //   .filter(Boolean);
            // dispatch(setNullValuesCount(nullValues));

            dispatch(setTotalLinesCount(result.length));

            // const invalidDateEntries = dataArray?.map((row, index) => ({
            //   index,
            //   code: formatDate(row[salesDateIndex]),
            // }))
            //   .filter((date) => date.code === "Invalid date");
            // if (invalidDateEntries?.length > 0) {
            //   dispatch(setInvalidDates(invalidDateEntries))
            // }
            if (headers) {
              const lotNoIndex = headers.findIndex(
                (header) =>
                  header.columnName.toLowerCase() ===
                  UPLOAD_FORMATS_COLUMNS.LOT_NO
              );

              if (lotNoIndex !== -1) {
                const lotCounts = new Map<string, number>();

                // Count occurrences of each lot number
                dataArray?.forEach((row) => {
                  const lotNo = row[lotNoIndex];
                  if (lotNo) {
                    lotCounts.set(lotNo, (lotCounts.get(lotNo) || 0) + 1);
                  }
                });

                // Filter and collect duplicate lot numbers with their indexes
                // const duplicatedLots = dataArray
                //   ?.map((row, index) => ({
                //     lotNo: row[lotNoIndex],
                //     index,
                //   }))
                //   .filter(({ lotNo }) => lotNo && lotCounts.get(lotNo)! > 1);
                // const lotMap: Record<string, number[]> = {};

                // duplicatedLots.forEach(({ lotNo, index }) => {
                //   if (!lotMap[lotNo]) {
                //     lotMap[lotNo] = [];
                //   }
                //   lotMap[lotNo].push(index + 1);
                // });

                // if (duplicatedLots?.length > 0) {
                //   dispatch(setDuplicatedLotNos(lotMap));
                // }
                dispatch(setIsUploadFailed(true));

                const dataListArray = responses.data.slice(1) as string[][];
                const headerIndices = extractHeaderIndices(
                  headers?.map((h) => h.columnName)
                );

                const columnTypes = Object.keys(headerIndices)?.map(
                  (header) => {
                    const index = headerIndices[header];
                    if (
                      header === UPLOAD_FORMATS_COLUMNS.LOT_NO ||
                      header === UPLOAD_FORMATS_COLUMNS.NO_OF_BAGS ||
                      header === UPLOAD_FORMATS_COLUMNS.ONE_BAG_WEIGHT ||
                      header === UPLOAD_FORMATS_COLUMNS.TOTAL_QUANTITY ||
                      header === UPLOAD_FORMATS_COLUMNS.NO_OF_DELIVERY_DATES
                    ) {
                      return "number";
                    }
                    return "string";
                  }
                );

                const isValidData = (rowData: string[], rowIndex: number) => {
                  const invalidValues: { column: number; value: string }[] = [];
                  rowData.forEach((value, index) => {
                    const columnType = columnTypes[index];
                    if (
                      (columnType === "number" && isNaN(Number(value))) ||
                      (columnType === "string" && typeof value !== "string")
                    ) {
                      invalidValues.push({ column: index, value });
                    }
                  });

                  if (invalidValues.length > 0) {
                    invalidValues.forEach(({ column, value }) => {});
                  }
                };

                dataListArray.forEach((rowData: string[], index: number) => {
                  isValidData(rowData, index);
                });

                // const irrelevantValueCount = dataListArray.reduce(
                //   (acc, rowData) => {
                //     let count = 0;
                //     rowData.forEach((value, index) => {
                //       const columnType = columnTypes[index];
                //       if (
                //         (columnType === "number" && isNaN(Number(value))) ||
                //         (columnType === "string" && typeof value !== "string")
                //       ) {
                //         count++;
                //       }
                //     });
                //     return acc + count;
                //   },
                //   0
                // );

                // console.log(irrelevantValueCount,'printpls')
                // dispatch(setIrrelevantValueCount(irrelevantValueCount));

                if (
                  invalidBrokerCodes.length === 0 &&
                  nullValuesCount.length === 0 &&
                  // !duplicatedLotNos &&
                  // (Object.keys(invalidData)?.length > 0  &&
                  // (invalidData?.Break?.length > 0  ||
                  // invalidData?.ChestType?.length > 0  ||
                  // invalidData?.Elevation?.length > 0  ||
                  // invalidData?.Grade?.length > 0  ||
                  // invalidData?.SackType?.length > 0 ))
                  //  &&
                  irrelevantValueCount === 0
                ) {
                } else {
                  dispatch(setIsUploadFailed(true));
                  dispatch(setErrorAlertOpen(true));
                }
              }
            }
          }
        }
      },
    });
  };

  const handleUploadDifferentFile = () => {
    dispatch(setIsUploaded(false));
    dispatch(setCsvData([]));
    dispatch(setNullValuesCount([]));
    dispatch(setTotalLinesCount(0));
    dispatch(setInvalidBrokerCodes([]));
    dispatch(setInvalidDates([]));
    dispatch(resetInvlalidData());
    dispatch(setIrrelevantValueCount(0));
    // dispatch(setDuplicatedLotNos(null));
    dispatch(setIsUploadFailed(false));
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsError(false));
    dispatch(setFileName(""));
  };

  const handleReUploadFile = () => {
    dispatch(resetUploadErrorResponse());
    dispatch(setIsUploaded(false));
    dispatch(setIsUploadFailed(false));
    dispatch(setCsvData([]));
    dispatch(setNullValuesCount([]));
    dispatch(setTotalLinesCount(0));
    dispatch(setInvalidBrokerCodes([]));
    dispatch(setInvalidDates([]));
    dispatch(resetInvlalidData());

    dispatch(setIrrelevantValueCount(0));
    // dispatch(setDuplicatedLotNos(null));
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsError(false));
    dispatch(setFileName(""));
    setButtonClicked(false);
  };

  const handleDeleteUploadedFile = () => {
    dispatch(setCsvData([]));
    dispatch(setIsUploaded(false));
    dispatch(setNullValuesCount([]));
    dispatch(setTotalLinesCount(0));
    dispatch(setInvalidBrokerCodes([]));
    dispatch(setInvalidDates([]));
    dispatch(resetInvlalidData());

    dispatch(setIrrelevantValueCount(0));
    // dispatch(setDuplicatedLotNos(null));
    dispatch(setIsUploadFailed(false));
    dispatch(setErrorAlertOpen(false));
    dispatch(setIsError(false));
    dispatch(setFileName(""));
  };

  const handleOnReset = () => {
    window.location.reload();
  };

  const handleClose = () => {
    if (isUploadButtonClick) {
      dispatch(setIsUploadButtonClick(false));
    }
    if (uploadCatalogResponse.hasError) {
      dispatch(setIsError(false));
      setButtonClicked(false);
    }
  };
  const renderInvalidMasterValueErrors = (
    invalidMasterValues: { code: number | string; index: number }[],
    errorField: string
  ) => {
    return (
      <Grid>
        {invalidMasterValues?.length > 0 && (
          <span style={{ color: "#D32F2F" }}>
            {`* The ${errorField} value in the catalogue file, line number(s) ${invalidMasterValues
              ?.map((b) => b.index + 1)
              .join(",")} does not exist`}
          </span>
        )}
      </Grid>
    );
  };
  const setFileEmptyError = () => {
    setErrorMessage("Please Upload a File");
  };
  console.log(invalidData, "invalidData");
  return (
    <Grid container display="flex" justifyContent="center">
      <Box className={Styles.combobox}>
        <Grid container>
          {textFieldFormat.hasError && (
            <Grid item container mb={2}>
              <Alert
                variant="filled"
                severity="error"
                sx={{
                  marginBottom: 1,
                  fontWeight: "400",
                  borderRadius: "16px",
                  width: "100%",
                }}
              >
                {textFieldFormat?.message ||
                  "Something went wrong, try again later"}
              </Alert>
            </Grid>
          )}
          <Grid item container spacing={3} mb={4}>
            <Grid item xl={6} xs={6}>
              <FormControl
                fullWidth
                error={errorAlertOpen && !isBrokerSelected}
              >
                <InputLabel id="search-by-select-label" size="small">
                  Search By
                </InputLabel>
                <Select
                  size="small"
                  labelId="search-by-select-label"
                  id="search-by-select"
                  label="brokerCodeOptions"
                  value={searchBy}
                  onChange={handleSearchByChange}
                >
                  <MenuItem value={"Broker Code"}>Broker Code</MenuItem>
                  <MenuItem value={"Broker Name"}>Broker Name</MenuItem>
                </Select>
                {errorAlertOpen && !isBrokerSelected && (
                  <FormHelperText>
                    Please select Broker Name or Broker Code
                  </FormHelperText>
                )}{" "}
              </FormControl>
            </Grid>

            <Grid item xl={6} xs={6}>
              <Autocomplete
                size="small"
                disablePortal
                id="broker-code-name-option"
                options={brokers}
                disabled={!isBrokerSelected}
                value={search?.value || null}
                onChange={(event, value) => handleAutocompleteChange(value)}
                getOptionLabel={(option) =>
                  searchBy === "Broker Code"
                    ? option.brokerCode || ""
                    : option.brokerName || ""
                }
                popupIcon={<SearchIcon />}
                sx={{
                  "& .MuiAutocomplete-popupIndicatorOpen": {
                    transform: "none",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    placeholder={
                      searchBy === "Broker Code" ? "Broker Code" : "Broker Name"
                    }
                    InputProps={{
                      ...params.InputProps,
                    }}
                    error={
                      errorAlertOpen && !isFieldsVisible && isBrokerSelected
                    }
                    helperText={
                      errorAlertOpen && !isFieldsVisible && isBrokerSelected
                        ? "Please select Broker Name or Broker Code"
                        : ""
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box className={Styles.middlebox}>
            {!isUploaded ? (
              <Grid item className={Styles.fileUploadForm}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "space-around",
                  }}
                  {...getRootProps()}
                >
                  <input
                    {...getInputProps({
                      onClick: handleFileUploadClick,
                    })}
                    style={{ display: "none" }}
                  />
                  <IconButton onClick={handleFileUploadClick}>
                    <UploadFileIcon
                      sx={{
                        width: "34px",
                        height: "34px",
                        color: "#005893",
                      }}
                    />
                  </IconButton>

                  <Typography variant="subtitle2">
                    <a
                      href="#"
                      style={{
                        textDecoration: "underline",
                        color: "#005893",
                        textAlign: "center",
                      }}
                      onClick={handleFileUploadClick}
                    >
                      Click to upload
                    </a>{" "}
                    or drag and drop
                  </Typography>

                  <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    TXT
                    <br />
                    (Maximum file size: 20MB, Maximum number of files: 1)
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <Grid
                item
                className={Styles.fileUploadDetailForm}
                style={{
                  border: `1px solid ${
                    errorAlertOpen || errorMessage ? "#D32F2F" : "#005893"
                  }`,
                }}
              >
                <IconButton>
                  <UploadFileIcon
                    sx={{
                      width: "34px",
                      height: "34px",
                      color: errorAlertOpen ? "#D32F2F" : "#005893",
                    }}
                  />
                </IconButton>
                {
                  // invalidBrokerCodes?.length === 0 &&
                  // nullValuesCount.length === 0 &&
                  // invalidDates.length === 0 &&
                  // // duplicatedLotNos === null &&
                  // Object.values(invalidData).every((arr) => arr.length === 0) &&
                  // (Object.keys(invalidData)?.length === 0 && (!invalidData))&&
                  // irrelevantValueCount === 0 && (
                    <Typography variant="subtitle1" sx={{ textAlign: "left" }}>
                      <b>{fileName}</b>
                      <br />
                      {fileSize}
                      <br />
                    </Typography>
                  // )
                  }
                {(invalidBrokerCodes?.length > 0 ||
                  nullValuesCount.length > 0 ||
                  invalidDates.length > 0 ||
                  // (Object.keys(invalidData)?.length > 0 &&
                  //   (invalidData?.Break?.length > 0 ||
                  //     invalidData?.ChestType?.length > 0 ||
                  //     invalidData?.Elevation?.length > 0 ||
                  //     invalidData?.Grade?.length > 0 ||
                  //     invalidData?.SackType?.length > 0)) ||
                  // duplicatedLotNos ||
                  irrelevantValueCount > 0) && (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "left",
                      whiteSpace: "normal", // allow text to wrap
                      wordBreak: "break-word",
                    }}
                  >
                    <span style={{ color: "#D32F2F" }}>Upload failed.</span>{" "}
                    <span>{totalLinesCount} Total Lines Detected</span>
                    <br />
                    {invalidBrokerCodes?.length > 0 && (
                      <span style={{ color: "#D32F2F" }}>
                        * The selected Broker code does not match broker code in
                        the catalogue file, line number(s)
                      </span>
                    )}
                    {invalidBrokerCodes?.map((b, index) => (
                      <span
                        style={{
                          color: "#D32F2F",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                        key={index}
                      >
                        {` `}
                        {b.index + 1}
                        {` `}
                        {index < invalidBrokerCodes?.length - 1 ? `,` : ``}
                      </span>
                    ))}
                    {Object.entries(invalidData).map(([key, values]) =>
                      renderInvalidMasterValueErrors(
                        values,
                        key.replace(/([A-Z])/g, " $1").toLowerCase()
                      )
                    )}
                    {irrelevantValueCount > 0 && (
                      <span style={{ color: "#D32F2F" }}>
                        {" "}
                        *{irrelevantValueCount} Error Records detected
                      </span>
                    )}
                    {/* invalid date error */}
                    <Grid>
                      {invalidDates.length > 0 && (
                        <span style={{ color: "#D32F2F" }}>
                          {
                            "* Invalid date format. Please use YYYY-MM-DD in line number(s) "
                          }
                          {invalidDates.map((i) => i.index + 1).join(",")}
                        </span>
                      )}
                    </Grid>
                    {/* duplciate lots error */}
                    {/* <Grid>
                        {duplicatedLotNos && (
                          <span style={{ color: "#D32F2F" }}>
                            * Duplicated lots are detected as below:
                          </span>
                        )}
                        <ul>
                          {duplicatedLotNos && Object.entries(duplicatedLotNos)
                            .filter(([_, indices]) => indices?.length > 1)
                            .map(([lotNo, indices], index) => (
                              <li key={index} style={{ color: "#D32F2F", marginLeft: "20px" }}>
                                <span style={{ color: "#D32F2F" }}>
                                  Lot No {lotNo} in line {indices.join(", ").replace(/,([^,]*)$/, " and$1")}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </Grid> */}
                    {/* null count error */}
                    <Grid>
                      {nullValuesCount.length > 0 && (
                        <span style={{ color: "#D32F2F" }}>
                          {
                            "* Empty values detected in the catalog file as below: "
                          }
                          <ul>
                            {nullValuesCount?.map((b, index) => (
                              <li
                                style={{ color: "#D32F2F", marginLeft: "20px" }}
                                key={index}
                              >
                                {`${b.nullCount} empty values found in line ${b.index} `}
                              </li>
                            ))}
                          </ul>
                          {/* *{nullValuesCount} Null values detected */}
                        </span>
                      )}
                    </Grid>
                  </Typography>
                )}

                <IconButton onClick={handleDeleteUploadedFile}>
                  <DeleteIcon
                    id={"deleteUploadedFile"}
                    sx={{
                      width: "34px",
                      height: "34px",
                      color: "rgba(0, 0, 0, 0.56)",
                    }}
                  />
                </IconButton>
              </Grid>
            )}
            <Typography color="error">{errorMessage}</Typography>
          </Box>
          {isSalesCodeExist && isUploaded && isUploadFailed && (
            <Grid mt={1}>
              <TextField
                variant="standard"
                fullWidth
                value={inputSalesCode}
                error={!inputSalesCode}
                helperText={!inputSalesCode && "Sales Code is required"}
                label="Sales Code"
                onChange={(e) => onSalesCodeChange(e.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {catalogueSerialNo && (
        <Box className={Styles.catalogueSerialNo}>
          <TextField
            disabled
            id="catalogueSerialNo"
            label="Catalogue Serial Number"
            value={catalogueSerialNo}
          />
        </Box>
      )}

      <Box className={Styles.buttongrid}>
        <Button size="large" variant="outlined" onClick={handleOnReset}>
          CANCEL
        </Button>
        {isUploadFailed && isUploaded ? (
          <Button
            size="large"
            variant="contained"
            // disabled={buttonClicked || (isSalesCodeExist && !inputSalesCode)
            //   ||
            //   (invalidBrokerCodes?.length > 0 ||
            //     nullValuesCount.length > 0 ||
            //     invalidDates.length > 0 ||
            //     (Object.keys(invalidData)?.length > 0 &&
            //       (invalidData?.Break?.length > 0 ||
            //         invalidData?.ChestType?.length > 0 ||
            //         invalidData?.Elevation?.length > 0 ||
            //         invalidData?.Grade?.length > 0 ||
            //         invalidData?.SackType?.length > 0)) ||
            //     // duplicatedLotNos !== null ||
            //     irrelevantValueCount > 0)
            // }
            disabled={buttonClicked}
            onClick={
              errorAlertOpen
                ? handleUploadDifferentFile
                : handleSaveUploadCatalogue
            }
          >
            {errorAlertOpen ? "UPLOAD DIFFERENT FILE" : "SAVE"}
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            onClick={isUploaded ? importCSV : setFileEmptyError}
          >
            UPLOAD FILE
          </Button>
        )}
      </Box>

      {isUploadButtonClick && (
        <Dialog
          open={isUploadButtonClick}
          id="uploadFailedMessage"
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            borderRadius: "19px",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
              <br />
              Do you want to upload file for this
              <br />
              <b>
                Broker code : {selectedBrokerCode} , Broker Name :{" "}
                {selectedBrokerName}
              </b>{" "}
              ?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              id="confirmationMessage"
              size="large"
              variant="contained"
              onClick={handleConfirmationFile}
            >
              YES
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {isSuccess && (
        <Dialog
          open={isSuccess}
          id="uploadFailedMessage"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            borderRadius: "19px",
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <h3 id={"dialogHeading"}>{successDialogMessage}</h3>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
              <b>Successfully imported : {fileName}</b>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}

      {isError && (
        <Dialog
          open={isError}
          id="uploadFailedMessage"
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            borderRadius: "19px",
          }}
        >
          <DialogTitle id="alert-dialog-title" color="error">
            <h3 id={"dialogHeading"}>UPLOAD FAILED</h3>
          </DialogTitle>
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            color="primary"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description" color={"error"}>
              <b>Cannot proceed with the save process: {errorDialogMessage}</b>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              id="confirmationMessage"
              size="large"
              variant="contained"
              onClick={handleReUploadFile}
            >
              REUPLOAD
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
}

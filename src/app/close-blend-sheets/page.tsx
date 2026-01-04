'use client'
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import HeaderBar from "@/components/headerBar/headerBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppDispatch, RootState } from "@/redux/store";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Alert, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constant";
import ConfirmationMessage from "@/components/confirmationMessage/confirmationMessage";
import { BlendSheetTemplate } from "@/interfaces/blendSheet";

import CloseBlendSheetTable from "@/components/blendingSheetManagement/closeBlendSheetTable/closeblendSheetTable";
import { resetBlendingSheetFilter, resetCloseBlendSheetResponse, resetGetMasterBlendBalance, resetRequest, setBlendingSheetLimit, setBlendingSheetSearchText, setBlendingSheetStatus, setBlendSheetCurrentPage, setSelectedBlendSheets } from "@/redux/slice/closeBlendSheetSlice";
import { closeBlendSheets, getAllBlendSheets, getMasterBlendSheetDetails } from "@/redux/action/closeBlendSheetAction";
export default function BlendSheetApprovals() {
  const tableHeaderData = [
    {
      id: 'blendSHeetNo',
      column: 'Blend Sheet'
    },
    {
      id: 'Sales Code',
      column: 'Sales Code'
    },
    {
      id: 'Product Item Code',
      column: 'Product Item Code'
    },
    {
      id: 'Blend Item',
      column: 'Blend Item'
    },
    {
      id: 'Blend Date',
      column: 'Blend Date'
    },
    {
      id: 'PlannedQuantity',
      column: 'Blend Quantity'
    },
    {
      id: 'actualQuantity',
      column: 'Blend Planned Quantity'
    },
    {
      id: 'blendBalance',
      column: 'Blend Balance'
    },
    // {
    //   id: 'blendGain',
    //   column: 'Blend Gain'
    // },
    // {
    //   id: 'actualQuantity',
    //   column: 'Actual Quantity'
    // },
    // {
    //   id: 'Planned Quantity',
    //   column: 'Planned Quantity'
    // },
    {
      id: 'action',
      column: 'Actions'
    }

  ]

  const [openBlenSheet, setOpenSubMenu] = useState<Record<string, boolean>>({});
  const [openErrorMessage, setOpenErrorMessage] = useState<boolean>(false);
  const handleToggleBlendSheet = (title: string) => {
    setOpenSubMenu((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  const dispatch = useDispatch<AppDispatch>();
  const blendSheetListResponse = useSelector(
    (state: RootState) => state.closeBlendSheet.blendSheetListResponse,
  );

  const blendSheetListRequest = useSelector(
    (state: RootState) => state.closeBlendSheet.blendSheetListRequest,
  );
  const selectedBlendSheets = useSelector(
    (state: RootState) => state.closeBlendSheet.selectedBlendSheets
  )

  const closeBlendSheetResponse = useSelector(
    (state: RootState) => state.closeBlendSheet.closeBlendSheetResponse
  )

  const getMasterBlendSheetDetailsResponse = useSelector(
    (state: RootState) => state.closeBlendSheet.getMasterBlendSheetDetailsResponse
  )

  useEffect(() => {
    // const releaseStatus: BlendSheetStatus = {
    //   statusId: 2,
    //   statusName: 'Released',
    //   statusCode: "2"
    // }
    // dispatch(setBlendingSheetStatus(releaseStatus))
    dispatch(resetCloseBlendSheetResponse())
    dispatch(resetRequest())
    dispatch(getAllBlendSheets())

    return () => {
      dispatch(resetGetMasterBlendBalance())//hotfix-state-issue
    }
  }, [])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setBlendSheetCurrentPage(newPage));
    dispatch(getAllBlendSheets())
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBlendingSheetLimit(Number(event.target.value)));
    dispatch(setBlendSheetCurrentPage(1));
    dispatch(getAllBlendSheets())

  };

  useEffect(() => {
    if (closeBlendSheetResponse.isSuccess) {

      dispatch(resetBlendingSheetFilter())
      dispatch(getAllBlendSheets())
      dispatch(setSelectedBlendSheets([]))
    }
  }, [closeBlendSheetResponse])

  useEffect(() => {
    if (getMasterBlendSheetDetailsResponse.isSuccess) {
      //TODO
      const result = getMasterBlendSheetDetailsResponse.data
        .filter(item => item.blendSheets.some(sheet => !sheet.isSapClosed))
        .map(item => item.masterBlendSheetNo);
      if (result.length > 0) {
        setOpenErrorMessage(true)
        const filteredData = selectedBlendSheets.filter((item) => !result.includes(item.masterBlendSheetNo))

        dispatch(setSelectedBlendSheets(filteredData))
      }
    }
    if (getMasterBlendSheetDetailsResponse.hasError) {
      dispatch(setSelectedBlendSheets([]))

      setTimeout(() => {
        dispatch(resetGetMasterBlendBalance())
      }, 3000);
    }
  }, [getMasterBlendSheetDetailsResponse])
  const router = useRouter();

  // const onViewBlendSheet = (col: BlendSheet) => {
  //   dispatch(setSelectedBlendSheet(col))
  //   router.push(`blending-sheet/${col.blendItemId}`)

  // };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(setSelectedBlendSheets(selectedBlendSheets.concat(blendSheetListResponse.data.data)))
      dispatch(getMasterBlendSheetDetails())
    } else {

      const selectedRowsSet = new Set(blendSheetListResponse.data.data?.map(row => row.blendItemId));
      const filteredData = selectedBlendSheets.filter((item) => !selectedRowsSet.has(item.blendItemId))
      dispatch(setSelectedBlendSheets(filteredData))
    }
  };

  const handleSelectBlendSheet = (isChecked: boolean, blendSheet: BlendSheetTemplate) => {
    if (isChecked) {
      dispatch(setSelectedBlendSheets(selectedBlendSheets.concat(blendSheet)))
      handleToggleBlendSheet(blendSheet.blendItemId)
      dispatch(getMasterBlendSheetDetails())
    } else {
      const filteredData = selectedBlendSheets.filter((item) => item.blendItemId !== blendSheet.blendItemId)
      dispatch(setSelectedBlendSheets(filteredData))
    }
  };

  const confirmCloseBlendSheets = () => {
    if (selectedBlendSheets?.length > 0) {
      dispatch(closeBlendSheets())
    }
  }
  const cancelCloseBlendSheets = () => {

    dispatch(setSelectedBlendSheets([]))
    dispatch(setBlendingSheetStatus(null))
    dispatch(setBlendSheetCurrentPage(1))
    dispatch(getAllBlendSheets())
    dispatch(resetCloseBlendSheetResponse())
    router.push(`${ROUTES.BLENDING_SHEETS}`)
  }

  const closeErrorMessage = () => {
    setOpenErrorMessage(false)
    dispatch(resetGetMasterBlendBalance()) //hotfix-state-issue
  }
  const breadcrumbs = [
    {
      id: 1,
      link: 'Blend Sheets',
      route: ROUTES.BLENDING_SHEETS,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]
  const handleOnSearch = (value: string) => {
    dispatch(setBlendingSheetSearchText(value))
    dispatch(getAllBlendSheets())
  };
  return (
    <main>

      <CatalogueManagementHeader
        title={'Close Blend Sheets'}
        breadcrumbs={breadcrumbs}
      // component={!isCloseSheetEnabled && createButton}
      />

      <Grid m={2}>

        <Grid item xs={12} md={12} lg={12} p={1} pb={0}>
          <TextField
            placeholder="Quick Search"
            fullWidth
            size="small"
            onChange={(e: { target: { value: string } }) =>
              handleOnSearch(e.target.value)
            }
            value={blendSheetListRequest?.search || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {(closeBlendSheetResponse.hasError || getMasterBlendSheetDetailsResponse.hasError) && (
          <Alert
            variant="filled"
            severity="error"
            sx={{ marginBottom: 3, fontWeight: "400", borderRadius: "16px" }}
          >
            {closeBlendSheetResponse?.message || getMasterBlendSheetDetailsResponse?.message || 'error in API'}
          </Alert>
        )}
        <CloseBlendSheetTable
          tableData={blendSheetListResponse.data.data}
          tableHeaderData={tableHeaderData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          page={blendSheetListRequest?.page || 0}
          rowsPerPage={blendSheetListRequest?.limit || 0}
          tableRowCount={blendSheetListResponse.data.totalCount}
          tableDataIsLoading={blendSheetListResponse.isLoading}
          // onView={onViewBlendSheet}
          selectedRows={selectedBlendSheets}
          handleSelectAll={handleSelectAll}
          handleSelectBlendSheet={handleSelectBlendSheet}
          handleToggleBlendSheet={handleToggleBlendSheet}
          openBlendSheet={openBlenSheet}
          getMasterBlendSheetDetailsResponse={getMasterBlendSheetDetailsResponse.data}
          getMasterBlendSheetDetailsResponseIsLoading={getMasterBlendSheetDetailsResponse.isLoading}
        />
      </Grid>
      <Grid m={2} justifyContent={"end"} display={"flex"}>
        <Button variant="outlined"
          onClick={cancelCloseBlendSheets}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button variant="contained"
          onClick={confirmCloseBlendSheets}
          disabled={selectedBlendSheets?.length <= 0}>
          Close Blend Sheets
        </Button>
      </Grid>

      <ConfirmationMessage
        dialogTitle="SUCCEEDED"
        dialogContentText={
          <>
            {closeBlendSheetResponse?.data?.message && (
              <div>{closeBlendSheetResponse?.data?.message}</div>
            )}
          </>
        }
        open={closeBlendSheetResponse.isSuccess}
        onClose={cancelCloseBlendSheets}
        showCloseButton={true}
      />


      <ConfirmationMessage
        dialogTitle="ERROR"
        dialogContentText={
          <Typography color={"error"}>
            Blend Sheet cannot be closed as blend sheet versions are not closed.
          </Typography>
        }
        open={openErrorMessage}
        onClose={closeErrorMessage}
        showCloseButton={true}
        color={'error'}
      />

    </main>
  );
}

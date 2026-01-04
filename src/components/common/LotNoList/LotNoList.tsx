"use client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { ReactNode, useEffect, useState } from "react";
import AppPagination from "../AppPagination/AppPagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTeaLotDetails } from "@/redux/action/gradingAction";
import { getTeaLotDetailsById } from "@/redux/action/teaLotDetailsAction";
import SkeletonBar from "../Skeleton/skeleton";
import { API_MESSAGES } from "@/constant";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { setCurrentPage, setSearchText, setTabStatus } from "@/redux/slice/gradingSlice";
import { setIsEdit, setShowEditIcon, setIsLeaveOn, setLot, setDataList, setChecked, setDataListInitial, setCheckedList, setSearchLotValue } from "@/redux/slice/lotDetailsSlice";
import isEqual from "lodash/isEqual";
import ClearIcon from "@mui/icons-material/Clear";

interface LotNoListProps {
  children?: ReactNode;
  showIcon?: boolean;
  checkedFilterBuyingPlan?: boolean;
  onCheckedItemsChange?: (checkedItems: number[]) => void;
  height?: number;
  commonSelectable?: boolean
  secondaryText?: boolean
  isFromPurchasing?:boolean
}

export default function LotNoList({
  children,
  showIcon,
  checkedFilterBuyingPlan,
  onCheckedItemsChange,
  height,
  commonSelectable,
  secondaryText,
  isFromPurchasing
}: LotNoListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const lotDetails = useSelector((state: RootState) => state.grading.tableData.data);
  const isLoading = useSelector((state: RootState) => state.grading.tableData.isLoading);
  const hasError = useSelector((state: RootState) => state.grading.tableData.hasError);
  const catalogueDetails = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue);
  const isEdit = useSelector((state: RootState) => state.lotDetails.isEdit);
  const selectedLotId = useSelector((state: RootState) => state.lotDetails.selectedLot);
  const searchLotValue = useSelector((state: RootState) => state.grading.searchText);
  const currentPage = useSelector((state: RootState) => state.grading.currentPage)
  const lotDetailsChecked = useSelector((state: RootState) => state.lotDetails.isCheckedList)
  const tabStatus = useSelector((state: RootState) => state.grading.tabStatus)
  const isBuyingPlan = useSelector((state: RootState) => state.grading.isBuyingPlan)

  const editLotForm = useSelector((state: RootState) => state.lotDetails.lotDetailsForm)
  const editLotFormPersist = useSelector((state: RootState) => state.lotDetails.lotDetailsFormPersist)

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [pageValue, setPageValue] = useState<number>(1);

  const onRowClick = (
    lot: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (isEdit === true) {
      if (!isEqual(editLotForm, editLotFormPersist)) {
        dispatch(setIsLeaveOn(true));
      } else {
        dispatch(setIsEdit(false));
        dispatch(setShowEditIcon(true));
        dispatch(setLot(lot));
        dispatch(getTeaLotDetailsById());
        setSelectedIndex(index);
        dispatch(setShowEditIcon(true));
      }
    } else {
      dispatch(setLot(lot));
      dispatch(getTeaLotDetailsById());
      setSelectedIndex(index);
      dispatch(setShowEditIcon(true));
    }
  };

  useEffect(() => {
    // dispatch(setTabStatus(undefined));
    // dispatch(getTeaLotDetails());

    return () => {
      dispatch(setChecked(false))
      dispatch(setDataListInitial())
    }
  }, [catalogueDetails, tabStatus, dispatch]);

  //TODO: Check 2nd condition
  useEffect(() => {
    if (lotDetails.length > 0) {
      if (pageValue !== currentPage) {
        const firstLot = lotDetails?.map((i) => i.lotId)[0];
        dispatch(setLot(firstLot));
        setPageValue(currentPage)
        dispatch(getTeaLotDetailsById());
      }
    }
  }, [lotDetails, dispatch]);

  let sortedLots = checkedFilterBuyingPlan
    ? lotDetails
      .filter((item) => item.statusId === 3)
      .concat(lotDetails.filter((item) => item.statusId !== 3))
    : lotDetails;

  // function for checked one buying plan
  const handleCheck = (lotId: number) => {
    setCheckedItems((prev) =>
      prev.includes(lotId)
        ? prev.filter((id) => id !== lotId)
        : [...prev, lotId]
    );
  };

  // function for checked all buying plans
  const handleCheckAllBuyingPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const buyPlanLotIds = sortedLots
      .filter(item => item.statusId === 3) 
      .map(item => item.lotId);

    if (event.target.checked) {
      // Select all buying-plan lots
      setCheckedItems(buyPlanLotIds);
    } else {
      // Unselect all buying-plan lots 
      setCheckedItems(prev =>
        prev.filter(id => !buyPlanLotIds.includes(id))
      );
    }
  };

  useEffect(() => {
    if (!checkedFilterBuyingPlan) {
      setCheckedItems([]);
    }
  }, [checkedFilterBuyingPlan]);

  useEffect(() => {
    onCheckedItemsChange?.(checkedItems);
  }, [checkedItems, onCheckedItemsChange]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIsChecked = (lotId: number) => {

    if (lotDetailsChecked.includes(lotId) === false) {
      dispatch(setLot(lotId))
      dispatch(setChecked(false))
      dispatch(setCheckedList(lotId))
    } else {
      dispatch(setCheckedList(lotId))
      dispatch(setChecked(true))
    }
  }

  // const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     sortedLots.forEach(item => {
  //       dispatch(setCheckedList(item.lotId))
  //     });
  //   } else {
  //     const selectedRowsSet = new Set(sortedLots?.map(row => row.lotId));
  //     const filteredData = lotDetailsChecked.filter((item) => selectedRowsSet.has(item))
  //     filteredData.forEach(item => {
  //       dispatch(setCheckedList(item))
  //     });
  //   }
  // }

  // new handleCheckAll function
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentPageLotIds = sortedLots.map(item => item.lotId);
    
    if (event.target.checked) {
      // Check all: Only add items that are not already checked
      currentPageLotIds.forEach(lotId => {
        if (!lotDetailsChecked.includes(lotId)) {
          dispatch(setCheckedList(lotId));
        }
      });
    } else {
      // Uncheck all: Only remove items that are currently checked
      currentPageLotIds.forEach(lotId => {
        if (lotDetailsChecked.includes(lotId)) {
          dispatch(setCheckedList(lotId));
        }
      });
    }
  }
  const onSearchLot = (lotSearchValue: string) => {
    dispatch(setSearchText(lotSearchValue))
    dispatch(setCurrentPage(0))
    dispatch(getTeaLotDetails());
  }
  
  return (
    <div>
      <TextField
        variant="standard"
        fullWidth
        value={searchLotValue}
        label="Search Lot"
        onChange={(e) => onSearchLot((e.target.value))}
        InputProps={{
          endAdornment: searchLotValue && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => onSearchLot('')}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {isLoading ? (
        <SkeletonBar />
      ) : hasError ? (
        <p>{API_MESSAGES.FAILED_GET}</p>
      ) : (
        <List
          subheader={
            <Box sx={{ display: "flex", alignItems: "center" }} style={{paddingLeft:'16px'}}>
              {commonSelectable && (
                <Checkbox
                  checked={
                    sortedLots.length > 0 &&
                    sortedLots.every((item) => lotDetailsChecked.includes(item.lotId))
                  }
                  indeterminate={
                    sortedLots.length > 0 &&
                    sortedLots.some((item) => lotDetailsChecked.includes(item.lotId)) &&
                    !sortedLots.every((item) => lotDetailsChecked.includes(item.lotId))
                  }
                  onChange={handleCheckAll}
                />
              )}
              {/* checkbox for select all buying plan */}
              {isFromPurchasing && isBuyingPlan && (
                <div style={{marginLeft:'-12px'}}>
                    <Checkbox
                      checked={
                        sortedLots
                          .filter(item => item.statusId === 3)
                          .every(item => checkedItems.includes(item.lotId))
                      }
                      indeterminate={
                        sortedLots.some(item =>
                          item.statusId === 3 && checkedItems.includes(item.lotId)
                        ) &&
                        !sortedLots
                          .filter(item => item.statusId === 3)
                          .every(item => checkedItems.includes(item.lotId))
                      }
                      onChange={handleCheckAllBuyingPlan}
                    />
                </div>
              )}

              <ListSubheader sx={{ fontWeight: "600", marginLeft:'10px'}} >Lot No.</ListSubheader>
            </Box>
          }
          sx={{ height: { height }, overflow: "auto", marginBottom: 4 }}
          disablePadding
        >
          {sortedLots && sortedLots.length === 0 && (
            <ListItem sx={{ justifyContent: 'center', fontWeight: "600", minHeight: '200px', borderTop: "1px solid #005893" }}>
              Lots are not available!
            </ListItem>
          )}
          {sortedLots?.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ borderBottom: "1px solid #ddd", padding: 0 }}
            >
              <ListItemButton
                sx={{
                  "&.Mui-selected": { backgroundColor: "#005893" },
                  "&.Mui-selected .MuiCheckbox-root, &.Mui-selected .MuiSvgIcon-root": {
                    color: "#ffffff",
                  },
                }}
                onClick={(e) => onRowClick(item.lotId, e, index)}
                selected={item.lotId === selectedLotId}
              >
                {checkedFilterBuyingPlan && showIcon && item.statusId === 3 && (
                  <Checkbox
                    edge="start"
                    checked={checkedItems.includes(item.lotId)}
                    onChange={() => handleCheck(item.lotId)}
                  />
                )}
                {commonSelectable && (
                  <Checkbox
                    edge="end"
                    checked={lotDetailsChecked.includes(item.lotId)}
                    onChange={() => handleIsChecked(item.lotId)}
                    sx={{
                      marginRight: 1,
                      ":hover": {
                        color: "#E0E0E0",
                      }
                    }}
                  />
                )}
                <ListItemText
                  primary={item.lotNo}
                  secondary={secondaryText ? item.boxNo : ""}
                  sx={{ display: 'flex', justifyContent: 'flex-start' }}
                />
                <Typography sx={{ alignContent: "right" ,ml: 7}}>
                  {item?.approval?.status === "REJECTED" ? ' Rejected' : ""}
                </Typography>
                {showIcon && item.statusId === 3 && (
                  <StarIcon
                    sx={{
                      width: "30px",
                      textAlign: "center",
                      color:
                        item.lotId === selectedLotId ? "#E0E0E0" : "#005893",
                    }}
                  />
                )}
                {showIcon && item.statusId === 4 && (
                  <ShoppingCartIcon
                    sx={{
                      width: "30px",
                      textAlign: "center",
                      color:
                        item.lotId === selectedLotId ? "#E0E0E0" : "#005893",
                    }}
                  />
                )}
                {showIcon && item.statusId === 5 && (
                  <LocalShippingIcon
                    sx={{
                      width: "30px",
                      textAlign: "center",
                      color:
                        item.lotId === selectedLotId ? "#E0E0E0" : "#005893",
                    }}
                  />
                )}
                {showIcon && item.statusId === 6 && (
                  <AddTaskIcon
                    sx={{
                      width: "30px",
                      textAlign: "center",
                      color:
                        item.lotId === selectedLotId ? "#E0E0E0" : "#005893",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <AppPagination />
      {children && <Box>{children}</Box>}
    </div>
  );
}

"use client";
import { DATE_FORMAT } from "@/constant";
import { GetTeaBoardReportDetail } from "@/interfaces/teaBoard";
import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

export interface TeaBoardBlendingSheetPrintProps {
  data: GetTeaBoardReportDetail | null;
  forStore: boolean;
}
export default function TeaBoardDownloadPdfView(
  props: TeaBoardBlendingSheetPrintProps
) {
  const { data, forStore } = props;

  const [currentTime, setCurrentTime] = useState<string>("");

  // Utility function for precise decimal rounding to 2 decimal places
  const roundTo2Decimals = (value: number) => {
    return Math.round(value * 100) / 100;
  };
  // Calculate total weight with exact precision using rounded bag counts
  const totalWeight =
    data?.lots?.reduce((acc, lot) => {
      const required = Number(lot?.requiredQuantity) || 0;
      const weight = Number(lot?.weightPerBag) || 0;

      if (!required || !weight) {
        return acc;
      }
      // Calculate actual weight using rounded bag count for consistency
      const bags = roundTo2Decimals(required / weight);
      const actualWeight = bags * weight;
      return acc + actualWeight;
    }, 0) || 0;

  // Calculate total value with exact precision using rounded bag counts
  const totalValue = data?.lots.reduce((accumulator, currentVal) => {
    const price = Number(currentVal.price) || 0;
    const required = Number(currentVal.requiredQuantity) || 0;
    const weight = Number(currentVal?.weightPerBag) || 0;

    if (!price || !required || !weight) {
      return accumulator;
    }

    const bags = roundTo2Decimals(required / weight);
    const actualWeight = bags * weight;
    const value = price * actualWeight;
    return accumulator + value;
  }, 0);
  // Calculate sum of bags with exact precision and proper rounding
  const sumOfNoOfBags =
    data?.lots?.reduce((sum, item) => {
      const { requiredQuantity = 0, weightPerBag } = item || {};
      if (!weightPerBag) return sum;

      // Calculate bags with proper decimal precision
      const bags = roundTo2Decimals(requiredQuantity / weightPerBag);
      return sum + bags;
    }, 0) || 0;
  // Calculate sum of required quantities with exact precision
  const sumOfRequiredQuantity =
    data?.lots?.reduce(
      (sum, item) => sum + (Number(item.requiredQuantity) || 0),
      0
    ) || 0;
  // const avgWeightPerKg = (totalWeight && totalBags) ? totalWeight / totalBags : 0;
  const avgWeightPerKg = (sumOfRequiredQuantity || 0) / (sumOfNoOfBags || 1);

  // Calculate blend balance totals with exact precision
  const totalBlendBalanceQty =
    data?.blendBalance?.reduce(
      (accumulator, currentVal) =>
        accumulator + (Number(currentVal.balanceQuantity) || 0),
      0
    ) || 0;

  const totalGainQty =
    data?.blendBalance?.reduce(
      (accumulator, currentVal) =>
        accumulator + (Number(currentVal.gainQuantity) || 0),
      0
    ) || 0;

  const totalSieveQty =
    data?.otherBlendItemList?.reduce(
      (accumulator, currentVal) =>
        accumulator + (Number(currentVal.quantity) || 0),
      0
    ) || 0;
  const totalTBoardBlendBalanceValue =
    [totalBlendBalanceQty, totalGainQty, totalSieveQty]?.reduce(
      (accumulator, currentVal) => accumulator + (currentVal || 0),
      0
    ) || 0;

  // Calculate blend balance value with exact precision
  const totalBlendBalanceValue =
    data?.blendBalance?.reduce((accumulator, currentVal, index) => {
      const otherBlendItem = data?.otherBlendItemList?.[index];
      const balanceQty = Number(currentVal.balanceQuantity) || 0;
      const gainQty = Number(currentVal.gainQuantity) || 0;
      const sieveQty = Number(otherBlendItem?.quantity) || 0;
      const blendPrice = Number(currentVal.blendPrice) || 0;

      const totalQuantity = balanceQty + gainQty + sieveQty;
      const value = blendPrice * totalQuantity;
      return accumulator + value;
    }, 0) || 0;
  // const sumOfQty =
  //   totalBlendBalanceQty !== undefined && totalWeight !== undefined
  //     ? totalBlendBalanceQty + totalWeight
  //     : 0;
  // Calculate totals with exact precision
  const sumOfQty = totalTBoardBlendBalanceValue + totalWeight;

  // Calculate total value with exact precision (no early toFixed)
  const sumOfVal = (totalValue || 0) + (totalBlendBalanceValue || 0);

  const blendBalanceCF = sumOfQty - (Number(data?.salesContractQuantity) || 0);

  // Calculate values with exact precision
  const sumOfValue =
    data?.lots?.reduce((sum, item) => {
      const required = Number(item.requiredQuantity) || 0;
      const price = Number(item.price) || 0;
      return sum + required * price;
    }, 0) || 0;

  const sumOfBlendBalanceValue =
    data?.blendBalance?.reduce((sum, item) => {
      const balanceQty = Number(item.balanceQuantity) || 0;
      const price = Number(item.blendPrice) || 0;
      return sum + balanceQty * price;
    }, 0) || 0;

  const sumOfBlendBalanceRequiredQty =
    data?.blendBalance?.reduce(
      (sum, item) => sum + (Number(item.balanceQuantity) || 0),
      0
    ) || 0;

  // Calculate average blend price with exact precision
  const totalValueForAvg = sumOfValue + sumOfBlendBalanceValue;
  const totalQuantityForAvg =
    sumOfRequiredQuantity + sumOfBlendBalanceRequiredQty;
  const avgBlendPricePerKg =
    totalQuantityForAvg > 0 ? totalValueForAvg / totalQuantityForAvg : 0;

  const safeNumber = (value: any) => {
    return value !== null && value !== undefined ? value : 0;
  };

  useEffect(() => {
    setCurrentTime(moment().format("YYYY-MM-DD HH:mm:ss"));
  }, []);

  return (
    <Grid container sx={{ padding: 3 }}>
      {/* Header */}
      {/* <Grid container className="header"> */}
      <Grid item lg={4} md={4} sm={4}>
        <Typography>Brew One</Typography>
        <Typography>{currentTime}</Typography>
      </Grid>
      <Grid item lg={4} md={4} sm={4} textAlign="center">
        <Typography>{process.env.NEXT_PUBLIC_CLIENT_NAME}</Typography>
        <Typography>
          BLEND SHEET AS AT {moment(data?.createdAt).format(DATE_FORMAT) ?? ""}
        </Typography>
      </Grid>
      <Grid item lg={4} md={4} sm={4} display="flex" justifyContent="flex-end">
        <Grid item lg={4} md={4} sm={4} m={1} p={1}>
          <Typography variant="subtitle2" color="black">
            {data?.approval?.status ?? "-"}
          </Typography>
        </Grid>
      </Grid>

      {/* Sub - Header */}
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center" mt={4}>
        CONTRACT NO
      </Grid>
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center" mt={4}>
        BUYER
      </Grid>
      <Grid item lg={2} md={2} sm={2} textAlign="center" mt={4}>
        STANDARD
      </Grid>
      <Grid item lg={2.8} md={2.8} sm={2.8} textAlign="center" mt={4}>
        QUANTITY TO BE EXPORTED
      </Grid>
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center" mt={4}>
        SHIPMENT DATE
      </Grid>

      <Grid item lg={0.5} md={0.5} sm={0.5} />
      <Grid item lg={11} md={11} sm={11}>
        <Divider
          sx={{
            padding: "2px",
            borderBottomWidth: 2.5,
            borderColor: "text.primary",
          }}
        />
      </Grid>
      <Grid item lg={0.5} md={0.5} sm={0.5} />

      {/* Sub - Header Detail*/}
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center">
        {data?.salesContractNo ?? "-"}
      </Grid>
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center">
        {data?.customerName ?? ""}
      </Grid>
      <Grid item lg={2} md={2} sm={2} textAlign="center">
        {data?.productDescription ?? ""}
      </Grid>
      <Grid item lg={2.8} md={2.8} sm={2.8} textAlign="center">
        {data?.salesContractQuantity
          ? data?.salesContractQuantity.toFixed(2)
          : "-"}
      </Grid>
      <Grid item lg={2.4} md={2.4} sm={2.4} textAlign="center">
        {moment(data?.dueDate).format("DD-MMM-YYYY") ?? ""}
      </Grid>

      {/* Other - Header Details*/}
      <Grid item lg={2.5} md={2.5} sm={2.5} mt={1}>
        <Typography variant="caption">
          BLEND NO - {data?.blendSheetNo ?? ""}{" "}
        </Typography>
      </Grid>
      <Grid item lg={0.5} md={0.5} sm={0.5} />
      <Grid item lg={3.5} md={3.5} sm={3.5} mt={1}>
        <Typography variant="caption">
          DATE OF COMMENCE -{" "}
          {moment(data?.orderDate).format("DD-MMM-YYYY") ?? ""}
        </Typography>
      </Grid>
      <Grid item lg={5.5} md={5.5} sm={5.5} />
      {!forStore && (
        <Grid item sm={4}>
          <Typography variant="caption" marginBlockStart={10}>
            {" "}
            AVERAGE BLEND PRICE PER KG &nbsp;&nbsp;{" "}
            {Number.isNaN(avgBlendPricePerKg)
              ? "-"
              : avgBlendPricePerKg
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
          </Typography>
        </Grid>
      )}
      {!forStore && <Grid item sm={1} />}
      <Grid item sm={4}>
        <Typography variant="caption" marginBlockStart={10}>
          TOTAL AVG WEIGHT PER PKG &nbsp;&nbsp;{" "}
          {Number.isNaN(avgWeightPerKg) ? "-" : avgWeightPerKg.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item sm={3} />
      {/* </Grid> */}

      {/* <Grid container className="body-content"> */}
      <TableContainer
        sx={{
          marginTop: "2px",
          "& .MuiTableCell-root": {
            fontSize: "11px",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  lineHeight: 1,
                  fontSize: "12px",
                  borderTop: "1px solid #000000",
                  borderBottom: "1px solid #000000",
                },
              }}
            >
              <TableCell width={20} align="left">
                SER NO
              </TableCell>
              <TableCell width={50} align="left">
                BOX NO
              </TableCell>
              <TableCell width={60} align="center">
                DATE OF SALE
              </TableCell>
              <TableCell width={20} align="center">
                SALE NO
              </TableCell>
              <TableCell width={50} align="center">
                BROKER-LOT
              </TableCell>
              <TableCell width={80} align="center">
                ESTATE NAME
              </TableCell>
              <TableCell width={10} align="center">
                INVOICE NO
              </TableCell>
              <TableCell width={50} align="center">
                GRADE
              </TableCell>
              <TableCell width={20} align="center">
                PACKING
              </TableCell>
              <TableCell width={20} align="right">
                WEIGHT (KG)
              </TableCell>
              {!forStore && (
                <TableCell width={40} align="right">
                  RATE PER KG
                </TableCell>
              )}
              {!forStore && (
                <TableCell sx={{ textAlign: "right" }} width={60}>
                  VALUE
                </TableCell>
              )}
              <TableCell width={20} align="center">
                STD
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.lots?.map((lot, index) => (
              <TableRow
                key={index}
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                  },
                }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="left">{lot.boxNo}</TableCell>
                <TableCell align="center">
                  {lot.salesDate
                    ? moment(lot.salesDate).format("DD-MMM-YYYY")
                    : "-"}
                </TableCell>
                <TableCell align="center">{lot.salesCode}</TableCell>
                <TableCell align="center">
                  {lot.brokerCode} {lot.lotNo}
                </TableCell>
                <TableCell align="center">{lot.estateName ?? "-"}</TableCell>
                <TableCell align="center">{lot.invoiceNo ?? "-"}</TableCell>
                <TableCell align="center">{lot.grade ?? "-"}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Box sx={{ minWidth: "40px", textAlign: "right" }}>
                      {lot.requiredQuantity && lot?.weightPerBag
                        ? roundTo2Decimals(
                            lot.requiredQuantity / lot.weightPerBag
                          ).toFixed(2)
                        : "0.00"}{" "}
                      {lot.chestType} &nbsp;
                    </Box>
                    <Box sx={{ minWidth: "50px", textAlign: "right" }}>
                      {lot?.weightPerBag ? lot.weightPerBag.toFixed(2) : "0.00"}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {lot.requiredQuantity && lot?.weightPerBag
                    ? (() => {
                        const bags = roundTo2Decimals(
                          lot.requiredQuantity / lot.weightPerBag
                        );
                        const actualWeight = bags * lot.weightPerBag;
                        return actualWeight.toFixed(2);
                      })()
                    : "0.00"}
                </TableCell>
                {!forStore && (
                  <TableCell align="right">
                    {lot.price
                      ? lot.price
                          ?.toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                      : "0.00"}
                  </TableCell>
                )}
                {!forStore && (
                  <TableCell align="right">
                    {(() => {
                      const price = Number(lot.price) || 0;
                      const required = Number(lot.requiredQuantity) || 0;
                      const weight = Number(lot?.weightPerBag) || 0;

                      if (!price || !required || !weight) return "0.00";

                      const bags = roundTo2Decimals(required / weight);
                      const actualWeight = bags * weight;
                      const value = price * actualWeight;
                      return value
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    })()}
                  </TableCell>
                )}
                <TableCell align="center">{lot.standardName ?? "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                },
              }}
            >
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell
                align="center"
                sx={{
                  paddingTop: "1px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    borderTop: "2px #000000 solid",
                  }}
                >
                  <Box sx={{ minWidth: "40px", textAlign: "right" }}>
                    {sumOfNoOfBags ? sumOfNoOfBags.toFixed(2) : "0.00"}
                  </Box>
                  <Box sx={{ minWidth: "50px", textAlign: "right" }}></Box>
                </Box>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderTop: "2px #000000 solid",
                  paddingTop: "1px",
                }}
              >
                {totalWeight ? totalWeight.toFixed(2) : "0.00"}
              </TableCell>
              {!forStore && <TableCell></TableCell>}
              {!forStore && (
                <TableCell
                  align="right"
                  sx={{
                    borderTop: "2px #000000 solid",
                    paddingTop: "1px",
                  }}
                >
                  {totalValue
                    ? totalValue
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    : "0.00"}
                </TableCell>
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* </Grid> */}

      {/* SFG part */}
      <Grid container mt={5} className="blend-balance">
        <Grid item sm={12} textAlign="left">
          Particulars of the SFG used
        </Grid>
        <Grid item sm={0.5} />
        <Grid item sm={11}>
          <TableContainer
            sx={{
              "& .MuiTableCell-root": {
                fontSize: "11px",
              },
            }}
          >
            <Table>
              <TableHead
                sx={{
                  "& .MuiTableCell-root": {
                    borderTop: "none",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    width={"15%"}
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    SFG BLEND DATE
                  </TableCell>
                  <TableCell
                    width={"15%"}
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    SFG B/NO
                  </TableCell>
                  <TableCell
                    width={"15%"}
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    BLEND QUANTITY
                  </TableCell>

                  <TableCell
                    width={"15%"}
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    STANDARD
                  </TableCell>
                  {!forStore && (
                    <TableCell
                      width={"15%"}
                      align="right"
                      sx={{
                        lineHeight: 1,
                        fontSize: "12px",
                        borderTop: "1px solid",
                      }}
                    >
                      AVERAGE PRICE
                    </TableCell>
                  )}
                  {!forStore && (
                    <TableCell
                      width={"15%"}
                      align="right"
                      sx={{
                        lineHeight: 1,
                        fontSize: "12px",
                        borderTop: "1px solid",
                      }}
                    >
                      VALUE
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                  },
                }}
              >
                {data?.blendItemList?.map((sfg, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {sfg.blendDate
                        ? moment(sfg.blendDate).format("DD-MMM-YYYY")
                        : "-"}
                    </TableCell>
                    <TableCell>{sfg?.blendSheetNo}</TableCell>
                    <TableCell align="right">
                      {sfg?.quantity ? sfg.quantity.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell align="right">
                      {sfg?.productDescription}
                    </TableCell>
                    {!forStore && (
                      <TableCell align="right">
                        {sfg?.price ? sfg.price.toFixed(2) : "0.00"}
                      </TableCell>
                    )}
                    {!forStore && (
                      <TableCell align="right">
                        {sfg?.price && sfg?.quantity
                          ? (sfg.price * sfg.quantity)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          : "0.00"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {data?.blendItemList && data?.blendItemList.length === 0 && (
                  <TableCell colSpan={10} align="center">
                    No SFG Balance
                  </TableCell>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Blend part */}
      <Grid container mt={5} className="blend-balance">
        <Grid item sm={12} textAlign="left">
          PARTICULARS OF THE BLEND BALANCES USED
        </Grid>
        <Grid item sm={0.5} />
        <Grid item sm={11}>
          <TableContainer
            sx={{
              "& .MuiTableCell-root": {
                fontSize: "11px",
              },
            }}
          >
            <Table>
              <TableHead
                sx={{
                  "& .MuiTableCell-root": {
                    borderTop: "none",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    BLEND DATE
                  </TableCell>
                  <TableCell
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    BLEND NO
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    BALANCE QTY
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    GAIN QTY
                  </TableCell>
                  {/* <TableCell
                    width={20}
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    PACKED QTY */}
                  {/* </TableCell> */}
                  <TableCell
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    SIEVE QTY
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    STANDARD
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    STORE
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      borderTop: "1px solid",
                    }}
                  >
                    QUANTITY SUM
                  </TableCell>
                  {!forStore && (
                    <TableCell
                      align="right"
                      sx={{
                        lineHeight: 1,
                        fontSize: "12px",
                        borderTop: "1px solid",
                      }}
                    >
                      BLEND PRICE
                    </TableCell>
                  )}
                  {!forStore && (
                    <TableCell
                      align="right"
                      sx={{
                        lineHeight: 1,
                        fontSize: "12px",
                        borderTop: "1px solid",
                      }}
                    >
                      BLEND VALUE
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                  },
                }}
              >
                {data?.blendBalance?.map((blend, index) => {
                  const otherBlendItem = data?.otherBlendItemList?.[index];
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {blend.blendDate
                          ? moment(blend.blendDate).format("DD-MMM-YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>{blend.blendSheetNo}</TableCell>
                      <TableCell align="right">
                        {blend?.balanceQuantity
                          ? blend?.balanceQuantity.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      <TableCell align="right">
                        {blend?.gainQuantity
                          ? blend?.gainQuantity.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      {/* <TableCell align="center">{"-"}</TableCell> */}
                      <TableCell align="right">
                        {otherBlendItem?.quantity
                          ? otherBlendItem.quantity.toFixed(2)
                          : "0.00"}
                      </TableCell>

                      <TableCell align="right">
                        {blend.productDescription}
                      </TableCell>
                      <TableCell align="center">{"-"}</TableCell>
                      <TableCell align="right">
                        {(
                          safeNumber(blend.balanceQuantity) +
                          safeNumber(blend.gainQuantity) +
                          safeNumber(otherBlendItem?.quantity)
                        ).toFixed(2)}
                      </TableCell>
                      {!forStore && (
                        <TableCell align="right">
                          {blend?.blendPrice
                            ? blend?.blendPrice.toFixed(2)
                            : "0.00"}
                        </TableCell>
                      )}
                      {!forStore && (
                        <TableCell align="right">
                          {(() => {
                            const balanceQty = safeNumber(
                              blend.balanceQuantity
                            );
                            const gainQty = safeNumber(blend.gainQuantity);
                            const sieveQty = safeNumber(
                              otherBlendItem?.quantity
                            );
                            const blendPrice = safeNumber(blend.blendPrice);

                            const totalQuantity =
                              balanceQty + gainQty + sieveQty;
                            const value = totalQuantity * blendPrice;
                            return value
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                          })()}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {data?.blendBalance && data.blendBalance.length === 0 && (
                  <TableCell colSpan={!forStore ? 10 : 8} align="center">
                    No Blend Balance
                  </TableCell>
                )}
                <TableRow>
                  <TableCell>TOTAL</TableCell>
                  <TableCell></TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {totalBlendBalanceQty ? totalBlendBalanceQty : 0.0}
                  </TableCell>
                  {/* <TableCell></TableCell> */}
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {totalGainQty ? totalGainQty.toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {totalSieveQty ? totalSieveQty : "0.00"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  ></TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {totalTBoardBlendBalanceValue
                      ? totalTBoardBlendBalanceValue.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  {!forStore && (
                    <TableCell
                      sx={{
                        borderTop: "2px #000000 solid",
                        paddingTop: "1px",
                      }}
                    ></TableCell>
                  )}
                  {!forStore && (
                    <TableCell
                      align="right"
                      sx={{
                        borderTop: "2px #000000 solid",
                        paddingTop: "1px",
                      }}
                    >
                      {totalBlendBalanceValue
                        ? totalBlendBalanceValue
                            ?.toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        : "0.00"}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow />
                <TableRow />
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: 1500,
                    },
                  }}
                >
                  {/* <TableCell></TableCell> */}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>TOTAL</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {sumOfQty ? sumOfQty.toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell></TableCell>
                  {!forStore && (
                    <TableCell
                      align="right"
                      sx={{
                        borderTop: "2px #000000 solid",
                        paddingTop: "1px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sumOfVal
                        ? sumOfVal
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        : "0.00"}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: 1500,
                    },
                  }}
                >
                  {/* <TableCell></TableCell> */}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>QUANTITY TO BE EXPORTED</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {data?.salesContractQuantity
                      ? data.salesContractQuantity.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  {!forStore && <TableCell colSpan={2}></TableCell>}
                </TableRow>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      fontWeight: 1500,
                    },
                  }}
                >
                  {/* <TableCell></TableCell> */}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>BLEND BALANCE C/F</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderTop: "2px #000000 solid",
                      paddingTop: "1px",
                    }}
                  >
                    {blendBalanceCF.toFixed(2)}
                  </TableCell>
                  {!forStore && <TableCell colSpan={2}></TableCell>}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item sm={0.5} style={{ marginTop: "1rem" }} />
        <Grid container mt={2} className="signature-content">
          <Grid item sm={6}>
            Remarks
          </Grid>
          <Grid item sm={6} />
          <Grid item sm={8}>
            {data?.remarks}
          </Grid>
          <Grid item sm={2} />
        </Grid>
        <Grid item sm={0.5} />
        <Grid container mt={2} className="signature-content">
          <Grid item sm={6}>
            WE HEREBY DECLARE THAT THE PARTICULARS GIVEN ABOVE ARE TRUE AND
            CORRECT
          </Grid>
          <Grid item sm={6} />
          <Grid item sm={8}>
            SIGNATURE OF THE EXPORTER :- _____________________________
            &nbsp;&nbsp; DATE :- ____________________
          </Grid>
          <Grid item sm={2} />
        </Grid>
      </Grid>
    </Grid>
  );
}

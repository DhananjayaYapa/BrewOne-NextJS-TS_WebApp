import { Box, Button, CircularProgress, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import LotNoList from '../common/LotNoList/LotNoList'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentPage, setTabStatus } from '@/redux/slice/gradingSlice';
import { resetLot } from '@/redux/slice/lotDetailsSlice';
import * as htmlToImage from 'html-to-image';
import jsPDF from "jspdf";
import { CATALOGUE_STATUS, PAYMENT_TYPES } from '@/constant';
import { getTeaLotDetails } from '@/redux/action/gradingAction';
import dayjs from 'dayjs';

export default function CreateConfirmationNote() {
    const dispatch = useDispatch<AppDispatch>()
    const catalogueData = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue)
    const lotDetailsLoading = useSelector((state: RootState) => state.lotDetails.isLoading);
    const lotDetailsList = useSelector((state: RootState) => state.grading.tableData.data)
    const lotDetailsChecked = useSelector((state: RootState) => state.lotDetails.isCheckedList)

    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const pdfRef = useRef(null)

    useEffect(() => {
        dispatch(setCurrentPage(0))
        dispatch(setTabStatus(`${CATALOGUE_STATUS.PLANNED.toString()},${CATALOGUE_STATUS.PLANNED_GENERATED_PO.toString()},
        ${CATALOGUE_STATUS.DELIVERY_ORDER_CREATED.toString()},${CATALOGUE_STATUS.DELIVERY_ORDER_COMPLETED.toString()}`))
        dispatch(resetLot())

        dispatch(getTeaLotDetails())
    }, []);

    const printCreated = () => {
        setIsPrintClicked(true);
        setTimeout(() => {
            window.print();
            setIsPrintClicked(false);
        });
    };

    const onDownloadButtonClick = async () => {
        setIsPrintClicked(true);
        if (!pdfRef.current) {
            return
        }

        const content: HTMLElement = pdfRef.current;

        const originalGridTemplateColumns = content.getAttribute('style')
        try {
            // content.style.display = "grid";
            // content.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
            // content.style.gap = "2px";
            content.style.margin = "10px 10px";
            content.style.background = "#fff";
            content.style.width = "100%";
            content.style.height = "100%";
            content.style.maxWidth = "100vw"; // Ensures proper scaling

            const imgData = await htmlToImage.toCanvas(content, { quality: 1, pixelRatio: 5 });
            const pdf = new jsPDF("l", "mm", "a4");
            // Header text

            // A4 landscape dimensions
            const imgWidth = 297; // Full width of A4 in landscape
            const pageHeight = 210; // Full height of A4 in landscape
            const imgHeight = (imgData.height * imgWidth) / imgData.width; // Maintain aspect ratio

            let heightLeft = imgHeight;
            let position = 0;
            let additionalPageHeader = 0;

            const avoidBreakElements = content.querySelectorAll(".payment-option-container");

            let totalAvoidBreakHeight = 0;

            avoidBreakElements.forEach(element => {
                totalAvoidBreakHeight += element.getBoundingClientRect().height;
            });

            // Add the first page
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position + 10 + additionalPageHeader, imgWidth, imgHeight);
                additionalPageHeader += 10;
                heightLeft -= pageHeight;
            }

            pdf.save(`${catalogueData.catalogSerialNumber} confirmation-note`);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            if (originalGridTemplateColumns !== null) {
                content.setAttribute('style', originalGridTemplateColumns);
            } else {
                content.removeAttribute('style');
            }

            setIsPrintClicked(false);
        }
    }


    return (
        <>
            <style jsx global>{`
       @media print {
        body * {
            visibility: hidden;
            }

        table {
            // border: 2px solid #FF0000;
            overflow: visible;
            }

        .print-only, .print-only * {
            visibility: visible !important;
            }

            // ABOVE FIXED

        .print-only {
            display: flex;
            height: auto !important;
            margin: 0 !important;
            padding: 0;

            position: absolute !important;
            top:0 !important;
            left: 0 !important;
            page-break-before: auto !important;
            page-break-inside: avoid !important;
            }

         .print-wrapper {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            page-break-before: always !important;
            background-color: black !important;
            }

        // .print-only > * {
        //     page-break-inside: avoid !important;
        //     }

         .payment-option-container{
            page-break-inside: avoid !important;
            }

        .no-print{
            visibility: hidden !important;
            }

             @page {
                size: letter landscape;
            }

            html, body {
                width: 100%;
                height: auto;
            }
        }
      `}</style>
            <Grid container className='print-wrapper'>
                <Grid item lg={3} md={3} sm={3}>
                    <LotNoList
                        commonSelectable={true}
                        secondaryText={true}
                        height={280} />
                </Grid>
                <Grid item lg={9} md={9} sm={9}>
                    <Grid item xs={12} lg={12} textAlign='right'>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 5 }}
                            disabled={lotDetailsList.length === 0}
                            onClick={onDownloadButtonClick}>
                            {isPrintClicked && (
                                <CircularProgress size="12px" sx={{ color: 'white', marginRight: '10px' }} />
                            )}
                            Download
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 5 }}
                            disabled={lotDetailsList.length === 0}
                            onClick={printCreated}>
                            Print Confirmation Note
                        </Button>
                    </Grid>
                    {lotDetailsLoading && (
                        <Grid item xs={12} md={12} lg={12} xl={12} mt={5} alignContent={'center'} justifyItems={'center'}>
                            <Skeleton animation="wave" variant="rectangular" width="80%" height="20rem" />
                        </Grid>
                    )}
                    {!lotDetailsLoading && lotDetailsList.length < 1 === true && (
                        <Grid item xs={12} md={12} lg={12} xl={12}
                            alignContent={'center'} m={3}
                            justifyItems={'center'}
                            sx={{ border: '1px solid #000000' }}>
                            <Typography gutterBottom variant="body2">
                                Please select a lot
                            </Typography>
                        </Grid>
                    )}
                    {lotDetailsList.length > 0 && (
                        <Grid item lg={12} md={12} sm={12} xl={12}
                            sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Grid container m={5} justifySelf={'center'} spacing={1}
                                // sx={{ width: 280, height: 165, border: '1px solid #000000' }}
                                ref={pdfRef} className={isPrintClicked ? "print-only" : "no-print"}
                            >
                                <Grid item lg={4} md={4} sm={4}>
                                    <Typography>Brew One</Typography>
                                    <Typography>From: {catalogueData.brokerName}</Typography>
                                    <Typography>To: {process.env.NEXT_PUBLIC_CLIENT_NAME}</Typography>
                                    <Typography mt={6}>The following are for our accounts-</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} sx={{ textAlign: 'center' }}>
                                    <Typography>{process.env.NEXT_PUBLIC_CLIENT_NAME}</Typography>
                                    <Typography> Confirmation Note </Typography>
                                    <Typography mt={5} > Date of Sales: {catalogueData.salesDate.toLocaleString().split(" ")[0]} - {catalogueData?.salesCode} - {catalogueData.brokerCode}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} mt={4} sx={{ textAlign: 'center' }}>
                                    <Typography> Original </Typography>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12}>
                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Box No</TableCell>
                                                    <TableCell>Lot No</TableCell>
                                                    <TableCell>Estate Name</TableCell>
                                                    <TableCell>Inv.No</TableCell>
                                                    <TableCell>Grade</TableCell>
                                                    <TableCell>Chests</TableCell>
                                                    <TableCell>Weight</TableCell>
                                                    <TableCell>M/Buyer</TableCell>
                                                    <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>Net Qty</TableCell>
                                                    <TableCell sx={{ width: "auto", whiteSpace: "nowrap" }}>Price Kg</TableCell>
                                                    <TableCell>Value</TableCell>
                                                    <TableCell>Standard</TableCell>
                                                    <TableCell>Contract No</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {lotDetailsList.map((lot, key) => (
                                                    lotDetailsChecked.includes(lot.lotId) && (
                                                        <TableRow
                                                            key={lot.lotId}
                                                            sx={{ '& .MuiTableCell-root': { fontSize: 13, fontWeight: 500 }, '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row"> {lot.boxNo ?? "-"} </TableCell>
                                                            <TableCell>{lot.lotNo}</TableCell>
                                                            <TableCell>{lot.estateName ?? "-"}</TableCell>
                                                            <TableCell>{lot.invoiceNo ?? "-"}</TableCell>
                                                            <TableCell>{lot.gradeCode ?? "-"}</TableCell>
                                                            <TableCell>{lot.bagCount} {lot.chestTypeName}</TableCell>
                                                            <TableCell>{lot.weightPerBag?.toFixed(2)}</TableCell>
                                                            <TableCell width={20}>{lot.buyer ?? "-"}</TableCell>
                                                            <TableCell>{lot.netQuantity?.toFixed(2)}</TableCell>
                                                            <TableCell>{lot.price}</TableCell>
                                                            <TableCell>{lot.value?.toFixed(2)}</TableCell>
                                                            <TableCell>{lot.standardName ?? "-"}</TableCell>
                                                            <TableCell>{lot.contractNumber ?? "-"}</TableCell>
                                                        </TableRow>
                                                    )
                                                ))}
                                                <TableRow sx={{ '& .MuiTableCell-root': { fontSize: 13, fontWeight: 500, border: 0 } }}>
                                                    <TableCell colSpan={6}>
                                                        Total Lots: {lotDetailsChecked.length}
                                                    </TableCell>
                                                    <TableCell colSpan={2}>
                                                        Total Quantity:
                                                    </TableCell>
                                                    <TableCell style={{ borderTop: '2px solid #000000', borderBottom: '3px double #000000' }}>
                                                        {lotDetailsList.filter(i => lotDetailsChecked.includes(i.lotId))
                                                        .reduce((accumulator, currentVal) => accumulator + currentVal.netQuantity, 0)?.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell style={{ borderTop: '2px solid #000000', borderBottom: '3px double #000000' }}>
                                                        {lotDetailsList.filter(i => lotDetailsChecked.includes(i.lotId))
                                                        .reduce((accumulator, currentVal) => accumulator + currentVal.value, 0)?.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {/* <Grid item lg={12} md={12} sm={12} display='flex' justifyContent={'center'}>
                                        <div className='payment-option-container'>
                                            <Box m={3} p={3} justifyContent={"center"} gap={5} width={450}>
                                                <Box sx={{ border: '1px solid #000000' }} display={'flex'} flexWrap={'wrap'}>
                                                    <Typography width={100} variant={'subtitle2'} sx={{ borderRight: '1px solid', color: 'text.primary', borderBottom: '1px solid' }}>
                                                        Urgent DOs
                                                    </Typography>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                        {lotDetailsList.filter((lot) => lot.paymentTypeId === PAYMENT_TYPES.URGENT_DO).map((lot1, key) =>
                                                            lot1.contractNumber !== null ? (
                                                                <Typography key={key} sx={{ marginLeft: 5 }}>{lot1.contractNumber}</Typography>
                                                            ) : (
                                                                <Typography key={key} sx={{ marginLeft: 5 }}> N/A </Typography>
                                                            ))
                                                        }
                                                    </Box>
                                                </Box>
                                                <Box sx={{ border: '1px solid #000000' }} display={'flex'} flexWrap={'wrap'}>
                                                    <Typography width={100} variant={'subtitle2'} sx={{ borderRight: '1px solid', color: 'text.primary', borderBottom: '1px solid' }}>
                                                        10% - 90%
                                                    </Typography>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                        {lotDetailsList.filter((lot) => lot.paymentTypeId === PAYMENT_TYPES.OTHERS).map((lot1, key) =>
                                                            lot1.contractNumber !== null ? (
                                                                <Typography key={key} sx={{ marginLeft: 5 }}>{lot1.contractNumber}</Typography>
                                                            ) : (
                                                                <Typography key={key} sx={{ marginLeft: 5 }}> N/A </Typography>
                                                            ))
                                                        }
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </div>
                                    </Grid> */}

                                    <Grid item lg={12} md={12} sm={12} display='flex' justifyContent={'center'} p={2} m={2}>
                                        <Table sx={{ border: '1px solid black', width: '300px' }}>
                                            <TableHead>
                                                 <TableRow>
                                                    <TableCell sx={{ border: '1px solid black', maxWidth: '100px', width:'100px' }}>Payment Type </TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>Contract Number </TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>Total Values</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ border: '1px solid black', maxWidth: '100px', width:'100px' }}>Urgent DOs</TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>{lotDetailsList.filter(i => i.paymentTypeId === PAYMENT_TYPES.URGENT_DO && lotDetailsChecked.includes(i.lotId)).map(i => i.contractNumber ?? 'N/A').join(', ')}</TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>{lotDetailsList.filter(i => i.paymentTypeId === PAYMENT_TYPES.URGENT_DO 
                                                    && lotDetailsChecked.includes(i.lotId))
                                                    .reduce((accumulator, currentVal) => accumulator + currentVal.value, 0)?.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ border: '1px solid black' }}>10% and 90%</TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>{lotDetailsList.filter(i => i.paymentTypeId === PAYMENT_TYPES.OTHERS && lotDetailsChecked.includes(i.lotId)).map(i => i.contractNumber ?? 'N/A').join(', ')}</TableCell>
                                                    <TableCell sx={{ border: '1px solid black' }}>{lotDetailsList.filter(i => i.paymentTypeId === PAYMENT_TYPES.OTHERS 
                                                    && lotDetailsChecked.includes(i.lotId))
                                                    .reduce((accumulator, currentVal) => accumulator + currentVal.value, 0)?.toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid >
        </>
    )
}

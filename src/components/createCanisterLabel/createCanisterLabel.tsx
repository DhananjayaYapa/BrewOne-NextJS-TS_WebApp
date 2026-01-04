import { Button, CircularProgress, Grid, Skeleton, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import LotNoList from '../common/LotNoList/LotNoList'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentPage, setTabStatus } from '@/redux/slice/gradingSlice';
import { resetLot } from '@/redux/slice/lotDetailsSlice';
import * as htmlToImage from 'html-to-image';
import jsPDF from "jspdf";
import { CATALOGUE_STATUS } from '@/constant';
import { getTeaLotDetails } from '@/redux/action/gradingAction';

export default function CreateCanisterLabel() {
    const dispatch = useDispatch<AppDispatch>()
    const catalogueData = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue)
    const lotDetailsLoading = useSelector((state: RootState) => state.lotDetails.isLoading);
    const lotDetailsList = useSelector((state: RootState) => state.grading.tableData.data)
    
      const lotDetailsChecked = useSelector((state: RootState) => state.lotDetails.isCheckedList)
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const pdfRef = useRef(null)

    useEffect(() => {
        dispatch(setCurrentPage(0))
        dispatch(setTabStatus(`${CATALOGUE_STATUS.PLANNED_GENERATED_PO.toString()},
        ${CATALOGUE_STATUS.DELIVERY_ORDER_CREATED.toString()},
        ${CATALOGUE_STATUS.DELIVERY_ORDER_COMPLETED.toString()}`))
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
            content.style.display = "grid";
            content.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
            content.style.gap = "2px";
            content.style.background = "#fff";
            content.style.width = "100%";
            content.style.maxWidth = "722px"; // Ensures proper scaling

            const imgData = await htmlToImage.toCanvas(content, { quality: 1, pixelRatio: 5 }); // High-quality PNG
            const pdf = new jsPDF("p", "mm", "a4");
            // Header text

            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = imgData.height * imgWidth / imgData.width;

            let heightLeft = imgHeight;
            let position = 0
            let additionPageHeader = 0

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, "PNG", 0, position + 10 + additionPageHeader, imgWidth, imgHeight)
                additionPageHeader += 10
                heightLeft -= pageHeight
            }

            pdf.save(`${catalogueData.catalogSerialNumber} Canister-Labels.pdf`);

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

        .print-only, .print-only * {
            // display: block !important;
            visibility: visible !important;
            }

            // ABOVE FIXED

        .print-only {
            display: flex;
            height: auto !important;
            margin: 0 !important;
            padding: 0;

            // position:fixed;  /* align items to start - relative aligns to center - page break not works properly */
            position: absolute !important;  /* align items to center, changed from relative */
            top:0 !important;
            left: 0 !important;
            page-break-before: auto !important;
            page-break-inside: avoid !important;
            }

         .print-wrapper {
        //  width: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            page-break-before: always !important;

            background-color: black !important;
            }

        .print-only > * {
            // page-break-before: always !important;
            page-break-inside: avoid !important;
            }

        .print-only > .MuiGrid-container {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important; /* Ensure the items are spread */
            margin: 10px !important;
            padding: 0 !important;

            }

        .print-only > .MuiGrid-container > .MuiGrid-item {
            flex: 0 0 50% !important; /* Each item takes 0% width */
            max-width: 50% !important; /* Ensures no stacking */
            width: 7cm !important;  /* Set the width of each grid item to 7cm */
            height: 4cm !important; /* Set the height of each grid item to 4cm */
            box-sizing: border-box !important; /* Prevents overflow */
            }

        .no-print{
            visibility: hidden !important;
            }

             @page {
                size: A4;
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
                            Download Canister Label
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ marginRight: 5 }}
                            disabled={lotDetailsList.length === 0}
                            onClick={printCreated}>
                            Print Canister Label
                        </Button>
                    </Grid>
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
                    {lotDetailsLoading ? (
                        <Grid item xs={12} md={12} lg={12} xl={12} mt={5} alignContent={'center'} justifyItems={'center'}>
                            <Skeleton animation="wave" variant="rectangular" width="30%" height="12rem" />
                        </Grid>
                    ) :
                        <>
                            <Grid item lg={12} md={12} sm={12} xl={12} className={isPrintClicked ? "print-only" : "no-print"}
                                sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} ref={pdfRef}>
                                {lotDetailsList?.map((lot, key) => (
                                    lotDetailsChecked.includes(lot.lotId) && (
                                        <Grid
                                            container
                                            m={5}
                                            justifySelf={'center'}
                                            spacing={1}
                                            sx={{ width: 280, height: 165, border: '1px solid #000000' }}
                                            id={`${lot.lotId}-myNode`} key={key}
                                        >
                                            <Grid item lg={6} md={6} sm={6}>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Break: {lot.breakName ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" sx={{ fontSize: '10px', color: 'text.primary' }}>
                                                    Invoice No: {lot.invoiceNo ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Sales Code: {catalogueData.salesCode ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Standard: {lot.standardName ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Broker: {catalogueData.brokerName ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" sx={{ fontSize: '10px', color: 'text.primary' }}>
                                                    Price: {lot.price ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    No of Bags : {lot.bagCount ?? ""}
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6}>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Box Number: {lot.boxNo ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Contract No: {lot.contractNumber ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Sales Date: {catalogueData.salesDate.toString().split(' ')[0] ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Estate Name: {lot.estateName ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Lot Number : {lot.lotNo ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body1" sx={{ fontSize: '10px' }}>
                                                    Grade: {lot.gradeCode ?? ""}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" sx={{ fontSize: '10px', color: 'text.primary' }}>
                                                    Net Quantity: {lot.netQuantity ?? ""}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    )
                                ))}
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid>
        </>
    )
}

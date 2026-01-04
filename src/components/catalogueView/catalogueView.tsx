"use client"

import { Box, Grid } from "@mui/material"
import LotNoList from "../common/LotNoList/LotNoList"
import LotDetails from "../common/LotDetails/LotDetails"
import { getTeaLotDetails } from "@/redux/action/gradingAction"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { UserRolesInterface } from "@/constant"

export default function CatalogueView() {
    const dispatch = useDispatch<AppDispatch>();
    const catalogueDetails = useSelector((state: RootState) => state.catalogue.catalogueData.catalogue);

    useEffect(() => {
        dispatch(getTeaLotDetails());
    }, [catalogueDetails])

    return (
        <div>
            <Box>
                <Grid container>
                    <Grid item lg={3} xs={12} pr={{ xs: 0, lg: 2 }}>
                        <LotNoList height={400} />
                    </Grid>
                    <Grid item lg={9} py={2}>
                        <LotDetails />
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}
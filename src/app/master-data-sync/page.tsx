"use client"

import CatalogueManagementHeader from '@/components/catalogueManagementHeader/catalogueManagementHeader'
import HeaderBar from '@/components/headerBar/headerBar'
import { Alert, Button, CircularProgress, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { ROUTES } from '@/constant';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { resetMaserDataSyncState, setSelectedMasterDataType } from '@/redux/slice/masterDataSyncSlice';
import { getSyncMasterDataDetails, syncMasterData } from '@/redux/action/dataAction';
import moment from 'moment'

export default function MasterDataSync() {

    const dispatch = useDispatch<AppDispatch>();
    const masterSyncRes = useSelector((state: RootState) => state.masterDataSync.masterDataSyncResponse);
    const selectedMaster = useSelector((state: RootState) => state.masterDataSync.selectedMasterDataType)
    const getSyncMaster = useSelector((state: RootState) => state.masterDataSync.data)
    const getSyncMasterLoading = useSelector((state: RootState) => state.masterDataSync.isLoading)

    useEffect(() => {
        dispatch(getSyncMasterDataDetails())
    }, [])

    const breadcrumbs = [
        {
            id: 1,
            link: 'Master Data Sync',
            route: ROUTES.MASTER_DATA_SYNC,
            icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        },
    ]

    const fileDetails = [
        {
            id: 1,
            fileName: 'Item Master',
            key: 'item',
            updatedAt: '4/3/2025'
        },
        {
            id: 2,
            fileName: 'Broker Master',
            key: 'broker',
            updatedAt: '4/3/2025'
        },
    ]

    const onSyncClick = (value: string) => {
        dispatch(setSelectedMasterDataType(value))
        dispatch(syncMasterData())
    }

    useEffect(() => {
        if (masterSyncRes.isSuccess || masterSyncRes.hasError) {
            setTimeout(() => {
                dispatch(resetMaserDataSyncState())
                dispatch(getSyncMasterDataDetails())
            }, 2000);
        }
    }, [dispatch, masterSyncRes]);

    return (
        <main>

                <CatalogueManagementHeader
                    title={"Master Data Sync"}
                    breadcrumbs={breadcrumbs}
                    showBorder={false}
                />
                <Grid container>
                    <Grid item sm={12} xs={12} xl={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Master File</TableCell>
                                        <TableCell>Last Update</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getSyncMasterLoading && (
                                        <TableRow>
                                            <TableCell colSpan={3} align='center'>
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {(!getSyncMasterLoading && getSyncMaster) && Object.entries(getSyncMaster).map(([key, value], index) => (
                                        <TableRow key={index}>
                                            <TableCell>{key.split(/(?=[A-Z])/)[0].toUpperCase()}</TableCell>
                                            <TableCell>{value.updatedAt ? moment(value.updatedAt).format('YYYY-MM-DD HH.mm.ss') : '-'}</TableCell>
                                            <TableCell>
                                                <Tooltip title={`Sync ${key}`} placement='top-end'>
                                                    <Button variant='contained' sx={{ minHeight: '25', p: '10' }}
                                                        onClick={() => { onSyncClick(key.split(/(?=[A-Z])/)[0]) }}>
                                                        {(selectedMaster === key.split(/(?=[A-Z])/)[0]) && (masterSyncRes.isLoading) ? (
                                                            <CircularProgress size="20px" sx={{ color: 'white', marginRight: '10px' }} />
                                                        ) : 'Sync'}
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    {masterSyncRes.hasError === true && (
                        <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                            <Alert
                                variant="filled"
                                severity="error"
                                sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                            >
                                {masterSyncRes.message}
                            </Alert>
                        </Grid>
                    )}
                    {masterSyncRes.isSuccess === true && (
                        <Grid item xs={12} lg={12} display='flex' justifyContent='flex-end' textAlign={"center"} p={2}>
                            <Alert
                                variant="filled"
                                severity="success"
                                sx={{ marginBottom: 1, fontWeight: "400", borderRadius: "16px", width: "50%" }}
                            >
                                {masterSyncRes.message}
                            </Alert>
                        </Grid>
                    )}
                </Grid>

        </main >
    )
}

'use client'

import { AddLotFormNewDto } from '@/interfaces'
import { Box, Button, Grid, List, ListItem, ListItemButton, ListSubheader, Pagination, TablePagination, Tooltip } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

export interface CreateCatalogueTableProps {
    lotTable: AddLotFormNewDto[]
    handleLotNoForDelete(lotNo: string): void
    handleLotNoForEdit(lotNo: string): void
    resetLotForm(): void

    handleChangePage: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    tableRowCount: number;
}

export default function CreateCatalogueTable({
    lotTable,
    handleLotNoForDelete,
    handleLotNoForEdit,
    resetLotForm,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    tableRowCount,
}: CreateCatalogueTableProps) {
    return (
        <Box p={2}>
            <List
                subheader={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: '10px' }}>
                        <ListSubheader sx={{ fontWeight: "600" }}>Lot No000.</ListSubheader>
                        <Button onClick={resetLotForm}
                            variant="contained" sx={{ ml: 2, fontWeight: "600" }}>
                            Add New
                        </Button>
                    </Box>
                }
                sx={{ overflow: "auto", height: "300px", marginBottom: 4, border: "1px solid #005893", borderRadius: 1 }}
                disablePadding
            >

                {lotTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((item) => (
                    <ListItem key={item.lotNo} sx={{ fontWeight: "600", borderTop: "1px solid #005893" }}>
                        <ListItemButton onClick={() => { handleLotNoForEdit(item.lotNo) }}
                            sx={{ "&.Mui-selected": { backgroundColor: "#005893" }, display: 'flex', justifyContent: 'space-between' }}
                        >
                            {item.lotNo}
                        </ListItemButton>
                        <Tooltip title={`Delete - ${item.lotNo}`} placement='top-end'>
                            <DeleteIcon onClick={() => handleLotNoForDelete(item.lotNo)} />
                        </Tooltip>
                    </ListItem>
                ))}

                {lotTable.length === 0 && (
                    <ListItem sx={{ justifyContent: 'center', fontWeight: "600", minHeight: '200px', borderTop: "1px solid #005893" }}>
                        Lots are not available!
                    </ListItem>
                )}
            </List>
            <Grid
                container
                xs={12}
                md={12}
                lg={12}
                alignItems="center"
                justifyContent="center"
            >
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={6}
                    count={tableRowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Rows per page"
                    onPageChange={() => { }}
                    nextIconButtonProps={{ style: { display: "none" } }}
                    backIconButtonProps={{ style: { display: "none" } }}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}
                />
                <Pagination
                    count={Math.ceil(tableRowCount / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, newPage) => handleChangePage(null, newPage)}
                    showFirstButton
                    showLastButton
                    sx={{
                        "& .MuiPaginationItem-root": { fontWeight: "600", fontSize: "12px" },
                        "& > .MuiPagination-ul": {
                            justifyContent: 'center',
                        },
                    }}
                />
            </Grid>
        </Box >
    )
}
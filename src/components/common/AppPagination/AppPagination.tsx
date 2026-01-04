"use client"

import { getTeaLotDetails } from "@/redux/action/gradingAction";
import { setCurrentPage, setLimit, setTabStatus } from "@/redux/slice/gradingSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Stack, Pagination, TablePagination } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AppPaginationBar() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentPage, limit, totalPages, totalRowCount } = useSelector((state: RootState) => state.grading);

    useEffect(() => {
        // dispatch(setTabStatus(undefined))
        if (totalRowCount > 0 && totalPages > 0) {
            dispatch(getTeaLotDetails());
        }
    }, [currentPage, limit, dispatch]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        dispatch(setCurrentPage(newPage));
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setLimit(parseInt(event.target.value, 10)));
        dispatch(setCurrentPage(0));
    };
    return (
        <div>
            <Stack sx={{ flexDirection: "row", justifyContent: 'center', width: "100%", maxHeight: 20 }}>
                <Pagination
                    count={Math.ceil(totalRowCount / limit)}
                    page={currentPage + 1}
                    onChange={(event, page) => handleChangePage(null, page - 1)}
                    showFirstButton
                    showLastButton
                    sx={{ '& .MuiPaginationItem-root': { margin: '-2px', fontWeight: "600" } }}
                />
            </Stack>

            <Stack sx={{ flexDirection: "row", justifyContent: 'center', width: "100%", mt: 2 }}>
                <TablePagination
                    component="div"
                    count={totalRowCount}
                    page={currentPage}
                    onPageChange={(event, newPage) => handleChangePage(null, newPage + 1)}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Lots per page"}
                    sx={{
                        '& .MuiTablePagination-selectLabel': { fontSize: "12px", fontWeight: "400" },
                        '& .MuiTablePagination-displayedRows': { fontSize: "12px", fontWeight: "400" },
                        '& .MuiTablePagination-select': { fontSize: "12px", fontWeight: "400" },
                        '& .MuiIconButton-root': { padding: 0 },
                        '& .MuiSvgIcon-root': { fontSize: "20px", width: "20px" },
                        '& .MuiInputBase-root-MuiTablePagination-select': { padding: 0 },
                        '& .MuiTablePagination-actions button': { display: 'none' },
                    }}
                />
            </Stack>
        </div>
    )
}
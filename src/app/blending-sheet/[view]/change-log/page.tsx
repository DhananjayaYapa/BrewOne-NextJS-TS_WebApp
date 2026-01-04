'use client'
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import BlendingSheetChangeLogTable from "@/components/blendingSheetManagement/blendingSheet/blendingSheetChangeLogTable";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { ROUTES } from "@/constant";
import { resetBlendChangeLogsResponseById, setBlendChangeLogCurrentPage, setBlendChangeLogLimit, setBlendChangeLogVersions, setSelectedChangeLog, setSelectedChangeLogBlendId } from "@/redux/slice/editBlendSheetSlice";
import BlendingSheetChangeLogPopup from "@/components/blendingSheetManagement/blendingSheet/blendingSheetChangeLogPopup";
import { getAllBlendChangeLogs, getBlendChangeLogById } from "@/redux/action/editBlendSheetAction";
// import { Auth } from "@aws-amplify/auth";

// type Props = { params: { view: number } }

type Props = {
    params: { view: number }
    searchParams: { blend?: string };
}


export default function ChangeLog({ params, searchParams }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const blendChangeLogsResponse = useSelector(
        (state: RootState) => state.editBlendSheet.blendChangeLogsResponse)

    const blendChangeLogByIdResponse = useSelector(
        (state: RootState) => state.editBlendSheet.blendChangeLogsResponseById
    );

    const tableRowCount = useSelector(
        (state: RootState) => state.editBlendSheet.changeLogTotalCount
      );

    const rowsPerPage = useSelector(
        (state: RootState) => state.editBlendSheet.changeLogLimit
    );

    const totalPages = useSelector(
        (state: RootState) => state.editBlendSheet.changeLogTotalPages
    );

    const page = useSelector(
        (state: RootState) => state.editBlendSheet.changeLogCurrentPage
    );

    const [isOpen, setIsOpen] = useState(false)

    const onClickLog = (changeLog: number, changeLogVersion: number) => {
        dispatch(setSelectedChangeLog(changeLog))
        dispatch(setBlendChangeLogVersions(changeLogVersion))
        setIsOpen(true);
        dispatch(getBlendChangeLogById())
    }

    const breadcrumbs = [
        {
            id: 1,
            link: "Blending Sheets",
            route: "/blending-sheet",
            icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
        },
        {
            id: 2,
            link: `${searchParams.blend}`,
            route: `/${ROUTES.BLENDING_SHEETS}/${params.view}?mode=view`,
        },
        {
            id: 3,
            link: 'Change Logs',
            route: "",
        },
    ];

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        dispatch(setBlendChangeLogCurrentPage(newPage));
        dispatch(getAllBlendChangeLogs())
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setBlendChangeLogLimit(Number(event.target.value)));
        dispatch(setBlendChangeLogCurrentPage(0));
        dispatch(getAllBlendChangeLogs())
    };

    useEffect(() => {
        dispatch(setSelectedChangeLogBlendId(params.view))
        dispatch(getAllBlendChangeLogs());
    }, [])

    const handleClose = () => {
        setIsOpen(false);
        dispatch(resetBlendChangeLogsResponseById())
    }

    return (
        <main>
            <CatalogueManagementHeader
                title={'Blending Sheet Change Logs'}
                breadcrumbs={breadcrumbs}
                component={<></>}
            />
            <BlendingSheetChangeLogTable
                tableData={blendChangeLogsResponse.data.data}
                tableDataIsLoading={blendChangeLogsResponse.isLoading}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                tableRowCount={tableRowCount}
                totalPages={totalPages}
                onClickLog={onClickLog}
            />
            <BlendingSheetChangeLogPopup
                open={isOpen}
                logData={blendChangeLogByIdResponse.data}
                logDataIsLoading={blendChangeLogByIdResponse.isLoading}
                onClose={handleClose}
                dialogTitle={"Differences"}
            />
        </main>
    )
}



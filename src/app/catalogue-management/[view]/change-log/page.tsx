'use client'
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    params: { view: number }
    searchParams: { id?: string };
}

import CatalogueChangeLogTable from "@/components/catalogueManagement/changeLogs/CatalogueChangeLogTable";
import { ROUTES } from "@/constant";
import { useEffect, useState } from "react";
import { getAllCatalogueLogs, getCatalogueLogsById } from "@/redux/action/catalogueAction";
import { resetCatalogueChangeLogsByIdResponse, setCatalogueChangeLogCurrentPage, setCatalogueChangeLogLimit, setCatalogueChangeLogVersions, setCatalogueLotId, setSelectedChangeLogCatalogueId } from "@/redux/slice/catalogueSlice";
import CatalogueChangeLogPopup from "@/components/catalogueManagement/changeLogs/CatalogueChangeLogPopup";


export default function ChangeLog({ params, searchParams }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const catalogueChangeLogsResponse = useSelector((state: RootState) => state.catalogue.catalogueChangeLogResponse)
    const catalogueChangeLogsByIdResponse = useSelector((state: RootState) => state.catalogue.catalogueChangeLogsByIdResponse)

    const tableRowCount = useSelector((state: RootState) => state.catalogue.changeLogTotalCount);
    const rowsPerPage = useSelector((state: RootState) => state.catalogue.changeLogLimit);
    const totalPages = useSelector((state: RootState) => state.catalogue.changeLogTotalPages);
    const page = useSelector((state: RootState) => state.catalogue.changeLogCurrentPage);

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        dispatch(setSelectedChangeLogCatalogueId(params.view))
        dispatch(getAllCatalogueLogs())
    }, [])

    const breadcrumbs = [
        {
            id: 1,
            link: "Catalogue Management",
            route: "/catalogue-management",
            icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
        },
        {
            id: 2,
            link: `${searchParams.id}`,
            route: `/${ROUTES.CATALOGUE_MANAGEMENT}/${params.view}`,
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
        dispatch(setCatalogueChangeLogCurrentPage(newPage));
        dispatch(getAllCatalogueLogs())
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setCatalogueChangeLogLimit(Number(event.target.value)));
        dispatch(setCatalogueChangeLogCurrentPage(0));
        dispatch(getAllCatalogueLogs())
    };

    const onClickLog = (lotId: number, lotVersion: number) => {
        dispatch(setCatalogueLotId(lotId))
        dispatch(setCatalogueChangeLogVersions(lotVersion))
        setIsOpen(true);
        dispatch(getCatalogueLogsById())
    }

    const handleClose = () => {
        setIsOpen(false);
        dispatch(resetCatalogueChangeLogsByIdResponse())
    }

    return (
        <main>
            <CatalogueManagementHeader
                title={'Catalogue Change Logs'}
                breadcrumbs={breadcrumbs}
                component={<></>}
            />
            <CatalogueChangeLogTable
                tableData={catalogueChangeLogsResponse.data.data}
                tableDataIsLoading={catalogueChangeLogsResponse.isLoading}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                tableRowCount={tableRowCount}
                totalPages={totalPages}
                onClickLog={onClickLog}
            />
            <CatalogueChangeLogPopup
                open={isOpen}
                logData={catalogueChangeLogsByIdResponse.data}
                logDataIsLoading={catalogueChangeLogsByIdResponse.isLoading}
                onClose={handleClose}
                dialogTitle={"Differences"}
            />
        </main >
    )
}

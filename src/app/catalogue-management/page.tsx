'use client'
import CatalogueManagementHeader from "@/components/catalogueManagementHeader/catalogueManagementHeader";
import CatalogueFilter from "@/components/catalogueManagement/catalogueFilter/catalogueFilter";
import HeaderBar from "@/components/headerBar/headerBar";
import CatalogueTable from "@/components/catalogueManagement/catalogueTable/catalogueTable";
import { getCatalogues } from "@/redux/action/catalogueAction";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { resetFilter, setBrokerFilterValue, setCatalogueStatusFilterValue, setCurrentPage, setEndDateFilterValue, setLimit, setSalesFilterValue, setSearchText, setStartDateFilterValue } from "@/redux/slice/catalogueSlice";
import { Broker, CatalogueStatus, Sales } from "@/interfaces";
import { Button, Grid } from "@mui/material";
import { getBrokers } from "@/redux/action/brokerAction";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useRouter } from 'next/navigation';
import { getCatalogueStatusList } from "@/redux/action/dataAction";
import { Dayjs } from "dayjs";
import { FEATURES, ROUTES, UserRolesInterface } from "@/constant";
import Cookies from 'js-cookie';

export default function CatalogueManagement() {
  const tableHeaderData = [
    {
      id: 'salesCode',
      column: 'Sales Code'
    },
    {
      id: 'catSerialNo',
      column: 'Cat Serial No.'
    },
    {
      id: 'brokerCode',
      column: 'Broker Code'
    },
    {
      id: 'brokerName',
      column: 'Broker Name'
    },
    {
      id: 'salesYear',
      column: 'Sales Year'
    },
    {
      id: 'salesDate',
      column: 'Sales Date'
    },
    {
      id: 'status',
      column: 'Status'
    },
    {
      id: 'action',
      column: 'Action'
    }

  ]

  const [userRole, setUserRole] = useState<UserRolesInterface | undefined>(undefined);

  useEffect(() => {
    const roleFromCookie = Cookies.get('userRole') as UserRolesInterface | undefined;
    setUserRole(roleFromCookie);
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const catalogId = useSelector(
    (state: RootState) => state.catalogue.selectedCatalogueId,
  );

  const catalogues = useSelector(
    (state: RootState) => state.catalogue.tableData.data,
  );

  const brokers = useSelector(
    (state: RootState) => state.broker.data.brokerData,
  );

  const salesData = useSelector(
    (state: RootState) => state.catalogue.filterData.salesData,
  );

  const brokerForm = useSelector(
    (state: RootState) => state.catalogue.filterValues.brokerValue,
  );

  const salesForm = useSelector(
    (state: RootState) => state.catalogue.filterValues.salesCodeValue,
  );

  const statusList = useSelector(
    (state: RootState) => state.data.data.catalogueStatusList,
  );

  const catalogStatus = useSelector(
    (state: RootState) => state.catalogue.filterValues?.catalogueStatus,
  );

  const startDateValue = useSelector(
    (state: RootState) => state.catalogue.filterValues?.startDate,
  );

  const endDateValue = useSelector(
    (state: RootState) => state.catalogue.filterValues?.endDate,
  );

  useEffect(() => {
    dispatch(getCatalogues())
    dispatch(getBrokers())
    dispatch(getCatalogueStatusList())
  }, [])

  const handleOnSearch = (value: string) => {
    dispatch(setSearchText(value))
    dispatch(getCatalogues())
  };

  const handleOnCatalogueStatusChange = (value: CatalogueStatus[] | null) => {
    dispatch(setCatalogueStatusFilterValue(value))
  };


  const handleOnEndDateChange = (value: Dayjs | null) => {
    dispatch(setEndDateFilterValue(value?.toDate() || null))
  };

  const handleOnStartDateChange = (value: Dayjs | null) => {
    dispatch(setStartDateFilterValue(value?.toDate() || null))
  };
  const handleOnBrokerChange = (value: Broker | null) => {
    dispatch(setBrokerFilterValue(value))
  };

  const handleOnSalesCodeChange = (value: Sales | null) => {
    dispatch(setSalesFilterValue(value))
  };
  const tableRowCount = useSelector(
    (state: RootState) => state.catalogue.totalCount,
  );

  const rowsPerPage = useSelector(
    (state: RootState) => state.catalogue.limit,
  );

  const totalPages = useSelector(
    (state: RootState) => state.catalogue.totalPages,
  );
  const page = useSelector(
    (state: RootState) => state.catalogue.currentPage,
  );

  const startDate = useSelector(
    (state: RootState) => state.catalogue.filterValues.startDate,
  );

  const featureList = useSelector(
    (state: RootState) => state.auth.currentUserFeatureList
  )
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setCurrentPage(newPage));
    dispatch(getCatalogues())
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLimit(Number(event.target.value)));
    dispatch(setCurrentPage(0));
    dispatch(getCatalogues())

  };

  const handleOnApplyFilter = () => {
    dispatch(setCurrentPage(0))
    dispatch(getCatalogues())
  };

  const handleOnReset = () => {
    dispatch(setCurrentPage(0))
    dispatch(resetFilter())
    dispatch(getCatalogues())
  };

  const router = useRouter();

  const goToUploadPage = () => {
    dispatch(resetFilter());
    window.location.href = ROUTES.UPLOAD_CATALOGUE;
  };

  const goToCreatePage = () => {
    dispatch(resetFilter());
    window.location.href = ROUTES.CREATE_CATALOGUE;
  };

  const breadcrumbs = [
    {
      id: 1,
      link: 'Catalogue Management',
      route: ROUTES.CATALOGUE_MANAGEMENT,
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]

  const uploadButton = featureList?.includes(FEATURES.UPLOAD_CATALOG_FILE) ? (
    <Button
      size="large"
      variant="contained"
      color='primary'
      onClick={goToUploadPage}
      endIcon={<UploadFileIcon />}
    >
      UPLOAD NEW CATALOGUE
    </Button>
  ) : (<></>)

  const createButton = featureList?.includes(FEATURES.CREATE_CATALOG) ? (
    <Button
      size="large"
      variant="contained"
      color='primary'
      onClick={goToCreatePage}
      endIcon={<NoteAddIcon />}
    >
      CREATE NEW CATALOGUE
    </Button>
  ) : (<></>)

  return (
    <main>
      {/*  */}
      <CatalogueManagementHeader
        title={'Catalogue Management'}
        breadcrumbs={breadcrumbs}
        component={uploadButton}
        component1={createButton}
      />
      <CatalogueFilter
        onSearch={handleOnSearch}
        brokers={brokers}
        broker={brokerForm}
        onBrokerChange={handleOnBrokerChange}
        onSalesCodeChange={handleOnSalesCodeChange}
        sales={salesData}
        salesFilterValue={salesForm}
        onApplyFilter={handleOnApplyFilter}
        onReset={handleOnReset}
        catalogueStatusList={statusList}
        onEndDateChange={handleOnEndDateChange}
        onStartDateChange={handleOnStartDateChange}
        startDate={startDate || new Date()}
        onStateChange={handleOnCatalogueStatusChange}
        catalogStatus={catalogStatus}
        startDateValue={startDateValue}
        endDateValue={endDateValue} />
      <Grid m={2}>
        <CatalogueTable
          tableData={catalogues}
          tableHeaderData={tableHeaderData}
          tableRowCount={tableRowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalPages={totalPages}
        />
      </Grid>
    </main>
  );
}

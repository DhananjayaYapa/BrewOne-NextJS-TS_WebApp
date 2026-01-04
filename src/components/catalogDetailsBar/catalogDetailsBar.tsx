import { Catalogue } from "@/interfaces";
import { Grid, TextField, Typography, Link, Box, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CatalogueManagementHeader from "../catalogueManagementHeader/catalogueManagementHeader";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { ROUTES } from "@/constant";
import { useRouter } from "next/navigation";

type Props = { params: { view: number } }

export default function CatalogDetailsBar({ params }: Props) {
  const catalogueDetails = useSelector(
    (state: RootState) => state.catalogue.catalogueData.catalogue
  );

  const router = useRouter();

  const breadcrumbs = [
    {
      id: 1,
      link: "Catalogue Management",
      route: "/catalogue-management",
      icon: <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
    },
    {
      id: 2,
      link: catalogueDetails.catalogSerialNumber,
      route: "",
    },
  ];

  const goToHistoryLogsPage = () => {
    router.push(`${params.view}/${ROUTES.CHANGE_LOG}/?id=${catalogueDetails.catalogSerialNumber}`)
  };
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ padding: '20px' }}
    >
      <CatalogueManagementHeader
        title={"Catalogue Management"}
        breadcrumbs={breadcrumbs}
        showBorder={false}
        component={
          <Button
            size="large"
            variant="outlined"
            color='primary'
            sx={{ mr: 1 }}
            onClick={goToHistoryLogsPage}
          >
            CHANGE LOGS
          </Button>
        }
      />
      <Grid item xs={12} md={3} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }} >Catalogue serial number</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.catalogSerialNumber}
          type="text"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Broker Code</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.brokerCode}
          type="text"
          fullWidth
          disabled
        />

      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Broker Name</Typography>
        <Tooltip title={catalogueDetails.brokerName} placement="top">
          <TextField
            variant="standard"
            value={catalogueDetails.brokerName}
            type="text"
            fullWidth
            disabled
          />
        </Tooltip>

      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Sales Code</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.salesCode}
          type="text"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Sales Date</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.salesDate.toString().split(' ')[0]}
          type="text"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Status</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.statusName}
          type="text"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} md={2} lg={2} xl={2}>
        <Typography sx={{ color: "#005893" }}>Type</Typography>
        <TextField
          variant="standard"
          value={catalogueDetails.typeName}
          type="text"
          fullWidth
          disabled
        />
      </Grid>
    </Grid>
  );
}

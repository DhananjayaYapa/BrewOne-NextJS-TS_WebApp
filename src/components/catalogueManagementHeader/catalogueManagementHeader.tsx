"use client";

import {
  Box,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Typography,
} from "@mui/material";
import Link from "next/link";
export interface CatalogueManagementHeaderProps {
  title: string;
  breadcrumbs: {
    id: number;
    link: string | number | undefined;
    route: string;
    icon?: React.ReactNode;
  }[];
  component?: React.ReactNode;
  component1?: React.ReactNode;
  showBorder?: boolean;
}

export default function CatalogueManagementHeader(
  props: CatalogueManagementHeaderProps
) {
  const { title, breadcrumbs, component, component1, showBorder = true } = props;

  return (
    <Grid
      container
      justifyContent="center"
      my={1}
      p={2}
      borderBottom={showBorder ? "0.5px solid lightgrey" : "none"}
      boxShadow="none"
    >
      <Grid item xs={12} lg={6}>
        <Box
          display="flex"
          justifyContent="flex-start"
          flexDirection={"column"}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs?.map((item, index) => (
              item.route !== "" ? (
                <MuiLink
                  underline="hover"
                  color={"primary"}
                  key={item.id}
                  href={item.route}
                  component={Link}
                  scroll={false}
                >
                  {item?.icon}
                  {item.link}
                </MuiLink>
              ) : (
                <Typography color="inherit" key={item.id}>{item.link}</Typography>
              )
            ))}

          </Breadcrumbs>
          <Typography variant="h2">{title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Box display="flex" justifyContent={{ lg: "flex-end", md: "flex-end", xs: "flex-start" }} gap={2}>
          {component1}
          {component}
        </Box>
      </Grid>
    </Grid>
  );
}

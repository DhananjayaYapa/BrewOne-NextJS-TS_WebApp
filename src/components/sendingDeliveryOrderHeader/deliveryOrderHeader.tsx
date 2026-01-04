"use client";

import { Box, Grid, Breadcrumbs, Link, Typography } from "@mui/material";

export interface DeliveryOrderHeaderProps {
  title: string;
  breadcrumbs: {
    id: number;
    link: string;
    route: string;
    icon?: React.ReactNode;
  }[];
  component?: React.ReactNode;
  showBorder?: boolean;
}

export default function DeliveryOrderHeader(props: DeliveryOrderHeaderProps) {
  const { title, breadcrumbs, component, showBorder = true } = props;

  return (
    <Grid
      container
      justifyContent="center"
      my={1}
      p={2}
      borderBottom={showBorder ? "0.5px solid lightgrey" : "none"}
      boxShadow="none"
    >
      <Grid item lg={6}>
        <Box
          display="flex"
          justifyContent="flex-start"
          flexDirection={"column"}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs?.map((item, index) => (
              <Link
                underline="hover"
                color={index === breadcrumbs.length - 1 ? "primary" : "inherit"}
                key={item.id}
                href={item.route}
              >
                {item?.icon}
                {item.link}
              </Link>
            ))}
          </Breadcrumbs>
          <Typography variant="h2">{title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Box display="flex" justifyContent="flex-end">
          {component}
        </Box>
      </Grid>
    </Grid>
  );
}

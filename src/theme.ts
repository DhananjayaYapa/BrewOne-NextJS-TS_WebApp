"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { alignProperty } from "@mui/material/styles/cssUtils";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme({
  palette: {
    primary: {
      main: "#005893",
    },
    secondary: {
      main: "#005893",
    },
    error: {
      main: "#D32F2F",
    },
    success: {
      main: "#3BB357",
    },
    info: {
      main: "#fff",
    },
    action: {
      // disabled: '#848884', // color for disabled elements
      // disabledBackground: '#F5F5F5', // for disabled buttons, etc.
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: 28,
      fontWeight: 700,
      color: "#005893",
    },
    h2: {
      fontSize: 22,
      fontWeight: 500,
      color: "#005893",
    },
    h3: {
      fontSize: 18,
      fontWeight: 500,
      color: "#005893",
    },
    h4: {
      fontSize: 16,
      fontWeight: 700,
      color: "#005893",
    },
    h5: {
      fontSize: 14,
      fontWeight: 700,
      color: "#005893",
    },
    h6: {
      fontSize: 12,
      fontWeight: 400,
      color: "#005893",
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
      color: "#005893",
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 500,
      color: "#005893",
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      color: "#000000",
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
      color: "#005893",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "40px",
        },
        input: {
          '&.Mui-disabled': {
            WebkitTextFillColor: '#848884', // your custom disabled color
            color: '#848884', // fallback
          },
          
          '&::placeholder': {
            color: '#848884', // customize placeholder color here
            opacity: 1, // optional: ensure full opacity across browsers
          },
        },
      },
      
    },
    MuiTextField: {
      styleOverrides: {
        root: {
            '&.Mui-disabled': {
              color: '#848884',
              WebkitTextFillColor: '#848884 !important',
            },
        },
      },
    },


    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#B2BEB5", // Change label color
          '&.Mui-disabled': {
            color: '#848884',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {},
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: "primary",
            color: "#fff",
            borderRadius: "40px",
            whiteSpace: "nowrap"
          },
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            backgroundColor: "#fff",
            borderColor: "primary",
            borderRadius: "40px",
          },
        },
        {
          props: { variant: "text" },
          style: {
            borderRadius: "40px",
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            borderRadius: "4px",
            color: "#FFFFFF",
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            borderRadius: "4px",
            color: "#FFFFFF",
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            borderRadius: "4px",
            color: "#FFFFFF",
          },
        },
      ],
    },
    
    MuiAppBar: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundColor: "#FFFFFF", 
            color: "#005893", 
            boxShadow: "none",
            height: "80px",
            rightBorder: "none",
            leftBorder: "none",
            topBorder: "none",
            bottomBorder: "1px solid #005893", 
          },
        },
      ],
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          width: "506px",
          height: "76px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '4px',
          // width: '15%', 
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: '#848884 !important',
            WebkitTextFillColor: '#848884 !important',
          },
        },
        input: {
          '&.Mui-disabled': {
            WebkitTextFillColor: '#848884', // your custom disabled color
            color: '#848884', // fallback
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            WebkitTextFillColor: '#848884', // your custom disabled color
            color: '#848884', // fallback
          },
        },
      },
    },
  },
});

export default theme;

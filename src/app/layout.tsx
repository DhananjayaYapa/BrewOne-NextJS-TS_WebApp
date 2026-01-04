import type { Metadata } from "next";
import "./globals.scss";
import "../style/main.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { ReduxProvider } from "@/redux/provider";
import theme from "@/theme";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import HeaderBar from "@/components/headerBar/headerBar";
import HeaderWrapper from "@/components/headerWrapper/HeaderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AppRouterCacheProvider options={{ key: "css" }}>
            <ThemeProvider theme={theme}>
              <ConfigureAmplifyClientSide />
         
                <HeaderWrapper>
                  {children}
                </HeaderWrapper>

              

            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Brew One",
  description: "Tea Add-on",
};


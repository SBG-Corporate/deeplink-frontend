import React, { FC } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query'
import { createTheme } from "@mui/material/styles";
import { themeSettings } from '/app/themes/theme';
import { store } from '/app/store';
import { MessagesProvider } from '/app/context/messages';
import AppFetcher from './AppFetcher';
import '../app/themes/globals.css';


const ThemeComponent: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode) || "light";
  const theme = createTheme(themeSettings(themeMode));

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

const queryClient = new QueryClient()

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MessagesProvider>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <ThemeComponent>
              <CssBaseline />
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 5000,
                  // style: {
                  //   borderRadius: '10px',
                  //   background: '#333',
                  //   color: '#fff',
                  //   fontSize: '16px',
                  // },
                }}
              />
              <AppFetcher>
                <Component {...pageProps} />
              </AppFetcher>
            </ThemeComponent>
          </PersistGate>
        </MessagesProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
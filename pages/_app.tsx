import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { PersistGate } from 'redux-persist/integration/react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import {store,persistor} from '../store/store'; 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;

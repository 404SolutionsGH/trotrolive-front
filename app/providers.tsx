'use client';

export {}; // <-- Add this line at the top

import { Provider } from 'react-redux';
import { store } from './lib/store';
import WalletProvider from './wallet-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WalletProvider>
        {children}
      </WalletProvider>
    </Provider>
  );
}

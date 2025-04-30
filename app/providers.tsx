'use client';

export {}; // <-- Add this line at the top

import { Provider } from 'react-redux';
import { store } from './lib/store/index';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

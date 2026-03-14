import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

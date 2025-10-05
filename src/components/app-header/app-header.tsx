import React, { FC } from 'react';
import { AppHeaderUI } from '../../components/ui/app-header/app-header';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useSelector((state: RootState) => state.user?.name || '');

  return <AppHeaderUI userName={userName} />;
};

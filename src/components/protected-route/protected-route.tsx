import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

type ProtectedRouteProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean; // если true — доступ только неавторизованным
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const isAuthenticated = !!useSelector(
    (state: RootState) => state.user && state.user.name
  );

  // Если маршрут только для неавторизованных пользователей
  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Если маршрут защищён и пользователь не авторизован — редирект на логин
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

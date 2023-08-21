import { FC, PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';

const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

export default NavigationProvider;

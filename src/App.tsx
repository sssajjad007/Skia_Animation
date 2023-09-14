import React, { FC } from 'react';
import NavigationProvider from './navigation/NavigationProvider';
import { LineSlider } from 'LineSlider';
import { Liquid } from 'Liquid';

const App: FC = () => {
  return (
    <NavigationProvider>
      {/* <LineSlider /> */}
      <Liquid />
    </NavigationProvider>
  );
};
export default App;

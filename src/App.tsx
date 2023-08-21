import React, { FC } from 'react';
import NavigationProvider from './navigation/NavigationProvider';
import { LineSlider } from 'LineSlider';
const App: FC = () => {
  return (
    <NavigationProvider>
      <LineSlider />
    </NavigationProvider>
  );
};
export default App;

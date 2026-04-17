import { HomePage } from '@/components/home-page';
import React, { Suspense } from 'react';

const App: React.FC = () => {
  return <Suspense><HomePage /></Suspense>
};

export default App;

import React from 'react';
import UploadSection from './UploadSection';
import UploadedFilesList from './UploadedFilesList';
import './styles.css'
const App: React.FC = () => {
  return (
    <div className="app">
      <div className="main-content">
        <UploadSection />
        <UploadedFilesList />
      </div>
    </div>
  );
};

export default App;

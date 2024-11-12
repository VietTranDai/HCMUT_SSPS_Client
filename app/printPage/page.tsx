import React from 'react';
import UploadSection from './UploadSection';
import UploadedFilesList from './UploadedFilesList';
import './styles.css'


const App: React.FC = () => {
  return (
    <div className="app">
      <div className="main-content">
        <h1 className='Title'>IN TÀI LIỆU</h1>
        <UploadSection />
        <UploadedFilesList />
      </div>
    </div>
  );
};

export default App;

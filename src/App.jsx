import React, { useState } from 'react';
import Header from './Header';
import Tools from './Tools';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConverter, setSelectedConverter] = useState('');

  return (
    <div className="app">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        onConverterSelect={setSelectedConverter}
      />
      <main>
        <Tools searchTerm={searchTerm} selectedConverter={selectedConverter} />
      </main>
    </div>
  );
}

export default App;
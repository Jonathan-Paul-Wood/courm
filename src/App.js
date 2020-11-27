import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import TutorialDataService from './services/TutorialService';

function App() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getRecords();
  }, []);

  function getRecords() {
    const response = TutorialDataService.getAll();
    setRecords(response);
  }

  function handleAddRecord() {
    TutorialDataService.create({
      'title': 'lame',
      'description': 'stuff goes here now',
      'published': false,
    });
    getRecords();
  }

  return (
    <div className="App">
      <div>
        <button onClick={() => handleAddRecord()}>
          Add record
        </button>
      </div>
      <div>
        {records.length ? records.map((record, index) => {
          return (
            <div key={index}>
              <h1>{record.title}</h1>
              <p>{record.description}</p>
              <p>
                Status: {record.published ? 'Published' : 'Coming Soon'}
              </p>
            </div>
          )
        }) : <div>No Records</div>}
      </div>
    </div>
  );
}

export default App;

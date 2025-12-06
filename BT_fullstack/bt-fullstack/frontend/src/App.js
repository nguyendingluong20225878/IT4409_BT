import React from 'react';
import './App.css';
import StudentList from './components/StudentList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hệ Thống Quản Lý Học Sinh</h1>
      </header>
      <main className="App-main">
        <StudentList />
      </main>
    </div>
  );
}

export default App;


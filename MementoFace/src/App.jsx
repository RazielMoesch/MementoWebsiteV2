import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Demo from './components/Demo';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Login from './components/Login';
import HomePage from './components/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [knownPeople, setKnownPeople] = useState([])

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} />

      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<Demo knownPeople={knownPeople} setKnownPeople={setKnownPeople}/>} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/login"
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setError={setError}
                setIsLoading={setIsLoading}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

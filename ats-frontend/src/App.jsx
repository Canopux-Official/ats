import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import JobSeeker from './components/JobSeeker';
import JobRecruiter from './components/JobRecruiter';
import Pricing from './components/Pricing';
import Contact from './components/Contact';


function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/job" element={<JobSeeker />} />
        <Route path="/jobr" element={<JobRecruiter />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
  );
}

export default App;

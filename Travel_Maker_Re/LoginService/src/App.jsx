import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import IDLoginPage from "./pages/IDLoginPage";
import SignupAgreement from "./pages/SignupAgreement";
import Signup from './pages/Signup';
import FindPwd from './pages/FindPwd';
import PwdNext from './pages/PwdNext';
import ResetPwd from './pages/ResetPwd';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/id-login" element={<IDLoginPage />} />
        <Route path="/signup-agreement" element={<SignupAgreement />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/pwd-next" element={<PwdNext />} />
        <Route path="/resetpwd" element={<ResetPwd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import CreateJobOffer from "./pages/CreateJobOffer";
import PostLogin from "./pages/PostLogin";
import CompanyDashboard from "./pages/CompanyDashboard";
import JobOffers from "./pages/JobOffers";
import Applications from "./pages/Applications";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post-login" element={<PostLogin />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/job-offers/new" element={<CreateJobOffer />} />
            <Route path="/job-offers" element={<JobOffers />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

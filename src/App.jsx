import Home from "./pages/home";
import "./index.css";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/Navbar";
// import ForgotPassword from "./pages/ForgotPassword"
import Login from "./pages/login";
import Signup from "./pages/signup";
import LostItems from "./pages/lostItems";
import ReportLostItem from "./pages/reportLostItem";
import LostItemDetails from "./pages/details";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  // localStorage.clear();
  // localStorage.removeItem("userId");
  return (
    <BrowserRouter>
      <Navbar />
      <div className="bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportLostItem />} />
          <Route path="/items" element={<LostItems />} />
          <Route path="/details/:id" element={<LostItemDetails />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

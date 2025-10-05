import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import TopBusinesses from "./components/TopBusinesses";
import MapView from "./components/MapView";
import RegisterBusiness from "./components/RegisterBusiness";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessDetail from "./pages/BusinessDetail";
import CategoryPage from "./pages/CategoryPage";
import AllCategories from "./pages/AllCategories";
import "./App.css";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <Categories />
        <TopBusinesses />
        <MapView />
        <RegisterBusiness />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/business-registration" element={<BusinessRegistration />} />
            <Route path="/business/:businessId" element={<BusinessDetail />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
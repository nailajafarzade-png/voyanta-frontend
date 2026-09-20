import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./features/home/HomePage";
import MainLayout from "./components/layout/MainLayout";
import ProfilePage from "./features/profile/ProfilePage";
import TravelItineraryPage from "./features/planning/TravelItineraryPage";
import LocationsDiscovered from "./features/planning/LocationsDiscovered";
import YourFavorites from "./features/wishlist/YourFavorites";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/travel" element={<TravelItineraryPage />} />
          <Route path="/location" element={<LocationsDiscovered />} />
          <Route path="/favorites" element={<YourFavorites />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;

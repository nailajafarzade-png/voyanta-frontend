import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "./store";
import Header from "./components/Header";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;

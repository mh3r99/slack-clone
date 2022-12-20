import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App/App";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import { getAuth } from "firebase/auth";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { setLoggedUser } from "./store/features/userSlice";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(
          setLoggedUser({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
          })
        );
      }
    });

    return () => unsubscribed();
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default AppRoutes;

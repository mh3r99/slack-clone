import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { setLoggedUser } from "../../store/features/userSlice";
import Spinner from "../Spinner";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const auth = getAuth();

  console.log(isLoading);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setLoggedUser(user));
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;

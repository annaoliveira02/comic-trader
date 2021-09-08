import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import fakeapi from "../../services/fakeapi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(0);
  const [name, setName] = useState("");
  const [location, setLocation] = useState();
  const [rating, setRating] = useState();
  const token = JSON.parse(localStorage.getItem("@comictrader:token")) || "";

  const getId = () => {
    if (token) {
      const decoderId = jwtDecode(token);
      setUserId(decoderId.sub);
      fakeapi.get(`users/${userId}/`).then((response) => {
        setName(response.data.name);
        setLocation([response.data.state, response.data.country]);
        setRating(response.data.rating);
      });
    }
  };

  useEffect(() => {
    getId();
  }, [token]);

  const addRating = (data, config) => {
    fakeapi
      .patch(`users/${userId}`, data, config)
      .then((e) => {
        setRating(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <UserContext.Provider value={{ addRating, userId, name, location, rating }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
import { createContext, useContext, useEffect, useState } from "react";
import comic from "../../services/comic";
import fakeapi from "../../services/fakeapi";

export const ComicsContext = createContext();

export const ComicsProvider = ({ children }) => {
  // const [comicsOwned, setComicsOwned] = useState();
  // const [comicsWanted, setComicsWanted] = useState();
  const [comicsList, setComicsList] = useState([]);
  // const [id, setId] = useState(0);
  const [specificComic, setSpecificComic] = useState([]);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   updateUserComics();
  // }, []);
  // const config = { headers: { Authorization: `Bearer ${token}`}}
  // const userid = numseioquelá

  // const updateOwned = (userid, config) => {
  //   comic.get(`users/${userid}`, config).then((response) => {
  //     setComicsOwned(response.data.comics_owned);
  //     setComicsWanted(response.data.comics_wanted);
  //   });
  // };

  // const updateUserComics = () => {
  //   const token = localStorage.getItem("@comictrader:token");
  //   const userId = localStorage.getItem("@comictrader:userID");
  //   const config = { headers: { Authorization: `Bearer ${token}` } };
  //   fakeapi
  //     .get(`users/${userId}`, config)
  //     .then((response) => {
  //       setComicsOwned(response.data.comics_owned);
  //       setComicsWanted(response.data.comics_wanted);
  //     })
  //     .catch((e) => console.log(e));
  // };

  const addOwned = (userid, config) => {
    const comicsOwned = JSON.parse(
      localStorage.getItem("@comictrader:ownedList") || "[]"
    );
    const data = specificComic;
    fakeapi
      .patch(
        `users/${userid}`,
        { comics_owned: [...comicsOwned, data] },
        config
      )
      .then((e) => {
        console.log(data);

        localStorage.setItem(
          "@comictrader:ownedList",
          JSON.stringify([...comicsOwned, data] || [])
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addWanted = (userid, config) => {
    const comicsWanted = JSON.parse(
      localStorage.getItem("@comictrader:wantedList") || "[]"
    );
    const data = specificComic;
    fakeapi
      .patch(
        `users/${userid}`,
        { comics_wanted: [...comicsWanted, data] },
        config
      )
      .then((e) => {
        console.log(data);

        localStorage.setItem(
          "@comictrader:wantedList",
          JSON.stringify([...comicsWanted, data] || [])
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const removeOwned = (data, userid, config, item) => {
  //   const filteredOwned = comicsOwned.filter((comic) => comic.id !== item.id);
  //   data = filteredOwned;
  //   comic.patch(`users/${userid}`, data, config).then((e) => {
  //     setComicsOwned([filteredOwned]);
  //   });
  // };

  // const removeWanted = (data, userid, config, item) => {
  //   const filteredWanted = comicsWanted.filter((comic) => comic.id !== item.id);
  //   data = filteredWanted;
  //   comic.patch(`users/${userid}`, data, config).then((e) => {
  //     setComicsWanted([filteredWanted]);
  //   });
  // };

  const getComicsList = () => {
    setLoading(true);
    const url = {
      url: "http://comicvine.gamespot.com/api/issues/?api_key=bf2d39824c84c5c81e7f1adcabea036406aff8e9&format=json&sort=cover_date:desc",
    };
    comic
      .post("get-data/", url)
      .then((response) => {
        setComicsList(response.data.results);
        setLoading(false);
      })

      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const searchComics = (input) => {
    const url = {
      url: `https://comicvine.gamespot.com/api/search/?api_key=e0240c902e8c43c50db1c50099fe9aa9c328103c&format=json&query=${input}&resources=issue`,
    };
    comic
      .post("get-data/", url)
      .then((response) => {
        input.length < 1
          ? getComicsList()
          : setComicsList(response.data.results);
      })
      .catch((e) => console.log(e));
  };

  const getComic = (id) => {
    setLoading(true);

    const url = {
      url: `https://comicvine.gamespot.com/api/issue/4000-${id}/?api_key=e0240c902e8c43c50db1c50099fe9aa9c328103c&format=json`,
    };
    comic
      .post("get-data/", url)
      .then((response) => {
        setSpecificComic(response.data.results);
        setLoading(false);

        // setId(response.data.results.id);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <ComicsContext.Provider
      value={{
        // updateUserComics,
        addOwned,
        addWanted,
        // removeOwned,
        // removeWanted,
        // comicsOwned,
        // comicsWanted,
        getComicsList,
        searchComics,
        comicsList,
        loading,
        // setId,
        // id,
        getComic,
        specificComic,
      }}
    >
      {children}
    </ComicsContext.Provider>
  );
};

export const useComics = () => useContext(ComicsContext);

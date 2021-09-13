import React, { useEffect } from "react";
import {
  Image,
  ImageContainer,
  ComicBackground,
  DashboardComicContainer,
  ComicMainContainer,
  InfoContainer,
} from "./styles";
import { useState } from "react";
import { useComics } from "../../providers/comics";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  DashboardBackground,
  DashboardContainer,
} from "../../styles/globalComponents";
import fakeapi from "../../services/fakeapi";

function DashboardComic() {
  const [comicObject, setComicImage] = useState([]);
  // const [description, setDescrition] = useState();
  // const [image, setImage] = useState();
  const { getComic, id, specificComic, addWanted, addOwned } = useComics();
  const [ownerList, setOwnerList] = useState([]);

  const token = localStorage.getItem("@comictrader:token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const userId = localStorage.getItem("@comictrader:id");

  useEffect(() => {
    getComic(id);
  }, []);

  const updatingOwners = () => {
    fakeapi
      .get(`users`, config)
      .then((res) => {
        console.log(res.data);
        setOwnerList(res.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <DashboardBackground>
      <Header />
      {specificComic.aliases !== undefined && (
        <DashboardComicContainer>
          <ComicBackground
            style={{
              background: `url(${specificComic.image.small_url}) no-repeat center`,
              backgroundSize: "cover",
            }}
          >
            <div className="ComicBlackTop">
              <img
                src={specificComic.image.thumb_url}
                alt={specificComic.volume.name}
              />
              <h1>{specificComic.volume.name}</h1>
              <p>
                {specificComic.description !== null &&
                  (specificComic.description.includes("<h4>")
                    ? specificComic.description
                        .slice(0, specificComic.description.indexOf("<h4>"))
                        .replace(/<.*?>/g, " ")
                    : specificComic.description.replace(/<.*?>/g, " "))}
              </p>
              <div className="ComicButtons">
                <button onClick={() => addWanted(userId, config)}>
                  Eu quero
                </button>
                <button onClick={() => addOwned(userId, config)}>
                  Eu tenho
                </button>
              </div>
            </div>
          </ComicBackground>
          <InfoContainer>
            <div className="WhoHas">
              <h3>Quem tem esta HQ:</h3>
              <div>
                <button onClick={updatingOwners}>chama</button>
                {ownerList.map((owners, id) => (
                  <div>{owners.id}</div>
                ))}
              </div>
            </div>
            <div className="WhoWants">
              <h3>Quem também quer:</h3>
              <div></div>
            </div>
          </InfoContainer>
        </DashboardComicContainer>
      )}
      <Footer />
    </DashboardBackground>
  );
}

export default DashboardComic;

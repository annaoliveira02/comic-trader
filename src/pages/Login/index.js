import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { BlackTop, InitialBackground } from "../../styles/globalComponents";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import fakeapi from "../../services/fakeapi";
import { AnimationContainer, LoginBackground } from "./styles";
import { useAuth } from "../../providers/auth";
import { toast } from "react-toastify";

function Login() {
  const { setAuthenticated } = useAuth();
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("E-mail obrigatório")
      .matches(/^(.+)@(\S+)$/, "Digite um formato de email valido"),
    password: yup
      .string()
      .min(8, "Digite uma senha com 8 caracteres")
      .required("Senha Obrigatoria")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "uma letra maiuscula, uma letra minuscula e um numero"
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const history = useHistory();

  const onSubmitSignin = (data) => {
    fakeapi
      .post("login", data)
      .then((res) => {
        const { accessToken } = res.data;
        const userId = res.data.user.id;
        // setUserId(userId);
        localStorage.setItem("@comictrader:userID", userId);
        localStorage.setItem("@comictrader:token", accessToken);
        setAuthenticated(true);
      })

      .then((_) => {history.push("/main")})
      .catch((err) => toast.error('Oops! Algo deu errado'));
  };

  return (
    <InitialBackground>
      <BlackTop>
        <Header />
        <AnimationContainer>
          <LoginBackground>
            <h1>LOGIN</h1>
          </LoginBackground>
          <form onSubmit={handleSubmit(onSubmitSignin)}>
            <input {...register("email")} placeholder="Digite seu email" />
            <span>{errors.email?.message}</span>
            <input
              {...register("password")}
              type="password"
              placeholder="Digite sua senha"
            />
            <span>{errors.password?.message}</span>
            <button type="submit">Entrar</button>
            <p>
              Não tem um cadastro? Faça seu <Link to="/signup">registro</Link>!
            </p>
          </form>
        </AnimationContainer>
        <Footer />
      </BlackTop>
    </InitialBackground>
  );
}

export default Login;

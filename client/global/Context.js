import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
React.useLayoutEffect = React.useEffect;

const initialState = {
  user: null,
  courses: null,
  pageLoading: false,
};

// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "LOADING":
      return { ...state, pageLoading: action.payload };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = token;
        }
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (err) {
      const res = err.response;
      if (
        res &&
        res.status === 401 &&
        res.config &&
        !res.config_isRetryRequest
      ) {
        // axios documentation
        return new Promise((resolve, reject) => {
          console.log("401 ERROR -> LOGOUT");
          dispatch({ type: "LOGOUT" });
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("token");
          router.push("/login");
        });
      }
      return Promise.reject(err);
    }
  );

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };

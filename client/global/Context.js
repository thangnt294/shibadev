import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const initialState = {
  user: null,
  courses: null,
  page: 0,
  limit: 9,
  total: null,
  term: ".*",
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
    case "UPDATE_COURSE_LIST":
      return {
        ...state,
        courses: action.payload.courses,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
        term: action.payload.term,
      };
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

  axios.interceptors.response.use(
    (response) => {
      // any status code of 2XX trigger this function
      return response;
    },
    (err) => {
      // any status code that is not 2XX trigger this function
      const res = err.response;
      if (res.status === 401 && res.config && !res.config_isRetryRequest) {
        // axios documentation
        return new Promise((resolve, reject) => {
          axios
            .post("/api/logout")
            .then((data) => {
              console.log("/401 ERROR -> LOGOUT");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERROR", err);
              reject(err);
            });
        });
      }
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
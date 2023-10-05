// AuthContext.js
import React,{useState,useEffect} from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { isCookieExpired } from "./cookieAuth";
import { useDispatch } from "react-redux";
import { fillUserDetails } from "./slice/merchantSlice";
import { getCookie } from "./cookieAuth";
import { useSelector } from "react-redux";
import { getUser } from "../helpers/getUser";
import { RefreshToken } from "../helpers/getRefreshToken";
import Cookies from "js-cookie";
export function AuthProvider({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const authPages = ["/"];
  const isAuthPage = authPages.includes(pathname);
  const getCookieValue = getCookie("authToken");
  const {userDetails} =  useSelector(state=>state.merchantReducer)


  const [res, setRes] = useState(null);

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const refreshedToken = await RefreshToken();
      if (refreshedToken) {
        setRes(refreshedToken);
        Cookies.set('authToken', refreshedToken?.access_token);
        Cookies.set('refreshToken', refreshedToken?.refreshToken);
      }
    }, 30000);

    return () => {
      clearInterval(refreshTokenInterval); // Clear interval on component unmount
    };
  }, [res])
  if (!userDetails) {
    return (
      <Box
        sx={{
          maxWidth: "31%",
          margin: "auto",
          marginTop: "1rem",
          maxWidth: { xs: "100%", sm: "100%", md: "31%" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10rem",
          }}
        >
          <CircularProgress size="4rem" color="error" />
        </Box>
      </Box>
    );
  }

  if (isAuthPage && userDetails) {
    return <Navigate to="/home" />;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!getCookieValue) {
    localStorage.clear();
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

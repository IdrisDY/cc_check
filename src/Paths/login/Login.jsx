import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import passwordLogo from "../../images/passwordLogo.svg";
import checkLogo from "../../images/checkLogo.svg";
import emailLogo from "../../images/emailIcon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthAxios, BaseAxios } from "../../helpers/axiosInstance";

import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Container } from "@mui/system";
import Basic from "../../components/signup/SignUp";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Navigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { setCookie } from "../../util/cookieAuth";
import Cookies from "js-cookie";
import { useTheme } from "@emotion/react";
import { useRoutes } from "react-router-dom";

const Login = () => {
  const currentTheme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [textOne, setTextOne] = useState(false);
  const [textTwo, setTextTwo] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [active, setActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);


  const notify = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const mutation = useMutation(
    async (formData) => {
      const response = await BaseAxios({
        url: "/auth/login",
        method: "POST",
        data: formData,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    {
      mutationKey: "login", // Specify the mutation key
      onSuccess: (data) => {
        setButtonDisabled(false);
        const authToken = data?.access_token;
        const refreshToken = data?.refreshToken;
        const currentTime = new Date();

        // const expiryTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
        Cookies.set("authToken", authToken, { expires: 7 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });
        navigate(location?.state?.prevUrl ? location?.state?.prevUrl : "/home");
      },
      onError: (error) => {
        // Handle errors here
        console.error("Login error:", error);
        setButtonDisabled(false);

        setTimeout(() => {
          notify(error.response.data.message);
        }, 1000);
      },
    }
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    // Assuming you have email and password fields in your component state
    const formData = {
      emailOrPhone: email,
      password,
    };

    // Call the mutation to trigger the login process
    mutation.mutate(formData);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const showLogin = () => {
    setIsShown(false);
    setActive(false);
  };

  const showSignUp = () => {
    setIsShown(true);
    setActive(true);
  };

  useEffect(() => {
    setActive(false);
  }, []);

  const regStyle = {
    color: "#DC0019",
    fontWeight: 600,
    cursor: "pointer",
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Please enter your email address");
      setTextOne(true);
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("Please enter password");
      setTextTwo(true);
    }
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    // setFirstNameError(value ? '' : 'Email is required');

    if (!value) {
      setEmailError("Please enter your email address");
      setTextOne(true);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      setTextOne(true);
      setEmailError("Invalid email address");
    } else {
      setTextOne(false);
      setEmailError("");
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    // setLastNameError(value ? '' : 'Last Name is required');

    if (!value) {
      setPasswordError("Password enter password");
      setTextTwo(true);
    } else {
      setTextTwo(false);
      setPasswordError("");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          bgcolor: currentTheme.palette.type === "light" ? "#fff" : "#121212",
          height: "100%",
          mx: "auto",
        }}
      >
        <div className="gpt3__check-login">
          <div className="gpt3__check-img">
            <div className="gpt3__check-image">
              <img src={checkLogo} alt="check-retail-logo" />
            </div>

            <div className="gpt3__check-img_text">
              <h5>RETAIL</h5>
            </div>
          </div>

          <div className="gpt3__check-auth-btn">
            <button
              className={
                active
                  ? currentTheme.palette.type === "light"
                    ? "light"
                    : "night"
                  : "active"
              }
              onClick={showLogin}
            >
              Login
            </button>
            <button
              className={
                active
                  ? "active"
                  : currentTheme.palette.type === "light"
                  ? "light"
                  : "night"
              }
              onClick={showSignUp}
            >
              Sign Up
            </button>
          </div>

          {!isShown && (
            <form onSubmit={handleSubmit}>
              <div>
                <FormControl
                  sx={{
                    width: "327px",
                    marginBottom: "0.5rem",
                    maginX: "auto",
                  }}
                  variant="outlined"
                >
                  <Typography
                    htmlFor="input"
                    sx={{
                      paddingX: { xs: "15px", sm: "0px", md: "0px" },
                      fontWeight: 600,
                      marginBottom: "1ch",
                      fontFamily: "raleWay",
                      fontSize: "16px",
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    sx={{
                      width: { xs: "300px", sm: "100%", md: "327px" },
                      mx: "auto",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: `${textOne ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
                        },
                        "&:hover fieldset": {
                          borderColor: `${textOne ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: `${textOne ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
                        },
                      },
                    }}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    value={email}
                    required
                    helperText={emailError && <span>{emailError}</span>}
                    placeholder="example@domain.com"
                    variant="outlined"
                    id="email-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <img src={emailLogo} alt="e-logo" />
                          &nbsp;&nbsp;
                        </InputAdornment>
                      ),
                    }}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                </FormControl>
              </div>

              <div>
                <FormControl sx={{ width: "327px", marginBottom: "0.5rem" }}>
                  <Typography
                    htmlFor="input"
                    sx={{
                      paddingX: { xs: "15px", sm: "0px", md: "0px" },
                      fontWeight: 600,
                      marginBottom: "1ch",
                      fontFamily: "raleWay",
                      fontSize: "16px",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    sx={{
                      width: {
                        xs: "300px",
                        sm: "100%",
                        md: "327px",
                      },
                      mx: "auto",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: `${textTwo ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
                        },
                        "&:hover fieldset": {
                          borderColor: `${textTwo ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: `${textTwo ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
                        },
                      },
                    }}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    value={password}
                    required
                    helperText={passwordError && <span>{passwordError}</span>}
                    name="password"
                    placeholder="Enter your Password"
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <img src={passwordLogo} alt="password-logo" />{" "}
                          &nbsp;&nbsp;
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                </FormControl>
              </div>
              <div className="gpt3__check-forget">
                <Link to="/forget-password">Forget Password?</Link>
              </div>

              <div className="gpt3__check-button">
                <button
                  disabled={mutation.isLoading || buttonDisabled}
                  type="submit"
                >
                  {mutation.isLoading || buttonDisabled ? (
                    <CircularProgress size="1.2rem" sx={{ color: "white" }} />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              <div className="gpt3__check-register-link">
                <p>Dont't have an account yet?</p>
                <span style={regStyle} onClick={showSignUp}>
                  Register
                </span>
              </div>
            </form>
          )}
          {isShown && <Basic setIsShown={setIsShown} setActive={setActive} />}
        </div>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Login;

import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Avatar, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { server } from '../components/layout/constants/config';
import { VisuallyHiddenInput } from '../components/style/stylecomponent';
import { userExists, userNotExists } from '../redux/reducers/auth';
import { usernameValidator } from '../utilis/validator';

const Login = () => {

    const dispatch = useDispatch();

    const [showPassword,setShowPassword] = useState(false);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const toggleLogin = () => {
        setIsLogin((prev) => !prev);
    }

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();

    const avatar = useFileHandler('single');

    const handleLogin = async (e) => {

        e.preventDefault();

        const toastId = toast.loading("Logging In....");

        setIsLoading(true);

        

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        }

       try {
         const {data} = await axios.post(`${server}/api/v1/user/login`,{
            username:username.value,
            password:password.value
        },
        config
    )
        dispatch(userExists(data.user));
        toast.success(data.message,{
          id : toastId
        });
       } catch (error) {
        dispatch(userNotExists());
        console.log(error);
        toast.error(error?.response?.data?.message || "something went wrong",{
          id : toastId
        });
       }
       finally{
          setIsLoading(false);
       }
    }

    const handleSignUp = async (e) => {

         e.preventDefault();

         const toastId = toast.loading("Signing Up....");

        setIsLoading(true);
        

        console.log("avatar is ",avatar.file);
        console.log("name is ",name.value);
        console.log("bio is ",bio.value);
        console.log("username is ",username.value);
        console.log("password is ",password.value);

        
        const formData = new FormData();
        formData.append("avatar",avatar.file);
        formData.append("name",name.value);
        formData.append("Bio",bio.value);
        formData.append("username",username.value);
        formData.append("password",password.value);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
        try {
           const {data} = await axios.post(`${server}/api/v1/user/new`,formData,config);
           dispatch(userExists(data.user));
           toast.success(data.message,{id:toastId});
        } catch (error) {
            toast.error(error?.response?.data?.message || "something went wrong",{id:toastId});
        }
        finally{
          setIsLoading(false);
        }

    }

    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    }


    return (
        <div>
        <Container
          component={"main"}
          maxWidth="xs"
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isLogin ? (
              <>
                <Typography variant="h5">Login</Typography>
                <form
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                  }}
                  onSubmit={handleLogin}
                >
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}
                  />
  
                 
                 <TextField
                    required
                    fullWidth
                    label="Password"
                    type={`${showPassword ? "text" : "password"}`}
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    InputProps={{
                      endAdornment : (
                        <InputAdornment position='end'>
                          <IconButton
                           aria-label='toggle password visibility'
                           onClick={handleClickShowPassword}
                           edge="end"
                          >
                            {
                              showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>
                            }
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    
                  />
  
                  <Button
                    sx={{
                      marginTop: "1rem",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    Login
                  </Button>
  
                  <Typography textAlign={"center"} m={"1rem"}>
                    OR
                  </Typography>
  
                  <Button
                    disabled={isLoading}
                    fullWidth
                    variant="text"
                    onClick={toggleLogin}
                  >
                    Sign Up Instead
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Typography variant="h5">Sign Up</Typography>
                <form
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                  }}
                  onSubmit={handleSignUp}
                >
                  <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                    <Avatar
                      sx={{
                        width: "10rem",
                        height: "10rem",
                        objectFit: "contain",
                      }}
                      src={avatar.preview}
                    />
  
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.5)",
                        ":hover": {
                          bgcolor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      component="label"
                    >
                      <>
                        <CameraAltIcon />
                        <VisuallyHiddenInput
                          type="file"
                          onChange={avatar.changeHandler}
                        />
                      </>
                    </IconButton>
                  </Stack>
  
                  {avatar.error && (
                    <Typography
                      m={"1rem auto"}
                      width={"fit-content"}
                      display={"block"}
                      color="error"
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}
  
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    value={name.value}
                    onChange={name.changeHandler}
                  />
  
                  <TextField
                    required
                    fullWidth
                    label="Bio"
                    margin="normal"
                    variant="outlined"
                    value={bio.value}
                    onChange={bio.changeHandler}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}
                  />
  
                  {username.error && (
                    <Typography color="error" variant="caption">
                      {username.error}
                    </Typography>
                  )}
  
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={`${showPassword ? "text" : "password"}`}
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    InputProps={{
                      endAdornment : (
                        <InputAdornment position='end'>
                          <IconButton
                           aria-label='toggle password visibility'
                           onClick={handleClickShowPassword}
                           edge="end"
                          >
                            {
                              showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>
                            }
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
  
                  <Button
                    sx={{
                      marginTop: "1rem",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    Sign Up
                  </Button>
  
                  <Typography textAlign={"center"} m={"1rem"}>
                    OR
                  </Typography>
  
                  <Button
                    disabled={isLoading}
                    fullWidth
                    variant="text"
                    onClick={toggleLogin}
                  >
                    Login Instead
                  </Button>
                </form>
              </>
            )}
          </Paper>
        </Container>
      </div>
    );
}

export default Login
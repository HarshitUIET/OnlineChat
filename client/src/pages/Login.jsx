import React from 'react';
import { useState } from 'react';
import { CiCamera } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import uploadarea from '../assets/uploadarea.svg';
import { usernameValidator } from '../utilis/validator';
import { passwordValidator } from '../utilis/passvalidator';
import { HiOutlineEye } from "react-icons/hi";
import { HiOutlineEyeOff } from "react-icons/hi";
import { Avatar, Button, Container, IconButton, Paper, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { VisuallyHiddenInput } from '../components/style/stylecomponent';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';


const Login = () => {

    const [isLoggedin, setLoggedin] = useState(true);

    const togglelogin = () => {
        setLoggedin((prev) => !prev);
    }

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();

    const avatar = useFileHandler('single');

    const handleLogin = (e) => {
        e.preventDefault();
    }

    const handleSignUp = (e) => {
        e.preventDefault();
    }

    console.log(avatar);

    return (
        <div style={{
            //  backgroundImage:"linear-gradient(rgb(255 255 209) ,rgb(249 159 159))"
        }}>
            <Container component={'main'} maxWidth={"xs"}
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Paper elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {
                    isLoggedin ?

                        (
                            <>
                                <Typography variant="h5">
                                    Login
                                </Typography>

                                <form style={{
                                    width: '100%',
                                    marginTop: '1rem'
                                }}
                                 onSubmit={handleLogin}
                                >
                                    <TextField required fullWidth
                                        label="Username" margin='normal'
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />
                                    {
                                        username.error && (
                                            <Typography variant="caption" color="error">
                                                {username.error}
                                            </Typography>
                                        )
                                    }
                                    <TextField required fullWidth
                                        label="Password" type='password' margin='normal'
                                        variant="outlined"
                                        value={username.password}
                                        onChange={password.changeHandler}
                                    />
                                    {
                                        password.error && (
                                            <Typography variant="caption" color="error">
                                                {password.error}
                                            </Typography>
                                        )
                                    }
                                    <Button
                                        sx={{
                                            marginTop: '1rem'
                                        }}
                                        fullWidth
                                        variant='contained' color='primary'
                                        type='submit' >
                                        Login
                                    </Button>

                                    <Typography textAlign={'center'} m={'1rem'} >OR</Typography>
                                    <Button sx={{
                                        marginTop: '1rem'
                                    }}
                                        fullWidth
                                        variant='text'
                                        onClick={togglelogin}>
                                        Sign Up Instead
                                    </Button>
                                </form>
                            </>
                        )

                        :
                        (
                            <>
                                <Typography variant="h5">
                                    Sign Up
                                </Typography>

                                <Stack position="relative" margin="auto" width="10rem" >
                                    <Avatar sx={{
                                        width: '10rem',
                                        height: '10rem',
                                        objectFit: 'cover',
                                        marginTop:"1rem"

                                    }}
                                        src={avatar.preview}
                                    />

                                    {
                                        avatar.error && (
                                            <Typography m={"1rem"} variant="caption" color="error">
                                                {avatar.error}
                                            </Typography>
                                        )
                                    }

                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            color: 'white',
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            ":hover": {
                                                bgcolor: "rgba(0,0,0,0.7)"
                                            }
                                        }} component="label" >
                                        <>
                                            <CameraAltIcon />
                                            <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                                        </>
                                    </IconButton>

                                </Stack>

                                <form style={{
                                    width: '100%',
                                    marginTop: '1rem'
                                }}
                                 onSubmit={handleSignUp}
                                >
                                    <TextField required fullWidth
                                        label="Name" margin='normal'
                                        variant="outlined"
                                        value={name.value}
                                        onChange={name.changeHandler}
                                    />

                                    <TextField required fullWidth
                                        label="Bio" margin='normal'
                                        variant="outlined"
                                        value={bio.value}
                                        onChange={bio.changeHandler}
                                    />

                                    <TextField required fullWidth
                                        label="Username" margin='normal'
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />
                                    <TextField required fullWidth
                                        label="Password" type='password' margin='normal'
                                        variant="outlined"
                                        value={username.password}
                                        onChange={password.changeHandler}
                                    />
                                    <Button
                                        sx={{
                                            marginTop: '1rem'
                                        }}
                                        fullWidth
                                        variant='contained' color='primary'
                                        type='submit' >
                                        Sign Up
                                    </Button>

                                    <Typography textAlign={'center'} m={'1rem'} >OR</Typography>
                                    <Button 
                                        fullWidth
                                        variant='text'
                                        onClick={togglelogin}>
                                        Login Instead
                                    </Button>
                                </form>
                            </>
                        )
                }
            </Paper>

        </Container>
        </div>
        
    )
}

export default Login
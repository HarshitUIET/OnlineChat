import { useInputValidation } from '6pp';
import { Avatar, Button, Container, IconButton, Paper, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { admminLogin,getAdmin } from '../../redux/thunks/admin';


const AdminLogin = () => {

    const dispatch = useDispatch();

    const {isAdmin} = useSelector(state => state.auth);

    const secretKey = useInputValidation('');

    const SubmitHandler = (e) => {  
        e.preventDefault();
        console.log(secretKey.value);
        dispatch(admminLogin(secretKey.value));
    }

    useEffect(() => {
        dispatch(getAdmin());
    },[dispatch])

    if(isAdmin) {
        return <Navigate to = '/admin/dashboard' />
    }

    return (
        <div>
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
                    
                   
                        <Typography variant="h5">
                           Admin Login
                        </Typography>

                        <form style={{
                            width: '100%',
                            marginTop: '1rem'
                        }}
                            onSubmit={SubmitHandler}
                        >
                            
                           
                            <TextField required fullWidth
                                label="Secret key" type='password' margin='normal'
                                variant="outlined"
                                value={secretKey.value}
                                onChange={secretKey.changeHandler}
                            />
                           
                            <Button
                                sx={{
                                    marginTop: '1rem'
                                }}
                                fullWidth
                                variant='contained' color='primary'
                                type='submit' >
                                Login
                            </Button>
                        </form>
                </Paper>
            </Container>
        </div>
    )
}

export default AdminLogin
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export const ProtectRoute = ({children,user,redirect="/login"}) => {

      console.log(user);

     if(!user) return <Navigate to={redirect} />
   
      return children ? children : <Outlet/>;
}

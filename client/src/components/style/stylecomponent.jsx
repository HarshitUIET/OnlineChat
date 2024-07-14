import {styled } from '@mui/system';
import { Link as LinkedComponent } from 'react-router-dom';
import { grayColor } from '../layout/constants/color';
import { Skeleton } from '@mui/material';
import { keyframes } from '@mui/material';

export const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
    });

export const Link = styled(LinkedComponent)`
    text-decoration:none;
    color:black;
   padding : 1rem;
   &:hover{
       background-color: rgba(0,0,0,0.1);   
   }
}`;

export const InputBox = styled("input")({
    height: "100%", 
    width: "100%",
    outline: "none",
    border: "none",
     padding: "0 3rem",
     borderRadius: "1.5rem",
     backgroundColor: grayColor
    });

export const  SearchField = styled('input')`
padding : 1rem 2rem;
width : 20vmax;
border: none;
border-radius: 1.5rem;
outline: none;
background-color: ${grayColor};
font-size: 1.1rem;
`;

export const CurveButton = styled('button')` 
   border-radius : 1.5rem;
    padding : 1rem 2rem;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: black;
    color: white;
    &:hover{
        background-color: rgba(0,0,0,0.8);
    }
    font-size: 1.1rem;
    `;

const bounceAnimation = keyframes`
0% {transform : scale(1);}
50% {transform : scale(1.5);}
100% {transform : scale(1);}
`;


export const BouncingSkeleton = styled(Skeleton)(()=>({
    animation : `${bounceAnimation} 1s infinite`,
}))

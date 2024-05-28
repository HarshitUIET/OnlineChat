import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorE1}) => {
  return (
    <Menu  anchorEl={anchorE1} open={false}>
        <div 
        style={{
            width:"10rem",
        }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui veritatis beatae amet ducimus deleniti voluptate quos, deserunt maxime nam impedit debitis, omnis error.
        </div>
    </Menu>
  )
}

export default FileMenu
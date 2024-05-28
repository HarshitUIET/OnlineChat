import React from 'react'
import {FileOpen} from '@mui/icons-material'
import {transformImage} from '../../lib/features'

const RenderComponent = (url,file) => {
  
    
       switch (file) {

        case "audio":
        return  (<audio src={url} preload='none'  controls  />)

        case "video":
            return (<video src={url} preload='none' controls  width={"200px"} /> )

        case "image":
          return (
             <img src={transformImage(url,200)} 
            alt='attachment'
            width={'200px'}
            height={'150px'}
             style={{
                objectFit: "contain"
             }}        
             />  
            ) 
       
        default:
            return <FileOpen />
       }
    
  
}

export default RenderComponent
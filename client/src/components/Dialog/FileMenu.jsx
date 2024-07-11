import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { Image as ImageIcon,AudioFile as AudioFileIcon, VideoFile as VideoFileIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({anchorE1,chatId}) => {

  const {isFileMenu}  = useSelector(state=>state.misc);

  const dispatch = useDispatch();

  const AudioRef = useRef(null);
  const VideoRef = useRef(null);
  const FileRef = useRef(null);
  const ImageRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const fileChangeHandler = async (e,key) =>{

    const files = Array.from(e.target.files);

    if(files.length <= 0) return;

    if(files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}....`);
    closeFileMenu();


    try {

      const myform = new FormData();

      myform.append("chatId",chatId);

      files.forEach((file)=>{
        myform.append("files",file);
      });
         
      const res = await sendAttachments(myform);

      if(res.data) toast.success(`${key} sent successfully`,{id:toastId});
      else toast.error(`Failed to send ${key}`,{id:toastId});

    } catch (error) {
      toast.error(error,{id:toastId});
    } finally {
      dispatch(setUploadingLoader(false));
    }


  };

  const selectAudio = () => AudioRef.current?.click();
  const selectImage = () => ImageRef.current?.click();
  const selectFile = () => FileRef.current?.click();
  const selectVideo = () => VideoRef.current?.click();
   
  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  }

  return (
    <Menu  anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu} >
        <div 
        style={{
            width:"10rem",
        }}>


          <MenuList>
            <MenuItem onClick={selectImage} >
             <Tooltip title="Image" >
               <ImageIcon/>
             </Tooltip>
             <ListItemText
             style={{marginLeft:'0.5rem'}}
             >
              Image
             </ListItemText>
             <input 
             type='file'
             multiple 
             accept='image/png,image/jpeg,image/gif'
             style={{display:"none"}}
             onChange={(e)=>fileChangeHandler(e,"Images")}
             ref={ImageRef}
             />
            </MenuItem>
          

       
            <MenuItem onClick={selectAudio}>
             <Tooltip title="Audio" >
               <AudioFileIcon/>
             </Tooltip>
             <ListItemText
             style={{marginLeft:'0.5rem'}}
             >
              Audio
             </ListItemText>
             <input 
             type='file'
             multiple 
             accept='audio/mpeg,audio/wav'
             style={{display:"none"}}
             onChange={(e)=>fileChangeHandler(e,"Audios")}
             ref={AudioRef}
             />
            </MenuItem>
          
           
          
            <MenuItem onClick={selectVideo}>
             <Tooltip title="Video" >
               <VideoFileIcon/>
             </Tooltip>
             <ListItemText
             style={{marginLeft:'0.5rem'}}
             >
              Video
             </ListItemText>
             <input 
             type='file'
             multiple 
             accept='video/mp4,video/webm,video/ogg'
             style={{display:"none"}}
             onChange={(e)=>fileChangeHandler(e,"Videos")}
             ref={VideoRef}
             />
            </MenuItem>
         

          
            <MenuItem onClick={selectFile} >
             <Tooltip title="File" >
               <UploadFileIcon/>
             </Tooltip>
             <ListItemText
             style={{marginLeft:'0.5rem'}}
             >
              File
             </ListItemText>
             <input 
             type='file'
             multiple 
             accept='*'
             style={{display:"none"}}
             onChange={(e)=>fileChangeHandler(e,"Files")}
             ref={FileRef}
             />
            </MenuItem>
          </MenuList>

        </div>
    </Menu>
  )
}

export default FileMenu
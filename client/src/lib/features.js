import moment from 'moment';

const fileformat = (url='') => {

    const fileExtention = url.split('.').pop();


    if(fileExtention == 'mp3' ||fileExtention == 'wav') return 'audio';

    if(fileExtention == 'mp4' ||fileExtention == 'webm' || fileExtention == 'ogg') return 'video';

    if(
        fileExtention == "jpg" ||
        fileExtention == "png" ||
        fileExtention == "jpeg" ||
        fileExtention == "gif"
        
    ) {
        return 'image';
    }
    

    return 'file';

}

const transformImage = (url = "",width = 100) => url; 

const getlast7days = () => {
    const currentDate = moment();
    const last7days = [];

     for (let i=0;i<7;i++) {
        const daydate = currentDate.clone().subtract(i,'days');
        const day = daydate.format('ddd');
        last7days.unshift(day);
     }

     return last7days;
}

const getOrSaveStorage = ({key,value,get}) => {
    if(get) {
      return  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    }
    else {
         localStorage.setItem(key,JSON.stringify(value));
    }
}




export {getlast7days,fileformat,transformImage,getOrSaveStorage};
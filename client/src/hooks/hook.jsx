import { useState,useEffect } from "react";
import toast from "react-hot-toast";


const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({isError,error,fallback}) => {
            if(isError) {
                if(fallback) fallback();
                toast.error(error?.data?.message || "Something Went Wrong");    
            }
        })
    },[errors]);
}

const useAsyncMutation = (mutataionHook) => {
     
    const [isLoading,setIsLoading] = useState(false);
    const [data,setData] = useState(null);

    const [mutate] = mutataionHook();

    const executeMutation = async (toastMessage,...args) => {
       setIsLoading(true);
       const toastId = toast.loading(toastMessage || "Updating data");
       try {
         const res = await mutate(...args);
            if(res.data) {
                toast.success(res.data.message ||"Data Updated...",{id : toastId});
                setData(res.data);
       }
       else {
              toast.error(res?.error?.data?.message || "Something Went Wrong",{id : toastId});
       }
    }
    catch(err) {
        toast.error("Something Went Wrong",{id : toastId});
    }
    finally {
        setIsLoading(false);     
    }
}
    return [executeMutation,isLoading,data];
}



export {useErrors,useAsyncMutation};
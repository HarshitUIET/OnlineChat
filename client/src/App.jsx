import { BrowserRouter ,Route , Routes } from 'react-router-dom'
import './App.css'
import { Suspense, lazy, useEffect } from 'react'
import { ProtectRoute } from './components/auth/protectedroute';
import { LayoutLoader } from './components/layout/Loaders';

import {server} from './components/layout/constants/config';

import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';

import { Toaster } from 'react-hot-toast';



const Home = lazy(()=>import('./pages/Home'));
const Login = lazy(()=>import('./pages/Login'));
const Group = lazy(()=>import('./pages/Group'));
const Chat = lazy(()=>import('./pages/Chat'));
const Notfound = lazy(()=>import('./pages/Notfound'));
const AdminLogin = lazy(()=>import('./pages/Admin/AdminLogin'));
const Dashboard = lazy(()=>import('./pages/Admin/Dashboard'));
const UserManagement = lazy(()=>import('./pages/Admin/UserManagement'));
const MessageManagement = lazy(()=>import('./pages/Admin/MessageManagement'));
const ChatManagement = lazy(()=>import('./pages/Admin/ChatManagement'));

function App() {
  
  // let user = true;

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
    .then(({data})=>{
      dispatch(userExists(data.user))
    })
    .catch((err)=>{
      dispatch(userNotExists())
    })
  },[dispatch])
  
  return (
   <div >
       <BrowserRouter>
         <Suspense fallback={<LayoutLoader/>}>
         <Routes>
        <Route element={<ProtectRoute user={user}/>}>
           <Route path='/' element={<Home/>} />  
          <Route path='/group' element={<Group/>} />  
          <Route path='/chat/:chatId' element={<Chat/>} />
        </Route>
         
          <Route path='/login' element={<ProtectRoute user={!user} redirect='/'>
            <Login/>
          </ProtectRoute>} />

          <Route path='/admin' element={<AdminLogin/>} />
          <Route path='/admin/users' element={<UserManagement/>} />
          <Route path='/admin/messages' element={<MessageManagement/>} />
          <Route path='/admin/chats' element={<ChatManagement/>} />

          <Route path='/admin/dashboard' element={<Dashboard/>} />

          <Route path='*' element={<Notfound/>} />
       </Routes>
         </Suspense>
         <Toaster position='top-center' />
       </BrowserRouter>
   </div>
  )
}

export default App

import { BrowserRouter ,Route , Routes } from 'react-router-dom'
import './App.css'
import { Suspense, lazy } from 'react'
import { ProtectRoute } from './components/auth/protectedroute';
import { LayoutLoader } from './components/layout/Loaders';

const Home = lazy(()=>import('./pages/Home'));
const Login = lazy(()=>import('./pages/Login'));
const Group = lazy(()=>import('./pages/Group'));
const Chat = lazy(()=>import('./pages/Chat'));
const Notfound = lazy(()=>import('./pages/Notfound'));

function App() {
  
  let user = true;
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

          <Route path='*' element={<Notfound/>} />
       </Routes>
         </Suspense>
       </BrowserRouter>
   </div>
  )
}

export default App

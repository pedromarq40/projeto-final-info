import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from './api/api.js'
import Protected from './components/Protected.jsx';
import Login from './pages/login.jsx';
import Cadastro from './pages/cadastro.jsx'
import Home from './pages/home.jsx'

function NotFound() {
  return <h2>404 - Página não encontrada</h2>;
}

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return null

  const isAuth = !!user

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protected children={<Home user={user} setUser={setUser}/>} condition={isAuth} redirectTo='/login'/>}/>
        <Route path="/cadastro" element={<Protected children={<Cadastro/>} condition={!isAuth}/>}/>
        <Route path="/login" element={<Protected children={<Login setUser={setUser}/>} condition={!isAuth}/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}
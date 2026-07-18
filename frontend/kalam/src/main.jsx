import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './routes/SignUp.jsx'
import Login from './routes/Login.jsx'
import Home from './routes/Home.jsx'
import Profile from './routes/Profile.jsx'
import ChatSelect from './components/ChatSelect.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/chat" element={<Home />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/select" element={<ChatSelect />}/>
  
    </Routes>
  </BrowserRouter>
  
)

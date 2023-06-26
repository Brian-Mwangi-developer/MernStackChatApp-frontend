import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Login } from './pages/login'
import { Signup } from './pages/signup'
import { Chat } from './pages/chat'
import { Home } from './pages/Home'
import { useSelector } from 'react-redux'
import { AppContext, socket } from './context/appContext'

function App() {
  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMembersMsg, setPrivateMembersMsg] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const user = useSelector((state) => state.user);
  return (
    <AppContext.Provider value={{socket,rooms,setRooms,currentRoom,setCurrentRoom,members,setMembers,messages,setMessages,privateMembersMsg,setPrivateMembersMsg,newMessage,setNewMessage}}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user &&
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          }
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App

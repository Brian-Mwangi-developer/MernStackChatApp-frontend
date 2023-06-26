import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/appContext';
import { useSelector } from 'react-redux';

export const Sidebar = () => {
  const { socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, privateMembersMsg, setPrivateMembersMsg } = useContext(AppContext);
  const user =useSelector((state)=>state.user);
  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload);
  })

  useEffect(() => {
    if(user){
      setCurrentRoom("general");
      fetchRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }

  }, [user,socket,setCurrentRoom]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8000/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };
  if (!user){
    return <></>
  }

  return (

    <>
      <h2>Available Rooms</h2>
      <table className='w-11/12'>
        <tbody>
          {rooms.map((room, index) => {
            return (
              <tr key={index} >
                <td className='border border-1 border-gray-600 px-3 py-2.5'>{room}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Members</h2>
      <table className='w-11/12'>
        <tbody>
          {members.map((member) =>(
            <tr key={member.id}>
              <td className='block border border-1 border-gray-300 px-3 py-2.5'>{member.name}</td>
            </tr>
          ))}
          </tbody>
      </table>

    </>
  )
}

import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/appContext';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifications, resetNotifications } from '../features/userSlice';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMembersMsg,
    rooms,
    setPrivateMembersMsg,
    currentRoom,
  } = useContext(AppContext);

  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload);
  });

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert('please login');
    }

    socket.emit('join-room', room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMembersMsg(null);
    }

    // Dispatch  reset notifications
    dispatch(resetNotifications(room));
  }
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom != room) dispatch(addNotifications(room));
  });
  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });
  function getRooms() {
    fetch("http://localhost:8000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }
  function handlePrivateMemberMsg(member) {
    setPrivateMembersMsg(() => member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  if (!user) {
    return <></>;
  }


  return (
    <>
      <h2 className="text-3xl mb-2">Available Rooms</h2>
      <table className="w-11/12">
        <tbody>
          {rooms.map((room, index) => {
            return (
              <tr key={index}>
                <td
                  className={`border border-1 border-gray-600 px-3 py-2.5 ${room === currentRoom ? 'bg-blue-600' : ''}`}
                  onClick={() => joinRoom(room)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  {room} {currentRoom !== room && <span className="rounded-full bg-green-600 text-white font-serif h-4 w-4">{user.newMessage[room]}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2 className="mt-5 text-3xl">Members</h2>
      <table className="w-11/12">
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td
                className={`block border border-1 border-gray-300 px-3 py-2.5 ${privateMembersMsg?._id === member?._id ? 'bg-blue-600' : ''
                  }`}
                style={{ cursor: member._id === user._id ? 'not-allowed' : 'pointer' }}
                onClick={member._id !== user._id ? () => handlePrivateMemberMsg(member) : undefined}
              >
                <div className='flex '>
                  <div className='relative mx-2'>
                  <img src={member.picture} className='h-[36px] w-[36px] rounded-full relative' />
                  <span className={`absolute bottom-0 left-6 h-3 w-3  rounded-full ${member.status == 'online'? 'bg-green-500':'bg-yellow-300' }`}></span>
                  </div>
                  <div>
                    {member._id === user?._id ? "You": member.name}
                    {member.status == "offline" && ("offline")}
                  </div>
                  <span className="rounded-full bg-green-600 text-white font-serif">{user.newMessage[orderIds(member._id, user._id)]}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

import React, { useContext, useState } from 'react'
import { FiSend } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

export const MessageForm = () => {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user)
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString()

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return day + "/" + month + "/" + year;
    }
    // function handleSubmit() {
    //     e.preventDefault();
    //     //form.onSubmit logic
    // }
    const todayDate = getFormattedDate();
    socket.off('room-messages').on('room-messages',(roomMessages)=>{
        console.log("room messages",roomMessages);
        setMessages(roomMessages);
    })
    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;

        //Emit the message to the Server
        socket.emit("message-room", roomId, message, user, time, todayDate);
        setMessage("");
    }

    return (
        <>

            <div className="w-full h-96 px-5 flex flex-col justify-between border border-gray-500 rounded-md overflow-y-scroll">
                {!user && <div className='bg-red-300  px-4 font-sans font-bold text-2xl'>Please Login In</div>}
                {user &&
                messages.map(({_id:date, messageByDate},idx) =>(
                    <div key={idx}>
                        <p className='bg-green-300 text-xl'>{date}</p>
                        {messageByDate?.map(({content, time, from:sender},msgIdx) =>(
                            <div className='' key={msgIdx}>
                                <div className="chat-bubble my-3">{content}</div>
                          </div>
                        ))}
                    </div>
                ))}
            </div>
                <form onSubmit={handleSubmit} className='  flex mt-5 border  rounded-md border-gray-400' >
                        <input
                            disabled={!user}
                            value={message}
                            className="w-full px-2 py-1.5 focus: outline-none border-none border-r-md rounded-md disabled:bg-gray-400 border border-gray-500 "
                            type="text"
                            placeholder="type your message here..."
                            onChange={(e) => setMessage(e.target.value)}
                            
                        />
                        <button type='submit'><FiSend size={36} color='white' className='bg-gray-100 px-2 rounded-l-0' style={{ backgroundColor: '#46e370' }} /></button>
                </form>
            
        </>
    )
}

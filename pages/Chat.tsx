import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

const socket = io('http://localhost:5000')


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [recipientID, setRecipientID] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { data: session } = useSession();
    const userID = session?.user?.email;  // This should be dynamic based on the logged-in user

    useEffect(() => {
        socket.emit('user joined', userID);

        socket.on('private message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        socket.on('user typing', (typingUserID) => {
            if (typingUserID === recipientID) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 1000); // Remove typing status after 1 second
            }
        });

        socket.on('disconnect', () => {
            console.error('You have been disconnected from the server');
        });

        return () => {
            socket.off('private message');
            socket.off('user typing');
            socket.off('disconnect');
        };
    }, [recipientID]);
console.log(messages)
const handleSend = () => {
    const messageObj = {
        id: Date.now(),
        from: userID,
        to: recipientID,
        message: input,
        timestamp: new Date()
    };

    // Update the local state immediately to reflect the sent message in the UI
    setMessages(prevMessages => [...prevMessages, messageObj]);

    // Emit the message to the server
    socket.emit('private message', messageObj);
    setInput('');
};


    const handleTyping = (e) => {
        setInput(e.target.value);
        socket.emit('user typing', userID);
    };

    return (
        <div>
            <Navbar />
           <div>
    {messages.map((msg) => (
        <div 
            key={msg.id}
            className={msg.from === userID ? "my-message" : "other-message"}
        >
            <strong>{msg.from}</strong> to <strong>{msg.to}</strong>: {msg.message}
        </div>
    ))}
</div>
            {isTyping && <div><em>User is typing...</em></div>}
            <input 
                placeholder="Recipient ID"
                value={recipientID} 
                onChange={e => setRecipientID(e.target.value)} 
            />
            <input 
                placeholder="Type your message"
                value={input} 
                onChange={handleTyping}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;

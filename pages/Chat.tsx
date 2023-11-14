import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recipientID, setRecipientID] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();
  const userID = session?.user?.email;

  useEffect(() => {
    const newSocket = new WebSocket('wss://carbon-relay-backend2.vercel.app');


      newSocket.onopen = () => {
          newSocket.send(JSON.stringify({ type: 'user joined', userID }));
      };

      newSocket.onmessage = (event) => {
          const msg = JSON.parse(event.data);

          if (msg.type === 'private message') {
              setMessages(prevMessages => [...prevMessages, msg]);
          }
      };

      newSocket.onclose = () => {
          console.error('WebSocket disconnected');
      };

      setSocket(newSocket);

      return () => {
          newSocket.close();
      };
  }, [userID]);

  const handleSend = () => {
      const messageObj = {
          type: 'private message',
          id: Date.now(),
          from: userID,
          to: recipientID,
          message: input,
          timestamp: new Date()
      };

      socket.send(JSON.stringify(messageObj));
      setMessages(prevMessages => [...prevMessages, messageObj]);
      setInput('');
  };

    const handleTyping = (e) => {
        setInput(e.target.value);
        // socket.emit('user typing', userID);
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

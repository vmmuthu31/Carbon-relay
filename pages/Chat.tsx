import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const currentUserEmail = session?.user?.email;
    const recipientID = currentUserEmail === "mvairamuthu2003@gmail.com" ? "vairamuthu@jec.ac.in" : "mvairamuthu2003@gmail.com";
    const [isTyping, setIsTyping] = useState(false);
    const userID = session?.user?.email;

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/events');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'private message' && (data.from === userID || data.to === userID)) {
                setMessages(prevMessages => [...prevMessages, data]);
            } else if (data.type === 'user typing' && data.from === recipientID) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 1000);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [userID, recipientID]);

    const handleSend = async () => {
        const messageObj = {
            from: userID,
            to: recipientID,
            message: input,
            timestamp: new Date()
        };

        // Update local state immediately
        setMessages(prevMessages => [...prevMessages, messageObj]);

        // Send the message to the server
        await axios.post('http://localhost:5000/send', messageObj);
        setInput('');
    };

    const handleTyping = async () => {
        setInput(input);
        // Send typing notification
        await axios.post('http://localhost:5000/typing', { userID, recipientID });
    };

    return (
        <div className='bg-[#e7e4e4] w-[400px] min-h-screen'>
        <div className='cs2 rounded-b-lg'>
          <div className='flex cs2 gap-40 pr-5 pl-2 justify-between'>
            <div className='flex'>
              <h2  className='ml-2'></h2>
            </div>
            <button  className="ml-auto text-white inline-flex items-center rounded-lg bg-transparent  text-xl hover:bg-gray-200 hover:text-gray-900 dark:hover-bg-gray-600 dark:hover-text-white">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 11-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className='flex mx-5 mt-2 justify-between'>
            <div className='flex text-white font-semibold text-xl flex-col'>
              <p>Company A</p>
              <p>if company</p>
              <p>name extends</p>
            </div>
            <div className='flex text-white font-thin text-xl flex-col'>
              <div className='flex space-x-4'>
                <p>Offer</p>
                <p className='bg-white text-black font-semibold pl-1 pr-10 rounded-sm'>$26</p>
              </div>
              <div className='flex space-x-8 mt-2'>
                <p>Bid</p>
                <p className='bg-white text-black font-semibold pl-1 pr-7 rounded-sm'>$27.5</p>
              </div>
            </div>
          </div>
          <div className='flex justify-center pb-6 gap-28 mx-4'>
            <select className='border flex outline-none space-x-5 mt-2 text-gray-500 py-1 rounded-md pr-20'>
            <option>Evaluating</option>
                    <option>Accept</option>
                    <option>Reject</option>
                    <option>On hold</option>
            </select>
            <p className='text-green-400 text-md flex'>
              <span className='text-4xl'>•</span>
              <span className='mt-3'>Active</span>
            </p>
          </div>
        </div>
        <div>
          <div className="px-4">
            <p>Conversation Between You and Trader has been established</p>
          </div>
    
          <div className="container" style={{ maxHeight: "400px", maxWidth: "400px", overflowY: "scroll" }}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.from === userID ? "my-message" : "other-message"}>
                <div className="text-[10px] font-bold sender-name">
                  {msg.from === userID ? <p>You</p> : msg.from.slice(0, -10)}
                </div>
                <div style={{ wordBreak: "break-word" }}>{msg.message}</div>
              </div>
            ))}
          </div>
    
          {isTyping && <div className='text-center'><em>User is typing...</em></div>}
    
          <form onSubmit={handleSend}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">Send</button>
          </form>
        </div>
    
    
        <div className='mt-4 sticky-bottom py-2'>
          <div className="flex">
            <form className="relative">
              <input
                className="px-3 w-[340px] py-4 outline-none border rounded-sm mx-3"
                value={input}
                onChange={handleTyping}
                placeholder="Type your message here..."
              />
              <button
                onClick={handleSend}
                className="absolute top-2 right-5 px-3 py-2 rounded-md bg-[#203682] text-white"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}

export default Chat;

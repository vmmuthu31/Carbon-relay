import React, { Fragment, useState,useCallback, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {RxCrossCircled} from "react-icons/rx"
import {AiOutlineHome,AiFillSound,AiFillCaretDown,AiOutlineMenu,AiOutlineArrowLeft, AiOutlineDown,AiOutlineArrowRight } from "react-icons/ai"
import {PiUserCircleGearLight,PiNewspaperClippingDuotone } from "react-icons/pi"
import {FiUpload} from "react-icons/fi";
import {FaLock, FaUnlock} from "react-icons/fa"
import {RxCross2} from "react-icons/rx"
import {BsChevronLeft, BsThreeDots} from "react-icons/bs"
import {HiArrowLongRight} from "react-icons/hi2"
import Modal from 'react-modal'; // Adjust the import path as needed
import { useSession } from 'next-auth/react'
import io from 'socket.io-client';

const socket = io('http://localhost:5000')

const navigation = [
  { name: 'Home', href: '#', icon: AiOutlineHome, current: false },
 
]
const buynavigation = [
  { name: 'Credits Offers', href: '#', icon: PiUserCircleGearLight, current: false },
  { name: 'Request Credits', href: '#', icon: PiUserCircleGearLight, current: false },

]
const sellnavigation = [
  { name: 'Offer Credits', href: '#', icon: AiFillSound, current: true },
  { name: 'Fulfill Request', href: '#', icon: PiNewspaperClippingDuotone, current: false },
]
const Cbuynavigation = [
  { name: 'Credits Offers', href: '#', icon: PiUserCircleGearLight, current: false },
  { name: 'Request Credits', href: '#', icon: PiUserCircleGearLight, current: false },
]

const Csellnavigation = [
  { name: 'Offer Credits', href: '#', icon: AiFillSound, current: false },
  { name: 'Fulfill Request', href: '#', icon: PiNewspaperClippingDuotone, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rowStates, setRowStates] = useState(Array(3).fill(true)); // Initialize with 3 rows
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();
  const [input, setInput] = useState(''); 
  const recipientID = session?.user?.email == "mvairamuthu2003@gmail.com" ? "vairamuthu@jec.ac.in"  : "mvairamuthu2003@gmail.com" ;


  console.log(recipientID,"receipt")
  const [isTyping, setIsTyping] = useState(false);
  const userID = session?.user?.email; 
  // Function to toggle the lock/unlock state for a specific row
  const toggleLock = (rowIndex) => {
    // Create a copy of the current rowStates
    const updatedRowStates = [...rowStates];
    // Toggle the state of the specific row
    updatedRowStates[rowIndex] = !updatedRowStates[rowIndex];
    // Update the state with the new array
    setRowStates(updatedRowStates);
  };
  const openRowPopup = (rowData) => {
    setSelectedRowData(rowData);
  };
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
const handleSend = (e) => {
  e.preventDefault();
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


  const closeRowPopup = () => {
    setSelectedRowData(null);
  };
  const [projectId, setProjectId] = useState('');
  const [projectData, setProjectData] = useState({});

  useEffect(() => {
    if (projectId) {
        // Replace the following with your data fetching logic
        // Example: Fetch data from an API endpoint using the projectId
        fetch(`http://localhost:5000/auth/projectData/${projectId}`)
            .then(response => response.json())
            .then(data => setProjectData(data));
    }
}, [projectId]);



  let subtitle;

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
console.log("projectid",projectId)
console.log("projectdata",projectData)
  const openModal = () => {
      setModalIsOpen(true);
  }
  const openModal1 = () => {
    setModalIsOpen1(true);
}
const openModal2 = () => {
  setModalIsOpen2(true);
}
  
  const closeModal = () => {
      setModalIsOpen(false);
  }
  const closeModal1 = () => {
    setModalIsOpen1(false);
}
const closeModal2 = () => {
  setModalIsOpen2(false);
}
  
const [startingYear, setStartingYear] = useState("");
const [endingYear, setEndingYear] = useState("");
const [offerPrice, setOfferPrice] = useState("");
const [corisa, setCorisa] = useState("");

  const handleSubmit = async () => {
    const data = {
      projectId,
      quantity,
      startingYear,
      endingYear,
      offerPrice,
      corisa,
      projectName: projectData?.Name,
      projectType: projectData?.ProjectType,
      proponent: projectData?.Proponent,
      country: projectData?.Country_Area,
      methodology: projectData?.Methodology,
      sdgs: projectData?.SDGs,
      additionalCertificates1: projectData?.AdditionalAttributes?.Attribute1,
      additionalCertificates2: projectData?.AdditionalAttributes?.Attribute2,
      additionalCertificates3: projectData?.AdditionalAttributes?.Attribute3,
    };
    console.log(data)
  
    try {
      const response = await fetch("http://localhost:5000/auth/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Handle success - maybe show a success message or redirect the user
      } else {
        // Handle errors - maybe show an error message to the user
        console.error("Failed to submit data");
      }
    } catch (error) {
      console.error("There was an error sending the data", error);
    }
  };
  
  const [quantity, setQuantity] = useState("");

  const increaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity === "" ? 1 : prevQuantity + 1));
  };


  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };



  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
  function afterOpenModal1() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
  function afterOpenModal2() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

 


  return (

    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-40 flex md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <RxCrossCircled className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 px-4 flex items-center">
                <img
                className="h-8 w-auto"
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhZJPipfeyNsdZI8CywAOgRlNn9nd30AlFuOcccs4IJxj_JfRUHxXap3KaGKfT7AlBry3Kn3QvIQzjOk78WPTxbINLWbaNLsT0deumPes4VYEXCYMkWlvCYJvYjPryn05qZeN4wtyY_Ufxqg3kn_lbmlTVymQ0iuvW9MtDq7Qn8TNfuIjk4t8d8KrPLQNg"
                alt="Workflow"
              />
                <p className='text-lg px-2 font-semibold'>CDash</p>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="flex-1  px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-2 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                <div>
                  <p className='text-sm my-2 px-2 text-[#8C8C8C]'>BUY</p>
                  {buynavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {sellnavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                </div>
              </nav>
              <nav className="flex-1 px-2 pb-1 space-y-1">
               <p className='text-md px-2 py-4 font-semibold text-gray-800'>Company Relay</p>
                <div>
                  <p className='text-sm px-2 my-2 text-[#8C8C8C]'>BUY</p>
                  {Cbuynavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {Csellnavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                </div>
              </nav>
                </div>
                
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">{/* Dummy element to force sidebar to shrink to fit close icon */}</div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-52 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className={`border-r border-gray-200 py-2 flex flex-col  flex-grow ${modalIsOpen || modalIsOpen1 || modalIsOpen2 ? 'opacity-50' : ''} overflow-y-auto`}>
            <div className=" sticky top-0 z-10 flex-shrink-0 py-3 bg-white border-b border-gray-200 flex px-4 items-center">
         
              <img
                className="h-8 w-auto"
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhZJPipfeyNsdZI8CywAOgRlNn9nd30AlFuOcccs4IJxj_JfRUHxXap3KaGKfT7AlBry3Kn3QvIQzjOk78WPTxbINLWbaNLsT0deumPes4VYEXCYMkWlvCYJvYjPryn05qZeN4wtyY_Ufxqg3kn_lbmlTVymQ0iuvW9MtDq7Qn8TNfuIjk4t8d8KrPLQNg"
                alt="Workflow"
              />
                <p className='text-lg px-2 font-semibold'>CDash</p>
             
            </div>
            <div className="flex-grow space-y-24  mt-5 flex flex-col">
         
            <nav className="flex-1  px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-2 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                <div>
                  <p className='text-sm my-2 px-2 text-[#8C8C8C]'>BUY</p>
                  {buynavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {sellnavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                </div>
              </nav>
              <nav className="flex-1 px-2 pb-1 space-y-1">
               <p className='text-md px-2 py-4 font-semibold text-gray-800'>Company Relay</p>
                <div>
                  <p className='text-sm px-2 my-2 text-[#8C8C8C]'>BUY</p>
                  {Cbuynavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {Csellnavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group rounded-md py-1 px-2 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
                </div>
              </nav>
            </div>
            
          </div>
        </div>

        <div className="md:pl-52">
          <div className={`flex flex-col ${modalIsOpen || modalIsOpen1 || modalIsOpen2 ? 'opacity-90 bg-gray-200' : ''} bg-[#f4f6f9]  md:px-8 xl:px-0`}>
            <div className={`sticky top-0 z-10 flex-shrink-0 h-16 ${modalIsOpen || modalIsOpen1 || modalIsOpen2 ? 'opacity-60 bg-gray-200' : ''} bg-white border-b border-gray-200 flex`}>
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <AiOutlineMenu className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex mx-10 justify-between px-4 md:px-0">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    
                    <div className="relative w-full  text-gray-800 text-xl pt-4 focus-within:text-gray-600">
                      <p className="">Offer Credits</p>
                    </div>
                  </form>
                </div>
                
              </div>
            </div>

            <main className="flex-1 mx-5">
      <div className="py-3">
        <div className="sm:px-6 flex justify-between md:px-0">
          <h1 className="text-lg font-semibold text-gray-900">You have 156 active offers available</h1>
          <button   className="bg-[rgb(47,84,235)] px-3 rounded-md py-1 text-white" onClick={openModal}>Create New Offer</button>
      <Modal  isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className='py-2 rounded-lg  my-[380px] bg-white w-[950px] mx-[800px] text-black '>
        <div className='flex justify-between'>
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}  className='mx-5 '><span className=' my-2 text-center flex justify-center text-black'>Create New Offer</span></h2>
       
  <button
   onClick={closeModal} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 11-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </button>
  
        </div>
        <hr className='text-xl font-bold text-black'/>      
        
        <div>
          <div className='flex mx-20 justify-between'>
            <div>
              <label htmlFor="" className="block font-semi text-blue-600 mb-2 ml-1 text-sm mt-2 ">Project ID</label>
              <input 
                className='border-black border px-4  py-2 rounded-md' 
                type='text' 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
            />
              <p className='text-sm '>Enter Your Project ID</p>
            </div>
            <div>
            <label htmlFor="" className="block mb-2 ml-1 text-blue-600 text-md mt-4 ">Quantity</label>
<div className='flex'>
  <input 
    className='border-black border px-4 py-2 rounded-md' 
    type='text' 
    value={quantity} 
    onChange={e => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 0) { // Ensure the value is a non-negative number
        setQuantity(val);
      } else if (e.target.value === "") { // Allow the input to be empty
        setQuantity("");
      }
    }}
  />
  <div className='flex justify-center flex-col'>
    <div>
      <button onClick={decreaseQuantity} className='text-2xl px-2 mx-1 ml-4 rounded-3xl bg-gray-100'>-</button>
      <span className='mt-2'>{quantity}</span>
      <button onClick={increaseQuantity} className='text-xl px-2 mx-1 rounded-3xl bg-gray-100'>+</button>
    </div>
  </div>
</div>

    </div>
          </div>
          <div className='flex mx-20 mt-2 justify-between'>
          <div className='flex flex-col my-1'>
      <label className='text-blue-600'>Vintage</label>
      <div className='flex '>
  <div className="relative ">
  <select 
    value={startingYear}
    onChange={(e) => setStartingYear(e.target.value)}
    className="appearance-none text-lg my-2 pl-2 pr-9 outline-none bg-gray-100 rounded-sm border py-1 cursor-pointer"
  >
    <option value="">Year</option>
    {Array.from({ length: 50 }, (_, i) => 2023 - i).map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
    <div className="absolute inset-y-0 text-center right-2  flex items-center pointer-events-none">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M6.293 9.293L10 13l3.707-3.707a.999.999 0 111.414 1.414l-4 4a.999.999 0 01-1.414 0l-4-4a.997.997 0 010-1.414.999.999 0 011.414 0z"/>
      </svg>
    </div>
  </div>
  
  <p className='text-3xl mt-3 mx-3'><HiArrowLongRight/></p>
  
  <div className="relative">
  <select 
    value={endingYear}
    onChange={(e) => setEndingYear(e.target.value)}
    className="appearance-none text-lg my-2 pl-2 pr-9 outline-none bg-gray-100 rounded-sm border py-1 cursor-pointer"
  >
    <option value="">Year</option>
    {Array.from({ length: 50 }, (_, i) => 2023 - i).map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M6.293 9.293L10 13l3.707-3.707a.999.999 0 111.414 1.414l-4 4a.999.999 0 01-1.414 0l-4-4a.997.997 0 010-1.414.999.999 0 011.414 0z"/>
      </svg>
    </div>
  </div>
</div>

    </div>
            <div>
              <label htmlFor="" className="block ml-1 text-blue-600 text-sm mt-2 ">Offer Price</label>
              <input className='border-black border px-4 w-[305px] py-2 rounded-md'
                 value={offerPrice} 
                 onChange={(e) => setOfferPrice(e.target.value)}
              type='text' />
              <p className='text-sm'>Enter Offer Price</p>
            </div>
          </div>
          <div className='flex mx-20  mb-6 justify-between'>
          <div>
              <label htmlFor="" className="block mb-2 ml-1 text-sm text-blue-600 ">CORISA</label>
              <select defaultValue="Select One" className='border-black border pl-5 pr-40 text-left  py-2 rounded-md'    value={corisa} 
                onChange={(e) => setCorisa(e.target.value)}>
              <option value="No">Select One</option>
              <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          <div className='bg-[#f4f6f9] px-1 py-1'>
          <div className='flex mx-5 my-5 text-center space-x-2 justify-between'>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-1 ">Project Name</label>
            <p className='text-[13px] line-clamp-3 '>{projectData?.Name || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-1">Project Type</label>
              <p className='text-[12px]' >{projectData?.ProjectType || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-1 ">Proponent</label>
              <p className='text-[12px]'>{projectData?.Proponent || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-1 ">Country</label>
              <p className='text-[12px]'>{projectData?.Country_Area || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 ml-1 mt-4 font-semibold">Methodology</label>
              <p className='text-[12px]'>{projectData?.Methodology || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-1 ">SDGs</label>
              <p className='text-[12px]'> {projectData?.SDGs || '|'}</p>
            </div>
          </div>
          <div className='flex mx-20 my-3 text-center space-x-3 justify-between'>
            <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 font-semibold  ml-1 mt-4 ">Additional Certificates 1</label>
            <p className='text-[12px]'>{projectData?.AdditionalAttributes?.Attribute1 || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-4 ">Additional Certificates 2</label>
              <p className='text-[12px]'>{projectData?.AdditionalAttributes?.Attribute2 || '|'}</p>
            </div>
            <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
              <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-4 ">Additional Certificates 3</label>
              <p className='text-[12px]'>{projectData?.AdditionalAttributes?.Attribute3 || '|'}</p>
            </div>
          </div>
          </div>
          <div className='flex justify-end my-2 mx-10'>
            <button className='bg-[rgb(47,84,235)] px-3  py-2 rounded-md text-white' onClick={handleSubmit}>Create New Offer</button>
            </div>
        </div>
        
      </Modal>
  
       
        </div>
        <div className="px-4 sm:px-6 md:px-0">
          <div className="pt-3">
            <div className={`h-[605px] flex flex-col justify-between ${modalIsOpen || modalIsOpen1 || modalIsOpen2 ? 'opacity-90 bg-gray-200' : ''} bg-white rounded-lg`}>
              <div className='flex flex-col justify-between'>
                <div className="flex space-x-5 mx-6 py-4 border-b border-gray-200">
                  <button>All Offers</button>
                  <button>Accepted Offers</button>
                  <button>Bookmarked</button>
                </div>
                <div className='flex mt-3 justify-between px-8'>
                  <label className="mb-2 text-sm font-medium text-gray-900 sr-only bg-white">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white  focus:ring-blue-500 focus:border-blue-500" placeholder="Search" required />
                  </div>
                    <button><FiUpload className='text-4xl p-1 px-2 border border-gray-300 rounded-lg' /></button>
                </div>
                <div className='flex font-semibold text-sm gap-3 mt-4 mx-10 py-2'>
                  <p className='pt-1 font-semibold'>Apply Filters</p>
                  <button className='border px-2 py-1 flex border-gray-700 rounded-md'>Last Purchase is more than 300 <RxCross2 className='mt-1 mx-1'/></button>
                  <button className='border px-2 py-1 flex border-gray-700 rounded-md'>Last Purchase is more than 300 <RxCross2 className='mt-1 mx-1' /></button>
                  <button className='border px-2 py-1 flex border-gray-300 rounded-md'>Add Filters<AiFillCaretDown className='mt-1 mx-1' /></button>
                </div>
                <table className=' items-center text-center mt-2 mr-10'>
                  <thead className='text-sm  text-gray-500   bg-[#f4f6f9]'>
                    <tr className='border-b'>
                      <th className='px-8 py-2 font-semibold'>SELECT</th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>PROJECT ID   </p><AiOutlineDown className='mt-1 mx-1'/>  </span></th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>PROJECT NAME </p><AiOutlineDown className='mt-1 mx-1'/>  </span></th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>PROJECT TYPE </p><AiOutlineDown className='mt-1 mx-1'/>  </span>  </th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>VINTAGE      </p><AiOutlineDown className='mt-1 mx-1'/>  </span>  </th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>QUANTITY     </p> <AiOutlineDown className='mt-1 mx-1'/> </span>  </th>
                      <th className='px-8 py-2 font-semibold '><span className='flex'><p>OFFER       </p> <AiOutlineDown className='mt-1 mx-1'/>  </span> </th>
                      <th className='px-8 py-2 font-semibold '>BID </th>
                    </tr>
                  </thead>
                  <tbody className='underline'>
                  {rowStates.map((isLocked, rowIndex) => (
            <tr onClick={() => openRowPopup(`Row ${rowIndex + 1} Data`)} className='border-b' key={rowIndex}>
              <td> <input className='py-4' type='checkbox' /></td>
              <td className='flex gap-2 py-4'>
                <button onClick={() => toggleLock(rowIndex)}>
                  {isLocked ? <FaLock className='mt-1' /> : <FaUnlock className='mt-1' />}
                </button>
                
                #129HjH9ukL
              </td>
            <td className='px-4 py-4'><button  onClick={openModal1}>totam est tenetur </button></td>
            <td className='px-4 py-4'><button  onClick={openModal1}>totam est tenetur </button></td>
            <td className='px-4 py-4'><button  onClick={openModal1}>2011 - 2022       </button></td>
            <td className='px-4 py-4'><button  onClick={openModal1}>45                </button></td>
            <td className='px-4 py-4'><button  onClick={openModal1}>$26,610           </button></td>
            <td className='px-4 py-4'><button  onClick={openModal1}>$26,610           </button></td>
          <td className='px-4 py-4'>
              <span className='flex gap-4 '>
                <button><BsThreeDots /></button>
                <button><AiOutlineDown/></button>
              </span>
            </td>
          </tr>
        ))}
          
      <Modal  isOpen={modalIsOpen1}
        onAfterOpen={afterOpenModal1}
        onRequestClose={closeModal1}
        className='py-1 rounded-l-xl rounded-lg min-h-full  flex justify-end   text-black '>
          <div className='bg-white min-h-screen'>
        <div className='flex  gap-40 mr-5 ml-2 justify-between'>
   <div className='flex'> <BsChevronLeft className='mt-4 ' />    <h2 ref={(_subtitle) => (subtitle = _subtitle)}  className='ml-2 '><span className=' my-2 text-center flex text-xl justify-center text-black'>Incoming Bids</span></h2>
   </div>
  <button
   onClick={closeModal1} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 11-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </button>
  
        </div>
        <hr className='text-xl font-bold text-black'/>      
        
        <div className='mx-5  rounded-tr-xl rounded-br-xl rounded-bl-xl font-semibold mt-8 cs1 text-white py-4'>
          <div className='flex gap-2'>
            <div>
          <div className='flex justify-center mx-4 items-center align-middle mb-4  gap-10'>
            <p>Offer Id</p>
            <p>Quantity</p>
            <p>Bid</p>
          </div>
          <div className='flex justify-center items-center text-center align-middle gap-10'>
            <p className='underline '>#129HjH9ukL</p>
            <p>45</p>
            <p>$26</p>
          </div>
          </div>
          <div>

          <p className='text-green-300 text-md  flex '><span className='text-4xl mt-2'>•</span><span className='mt-5'> Active</span></p>
          </div>
          </div>
        </div>
        <div className='mt-4 border rounded-xl border-black mx-4 py-2'>
          <div className='flex gap-2 justify-between mx-3 '>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='font-semibold'>Bid</p>
              <p className=' ml-4 font-semibold text-2xl'>$27</p>
            </div>
            <div className='bg-gray-100 px-3 pr-10 py-1 rounded-lg'>
              <p className='font-semibold'>From</p>
              <p className='ml-3 text-sm'>Company A</p>
            </div>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='text-center font-semibold'>Chat</p>
              <button onClick={() => { openModal2(); closeModal1(); }}><p className='text-[12px]'>Click To Chat </p></button>
            </div>
            </div>
            <div className='flex justify-center  gap-20 '>
              <select className='border flex outline-none space-x-5 mt-2  text-gray-500 py-1 rounded-md font-semibold pr-20'>
                <option>Evaluating</option>
                <option>Accept</option>
                <option>Reject</option>
                <option>On hold</option>
              </select>
              <p className='text-green-400 text-md  flex '><span className='text-4xl'>•</span><span className='mt-3'> Active</span></p>
            </div>
          </div>
          <div className='mt-2 border rounded-xl border-black mx-4 py-2'>
          <div className='flex  justify-between mx-3'>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='font-semibold'>Bid</p>
              <p className=' ml-4 font-semibold text-2xl'>$27</p>
            </div>
            <div className='bg-gray-100 px-3 pr-10 py-1 rounded-lg'>
              <p className='font-semibold'>From</p>
              <p className='ml-3 text-sm'>Company A</p>
            </div>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='text-center font-semibold'>Chat</p>
              <button onClick={() => { openModal2(); closeModal1(); }}> <p className='text-[12px]'>Click To Chat </p></button>
            </div>
            </div>
            <div className='flex justify-center  gap-16 '>
              <select className='border outline-none flex space-x-5 mt-2  text-gray-500 py-1 rounded-md font-semibold pr-20'>
              <option>Evaluating</option>
                <option>Accept</option>
                <option>Reject</option>
                <option>On hold</option>
              </select>
              <p className='text-orange-400 text-md  flex '><span className='text-4xl'>•</span><span className='mt-3'> On Hold</span></p>
            </div>
          </div>
          <div className='mt-2 border rounded-xl border-black mx-4 py-2'>
          <div className='flex  justify-between mx-3'>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='font-semibold'>Bid</p>
              <p className=' ml-4 font-semibold text-2xl'>$27</p>
            </div>
            <div className='bg-gray-100 px-3 pr-10 py-1 rounded-lg'>
              <p className='font-semibold'>From</p>
              <p className='ml-3 text-sm'>Company A</p>
            </div>
            <div className='bg-gray-100 px-3 py-1 rounded-lg'>
              <p className='text-center font-semibold'>Chat</p>
              <button onClick={() => { openModal2(); closeModal1(); }}>
  <p className="text-[12px]">Click To Chat</p>
</button>

            </div>
            </div>
            <div className='flex justify-center  gap-16 '>
              <select className='border outline-none flex space-x-5 mt-2  text-gray-500 py-1 rounded-md font-semibold pr-20'>
              <option>Evaluating</option>
                <option>Accept</option>
                <option>Reject</option>
                <option>On hold</option>
              </select>
              <p className='text-red-400 text-md  flex '><span className='text-4xl'>•</span><span className='mt-3'> Withdraw</span></p>
            </div>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={modalIsOpen2} onAfterOpen={afterOpenModal2} onRequestClose={closeModal2} className='pb-1 rounded-l-xl rounded-lg min-h-full flex justify-end text-black '>
  <div className='bg-[#e7e4e4] w-[400px] min-h-screen'>
    <div className='cs2 rounded-b-lg'>
      <div className='flex cs2 gap-40 pr-5 pl-2 justify-between'>
        <div className='flex'>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='ml-2'></h2>
        </div>
        <button onClick={closeModal2} className="ml-auto text-white inline-flex items-center rounded-lg bg-transparent pr-1.5 text-xl hover:bg-gray-200 hover:text-gray-900 dark:hover-bg-gray-600 dark:hover-text-white">
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
    {isTyping && <div className='text-center'><em>User is typing...</em></div>}
    
  <div >
    <p>Conversation Between You and Trader has Started been established</p>
    
  </div>


  <div className="container" style={{ maxHeight: "400px", maxWidth: "400px", overflowY: "scroll", overflowX: "hidden" }}>
  {messages
    .filter((msg) => msg.from !== 'server') // Replace 'server' with the actual server identifier
    .map((msg) => (
      <div key={msg.id} className={msg.from === userID ? "my-message" : "other-message"}>
        <div className="text-[10px] font-bold sender-name">
          {msg.from === userID ? <p>You</p> : msg.from.slice(0, -10)}
        </div>
        <div style={{ wordBreak: "break-word" }}>{msg.message}</div>
      </div>
    ))}
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
</Modal>

      
                  </tbody>
                </table>
             
              </div>
              <div>
                <div className='flex justify-between mx-10 py-2'>
                  <p className="flex"><AiOutlineArrowLeft className='mt-1 mx-2' /><span >Previous</span></p>
                  <p className="text-sm">1 2 3 ... 8 9 10</p>
                  <p className="flex"><span>Next</span> <AiOutlineArrowRight className='mt-1 mx-2' /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
          </div>
        </div>
      </div>
    </>
  )
}
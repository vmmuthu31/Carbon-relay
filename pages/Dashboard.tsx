import React, { Fragment, useState,useCallback, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {RxCrossCircled} from "react-icons/rx"
import {AiOutlineHome,AiFillSound,AiFillCaretDown,AiOutlineMenu,AiOutlineArrowLeft, AiOutlineDown,AiOutlineArrowRight, AiOutlineUp } from "react-icons/ai"
import {PiUserCircleGearLight,PiNewspaperClippingDuotone } from "react-icons/pi"
import {FiUpload} from "react-icons/fi";
import {FaLock, FaShare, FaUnlock} from "react-icons/fa"
import {RxCross2} from "react-icons/rx"
import {BsChevronLeft, BsThreeDots} from "react-icons/bs"
import {HiArrowLongRight, HiOutlineClipboardDocument} from "react-icons/hi2"
import Modal from 'react-modal'; // Adjust the import path as needed
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import Link from 'next/link'


const navigation = [
  { name: 'Home', href: '#', icon: AiOutlineHome, current: false },
 
]
const buynavigation = [
  { name: 'Credits Offers', href: '/CreditsOffers', icon: PiUserCircleGearLight, current: false },
  { name: 'Request Credits', href: '/RequestCredits', icon: PiUserCircleGearLight, current: false },

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
  const currentUserEmail = session?.user?.email;
  const [recipientID, setReceiptantID ] = useState()
  const [offercount, setOfferCount] = useState(0);
  const userID = useSelector((state) => state?.user?.user?.email);
  const role = useSelector((state) => state?.user?.user?.role);
  const token = useSelector((state) => state?.user?.token);
  const [offers, setOffers] = useState([]);
  const [bids, setBids] = useState([]);
  console.log("userID",userID)
  console.log("recipientID",recipientID)
  const router = useRouter()
  console.log("bids",bids)
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedbid, setselectedBid] = useState(null);
  const [selectedoffer, setselectedoffer] = useState(null);
  const [selectedProjectQuantity, setSelectedProjectQuantity] = useState(null);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/myoffers", {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setOffers(data);
        console.log("offers",data)
        const offersCount = data ? data.length : 0;
        console.log("data",data.length)
        console.log("ofc",offersCount)
        setOfferCount(offersCount);
        console.log("Number of offers:", offersCount);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
  
    fetchOffers();
  }, []);
  const [socket, setSocket] = useState(null);
useEffect(() => {
  const fetchOffers = async () => {
    try {
      const response = await fetch(`https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/get-bids/${selectedProjectId}`, {
        headers: {
          'Authorization': token
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setBids(data);
    } else {
      if(response?.statusText === "Unauthorized"){
        router.push("/Login")
      }
        console.error("Expected an array but received:", data);
    }
      const BidCount = data && Array.isArray(data) ? data.length : 0;
      // setOfferCount(BidCount);
      console.log("Number of Bids:", BidCount);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  fetchOffers();
}, [selectedProjectId]);

  console.log("count", offercount)
  console.log("token",token)
  console.log(recipientID,"receipt")
  const [isTyping, setIsTyping] = useState(false);
  
  const toggleLock = (rowIndex) => {
    const updatedRowStates = [...rowStates];
    updatedRowStates[rowIndex] = !updatedRowStates[rowIndex];
    setRowStates(updatedRowStates);
  };
  const openRowPopup = (rowData) => {
    setSelectedRowData(rowData);
  };
  useEffect(() => {
    const newSocket = new WebSocket('wss://carbon-relay-23a0f49f1c2f.herokuapp.com/ws');

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

const handleSend = (e) => {
  e.preventDefault();
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



  const closeRowPopup = () => {
    setSelectedRowData(null);
  };
  const [projectId, setProjectId] = useState('');
  const [projectData, setProjectData] = useState({});

  useEffect(() => {
    if (projectId) {
        fetch(`https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/projectData/${projectId}`)
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
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
console.log("projectid",projectId)
console.log("projectdata",projectData)


  const openModal = () => {
      setModalIsOpen(true);
  }
  const openModal1 = (projectId, quantity, offer) => {
    setSelectedProjectId(projectId);
    setSelectedProjectQuantity(quantity)
    setselectedoffer(offer)
    //  setReceiptantID(createdby)
    setModalIsOpen1(true);
    // ... any other logic to open the modal
  };
  
const openModal2 = () => {
  setModalIsOpen2(true);
}
const openModal5 = () => {
  setModalIsOpen5(true);
}
  
  const closeModal = () => {
      setModalIsOpen(false);
  }
  const closeModal1 = () => {
    setModalIsOpen1(false);
    setBids("")
}
const closeModal2 = () => {
  setModalIsOpen2(false);
}
const closeModal5 = () => {
  setModalIsOpen5(false);
}
  
const [startingYear, setStartingYear] = useState("");
const [endingYear, setEndingYear] = useState("");
const [offerPrice, setOfferPrice] = useState("");
const [corisa, setCorisa] = useState("");
const [isSubmitClicked, setIsSubmitClicked] = useState(false);
const [shareableLink, setShareableLink] = useState('');
const generateShareableLink = (offer) => {
  // Customize the link generation based on your data structure
  const link = `https://carbon-relay.vercel.app/CreditsOffers?PID=${offer.projectId}`; // Include all the necessary data
  return link;
};
const handleShareButtonClick = () => {
  // Assuming checkedOffers is an array of projectIds that have been checked
  const projectIdsParam = checkedOffers.join('&PID=');
  const baseLink = 'https://carbon-relay.vercel.app/CreditsOffers?PID=';
  const combinedLink = baseLink + projectIdsParam;

  setShareableLink(combinedLink);
  openModal5();
  // Show the popup or modal here, e.g., by setting a state variable to display it
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareableLink)
    .then(() => {
      console.log("Text copied to clipboard: ", shareableLink);
      toast.success("Copied to Clipboard")
      // You can add any further actions or notifications here.
    })
    .catch((error) => {
      console.error("Error copying text to clipboard: ", error);
      // Handle any errors here.
    });
};


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
      const response = await fetch("https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        toast.success("Offer Successfully received!")
        console.log(result);
        setIsSubmitClicked(true);
        setProjectId('');
        setQuantity('');
        setStartingYear('');
        setEndingYear('');
        setOfferPrice('');
        setCorisa('No');
        
        // Handle success - maybe show a success message or redirect the user
      } else {
        // Handle errors - maybe show an error message to the user
        console.error("Failed to submit data");
        toast.success("Failed to send the Offer!")

        closeModal()
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

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/myoffers", {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setOffers(data);
  
        const offersCount = data.length;
        setOfferCount(offersCount);  // Corrected this line
        console.log("Number of offers:", offersCount);
        
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
  
    if (isSubmitClicked) {
      fetchOffers();
    }
  }, [isSubmitClicked]);
  


  const [checkedOffers, setCheckedOffers] = useState([]);
  const handleCheckboxChange = (projectId) => {
    setCheckedOffers((prevCheckedOffers) => {
      if (prevCheckedOffers.includes(projectId)) {
        return prevCheckedOffers.filter((id) => id !== projectId);
      } else {
        return [...prevCheckedOffers, projectId];
      }
    });
  };
  



  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }
  function afterOpenModal1() {
    subtitle.style.color = '#f00';
  }
  function afterOpenModal2() {
    subtitle.style.color = '#f00';
  }
  function afterOpenModal5() {
    subtitle.style.color = '#f00';
  }

  const [tooltipVisibility, setTooltipVisibility] = useState({});

  const toggleTooltip = (projectId) => {
    setTooltipVisibility((prevState) => ({
      ...prevState,
      [projectId]: !prevState[projectId],
    }));
  };
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // Change handler for the select element
  const handleStatusChange = (bidId, newStatus) => {
    setSelectedStatuses(prev => ({ ...prev, [bidId]: newStatus }));
    updateBidStatus(bidId, newStatus); // Function to make API request
  };
  
  const updateBidStatus = async (bidId, newStatus) => {
    try {
      const response = await fetch(`https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/update-bid-status/${selectedProjectId}/${bidId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ newStatus }),
      });
      
  
      if (!response.ok) {
        throw new Error('Failed to update bid status');
      }
  
      // Additional logic if you need to do something after successful update
    } catch (error) {
      console.error('Error updating bid status:', error);
      // Handle error
    }
  };
  
  const multipleOffersSelected = checkedOffers.length > 1;



  const [dropdownVisibility, setDropdownVisibility] = useState([]);
  useEffect(() => {
    // Initialize the dropdownVisibility array to all false initially
    setDropdownVisibility(new Array(offers.length).fill(false));
  }, [offers]);
  
  const [isButtonOpenArray, setIsButtonOpenArray] = useState(new Array(offers.length).fill(false));

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
                  <Link
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
                  </Link>
                ))}
                <div>
                  <p className='text-sm my-2 px-2 text-[#8C8C8C]'>BUY</p>
                  {buynavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {sellnavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
                </div>
              </nav>
              <nav className="flex-1 px-2 pb-1 space-y-1">
               <p className='text-md px-2 py-4 font-semibold text-gray-800'>Company Relay</p>
                <div>
                  <p className='text-sm px-2 my-2 text-[#8C8C8C]'>BUY</p>
                  {Cbuynavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {Csellnavigation.map((item) => (
                  <Link
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
                  </Link>
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
          <div className={`border-r border-gray-200 py-2 flex flex-col  flex-grow ${modalIsOpen || modalIsOpen1 || modalIsOpen2|| modalIsOpen5 ? 'opacity-50' : ''} overflow-y-auto`}>
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
                  <Link
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
                  </Link>
                ))}
                <div>
                  <p className='text-sm my-2 px-2 text-[#8C8C8C]'>BUY</p>
                  {buynavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {sellnavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
                </div>
              </nav>
              <nav className="flex-1 px-2 pb-1 space-y-1">
               <p className='text-md px-2 py-4 font-semibold text-gray-800'>Company Relay</p>
                <div>
                  <p className='text-sm px-2 my-2 text-[#8C8C8C]'>BUY</p>
                  {Cbuynavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
             <p className='text-sm px-2 my-2 text-[#8C8C8C]'>Sell</p>
                 {Csellnavigation.map((item) => (
                  <Link
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
                  </Link>
                ))}
                </div>
              </nav>
            </div>
            
          </div>
        </div>

        <div className="md:pl-52">
          <div className={`flex flex-col ${modalIsOpen || modalIsOpen1 || modalIsOpen2 || modalIsOpen5 ? 'opacity-90 bg-gray-200' : ''} bg-[#f4f6f9]  md:px-8 xl:px-0`}>
            <div className={`sticky top-0 z-10 flex-shrink-0 h-16 ${modalIsOpen || modalIsOpen1 || modalIsOpen2 || modalIsOpen5 ? 'opacity-60 bg-gray-200' : ''} bg-white border-b border-gray-200 flex`}>
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
          <h1 className="text-lg font-semibold text-gray-900">You have {offercount} active offers available</h1>
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
      <button onClick={decreaseQuantity} className='text-2xl px-1 py-1 mx-1 ml-4 rounded-3xl bg-gray-100'>-</button>
      <span className='mt-2'>{quantity}</span>
      <button onClick={increaseQuantity} className='text-xl px-0.5 py-1.5 mx-1 rounded-3xl bg-gray-100'>+</button>
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
            <ToastContainer />
        </div>
      </Modal>     
        </div>
        <div className="px-4 sm:px-6 md:px-0">
          <div className="pt-3">
            <div className={`h-[605px] flex flex-col justify-between ${modalIsOpen || modalIsOpen1 || modalIsOpen2 || modalIsOpen5 ? 'opacity-90 bg-gray-200' : ''} bg-white rounded-lg`}>
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
                <div className="table-container">
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
                      <th className='px-8 py-2 font-semibold '>
                      {multipleOffersSelected && (
  <button className='flex bg-[rgb(47,84,235)] text-white px-2 py-2 rounded-lg' onClick={() => handleShareButtonClick(checkedOffers)}>
    Share <FaShare className='text-xl text-white w-8' />
  </button>
)}
</th>
                    </tr>
                  </thead>
                  <tbody className='underline '>
                    
                  {Array.isArray(offers) ? 
  offers
    .map(offer => ({ ...offer, creationDate: new Date(offer.creationDate) })) // Convert date strings to Date objects
    .sort((a, b) => b.creationDate - a.creationDate) // Sort offers in descending order by creation date
    .map((offer, index) => {
      const projectDataForOffer = projectData[offer.projectId] || {}; // Default to an empty object

  console.log("project", offer.projectId);
  const toggleDropdown = (index) => {
    console.log("Hello")
    setDropdownVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index]; 
      return updatedVisibility;
    });
  };

  const isDropdownVisible = dropdownVisibility[index];
  console.log("proj", projectDataForOffer);
  const handleOptionClick = (option) => {
    switch (option) {
      case "Active":
        break;
      case "Hold":
        break;
      case "Withdraw":
        break;
      case "Bookmark":
        break;
      case "Duplicate":
        break;
      default:
        break;
    }
  };

  return (
    <tr key={index} 
    className={`relative ${checkedOffers.includes(offer.projectId) ? '  px-10 h-10' : ''}`}>
      <td>
          <input 
      className='py-4' 
      type='checkbox' 
      checked={checkedOffers.includes(offer.projectId)}
      onChange={() => handleCheckboxChange(offer.projectId)}
        />
    </td>

<td className='flex gap-2 py-4'>
            <button onClick={() => toggleLock(index)}>
                {rowStates[index] ? <FaLock className='mt-1' /> : <FaUnlock className='mt-1' />}
            </button>
            {offer.projectId}
            </td>
            <td className='px-4 py-4 text-sm'>
        <button onClick={() => openModal1(offer.projectId,offer.quantity,offer.offerPrice)}><span className=' line-clamp-2'>{offer.projectName}</span></button>
      </td>
      <td className='px-4 py-4 text-sm'>
        <button onClick={() => openModal1(offer.projectId,offer.quantity,offer.offerPrice)}>{offer.projectType}</button>
      </td>
      <td className='px-4 py-4 text-sm'>
        <button onClick={() => openModal1(offer.projectId,offer.quantity,offer.offerPrice)}>
          {offer.startingYear}-{offer.endingYear}
        </button>
      </td>
      <td className='px-4 py-4 text-sm'>
        <button onClick={() => openModal1(offer.projectId,offer.quantity,offer.offerPrice)}>{offer.quantity}</button>
      </td>
      <td className='px-4 py-4 text-sm'>
        <button onClick={() => openModal1(offer.projectId,offer.quantity,offer.offerPrice)}>${offer.offerPrice}</button>
      </td>
      <td className='px-4 py-4 text-sm'>
  <button onClick={() => { openModal1(offer.projectId, offer.quantity,offer.offerPrice); setReceiptantID(offer.createdBy) }}>
  {offer.bids && offer.bids.length > 0 ? 
    `$${Math.max(...offer.bids.map(bid => bid.bidAmount))}` : 
    '-'
}

  </button>
</td>

    {!checkedOffers.includes(offer.projectId) && (
        <>
        
      <td className='px-4 py-4 text-sm'>
        <div className='flex gap-4'>
        <span>
      <button onClick={() => toggleDropdown(index)}><BsThreeDots /></button>
      {isDropdownVisible && (
        <div className="modal-dropdown">
          <ul>
            <li onClick={() => handleOptionClick("Active")}>Active</li>
            <li onClick={() => handleOptionClick("Hold")}>Hold</li>
            <li className=' border-dashed border-b-2 border-gray-200' onClick={() => handleOptionClick("Withdraw")}>Withdraw</li>
            
            <li onClick={() => handleOptionClick("Bookmark")}>Bookmark</li>
            <li onClick={() => handleOptionClick("Duplicate")}>Duplicate</li>
          </ul>
        </div>
      )}
    </span>
          <button
            onClick={() => {
              toggleLock(index);
              if (!projectData[offer.projectId]) {
                fetch(`https://carbon-relay-23a0f49f1c2f.herokuapp.com/auth/projectData/${offer.projectId}`)
                  .then((response) => response.json())
                  .then((data) => {
                    setProjectData((prevData) => ({
                      ...prevData,
                      [offer.projectId]: data,
                    }));
                  })
                  .catch((error) => {
                    console.error("Error fetching project data:", error);
                  });
              }
              toggleTooltip(offer.projectId);
              setIsButtonOpenArray((prevState) => {
                const newArray = [...prevState];
                newArray[index] = !newArray[index];
                return newArray;
              });
                      }}
          >
  {isButtonOpenArray[index] ? <AiOutlineUp /> : <AiOutlineDown />}
          </button>
          {tooltipVisibility[offer.projectId] && (
            <div className="absolute top-full px-28 pr-44 left-1/2 transform -translate-x-1/2 bg-[#f4f6f9] rounded-lg p-1 text-center z-10">
              <div className="tooltip-text">
                <div>
                  <div className='flex mx-5 my-1 text-center space-x-2 justify-between'>
                   
                    <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-1">Project Type</label>
                      <p className='text-[12px]'>{projectDataForOffer.ProjectType || '|'}</p>
                    </div>
                    <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-1">Proponent</label>
                      <p className='text-[12px]'>{projectDataForOffer.Proponent || '|'}</p>
                    </div>
                    <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-1">Country</label>
                      <p className='text-[12px]'>{projectDataForOffer.Country_Area || '|'}</p>
                    </div>
                    <div className='w-full text-sm px-3 py-1  rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 ml-1 mt-4 font-semibold">Methodology</label>
                      <p className='text-[12px]'>{projectDataForOffer.Methodology || '|'}</p>
                    </div>
                    <div className='w-[500px] text-sm px-3 py-1  rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-1">SDGs</label>
                      <p className='text-[12px]'> {projectDataForOffer.SDGs || '|'}</p>
                    </div>
                  </div>
                  <div className='flex mx-20 my-3 text-center space-x-3 justify-between'>
                    <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 font-semibold ml-1 mt-4">Additional Certificates 1</label>
                      <p className='text-[12px]'>{projectDataForOffer.AdditionalAttributes?.Attribute1 || '|'}</p>
                    </div>
                    <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-4">Additional Certificates 2</label>
                      <p className='text-[12px]'>{projectDataForOffer.AdditionalAttributes?.Attribute2 || '|'}</p>
                    </div>
                    <div className='w-full text-sm px-3 pr-20 py-1 rounded-lg bg-white'>
                      <label htmlFor="" className="block mb-2 ml-1 font-semibold mt-4">Additional Certificates 3</label>
                      <p className='text-[12px]'>{projectDataForOffer.AdditionalAttributes?.Attribute3 || '|'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
        </>
    )}
    <td>
    {!multipleOffersSelected && checkedOffers.includes(offer.projectId) && (
            <td>
              <button onClick={() => handleShareButtonClick(offer)}>
                <FaShare className='text-xl text-gray-700 w-8' />
              </button>
            </td>
          )}
    </td>
   
    </tr>
    
  );
}): null}
  

<Modal
   isOpen={modalIsOpen5}
   onAfterOpen={afterOpenModal5}
   onRequestClose={closeModal5}
   style={customStyles}
   className='py-2 rounded-lg  my-10   mt-[300px]   mx-[800px]  text-black '>
 <div className='flex justify-between mx-[500px] bg-white w-[420px]'>
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}  className='mx-5  '><span className=' my-2 text-center flex justify-center font-semibold text-black'>Share the Link</span></h2>
       
  <button
   onClick={closeModal5} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
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
        <div >
        <div className='mx-[500px]'>
  <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='ml-2'></h2>
    <p className='my-2'>Share the Referal Link to your Buyers:</p>
    <div className=" flex    space-x-12">
    <input type="text" className='border w-72  border-gray-600 rounded-md px-2' value={shareableLink} readOnly />
    <button onClick={copyToClipboard}><HiOutlineClipboardDocument className=' h-8 w-10 text-6xl  bg-gray-200 ' /></button>
    </div>
    <ToastContainer />
  </div>
        </div>
 
</Modal>

     

      
                  </tbody>
                </table>
                
                </div>
               <Modal isOpen={modalIsOpen1}
  onAfterOpen={afterOpenModal1}
  onRequestClose={closeModal1}
  className='py-1 rounded-l-xl rounded-lg min-h-full flex justify-end text-black'>
  <div className='bg-white min-h-screen'>
    <div className='flex gap-40 mr-5 ml-2 justify-between'>
    <div className='flex'>
                <BsChevronLeft className='mt-4'/>
                <button onClick={() => { openModal2(); closeModal1(); }} ref={(_subtitle) => (subtitle = _subtitle)} className='ml-2'>
                    <span className='my-2 text-center flex text-xl justify-center text-black'>Incoming Bids</span>
                </button>
            </div>
            <button onClick={()=>{closeModal1(); setSelectedProjectId("")}} className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 11-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
            </button>
        </div>
     
    <hr className='text-xl font-bold text-black' />
    <div className='mx-2  font-semibold mt-5  text-white py-4'>
      <div className='flex justify-between px-4 rounded-tr-xl py-4   cs1'>
      <table >
  <thead >
    <tr  >
      <th className='pr-3'>Offer Id</th>
      <th className='pr-3'>Quantity</th>
      <th className='pr-3'>Bid</th>
    </tr>
  </thead>
  <tbody>
    <tr className='text-center'>
      <td>{selectedProjectId}</td>
      {bids && bids.length  > 0 ? (
        <>
          <td>{bids[0].offerData.quantity}</td> {/* Use bid.offerQuantity here */}
          <td>{bids && bids.length > 0 ? `$${Math.max(...bids.map(bid => bid.bidAmount))}` : '-'}</td> {/* Use bid.bidAmount here */}
        </>
      ) : (
        <>
          <td>{selectedProjectQuantity}</td>
          <td>-</td>
        </>
      )}
    </tr>
  </tbody>
</table>

        <div>
          {bids && bids.length > 0 ? ( 
            <p className='text-green-300 text-md flex'>
              <span className='text-4xl mt-2'>•</span>
              <span className='mt-5'> Active</span>
            </p>
          ) : (
            <p className='text-red-300 text-md flex'>
              <span className='text-4xl mt-2'>•</span>
              <span className='mt-5'> No Bids Placed</span>
            </p>
          )}
        </div>
      </div>
      {Array.isArray(bids) && bids?.map((bid, index) => (
  <div key={index}>
    <div className=' font-semibold mt-4  text-white py-4'>
      
      <div className=' border rounded-xl border-black mx-4 py-2'>
        <div className='flex gap-2 text-black justify-between mx-3 '>
          <div className='bg-gray-100 px-3 py-1 rounded-lg'>
            <p className='font-semibold'>Bid</p>
            <p className=' ml-4 font-semibold text-2xl'>${bid.bidAmount}</p> {/* Use bid.bidAmount here */}
          </div>
          <div className='bg-gray-100 px-3 pr-10 py-1 rounded-lg'>
            <p className='font-semibold'>From</p>
            <p className='ml-3 font-semibold text-sm'>{bid.traderCompany}</p> {/* Use bid.traderCompanyName here */}
          </div>
          <div className='bg-gray-100 px-3 py-1 rounded-lg'>
            <p className='text-center font-semibold'>Chat</p>
            <button onClick={() => { openModal2(); closeModal1(); setselectedBid(bid.bidAmount); setReceiptantID(bid.traderemail); }}>
              <p className='text-[12px]'>Click To Chat</p>
            </button>
          </div>
        </div>
        <div className='flex mx-4 justify-center gap-20'>
        <select 
        value={selectedStatuses[bid._id] || bid.status} 
        onChange={(e) => handleStatusChange(bid._id, e.target.value)}
        className='border flex outline-none space-x-5 mt-2 text-gray-500 py-1 rounded-md font-semibold pr-20'>
        <option>Evaluating</option>
        <option>Accept</option>
        <option>Reject</option>
        <option>On hold</option>
      </select>
          <p className='text-green-400 text-md flex'><span className='text-4xl'>•</span><span className='mt-3'>{bid.status}</span></p>
        </div>
      </div>
    </div>
  </div>
))}
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
        <button onClick={closeModal2} className="ml-auto text-white inline-flex items-center rounded-lg bg-transparent  text-xl hover:bg-gray-200 hover:text-gray-900 dark:hover-bg-gray-600 dark:hover-text-white">
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
            <p className='bg-white text-black font-semibold pl-1 pr-10 rounded-sm'>${selectedoffer}</p>
          </div>
          <div className='flex space-x-8 mt-2'>
            <p>Bid</p>
            <p className='bg-white text-black font-semibold pl-1 pr-7 rounded-sm'>${selectedbid}</p>
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
    
  <div className="px-4" >
    <p >Conversation Between You and Trader has Started been established</p>
    
  </div>


  <div className="container" style={{ maxHeight: "400px", maxWidth: "400px", overflowY: "scroll", overflowX: "hidden" }}>
  {messages
    .filter((msg) => msg.from !== 'server') 
    .map((msg) => (
      <div key={msg.id} className={msg.from === userID ? "my-message" : "other-message"}>
        <div className="text-[10px] font-bold sender-name">
          {msg.from === userID ? <p>You</p> : msg.from.slice(0, -10)}
        </div>
        <div style={{ wordBreak: "break-word" }}>{msg.message}</div>
      </div>
    ))}
</div>


    <div className='mt-4  sticky-bottom py-2'>
      <div className="flex ">
        <form className="relative">
          <input
            className="px-3 mx-5 w-[340px] py-4 outline-none border rounded-sm "
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
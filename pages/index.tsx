"use client";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import {useSession} from "next-auth/react";
import { CiPlay1 } from "react-icons/ci";
import Image from 'next/image';
import offer1 from "../assets/offer1.png"
import offer2 from "../assets/offer2.png"
import offer3 from "../assets/offer3.png"
import offer4 from "../assets/offer4.png"
import logo from "../assets/logo.png"
import teamzone from "../assets/teamzone.png"
import team1 from "../assets/team1.png"
import team2 from "../assets/team2.png"
import team3 from "../assets/team3.png"
import contact from "../assets/contact.png"
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";


const Home: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = 2; 
    const [visible, setVisible] = useState({});

    const goToSlide = (index) => {
      setActiveIndex(index);
  };
    const slides = [
      {
          quote: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.",
          imageUrl: "https://pbs.twimg.com/profile_images/1674815862879178752/nTGMV1Eo_400x400.jpg",
          author: "Judith Black",
          title: "CEO of Workcation"
      },
      {
          quote: "Another inspiring quote here. Vivamus suscipit tortor eget felis porttitor volutpat.",
          imageUrl: "data:image/jpeg;base64,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",
          author: "John Doe",
          title: "CTO of Adventure Inc."
      },
  ];

  const toggleVisibility = (index) => {
    setVisible(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const faqs = [
    {
      question: "How do I create an account on this platform?",
      answer: "GIGS is a modern platform for job hunting and hiring, offering a vast array of exciting opportunities."
    },
    {
      question: "How can I post a job listing on the platform?",
      answer: "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities."
    },
    {
      question: "What is the benefit of using tokens on this platform?",
      answer: "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities."
    },
    {
      question: "How can I apply for a job using tokens?",
      answer: "You can sign up on the GIGS platform by creating an account and then start exploring job opportunities."
    },
  ];

    const goToPrevSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
        );
    };

    const goToNextSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
        );
    };


  useEffect(()=>{
    if (session){
      router.push("/Dashboard");
    }
  },[session])
  console.log(session)
  return (
    <div className=" bg-[url('../assets/hero.png')] pb-2 bgdm bg-no-repeat  ">
      <Navbar />
      <main className="">   
        <div className="md:bg-[url('../assets/hero2.png')] bg-contain bg-no-repeat bgdm2 pb-5   ">
        
          <div className="text-center   md:pb-52">
            <h1 className="text-3xl  pt-20  md:pt-44 text-center font-bold tracking-tight text-gray-900  sm:text-4xl">
            Empower Your Carbon Trades with 
 <br/>Next-Gen OTC Management
            </h1>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/Login"
                className="rounded-md flex bg-btn-landing px-3.5 py-2.5  font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Launch Carbon Relay <CiPlay1 className=" mx-2 text-lg mt-1 " />

              </Link>
            
            </div>
          </div>
        </div>
      </main>
      <div className="bg-[url('../assets/hero1.png')] mt-10 md:mt-0 md:py-20 bg-no-repeat bg-contain bgdm">
      <div className="flex  ">
          <Image
          src={offer1}
          alt=""
          className="md:w-80 w-[102px] md:mt-20"
           />
             <Image
          src={offer2}
          alt=""
          className="md:w-96 w-40"
           />
           <Image
          src={offer3}
          alt=""
          className="md:w-80 w-28  md:py-10"
           />
           <Image
          src={offer4}
          alt=""
          className="hidden md:block"
           />
      </div>
      </div>
      <div >
        <h1 className="text-center text-3xl mt-10 md:mt-0  font-bold">Why Carbon Relay?</h1>
        <div className="flex md:flex-row flex-col justify-center mx-5 mt-5 md:mx-40  md:my-10 md:space-x-20">
          <div className="py-5 px-5 rounded-lg  border shadow-2xl ">
          <div className="flex  justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
              <h1 className="text-center text-xl font-bold my-2">Seamless Bid/Offer Creation</h1>
              <p className="text-center md:w-96">Effortlessly craft and disseminate bids and offers to selected parties, streamlining your trading process in the carbon market.
</p>
          </div>
          <div className="py-5  px-5 rounded-lg  border shadow-2xl">
          <div className="flex  justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
          <h1 className="text-center  text-xl font-bold my-2">Trade Activity Dashboard</h1>
          <p className="text-center md:w-96">Monitor and manage all your carbon credit trade activities through a single, intuitive interface.
</p>
          </div> 
          <div className="py-5 px-5 rounded-lg  border shadow-2xl">
            <div className="flex justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
          <h1 className="text-center  text-xl font-bold my-2">Enhanced Communication and Document Sharing</h1>
          <p className="text-center md:w-96">Engage in secure chats and share documents with complete control, ensuring confidential and efficient interactions.
</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center mx-5 mt-5 md:my-10 md:space-x-20">
          <div className="py-5 px-5 rounded-lg  border shadow-2xl ">
          <div className="flex  justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
              <h1 className="text-center text-xl font-bold my-2">Integrated Project Due Diligence Dashboard</h1>
              <p className="text-center md:w-96">Comprehensive project data at your fingertips.
</p>
          </div>
          <div className="py-5 px-5 rounded-lg  border shadow-2xl">
          <div className="flex justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
          <h1 className="text-center  text-xl font-bold my-2">Streamlined Contract and Settlement Process</h1>
          <p className="text-center md:w-96">Utilize our platform to swiftly sign standard contracts and settle transactions, simplifying the closure of deals.

</p>
          </div> 
         
        </div>
        <div className="my-10 mt-24">
          <p className="text-center text-4xl font-bold">Advanced Analytics for Strategic Trading</p>
         
          <div className="flex flex-col md:flex-row justify-center mx-5 mt-5 md:my-10 md:space-x-20">
          <div className="py-5 px-5 rounded-lg  border shadow-2xl ">
          <div className="flex  justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
           <h1 className="text-center text-xl font-bold my-2">Market-Informed Pricing:</h1>
              <p className="text-center mt-2 md:w-96"> Leverage cutting-edge analytics to price your offers and bids, informed by real-time market trends and conditions.

</p>
          </div>
          <div className="py-5 px-5 rounded-lg  border shadow-2xl">
          <div className="flex justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
           <h1 className="text-center text-xl font-bold my-2">Curated Buyer Matching:</h1>
          <p className="text-center mt-2 md:w-96"> Benefit from a tailored list of potential buyers for each offer, crafted to maximize the relevance and success rate of your trades.

</p>
          </div> 
         
        </div>
        </div>
      </div>
      {/* <div  className="flex justify-center mx-10" >
        <Image 
        src={teamzone}
        alt=""
        />
        <div>
        <p className="text-4xl font-bold my-7 text-center">Meet our team</p>
        <p className="text-center mx-10"> The dedicated minds behind Carbon Relay bring a wealth of expertise to redefine how businesses connect and thrive. Together, our team envisions, innovates, and paves the way for a future where transparent collaboration transforms the business ecosystem</p>
        </div>
        <div className="mx-28">
          <p>.</p>
        </div>
      </div>
      <div>
          <div className="flex flex-col mb-5 justify-center">
            <div className="flex justify-center ">
            <Image
            src=""
            alt=""
            className="w-60 h-60"
            />
            </div>
            <p className="text-center text-2xl font-bold my-2">ABC</p>
            <p className="text-center ">Founder</p>
            <p className="text-center my-2 mx-96"> Founding Innovator: ABC, steering Carbon Relay with a <br/> visionary approach, expertly blending strategic thinking with a passion for <br/> transparent collaborations</p>
            <div className="flex text-lg space-x-5 justify-center">
              <FaLinkedin />
              <FaTwitter />
            </div>
          </div>
          <div className="flex ml-20 justify-center">
          <div className="flex flex-col mb-5 justify-center">
            <div className="flex justify-center ">
            <Image
            src=""
            alt=""
            className="w-60 h-60"
            />
            </div>
            <p className="text-center text-2xl font-bold my-2">ABC</p>
            <p className="text-center ">Founder</p>
            <p className="text-center my-2 mx-20 "> Founding Innovator: ABC, steering Carbon Relay with a <br/> visionary approach, expertly blending strategic thinking with a passion for <br/> transparent collaborations</p>
            <div className="flex text-lg space-x-5 justify-center">
              <FaLinkedin />
              <FaTwitter />
            </div>
          </div>
          <div className="flex flex-col mb-5 justify-center">
            <div className="flex  justify-center ">
            <Image
            src=""
            alt=""
            className="w-60 h-60"
            />
            </div>
            <p className="text-center text-2xl font-bold my-2">ABC</p>
            <p className="text-center ">Founder</p>
            <p className="text-center my-2 mx-20 "> Founding Innovator: ABC, steering Carbon Relay with a <br/> visionary approach, expertly blending strategic thinking with a passion for <br/> transparent collaborations</p>
            <div className="flex text-lg space-x-5 justify-center">
              <FaLinkedin />
              <FaTwitter />
            </div>
          </div>
          </div>
          
      </div> */}
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`duration-700 ease-in-out ${index === activeIndex ? 'block' : 'hidden'}`}
                        data-carousel-item
                    >
                        <section className="relative isolate overflow-hidden bg-white px-6 py-10 sm:py-20 lg:px-8">
                            
                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
                            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
                            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                                <figure >
                                    <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                                        <p>{slide.quote}</p>
                                    </blockquote>
                                    <figcaption className="mt-10 justify-center items-center flex">
                                        <img
                                            className=" h-10 w-10 rounded-full"
                                            src={slide.imageUrl}
                                            alt={slide.author}
                                        />
                                        <div className=" flex flex-col items-center justify-center space-x-3 text-base">
                                            <div className="font-semibold text-gray-900">{slide.author}</div>
                                            
                                            <div className="text-gray-600">{slide.title}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            </div>
                        </section>
                    </div>
                ))}
            </div>

            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {[...Array(totalSlides).keys()].map((index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-black' : 'bg-white'}`}
                        aria-current={index === activeIndex ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => goToSlide(index)}
                    ></button>
                ))}
            </div>
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={goToPrevSlide}
                data-carousel-prev
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={goToNextSlide}
                data-carousel-next
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
{/* <div>
  <p className="text-center mt-5 text-4xl font-bold">Frequently asked questions</p>
  <p className="text-center my-5 mx-96">Frequently asked questions ordered by popularity. Remember that if the visitor has not committed to the call to action, they may still have questions (doubts) that can be answered.</p>
  <div className="flex flex-col px-5 my-10 items-center justify-center w-full">
  {faqs.map((faq, index) => (
    <div key={index} className="w-full  flex flex-col items-center mb-4">
      <button
        className={`bg-white border border-[#7752FE] ${
          visible[index] ? 'rounded-t-md' : 'rounded-md'
        } w-full md:w-[580px] font-semibold md:text-xl py-4 px-5 flex justify-between items-center mx-auto`}
        onClick={() => toggleVisibility(index)}
      >
        {faq.question} <AiFillCaretDown className={`${visible[index] ? 'rotate-180' : ''}`} />
      </button>
      {visible[index] && (
        <div className="md:w-[580px] rounded-b-md border border-t-0 border-[#7752FE] bg-white py-2 px-4 text-center mx-auto mt-0">
          {faq.answer}
        </div>
      )}
    </div>
  ))}
</div>
</div> */}
<div>

<div className="flex  md:flex-row flex-col justify-center my-5 md:space-x-8">
<Image
src={contact}
alt=""
className=" md:h-[500px]"
/>
<div className="mx-8">
  <p className="text-4xl mt-8 md:mt-0 font-bold">Contact us</p>
  <p className="mt-8 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
  <p>Name</p>
  <input className="border border-[#2B3F84] rounded-xl w-full  md:w-96 px-3 py-2 outline-none my-1" />
  <p>Email</p>
  <input className="border border-[#2B3F84] rounded-xl w-full md:w-96 px-3 py-2 my-1 outline-none" />
  <p>Message</p>
  <textarea placeholder="Type your message..." className="border h-32 border-[#2B3F84] rounded-2xl w-full   md:w-96 px-3 py-1 my-1" />
  <br/>
  <div className="flex space-x-3">
  <input type="checkbox" />
  <p>I I accept the <span className="underline"> Terms</span></p>
  </div>
  <button
                className="rounded-md mt-3 w-20 flex bg-btn-landing px-3.5 py-2.5  font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Submit

              </button>
</div>
</div>
<div className=" flex pt-2 justify-between border-t-2 mx-6 text-sm md:mx-10 mt-10 border-black">
<p >© 2023 Carbon Relay. All rights reserved.</p>
<div className="flex md:space-x-5">
<p>Privacy Policy</p>
<p>Terms of Service</p>
<p> Cookies Settings</p>
</div>
</div>
</div>
    </div>
  );
};

export default Home;

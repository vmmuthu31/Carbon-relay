"use client";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {useSession} from "next-auth/react";
import { CiPlay1 } from "react-icons/ci";
import Image from 'next/image';
import offer1 from "../assets/offer1.png"
import offer2 from "../assets/offer2.png"
import offer3 from "../assets/offer3.png"
import offer4 from "../assets/offer4.png"
import logo from "../assets/logo.png"

const Home: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(()=>{
    if (session){
      router.push("/Dashboard");
    }
  },[session])
  console.log(session)
  return (
    <div className=" bg-[url('../assets/hero.png')] bgdm bg-no-repeat  ">
      <Navbar />
      <main className="">   
        <div className=" bg-[url('../assets/hero2.png')] bg-contain bg-no-repeat bgdm2 pb-5   ">
        
          <div className="text-center   pb-52">
            <h1 className="text-4xl    pt-44 text-center font-bold tracking-tight text-gray-900 sm:text-6xl">
            Unlock a New Era of <br/> Business Partnerships
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
            Welcome to Carbon Relay, Where Transparency Defines Transactions            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/Login"
                className="rounded-md flex bg-btn-landing px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Launch Carbon Relay <CiPlay1 className=" mx-2 text-lg mt-1 " />

              </Link>
            
            </div>
          </div>
        </div>
      </main>
      <div className="bg-[url('../assets/hero1.png')] py-20 bg-no-repeat bg-contain bgdm">
      <div className="flex  ">
          <Image
          src={offer1}
          alt=""
          className="w-80 mt-20"
           />
             <Image
          src={offer2}
          alt=""
          className="w-96"
           />
           <Image
          src={offer3}
          alt=""
          className="w-80 py-10"
           />
           <Image
          src={offer4}
          alt=""
           />
      </div>
      </div>
      <div >
        <h1 className="text-center text-3xl  font-bold">Why Carbon Relay?</h1>
        <div className="flex justify-center  my-10 space-x-20">
          <div className="py-5 px-5 rounded-lg  border shadow-2xl ">
          <div className="flex  justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
              <h1 className="text-center text-xl font-bold my-2">Transparent Trust</h1>
              <p className="text-center w-96">At Carbon Relay, transparency is key in every credit transaction. Our commitment to clarity ensures open visibility at every collaboration stage, fostering a trustworthy environment. Businesses can engage confidently, knowing interactions are honest, accountable, and reliable. Whether creating, sharing, or bidding on credits, Carbon Relay ensures a transparent foundation for authentic and meaningful partnerships.</p>
          </div>
          <div className="py-5 px-5 rounded-lg  border shadow-2xl">
          <div className="flex justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
          <h1 className="text-center  text-xl font-bold my-2">Competitive Bidding</h1>
          <p className="text-center w-96">In Carbon Relay&apos;s dynamic credit world, our unique bidding system creates a marketplace where organizations actively compete. This ensures fair, market-driven pricing, reflecting the true value of credits. Engage in a vibrant bidding environment that maximizes returns, setting the stage for a responsive credit exchange ecosystem.</p>
          </div> 
          <div className="py-5 px-5 rounded-lg  border shadow-2xl">
            <div className="flex justify-center">
          <Image
          src={logo}
          alt=""
          className="w-12"
           />
           </div>
          <h1 className="text-center  text-xl font-bold my-2">Strategic Collaboration</h1>
          <p className="text-center w-96">Forge strategic alliances with Carbon Relay. Our platform provides a dynamic space for businesses to collaborate strategically, fostering innovation and adaptability. Navigate the ever-changing marketplace with confidence, making empowered financial decisions tailored to the unique needs of your organization. Experience a synergy that goes beyond transactions, unlocking opportunities for growth and sustained success through strategic collaboration.
</p>
          </div>
        </div>
        <div className="my-10 mt-24">
          <p className="text-center text-4xl font-bold">Revolutionize Collaboration with Carbon <br/> Relay: Unleashing Transparent Credit <br/> Exchange and Dynamic Bidding</p>
          <p className="mx-72 my-5 text-center">Transform the way you collaborate with Carbon Relay&apos;s cutting-edge features. Experience unprecedented transparency in credit exchange and engage in a dynamic bidding system that reshapes the landscape of business interactions. Elevate your partnerships with a platform designed for innovation and strategic collaboration.</p>
        </div>
      </div>

    </div>
  );
};

export default Home;

"use client";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {useSession} from "next-auth/react";
import { CiPlay1 } from "react-icons/ci";

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
    <div className=" bg-[url('../assets/hero.png')] pb-14 bgdm bg-no-repeat  ">
      <Navbar />
      <main className="">   
        <div className="  bg-contain bg-no-repeat bgdm2 pb-10   ">
        
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
      <div className=" py-20 bg-no-repeat bg-contain bgdm">

      </div>
    </div>
  );
};

export default Home;

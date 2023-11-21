"use client";
import Link from "next/link";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {useSession} from "next-auth/react";

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
    <div className="min-h-full bg-white">
      <Navbar />
      <main className="">
      <div className="relative isolate px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl  lg:pt-28">
        \
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Lorem ipsum  dolor sit  amet consectetur.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
            Describe exactly what your product or service does to solve this problem. Avoid using verbose words or phrases.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/Login"
                className="rounded-md bg-btn-landing px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Launch Carbon Relay
              </Link>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      
      </div>
      </main>
    </div>
  );
};

export default Home;

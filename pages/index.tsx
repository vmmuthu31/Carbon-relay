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
      router.push("/Home");
    }
  },[session])
  console.log(session)
  return (
    <div className="min-h-full bg-white">
      <Navbar />
      <main className="">
      <div className="relative isolate px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl  lg:pt-28">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Working in the Alpha phase...{' '}
              <a href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Uncover the Project and Company Insights
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
            Welcome to the Carbon Dashboard, your gateway to actionable insights for driving positive environmental impact. Our platform provides you with the tools and data you need to make informed decisions that benefit both your projects and your organization.


            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/Login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
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

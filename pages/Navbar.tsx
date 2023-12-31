import React from 'react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getProviders, signIn, signOut, useSession} from "next-auth/react";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import logo from "../assets/logo.png"


function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
    const { data: session } = useSession();
    const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state?.token);
 
  return (
    <Disclosure as="nav" className=" border-b border-black">
        
    {({ open }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
          <div className="relative flex h-16 mx-3 md:mx-0 items-center justify-between">
            
            <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            {typeof user?.user?.email != "undefined"  || session && session.user ? (
            <Link href="/Dashboard">
              <div className="flex flex-shrink-0 items-center">
                <Image
                  className="h-8 w-auto rounded-3xl"
                  src={logo}
                  alt="Your Company"
                />
                   <p className=" text-lg px-2">Carbon Relay</p>    
              </div>
              </Link>
            ):(
              <Link href="/">
              <div className="flex  items-center">
                <Image
                  className="h-12 w-auto rounded-3xl"
                  src={logo}
                  alt="Your Company"
                />
                   <p className=" text-xl px-2">Carbon Relay</p>    
              </div>
              </Link>  
            )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            
              <div className="hidden sm:ml-6 sm:block pr-2">
                
              </div>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
              {typeof user?.user?.email != "undefined"  || session && session.user ? (
                <>
                <div>
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                   
                    <img
                    className="h-8 w-8 rounded-full"
                    src={session?.user?.image as string || "https://png.pngtree.com/element_our/20190604/ourmid/pngtree-user-avatar-boy-image_1482937.jpg"}
                    alt=""
                  />
              
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <p
                          className={classNames(active ? 'bg-gray-100' : '', 'block  text-center px-4 py-2 text-sm text-gray-700')}
                        >
                   {user?.user ? `User: ${user?.user?.email?.slice(0, -10)}` : `User: ${session?.user?.email?.slice(0, -10)}`}

                        </p>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                         <button
                         className={classNames(active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-sm text-gray-700')}
                         onClick={() => signOut({ callbackUrl: "/Login" })}
                       >
                         Sign Out
                       </button>
                      )}
                    </Menu.Item>
                   
                  </Menu.Items>
                </Transition>
                </>
              ):(
                <Link href="/Login">
                <button  className=' border-[#2A4191] border-2  hover:border-none text-[#2A4191] hover:text-white px-7 py-0.5 hover:bg-[#2A4191]  text-lg rounded-xl'>Sign in</button>
                </Link>
              )}
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
          
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
  )
}

export default Navbar

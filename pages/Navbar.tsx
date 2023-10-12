import React from 'react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getProviders, signIn, signOut, useSession} from "next-auth/react";
import Link from 'next/link';
import { useSelector } from 'react-redux';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation = [
  { name: 'Home', href: "/Home", current: true },
  { name: 'Projects', href: '#', current: false },
  { name: 'Offers', href: '#', current: false },
  { name: 'Bids', href: '#', current: false },
]


function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
    const { data: session } = useSession();
    const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state?.token);
 
  return (
    <Disclosure as="nav" className="bg-gray-800">
        
    {({ open }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          
              <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {typeof user?.user?.email != "undefined"  || session && session.user ? (
            <Link href="/Home">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="h-8 w-auto rounded-3xl"
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEiT8Afh7Hou6PPsXsNSRU9AQG1Cg6jg_yqfyIM3-VHhagOqwbuxJhgekjWO6WT64Yxh7dBzaTDvjtydaORLDO7QMzYS4-infXNy34WuNta0HbTPVqYc45MYbhTFTNlngOaC-XKHORZjmkrZVq1KE9Ql9Y043n5yAiMLc-vzlvhlPFZQM0ihZr8S9Rg4nRQ"
                  alt="Your Company"
                />
                   <p className="text-white text-lg px-2">C-Dash</p>    
              </div>
              </Link>
            ):(
              <Link href="/">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="h-8 w-auto rounded-3xl"
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEiT8Afh7Hou6PPsXsNSRU9AQG1Cg6jg_yqfyIM3-VHhagOqwbuxJhgekjWO6WT64Yxh7dBzaTDvjtydaORLDO7QMzYS4-infXNy34WuNta0HbTPVqYc45MYbhTFTNlngOaC-XKHORZjmkrZVq1KE9Ql9Y043n5yAiMLc-vzlvhlPFZQM0ihZr8S9Rg4nRQ"
                  alt="Your Company"
                />
                   <p className="text-white text-lg px-2">C-Dash</p>    
              </div>
              </Link>  
            )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            
              <div className="hidden sm:ml-6 sm:block pr-2">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
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
                   {user?.user ? `User: ${user?.user?.email.slice(0, -10)}` : `User: ${session?.user?.email?.slice(0, -10)}`}

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
                <button  className='text-white bg-blue-500 px-3 py-1 rounded-xl'>Login</button>
                </Link>
              )}
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
  )
}

export default Navbar
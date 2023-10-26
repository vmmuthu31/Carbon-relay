import React, { useState } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    personName: "",
    email: "",
    location: "",
    password: ""
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Signup Successfull Please Login!")
    router.push("/Login")
    
    } else {
      console.error("Sign-in failed");
      toast.error("Company Email is Already Registered!")
    }
  };
  return (
    <div className=" min-h-screen">
    <Navbar />
    
    <div className="min-h-full flex flex-col justify-center py-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEhZJPipfeyNsdZI8CywAOgRlNn9nd30AlFuOcccs4IJxj_JfRUHxXap3KaGKfT7AlBry3Kn3QvIQzjOk78WPTxbINLWbaNLsT0deumPes4VYEXCYMkWlvCYJvYjPryn05qZeN4wtyY_Ufxqg3kn_lbmlTVymQ0iuvW9MtDq7Qn8TNfuIjk4t8d8KrPLQNg"
            alt="Workflow"
          />
          <h2 className="mt-1 text-center text-3xl font-extrabold text-gray-900">Sign up to your account</h2>
         
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-400 mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-black">
                Company Name
              </label>
              <div className="mt-1">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="personName" className="block text-sm font-medium text-black">
                Person Name
              </label>
              <div className="mt-1">
                <input
                  id="personName"
                  name="personName"
                  type="text"
                  autoComplete="personName"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.personName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
  <label htmlFor="role" className="block text-sm font-medium text-black">
    Company Email Address
  </label>
  <div className="mt-1">
  <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />

  </div>
</div>
<div>
              <label htmlFor="location" className="block text-sm font-medium text-black">
              Location
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="location"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>


          
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
           <Link href="/Login"> <p className="flex justify-end pt-5 text-blue-800 font-semibold">Existing User?</p></Link>
          </form>
          <ToastContainer />
            
          </div>
        </div>
      </div>

    </div>
  );
}

export default Signup;


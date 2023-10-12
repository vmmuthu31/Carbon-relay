import React, { useState } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setUser } from "../store/userActions";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ProviderInfo {
  id: string;
  name: string;
  [key: string]: any; 
}

interface SignupProps {
  providers: Record<string, ProviderInfo>;
}


const Login: React.FC<SignupProps> = ({ providers }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("https://carbon-relay-backend.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      const { token, user } = data;
      toast.success("Login Successfull!")
     
      dispatch(setUser({ token, user }));
    router.push("/Home")
    } else {
      console.error("Sign-in failed");
      toast.error("Invalid Email and password!")
    }
  };

  
  return (
    <div className=" min-h-screen">
    <Navbar />
    {Object.values(providers).map((provider) => (
    <div key={provider.name} className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEhZJPipfeyNsdZI8CywAOgRlNn9nd30AlFuOcccs4IJxj_JfRUHxXap3KaGKfT7AlBry3Kn3QvIQzjOk78WPTxbINLWbaNLsT0deumPes4VYEXCYMkWlvCYJvYjPryn05qZeN4wtyY_Ufxqg3kn_lbmlTVymQ0iuvW9MtDq7Qn8TNfuIjk4t8d8KrPLQNg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
         
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-400 mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
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
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                Login
              </button>
            </div>
           <Link href="/Signup"> <p className="flex justify-end text-blue-800 pt-3 font-semibold">New User?</p></Link>
          </form>
          <ToastContainer />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-300 text-black">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                 <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => signIn(provider.id, { callbackUrl: "/Home" })}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
                          <radialGradient id="95yY7w43Oj6n2vH63j6HJa_fQDK2sCN4Eh1_gr1" cx="31.998" cy="34.5" r="30.776" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4e9c3"></stop><stop offset=".219" stop-color="#f8eecd"></stop><stop offset=".644" stop-color="#fdf4dc"></stop><stop offset="1" stop-color="#fff6e1"></stop></radialGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJa_fQDK2sCN4Eh1_gr1)" d="M63.97,30.06C63.68,32.92,61.11,35,58.24,35H53c-1.22,0-2.18,1.08-1.97,2.34	c0.16,0.98,1.08,1.66,2.08,1.66h3.39c2.63,0,4.75,2.28,4.48,4.96C60.74,46.3,58.64,48,56.29,48H51c-1.22,0-2.18,1.08-1.97,2.34	c0.16,0.98,1.08,1.66,2.08,1.66h3.39c1.24,0,2.37,0.5,3.18,1.32C58.5,54.13,59,55.26,59,56.5c0,2.49-2.01,4.5-4.5,4.5h-44	c-1.52,0-2.9-0.62-3.89-1.61C5.62,58.4,5,57.02,5,55.5c0-3.04,2.46-5.5,5.5-5.5H14c1.22,0,2.18-1.08,1.97-2.34	C15.81,46.68,14.89,46,13.89,46H5.5c-2.63,0-4.75-2.28-4.48-4.96C1.26,38.7,3.36,37,5.71,37H13c1.71,0,3.09-1.43,3-3.16	C15.91,32.22,14.45,31,12.83,31H4.5c-2.63,0-4.75-2.28-4.48-4.96C0.26,23.7,2.37,22,4.71,22h9.79c1.24,0,2.37-0.5,3.18-1.32	C18.5,19.87,19,18.74,19,17.5c0-2.49-2.01-4.5-4.5-4.5h-6c-1.52,0-2.9-0.62-3.89-1.61S3,9.02,3,7.5C3,4.46,5.46,2,8.5,2h48	c3.21,0,5.8,2.79,5.47,6.06C61.68,10.92,60.11,13,57.24,13H55.5c-3.04,0-5.5,2.46-5.5,5.5c0,1.52,0.62,2.9,1.61,3.89	C52.6,23.38,53.98,24,55.5,24h3C61.71,24,64.3,26.79,63.97,30.06z"></path><linearGradient id="95yY7w43Oj6n2vH63j6HJb_fQDK2sCN4Eh1_gr2" x1="29.401" x2="29.401" y1="4.064" y2="106.734" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff5840"></stop><stop offset=".007" stop-color="#ff5840"></stop><stop offset=".989" stop-color="#fa528c"></stop><stop offset="1" stop-color="#fa528c"></stop></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJb_fQDK2sCN4Eh1_gr2)" d="M47.46,15.5l-1.37,1.48c-1.34,1.44-3.5,1.67-5.15,0.6c-2.71-1.75-6.43-3.13-11-2.37	c-4.94,0.83-9.17,3.85-11.64,7.97l-8.03-6.08C14.99,9.82,23.2,5,32.5,5c5,0,9.94,1.56,14.27,4.46	C48.81,10.83,49.13,13.71,47.46,15.5z"></path><linearGradient id="95yY7w43Oj6n2vH63j6HJc_fQDK2sCN4Eh1_gr3" x1="12.148" x2="12.148" y1=".872" y2="47.812" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#feaa53"></stop><stop offset=".612" stop-color="#ffcd49"></stop><stop offset="1" stop-color="#ffde44"></stop></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJc_fQDK2sCN4Eh1_gr3)" d="M16.01,30.91c-0.09,2.47,0.37,4.83,1.27,6.96l-8.21,6.05c-1.35-2.51-2.3-5.28-2.75-8.22	c-1.06-6.88,0.54-13.38,3.95-18.6l8.03,6.08C16.93,25.47,16.1,28.11,16.01,30.91z"></path><linearGradient id="95yY7w43Oj6n2vH63j6HJd_fQDK2sCN4Eh1_gr4" x1="29.76" x2="29.76" y1="32.149" y2="-6.939" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#42d778"></stop><stop offset=".428" stop-color="#3dca76"></stop><stop offset="1" stop-color="#34b171"></stop></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJd_fQDK2sCN4Eh1_gr4)" d="M50.45,51.28c-4.55,4.07-10.61,6.57-17.36,6.71C22.91,58.2,13.66,52.53,9.07,43.92l8.21-6.05	C19.78,43.81,25.67,48,32.5,48c3.94,0,7.52-1.28,10.33-3.44L50.45,51.28z"></path><linearGradient id="95yY7w43Oj6n2vH63j6HJe_fQDK2sCN4Eh1_gr5" x1="46" x2="46" y1="3.638" y2="35.593" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#155cde"></stop><stop offset=".278" stop-color="#1f7fe5"></stop><stop offset=".569" stop-color="#279ceb"></stop><stop offset=".82" stop-color="#2cafef"></stop><stop offset="1" stop-color="#2eb5f0"></stop></linearGradient><path fill="url(#95yY7w43Oj6n2vH63j6HJe_fQDK2sCN4Eh1_gr5)" d="M59,31.97c0.01,7.73-3.26,14.58-8.55,19.31l-7.62-6.72c2.1-1.61,3.77-3.71,4.84-6.15	c0.29-0.66-0.2-1.41-0.92-1.41H37c-2.21,0-4-1.79-4-4v-2c0-2.21,1.79-4,4-4h17C56.75,27,59,29.22,59,31.97z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       ))}
    </div>
  );
}

export default Login;


export async function getServerSideProps() {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  }

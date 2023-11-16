import React, { useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const AdminView = ({ user, email, setEmail, handleSubmit }) => (
  <>
    <p>Hi, {user?.user?.personName} of {user?.user?.companyName} from {user?.user?.location}</p>
    <div>
      <p>Here, You can invite your traders</p>
      <div className="flex space-x-3 justify-center">
        <input 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border border-gray-700 rounded-md outline-none px-2" 
          placeholder="Traders email address" 
          type="email" 
        />
        <button onClick={handleSubmit} className="bg-blue-600 px-3 py-1 text-md rounded-md text-white">Invite</button>
      </div>
    </div>
  </>
);

const TraderView = ({ user }) => (
  <>
    <p>Hi, {user?.user?.email?.slice(0,-11)}.. of {user?.user?.companyName}</p>
    <p>Your Trading Dashboard</p>
  </>
);

const Home: React.FC = () => {
  const user = useSelector((state) => state?.user);
  const role = useSelector((state) => state?.user?.user?.role);
  console.log("user",user);
  console.log("role", role)
  const [email, setEmail] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://carbon-relay-23a0f49f1c2f.herokuapp.com/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: user?.user?.email,
          traderEmail: email
        }),
      });

      if (response.ok) {
        toast.success("Invited Successfully!");
        setEmail("");
      } else {
        toast.error("Trader Already Invited.");
      }
    } catch (error) {
      toast.error("Error inviting trader.");
    }
  };

  return (
    <>
      <Navbar/>
      <div className="text-center">
        {role === "Admin" ? (
          <AdminView user={user} email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
        ) : (
          <TraderView user={user} />
        )}
        <p>Navigate me to <Link href ="/Dashboard"> Dashboard</Link></p>
        <ToastContainer />
      </div>
    </>
  );
};

export default Home;

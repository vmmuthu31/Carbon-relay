import React, { useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { useRouter } from "next/router";



const Reedem: React.FC = () => {
  const user = useSelector((state) => state?.user);
  
  const token = useSelector((state) => state?.user?.token);
  const id = useSelector((state) => state?.user?.user?.id);
  const companyName = useSelector((state) => state?.user?.user?.companyName);
  const router = useRouter();
  const { projectId } = router.query;
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  console.log("amount",amount)
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/auth/create-bid/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': token
        },
        body: JSON.stringify({
          traderId: id,
          traderCompany: companyName,
          bidAmount: amount,
        }),
      });

      if (response.ok) {
        toast.success("Invited Successfully!");
        setAmount("");
      } else {
        toast.error("Trader Already Invited.");
      }
    } catch (error) {
      toast.error("Error inviting trader.");
    }
  };
console.log(user)
  return (
    <>
      <Navbar/>
      <div className="text-center">
      <p>Hi, {user?.user?.email?.slice(0,10)}.. of {user?.user?.companyName} </p>
    <div>
      <p>Bid for the {projectId}</p>
      <div className="flex space-x-3 justify-center">
        <input 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="border border-gray-700 rounded-md outline-none px-2" 
          placeholder="Enter the bid Amount" 
          type="number" 
        />
        <button onClick={handleSubmit} className="bg-blue-600 px-3 py-1 text-md rounded-md text-white">Bid</button>
      </div>
    </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Reedem;

"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Upload: React.FC = () => {
  const [file, setFile] = useState(null);
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };
 
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "https://carbon-relay-backend.vercel.app/DataRoute/uploadProjectData",
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  return (
    <div className=" min-h-screen">
    <Navbar />
    
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEhZJPipfeyNsdZI8CywAOgRlNn9nd30AlFuOcccs4IJxj_JfRUHxXap3KaGKfT7AlBry3Kn3QvIQzjOk78WPTxbINLWbaNLsT0deumPes4VYEXCYMkWlvCYJvYjPryn05qZeN4wtyY_Ufxqg3kn_lbmlTVymQ0iuvW9MtDq7Qn8TNfuIjk4t8d8KrPLQNg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Upload the project data</h2>
         
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-400 mx-8 rounded-md py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
          
      
      
<div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 1 MB)</p>
        </div>
        <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
    </label>
</div> 
<div className="flex justify-center">
<button className="bg-blue-600 px-4 py-2 rounded-xl text-md text-white" onClick={handleUpload}>Upload</button>
</div>
          </form>
          <ToastContainer />
            
          </div>
        </div>
      </div>

    </div>
  );
}

export default Upload ;


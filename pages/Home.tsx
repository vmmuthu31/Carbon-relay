"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "./Navbar";
import { useSession} from "next-auth/react";
import { useSelector } from 'react-redux';

type BeneficiaryData = {
  cleanBeneficiary: string;
  netRetirement: number;
};

type ProjectData = {
  Name: string;
  ID: string;
  Proponent: string;
};

const Home: React.FC = () => {
  const [data, setData] = useState<BeneficiaryData[]>([]);
  const [projectdata, setProjectData] = useState<ProjectData[]>([]);
  const [filteredData, setFilteredData] = useState<BeneficiaryData[]>([]);
  const [filteredprojectData, setFilteredprojectData] = useState<ProjectData[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("company");

  const router = useRouter();

  const redirectToDashboard = (companyName: string) => {
    router.push(`/Dashboard?companyName=${companyName}`);
  };
  const redirectToProjDashboard = (projectID: string) => {
    router.push(`/ProjectDash?projectID=${projectID}`);
  };

  useEffect(() => {
    axios
      .get<BeneficiaryData[]>(
        "https://carbon-relay-backend.vercel.app/DataRoute/data"
      )
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get<ProjectData[]>(
        "https://carbon-relay-backend.vercel.app/DataRoute/projectData"
      )
      .then((response) => {
        setProjectData(response.data);
        setFilteredprojectData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const { data: session } = useSession();
  const user = useSelector((state) => state?.user);
  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        data.filter((item) =>
          item.cleanBeneficiary.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredprojectData(
        projectdata.filter((item) =>
          item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.ID).toLowerCase().includes(searchTerm.toLowerCase()) || // Convert ID to string here
          item.Proponent.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
      setFilteredprojectData(projectdata);
    }
  }, [searchTerm, data, projectdata]);
  

  return (
    <>
    {typeof user?.user?.email != "undefined"  || session && session.user ? (
      <>
    <div className="min-h-full bg-white">
    <Navbar />
      <main className="pt-4">
        <div className="lg:px-20 px-4 mx-auto">
        <div className="flex border rounded-lg border-black">
      <button
        className={`text-xl border px-4 lg:px-20 font-bold ${selectedDataType === "company" ? "bg-red-500" : "bg-green-500"}`}
        onClick={() => setSelectedDataType("company")}
      >
        Company Level Data
      </button>
      <button
        className={`text-xl border px-4 lg:px-20 font-bold ${selectedDataType === "project" ? "bg-red-500" : "bg-green-500"}`}
        onClick={() => setSelectedDataType("project")}
      >
        Project Level Data
      </button>
      <input
        type="text"
        placeholder="Search by Company Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 bg-green-500 text-white border rounded custom-input"
      />
    </div>
          {selectedDataType === "company" ? (
            filteredData.length > 0 ? (
              <table className="w-full my-10 rounded-lg text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 rounded-xl uppercase bg-gray-600">
                  <tr>
                    <th scope="col" className="px-6 text-gray-300 py-3">
                      Company Name
                    </th>
                    <th scope="col" className="px-6 text-gray-300 py-3">
                      Net Retirement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer  border-b rounded-xl bg-gray-800 border-gray-700 hover:bg-gray-600"
                      onClick={() => redirectToDashboard(item.cleanBeneficiary)}
                    >
                      <td className="px-6 py-4">{item.cleanBeneficiary}</td>
                      <td className="px-6 py-4">{item.netRetirement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center my-10 text-lg text-gray-500">
                No available data
              </p>
            )
          ) : filteredprojectData.length > 0 ? (
            <table className="w-full my-10 rounded-lg text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 rounded-xl uppercase bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 text-gray-300 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 text-gray-300 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 text-gray-300 py-3">
                    Proponent
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredprojectData.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer  border-b rounded-xl bg-gray-800 border-gray-700 hover:bg-gray-600"
                    onClick={() => redirectToProjDashboard(item.ID)}
                  >
                    <td className="px-6 py-4">{item.ID}</td>
                    <td className="px-6 py-4">{item.Name}</td>
                    <td className="px-6 py-4">{item.Proponent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center my-10 text-lg text-gray-500">
              No available data
            </p>
          )}
        </div>
      </main>
    </div>
    </>
    ):(
      <>
      <Navbar />
      <p className="text-center">Your Not Authenticated!</p>
      </>
    )}
    </>
  );
};

export default Home;

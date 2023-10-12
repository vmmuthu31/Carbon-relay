"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSession} from "next-auth/react";
import { useSelector } from 'react-redux';

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const ProjectDash = () => {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const projectIDFromQuery = searchParams.get("projectID");
  const fetchData = async () => {
    const res = await fetch(
      "https://carbon-relay-backend.vercel.app/DataRoute/projectData"
    );
    const data = await res.json();
    setData(data);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getUTCMonth() + 1; 
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
  };
  const parseData = (str) => {
    const items = str?.split(", ");
    const parsedData = items?.map((item) => {
      const [date, value] = item?.split(": ");
      return { date, value: parseInt(value) };
    });
    return parsedData;
  };
  const parseBeneficiaries = (str) => {
    const parsedData = {};
    let name = "";
    let value = "";
    let isParsingName = true;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === ":" && isParsingName) {
        isParsingName = false;
      } else if (char === "," && !isParsingName) {
        parsedData[name.trim()] = parseFloat(value.trim());
        name = "";
        value = "";
        isParsingName = true;
      } else {
        if (isParsingName) {
          name += char;
        } else {
          value += char;
        }
      }
    }
    parsedData[name.trim()] = parseFloat(value.trim());

    return parsedData;
  };

  const parseBeneficiariesPercentages = (str) => {
    const jsonString = str?.replace(/'/g, '"');

    try {
      const parsedObj = JSON?.parse(jsonString);
      return parsedObj;
    } catch (e) {
      console.error("Failed to parse string into object: ", e);
      return null;
    }
  };
  const filteredData = data?.filter((datum) => datum.ID == projectIDFromQuery);
  console.log("filterone", filteredData);

  useEffect(() => {
    fetchData();
  }, []);
  const { data: session } = useSession();
  const user = useSelector((state) => state?.user);
  return (
    <>
       {typeof user?.user?.email != "undefined"  || session && session.user ? (
    <div className="">
     <Navbar />
      {filteredData &&
        filteredData.map((datum, index) => {
          const quantities = parseData(
            datum["Crediting Periods and Quantities"]
          );
          const retirements = parseData(
            datum["Crediting Periods and Net Retirements"]
          );
          const customizeTickText = (dateStr) => {
            if (typeof dateStr !== "string") {
              return dateStr; 
            }

            const dates = dateStr.split(" to ");
            return `${dates[0]} -<br> ${dates[1]}`;
          };

          const xTickVals = quantities?.map((q) => q.date); 
          const xTickTexts = xTickVals?.map(customizeTickText);

          const trace1 = {
            x: quantities?.map((q) => q.date),
            y: quantities?.map((q) => q.value),
            type: "bar",
            name: "Total Quantities",
            hovertemplate: '%{y}<extra></extra>',
          };
          
          const trace2 = {
            x: retirements?.map((r) => r.date),
            y: retirements?.map((r) => r.value),
            type: "bar",
            name: "Net Retirements",
            hovertemplate: '%{y}<extra></extra>',
          };
          
          const retirementNumbers = parseBeneficiaries(
            datum["Clean Beneficiaries with Retirement Numbers"]
          );
          const retirementPercentages = parseBeneficiariesPercentages(
            datum["Clean Beneficiaries with Retirement Percentages"]
          );
          console.log(retirementPercentages);
          const allBeneficiaries = [
            ...new Set([
              ...Object.keys(retirementNumbers),
              ...Object.keys(retirementPercentages),
            ]),
          ];
          const getUniqueDateRanges = (data) => {
            return [...new Set(data.map((d) => d.x))];
          };

          const uniqueDateRanges = getUniqueDateRanges([trace1, trace2]); 
          const customTickLabels = uniqueDateRanges.map(customizeTickText);
          
          return (
            
            <div key={index}>
              <div className="flex justify-center py-2 space-x-10">
                <h2>{`ID: ${datum.ID}`}</h2>
                <h2 className="w-[600px]">{`Name: ${datum.Name}`}</h2>
              </div>
              <div className="absolute">
              <div className="flex px-2 space-x-5 justify-center  ">
                <div className="w-full">
                  <Plot
                    data={[trace1, trace2]}
                    config={{
                      displayModeBar: false,
                    }}
                    layout={{
                      title: `Total Quantities vs Net Retirements for ID: ${datum.ID}`,
                      xaxis: {
                        title: "Creating Periods",
                        tickvals: xTickVals,
                        ticktext: xTickTexts,
                      },
                      yaxis: { title: "Values" },
                      
                      hoverlabel: "<b>%{x}</b><extra></extra>",
                    }}
                    style={{ width: "950px", height: "380px" }}
                  />
                </div>
                <div className="">
                  <table className="text-sm w-64 text-left text-gray-400 rounded-xl">
                    <thead className="text-xs  uppercase bg-gray-700 text-gray-400 rounded-t rounded-b">
                      <tr>
                        <th scope="col" className="px-6 py-3 rounded-tl">
                          Field
                        </th>
                        <th scope="col" className="px-6 py-3 rounded-tr">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="rounded-xl">
                      <tr className="border-b  bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">ID</div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4  whitespace-nowrap text-white rounded-br"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {datum.ID}
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="max-h-96">
                            <div className="pl-3">
                              <div className="text-base font-semibold">
                                Name
                              </div>
                            </div>
                          </div>
                        </td>
                        <th className="block px-6 py-4 rounded-br h-auto overflow-y-hidden text-white">
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {datum.Name}
                            </div>
                          </div>
                        </th>
                      </tr>

                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Proponent
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex rounded-br items-center px-6 py-4  whitespace-nowrap text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {datum.Proponent}
                            </div>
                          </div>
                        </th>
                      </tr>

                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Methodology
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="rounded-br items-center px-6 py-4 text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal break-words text-gray-500">
                              {datum.Methodology}
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Country/Area
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex rounded-br items-center px-6 py-4  whitespace-nowrap text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {datum["Country/Area"]}
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Creating Period Start Date
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex rounded-br items-center px-6 py-4  whitespace-nowrap text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {formatDate(datum["Crediting Period Start Date"])}
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Creating Period End Date
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex rounded-br items-center px-6 py-4  whitespace-nowrap text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {formatDate(datum["Crediting Period End Date"])}
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                        <td className="rounded-bl">
                          <div className="pl-3">
                            <div className="text-base font-semibold">
                              Project Type
                            </div>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex rounded-br items-center px-6 py-4  whitespace-nowrap text-white"
                        >
                          <div className="pl-3">
                            <div className="font-normal text-gray-500">
                              {datum["Project Type"]}
                            </div>
                          </div>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
              <div className=" ml-40 mt-96 relative">
                <div className="table-wrapper">
                  <table className="text-sm rounded text-left  text-gray-400">
                    <thead className="text-xs rounded-t rounded-b header-table  uppercase bg-gray-700 text-gray-400">
                      <tr className="border-br">
                        <th scope="col" className="px-8 py-2">
                          Beneficiary Name
                        </th>
                        <th scope="col" className="px-8 py-2">
                          No. of Credits Retired
                        </th>
                        <th scope="col" className="px-8 py-2">
                          Retirement (% of net)
                        </th>
                      </tr>
                    </thead>
                    <div className="scrollable-tbody">
                      <table className="rounded bg-white body-table">
                        <tbody>
                          {allBeneficiaries.map((name, index) => (
                            <tr
                              className=" rounded-t rounded-b border-b  bg-gray-800 border-gray-700 hover:bg-gray-600"
                              key={index}
                            >
                              <td className="py-1 px-4 ">{name}</td>
                              <td className="py-1 px-4 ">
                                {retirementNumbers[name] || "N/A"}
                              </td>
                              <td className="py-1 px-4 ">
                                {retirementPercentages[name] || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
    </div>
      ):(
      <>
      <Navbar />
      <p className="text-center">Your Not Authenticated!</p>
      </>
      )}
      </>
  );
};

export default ProjectDash;

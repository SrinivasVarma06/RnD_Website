import React, { useState, useEffect } from 'react';
import PageSkeleton from "../..//components/LoadingSkeleton/PageSkeleton" 
import { getApiUrl } from '../../config/api';
import {
  Typography,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";



export default function Civil() {
   const [doc, setDoc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search,setSearch]=useState('')
    const [sortOrder,setSortOrder]=useState(' ')
    const [sortedDoc,setsortedDoc]=useState('')
    const [filteredDoc,setfilteredDoc]=useState('')
    const [entries,setEntries]=useState('')
    const [value,setValue]=useState('')



const SHEET_API_URL = getApiUrl('lab-civil')

    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(SHEET_API_URL);
            const jsonData = await response.json();
            setDoc(jsonData);
          } catch (err) {
            console.error("Failed to fetch data from Google Sheet:", err);
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    


//     useEffect(()=>{
//        const filtered = doc.filter(item =>
//         [
    
//       item["Title"],
//       item["Investigator(s)"],
//       item["Co-PI"],
//       item["Sponsoring Organization"],
//       item["Value (₹1,00,000)"],
//       item["Sanction date"],
//       item["Duration (years)"]
// ]       
//           .join(" ")
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       );
//       setfilteredDoc(filtered)
//     // console.log(filtered)
// },[search,doc])



    if (loading) {
        return (
            <PageSkeleton />
        );
    }
    
    

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800 flex flex-col justify-center items-center text-red-600">
                <p className="text-xl font-semibold">Error: {error.message}</p>
                <p className="text-sm mt-2 text-center">Please check your network connection and try again.</p>
            </div>
        );
    }

    return (

         <Box sx={{ maxWidth: "95%", mx: "auto", p: 2 }}>
              <Typography id="consultancy-top" variant="h5" fontWeight="bold" mb={3} align="center">
               
              </Typography>
{/* 
            <div className="bar">
              <TextField
                label="Search Consultancy Projects"
                variant="outlined"
                size="small"
                className='searchfield'
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
         
              <FormControl className='formcontrol'  size="small" sx={{ mb: 3 }}>
                <InputLabel id="sort-by-label">Sort by date</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortOrder}
                  label="Sort by Sanction Date"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Oldest to Newest</MenuItem>
                  <MenuItem value="desc">Newest to Oldest</MenuItem>
                </Select>
              </FormControl>
            </div>
               */}
        <div  id="research-and-documents-table">
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-800">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                                Serial Numbers
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                                Name of the Lab
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                                Point of Contact
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                                Other Faculty Members
                            </th>

                            <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                                Website
                            </th>
                        </tr>
                    </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
  {doc.map((item, index) => (
    <tr key={index}>
      <td className="px-3 py-4 whitespace-normal text-sm font-medium text-gray-900">
        {item["Serial Numbers"]}
      </td>
            <td className="px-3 py-4 whitespace-normal text-sm text-gray-700">
        {item["Name of the Lab"]||"-"}
      </td>
      <td className="px-3 py-4 whitespace-normal text-sm text-gray-700">
        {item["Point of Contact"]||"-"}
      </td>

      <td className="px-3 py-4 whitespace-normal text-sm text-gray-700">
        {item["Other Faculty Members"]||"-"}
      </td>
      <td className="px-3 py-4 whitespace-normal text-sm text-gray-700">
       {item["Website"]!=undefined && <a className="purple-link" href={item["Website"]} target="_blank">Link</a>}
      </td>
      
    </tr>
  ))}
</tbody>

                </table>
            </div>
        </div>
        </Box>
    );
}

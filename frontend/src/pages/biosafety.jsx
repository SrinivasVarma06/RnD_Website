import React, { useState, useEffect } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';


export default function Biosafety() {
   const [doc, setdoc] = useState([]);
    const [loading, setLoading] = useState(true);
    

    
   return (
   <>
   
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Biosaftey committee
      </h1>

      {!loading ? (
        <PageSkeleton />
      ) :  (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-purple-800">
                <th className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">
                  :
                </th>
                <th className="px-3 py-3 text-center text-m font-medium text-white uppercase tracking-wider">
                  People
                </th>
              </tr>
              
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              
                <tr   className="hover:bg-gray-50">
                  
                  
                  
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Chairman</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr Sudhanshu Shukla</td>
                </tr>
              <tr   className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">DBT Nominee</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr C.B. GANESH</td>
                </tr>
                <tr   className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Outside Experts
</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr Vishwas Kaveeshwar</td>
                 
                </tr>
                <tr   className="hover:bg-gray-50">
                  
                  
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Member Secretary</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr Subhash Mehto</td>
                </tr>
                <tr   className="hover:bg-gray-50">
                  
                  
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Biosafety Officer
</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr Shrikrishna Javali</td>
                </tr>
                    <tr   className="hover:bg-gray-50">
                  
                  
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Internal Experts

</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">:</td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-center">Dr Bal Krishna Chaube, Dr Nilkamal Mahanta,
 Dr Surya Pratap Singh
, Dr Swananda Marathe</td>
                </tr>
            </tbody>
          </table>
        </div>
      )}
    </div></>
  );
};







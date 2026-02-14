import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { getApiUrl } from '../config/api';

export default function Csr() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDocLink, setSelectedDocLink] = useState('');
  const [rawDocLink, setRawDocLink] = useState('');

  const [csrData, setCsrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(getApiUrl('csr'));
        const items = response.data || [];
        setCsrData(items);
      } catch (err) {
        console.error('Failed to fetch CSR data', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewClick = (link) => {
  if (link) {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">CSR Information</h1>

      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-red-50 border border-red-200 rounded-lg shadow p-6 my-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load CSR information</h2>
          <p className="text-red-600 mb-2">
            There was a problem fetching the CSR data from the server.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Please check your internet connection or try again later.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">Sl No.</th>
                <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">Form Name</th>
                <th scope="col" className="px-3 py-3 text-left text-m font-medium text-white uppercase tracking-wider">View PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csrData.map((form, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 py-4 whitespace-normal text-sm font-medium text-gray-900 text-left">{index + 1}</td>
                  <td className="px-3 py-4 whitespace-normal text-sm font-medium text-gray-900 text-left">{form.name}</td>
                  <td className="px-3 py-4 whitespace-normal text-sm text-purple-700 text-left">
                    <button
                      onClick={() => handleViewClick(form.wordLink)}
                      className="underline hover:text-purple-900 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
  
    </div>
  );
}




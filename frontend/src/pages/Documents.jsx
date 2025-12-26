import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';

const CACHE_EXPIRY = 5 * 60 * 1000;

const backendUrl = import.meta.env.VITE_STRAPI_URL;

export default function Documents() {
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = 'docsDataCache';
    const cacheTimestampKey = 'docsDataCacheTimestamp';

    const loadData = async () => {
      const cached = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cached && cachedTimestamp && Date.now() - Number(cachedTimestamp) < CACHE_EXPIRY) {
        setDocsData(JSON.parse(cached));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`https://opensheet.vercel.app/1RG3VNFWNk8tnVrsNmk3-cf1Pko3lQIofwRyZonQmVg0/Sheet1`);
          const items = response.data || [];

          setDocsData(items);

          localStorage.setItem(cacheKey, JSON.stringify(items));
          localStorage.setItem(cacheTimestampKey, Date.now().toString());
        } catch (err) {
          console.error('Failed to fetch Forms data', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [backendUrl]);

  return (
    <div id='doc-top' className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">Documents</h1>
      <div className="mb-6 text-center">
        <a
          href="https://drive.google.com/drive/folders/1NsW2cChEMUG-sgS4VGh2_FWI9HOU_Nar?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-900 text-purple-700 text-base md:text-lg font-medium"
        >
          View all documents
        </a>
      </div>
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-red-50 border border-red-200 rounded-lg shadow p-6 my-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load OM and Documents</h2>
          <p className="text-red-600 mb-2">
            There was a problem fetching the documents from the server.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Please check your internet connection or try again later.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
            <ol className="list-decimal ml-6 space-y-2">
              {docsData.map((row, idx) => (         
                <li key={row["Serial number"]}>
                  <a
                    href={row["Link"]}
                    className="text-purple-600 hover:text-purple-800 no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    {row["Name of the document"]}
                  </a>
                </li>
              ))}
              </ol>
            </div>
        </div>
      )}
    </div>
  );
}




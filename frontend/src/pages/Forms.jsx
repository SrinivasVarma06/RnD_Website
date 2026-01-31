import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';

const CACHE_EXPIRY = 5 * 60 * 1000;

export default function Forms() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = 'formsDataCache';
    const cacheTimestampKey = 'formsDataCacheTimestamp';

    const loadData = async () => {
      const cached = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cached && cachedTimestamp && Date.now() - Number(cachedTimestamp) < CACHE_EXPIRY) {
        setFormData(JSON.parse(cached));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`https://opensheet.vercel.app/1zmpwBGzv6VtYhkiosMQfJ3YE3-8CNiGAUP0tiNEX_rU/Sheet1`);
          const items = response.data || [];
          setFormData(items);
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
  }, []);


  return (
    <div id='forms-top' className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">R&D Forms</h1>
      <div className="mb-6 text-center">
        <a
          href="https://drive.google.com/drive/u/2/folders/1EQ8rYC1ccBZHYn7UreO3Pn9TIUoCHF_Y"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-900 text-purple-700 text-base md:text-lg font-medium"
        >
          View all forms
        </a>
      </div>

      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-red-50 border border-red-200 rounded-lg shadow p-6 my-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load forms</h2>
          <p className="text-red-600 mb-2">
            There was a problem fetching the forms from the server.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Please check your internet connection or try again later.
          </p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                {formData.length > 0 &&
                  Object.keys(formData[0]).map((col, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-white tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {Object.keys(row).map((col, colIndex) => {
                    const cell = row[col];
                    const isLink =
                      typeof cell === "string" &&
                      (cell.startsWith("http://") || cell.startsWith("https://"));

                    return (
                      <td
                        key={colIndex}
                        className="px-3 py-4 whitespace-normal text-base text-gray-900 text-left"
                      >
                        {isLink ? (
                          <a
                            href={cell}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                          >
                            {col.toLowerCase().includes("pdf") ? "View" : "Download"}
                          </a>
                        ) : (
                          cell || <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




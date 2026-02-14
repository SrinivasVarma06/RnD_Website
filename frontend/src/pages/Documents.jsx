import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import EmptyState from '../components/EmptyState/EmptyState';
import Pagination from '../components/ProjectFilters/Pagination';

const ITEMS_PER_PAGE = 15;

export default function Documents() {
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(getApiUrl('documents'));
      const items = response.data || [];
      setDocsData(items);
    } catch (err) {
      console.error('Failed to fetch Documents data', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pagination calculations
  const totalPages = Math.ceil(docsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocs = docsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <div className="max-w-5xl mx-auto">
          <EmptyState
            type="error"
            title="Unable to load Documents"
            message="There was a problem fetching the documents from the server. Please check your internet connection or try again."
            onRetry={() => loadData(true)}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 table-zebra">
              <thead className="bg-purple-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-base font-semibold text-white w-16">S.No</th>
                  <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Document Name</th>
                  <th className="px-4 py-3.5 text-center text-base font-semibold text-white w-32">Open</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDocs.map((row, idx) => (
                  <tr key={row["Serial number"] || startIndex + idx} className="hover:bg-purple-50">
                    <td className="px-4 py-4 text-base text-gray-700 text-center">{startIndex + idx + 1}</td>
                    <td className="px-4 py-4 text-base text-gray-800">{row["Name of the document"]}</td>
                    <td className="px-4 py-4 text-base text-center">
                      <a
                        href={row["Link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2563eb', textDecoration: 'underline' }}
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={docsData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="documents"
          />
        </div>
      )}
    </div>
  );
}




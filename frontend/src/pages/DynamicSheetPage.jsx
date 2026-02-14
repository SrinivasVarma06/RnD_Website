import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getSheetsStatusUrl } from '../config/api';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import Pagination from '../components/ProjectFilters/Pagination';

const ITEMS_PER_PAGE = 20;

export default function DynamicSheetPage() {
  const { sheetKey } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch the human-readable title from sheets-status
  useEffect(() => {
    async function fetchTitle() {
      try {
        const res = await fetch(getSheetsStatusUrl());
        if (res.ok) {
          const status = await res.json();
          if (status[sheetKey]?.label) {
            setTitle(status[sheetKey].label);
          } else {
            // Fallback: convert key to title case
            setTitle(sheetKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
          }
        }
      } catch {
        setTitle(sheetKey.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      }
    }
    fetchTitle();
  }, [sheetKey]);

  // Fetch sheet data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const res = await axios.get(getApiUrl(sheetKey));
      const rows = Array.isArray(res.data) ? res.data : [];
      setData(rows);
    } catch (err) {
      console.error(`Failed to fetch sheet "${sheetKey}":`, err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [sheetKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">{title}</h1>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-red-500 text-lg">Unable to load data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">{title}</h1>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-500 text-lg">No data available yet.</p>
        </div>
      </div>
    );
  }

  // Get column headers from the first row, filter out empty keys
  const columns = Object.keys(data[0]).filter((col) => col.trim() !== '');

  // Pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">{title}</h1>

      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-gray-500 mb-4 text-right">
          Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, data.length)} of {data.length} records
        </p>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                  S.No
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageData.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {startIndex + idx + 1}
                  </td>
                  {columns.map((col) => {
                    const value = row[col] || '';
                    // Auto-detect URLs and render as links
                    const isUrl = typeof value === 'string' && value.match(/^https?:\/\//);
                    return (
                      <td key={col} className="px-4 py-3 text-sm text-gray-700">
                        {isUrl ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-700 underline hover:text-purple-900"
                          >
                            Link
                          </a>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

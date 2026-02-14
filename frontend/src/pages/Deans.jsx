import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, Award } from 'lucide-react';
import PageSkeleton from "../components/LoadingSkeleton/PageSkeleton";
import { Pagination } from '../components/ProjectFilters';
import { getApiUrl } from '../config/api';

const Deans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get(getApiUrl('deans'))
      .then(res => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Extract unique designations
  const designations = useMemo(() => {
    return [...new Set(data.map(item => item.Designation).filter(Boolean))].sort();
  }, [data]);

  // Filter data
  const processedData = useMemo(() => {
    let filtered = [...data];

    if (search.length >= 2) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        (item.Name?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (designationFilter !== 'all') {
      filtered = filtered.filter(item => item.Designation === designationFilter);
    }

    return filtered;
  }, [data, search, designationFilter]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, designationFilter, itemsPerPage]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-red-50 border border-red-200 rounded-lg shadow p-6 my-8">
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Unable to load Dean information
        </h2>
        <p className="text-red-600 mb-2">
          There was a problem fetching the data from the server.
        </p>
        <p className="text-sm text-red-500 mb-4">
          Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Award className="text-purple-700" size={32} />
          Former Deans
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">
          List of former Deans of Research & Development
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Designations</option>
              {designations.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Show per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-end">
            <p className="text-sm text-gray-600 pb-2">
              Showing {processedData.length} of {data.length} entries
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-purple-800">
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">S. No.</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Dean</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Designation</th>
              <th colSpan={2} className="px-4 py-3.5 text-center text-sm md:text-base font-semibold text-white">Tenure</th>
            </tr>
            <tr className="bg-purple-800">
              <th></th>
              <th></th>
              <th></th>
              <th className="px-3 py-2 text-center text-sm font-medium text-white">From</th>
              <th className="px-3 py-2 text-center text-sm font-medium text-white">To</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No deans found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.ID || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.Name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.Designation}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{row.FromDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{row.ToDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={processedData.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default Deans;



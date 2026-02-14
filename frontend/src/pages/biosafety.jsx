import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, ShieldCheck } from 'lucide-react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Pagination } from '../components/ProjectFilters';
import { getApiUrl } from '../config/api';

export default function Biosafety() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const SHEET_URL = getApiUrl('biosafety');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch(SHEET_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: The Google Sheet may not be publicly shared`);
        }
        const json = await res.json();
        setMembers(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error('Failed to fetch biosafety members', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Extract unique designations
  const designations = useMemo(() => {
    return [...new Set(members.map(m => m.designation).filter(Boolean))].sort();
  }, [members]);

  // Filter data
  const processedData = useMemo(() => {
    let filtered = [...members];

    if (search.length >= 2) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(m =>
        (m.person?.toLowerCase() || '').includes(searchLower) ||
        (m.designation?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (designationFilter !== 'all') {
      filtered = filtered.filter(m => m.designation === designationFilter);
    }

    return filtered;
  }, [members, search, designationFilter]);

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
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg max-w-lg">
          <p className="font-semibold text-xl">Error loading data</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-4 text-gray-500">
            Make sure the Google Sheet is shared publicly (Anyone with the link can view)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] mx-auto p-4" id="biosafety-top">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <ShieldCheck className="text-purple-700" size={36} />
          Biosafety Committee
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg max-w-3xl mx-auto">
          The Institutional Biosafety Committee oversees research involving biological agents 
          to ensure compliance with safety regulations and guidelines.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Total Members</p>
              <p className="text-3xl font-bold text-gray-800">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Designations</p>
              <p className="text-3xl font-bold text-purple-600">{designations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-end">
            <p className="text-sm text-gray-600 pb-2">
              Showing {processedData.length} of {members.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Designation</th>
              <th className="px-4 py-3.5 text-center text-sm md:text-base font-semibold text-white">:</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Person</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No members found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((m, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.designation}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">:</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{m.person}</td>
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
}

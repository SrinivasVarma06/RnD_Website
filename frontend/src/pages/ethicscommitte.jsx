import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, Shield } from 'lucide-react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Pagination } from '../components/ProjectFilters';

export default function Ethicscommitte() {
  const [doc, setDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const SHEET_URL = 'https://opensheet.elk.sh/1mpZ4L867iqx-47amKA8PVSdYpub2naAYmQ-mzFXYCNc/Sheet1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        if (!Array.isArray(jsonData)) {
          throw new Error("Invalid data format received from API.");
        }
        setDoc(jsonData);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique roles
  const roles = useMemo(() => {
    return [...new Set(doc.map(item => item.role).filter(Boolean))].sort();
  }, [doc]);

  // Filter data
  const processedData = useMemo(() => {
    let filtered = [...doc];

    if (search.length >= 2) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        (item.Name?.toLowerCase() || '').includes(searchLower) ||
        (item.currentorganization?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(item => item.role === roleFilter);
    }

    return filtered;
  }, [doc, search, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, itemsPerPage]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-red-600 text-center">
        <p className="text-xl font-semibold">Error: {error.message}</p>
        <p className="text-sm mt-2">Please check your internet connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] mx-auto p-4" id="ethics-top">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Shield className="text-purple-700" size={36} />
          Institutional Ethics Committee
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg max-w-3xl mx-auto">
          The Institutional Ethics Committee (IEC) is responsible for ensuring that all research 
          involving human participants is conducted ethically and in compliance with relevant regulations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Total Members</p>
              <p className="text-3xl font-bold text-gray-800">{doc.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <Shield className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Unique Roles</p>
              <p className="text-3xl font-bold text-purple-600">{roles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Roles</option>
              {roles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
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
              Showing {processedData.length} of {doc.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">S.No</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Name</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Organization</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No members found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.sl_no}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.Name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.currentorganization}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.role}</td>
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




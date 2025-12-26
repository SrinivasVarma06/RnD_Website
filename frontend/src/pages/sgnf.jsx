import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { ProjectFilters, Pagination } from '../components/ProjectFilters';
import { Search, Sprout, IndianRupee, Calendar, Clock, CheckCircle2 } from 'lucide-react';

import './searchresults.css'

export default function Sgnf() {
  const [doc, setDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const SHEET_API_URL = "https://opensheet.elk.sh/1JQ_9Xh9aPNnklv7_iP0ihVUztYd4Rs2ZnumybaJrf7c/Sheet1";

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

  function parseDateYMD(dateStr) {
    if (!dateStr || dateStr.toLowerCase() === 'n/a') return null;
    const parts = dateStr.split(/[-./#]/);
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  const isOngoing = useCallback((item) => {
    const sanctionDate = parseDateYMD(item["Sanction date"]);
    if (!sanctionDate) return true;
    const duration = parseFloat(item["Duration (years)"]) || 0;
    const endDate = new Date(sanctionDate);
    endDate.setFullYear(endDate.getFullYear() + duration);
    return endDate > new Date();
  }, []);

  const departments = useMemo(() => {
    const depts = new Set();
    doc.forEach(item => {
      const name = item["Name "] || '';
      const match = name.match(/\(([^)]+)\)/);
      if (match) depts.add(match[1].trim());
    });
    return Array.from(depts).sort();
  }, [doc]);

  const processedData = useMemo(() => {
    let filtered = [...doc];
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        [item["Name "], item["Project Title"]].join(" ").toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const ongoing = isOngoing(item);
        return statusFilter === 'ongoing' ? ongoing : !ongoing;
      });
    }
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(item => {
        const name = item["Name "] || '';
        return name.toLowerCase().includes(departmentFilter.toLowerCase());
      });
    }
    filtered.sort((a, b) => {
      const dateA = parseDateYMD(a["Sanction date"]);
      const dateB = parseDateYMD(b["Sanction date"]);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return filtered;
  }, [doc, search, statusFilter, departmentFilter, sortOrder, isOngoing]);

  const stats = useMemo(() => {
    let totalValue = 0, ongoingCount = 0, completedCount = 0;
    doc.forEach(item => {
      const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
      if (!isNaN(val)) totalValue += val;
      if (isOngoing(item)) ongoingCount++; else completedCount++;
    });
    return { totalValue, ongoingCount, completedCount, total: doc.length };
  }, [doc, isOngoing]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, departmentFilter, itemsPerPage]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-red-600 text-center">
        <p className="text-xl font-semibold">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] mx-auto p-4" id="sgnf-top">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Sprout className="text-purple-700" size={36} />
          Seed Grant and Networking Fund
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Internal funding for research initiation and collaboration</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Grants</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Funding</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>₹{(stats.totalValue / 100000).toFixed(2)} L</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 md:p-5 bg-green-50">
          <p className="text-sm md:text-base text-green-600 font-medium">Ongoing</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#15803d' }}>{stats.ongoingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4 md:p-5 bg-purple-50">
          <p className="text-sm md:text-base text-purple-600 font-medium">Completed</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{stats.completedCount}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search by name or project title..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>

      <ProjectFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter} departments={departments} itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage} showAgencyFilter={false} />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">Showing {processedData.length} of {doc.length} grants</p>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Name</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Project Title</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Value (Lakhs)</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Sanction Date</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Duration</th>
              <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No grants found</td></tr>
            ) : paginatedData.map((item, index) => {
              const ongoing = isOngoing(item);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item["Name "]}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item["Project Title"]}</td>
                  <td className="px-4 py-3 text-sm text-gray-700"><span className="flex items-center gap-1"><IndianRupee size={14} />{item["Value (₹1,00,000)"]}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700"><span className="flex items-center gap-1"><Calendar size={14} />{item["Sanction date"] || "N/A"}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700"><span className="flex items-center gap-1"><Clock size={14} />{item["Duration (years)"] || "N/A"} yrs</span></td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ongoing ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      <CheckCircle2 size={12} />{ongoing ? 'Ongoing' : 'Completed'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={processedData.length} itemsPerPage={itemsPerPage} />
    </div>
  );
}




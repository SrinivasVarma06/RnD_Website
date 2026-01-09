import React, { useState, useEffect, useMemo } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { ProjectFilters, Pagination } from '../components/ProjectFilters';
import axios from 'axios';
import { Search, Target, IndianRupee, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import './searchresults.css';

export default function CSR() {
  const [info, setInfo] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [agencyFilter, setAgencyFilter] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://opensheet.vercel.app/1aGpQlcEX4hw_L4nAhOxTC07KK0yXe0QqoKW3s7TRAaM/Sheet1");
        setInfo(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Parse date helper
  function parseDateDMY(dateStr) {
    if (!dateStr || dateStr.toLowerCase() === 'n/a') return null;
    const parts = dateStr.split(/[-.\/]/);
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // Check if project is ongoing
  function isOngoing(item) {
    const sanctionDate = parseDateDMY(item["Sanction date"]);
    if (!sanctionDate) return true;
    const duration = parseFloat(item["Duration (years)"]) || 0;
    const endDate = new Date(sanctionDate);
    endDate.setFullYear(endDate.getFullYear() + duration);
    return endDate > new Date();
  }

  // Get column keys dynamically
  const columns = useMemo(() => {
    if (info.length === 0) return [];
    return Object.keys(info[0]);
  }, [info]);

  // Extract unique departments from Dept(s) column
  const departments = useMemo(() => {
    const depts = new Set();
    info.forEach(item => {
      // Check for Dept(s) column first, then try extracting from investigator
      const deptCol = item["Dept(s)"] || item["Department"] || item["Dept"] || '';
      if (deptCol && deptCol.trim()) {
        depts.add(deptCol.trim());
      } else {
        // Fallback: try extracting from Investigator name
        const investigator = item["Investigator(s)"] || item["PI"] || '';
        const match = investigator.match(/\(([^)]+)\)/);
        if (match) depts.add(match[1].trim());
      }
    });
    return Array.from(depts).sort();
  }, [info]);

  // Extract unique sponsors/agencies
  const agencies = useMemo(() => {
    const agencySet = new Set();
    info.forEach(item => {
      const sponsor = item["Sponsoring Agency"] || item["Sponsor"] || '';
      if (sponsor && sponsor.trim()) agencySet.add(sponsor.trim());
    });
    return Array.from(agencySet).sort();
  }, [info]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...info];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        columns.map(col => item[col] || '').join(" ").toLowerCase().includes(searchLower)
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
        const dept = item["Dept(s)"] || item["Department"] || item["Dept"] || '';
        return dept.toLowerCase().includes(departmentFilter.toLowerCase());
      });
    }

    if (agencyFilter !== 'all') {
      filtered = filtered.filter(item => {
        const sponsor = item["Sponsoring Agency"] || item["Sponsor"] || '';
        return sponsor.toLowerCase().includes(agencyFilter.toLowerCase());
      });
    }

    filtered.sort((a, b) => {
      const dateA = parseDateDMY(a["Sanction date"]);
      const dateB = parseDateDMY(b["Sanction date"]);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [info, search, statusFilter, departmentFilter, agencyFilter, sortOrder, columns]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalValue = 0;
    let ongoingCount = 0;
    let completedCount = 0;

    info.forEach(item => {
      const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
      if (!isNaN(val)) totalValue += val;
      if (isOngoing(item)) ongoingCount++;
      else completedCount++;
    });

    return { totalValue, ongoingCount, completedCount, total: info.length };
  }, [info]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departmentFilter, agencyFilter, itemsPerPage]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-red-600 text-center">
        <p className="text-xl font-semibold">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] mx-auto p-4" id="csrProject-top">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Target className="text-purple-700" size={36} />
          CSR Projects
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Corporate Social Responsibility funded research initiatives</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Projects</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Funding</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>₹{(stats.totalValue / 10000000).toFixed(2)} Cr</p>
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

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search CSR projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <ProjectFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        departments={departments}
        agencyFilter={agencyFilter}
        setAgencyFilter={setAgencyFilter}
        agencies={agencies}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      {/* Results Count & Sort */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {processedData.length} of {info.length} projects
        </p>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {columns.length > 0 && (
            <thead className="bg-purple-800">
              <tr>
                {columns.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white"
                  >
                    {key}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Status</th>
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No projects found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const ongoing = isOngoing(item);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    {columns.map((key, i) => (
                      <td
                        key={i}
                        className="px-4 py-3 whitespace-normal text-sm text-gray-700"
                      >
                        {item[key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        ongoing ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        <CheckCircle2 size={12} />
                        {ongoing ? 'Ongoing' : 'Completed'}
                      </span>
                    </td>
                  </tr>
                );
              })
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



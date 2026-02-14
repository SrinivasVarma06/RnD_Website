import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import EmptyState from '../components/EmptyState/EmptyState';
import { ProjectFilters, Pagination } from '../components/ProjectFilters';
import { Search, Briefcase, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../config/api';
import './searchresults.css';

export default function Consultancy() {
  const [doc, setDoc] = useState([]);
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('consultancy'));
      const jsonData = await response.json();
      setDoc(jsonData);
    } catch (err) {
      console.error("Failed to fetch data from Google Sheet:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Parse date helper (M-D-Y format for consultancy)
  function parseDateMDY(dateStr) {
    if (!dateStr || dateStr.toLowerCase() === 'n/a') return null;
    const parts = dateStr.split(/[-./#]/);
    if (parts.length !== 3) return null;
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // Check if project is ongoing (duration is in months for consultancy)
  const isOngoing = useCallback((item) => {
    const sanctionDate = parseDateMDY(item["Sanction date"]);
    if (!sanctionDate) return true;
    const durationMonths = parseFloat(item["Duration (years)"]) || 0;
    const endDate = new Date(sanctionDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate > new Date();
  }, []);

  // Extract unique departments from Dept(s) column
  const departments = useMemo(() => {
    const depts = new Set();
    doc.forEach(item => {
      const deptCol = item["Dept(s)"] || item["Department"] || item["Dept"] || '';
      if (deptCol && deptCol.trim()) {
        // Handle multiple departments separated by comma or slash
        deptCol.split(/[,\/]/).forEach(d => {
          const trimmed = d.trim();
          if (trimmed) depts.add(trimmed);
        });
      }
    });
    return Array.from(depts).sort();
  }, [doc]);

  // Extract unique organizations
  const agencies = useMemo(() => {
    const agencySet = new Set();
    doc.forEach(item => {
      const org = item["Sponsoring Organization"];
      if (org && org.trim()) agencySet.add(org.trim());
    });
    return Array.from(agencySet).sort();
  }, [doc]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...doc];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        [item["Title"], item["Investigator(s)"], item["Sponsoring Organization"]]
          .join(" ").toLowerCase().includes(searchLower)
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
        const deptCol = item["Dept(s)"] || item["Department"] || item["Dept"] || '';
        return deptCol.toLowerCase().includes(departmentFilter.toLowerCase());
      });
    }

    if (agencyFilter !== 'all') {
      filtered = filtered.filter(item => {
        const org = item["Sponsoring Organization"] || '';
        return org.toLowerCase().includes(agencyFilter.toLowerCase());
      });
    }

    filtered.sort((a, b) => {
      const dateA = parseDateMDY(a["Sanction date"]);
      const dateB = parseDateMDY(b["Sanction date"]);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [doc, search, statusFilter, departmentFilter, agencyFilter, sortOrder, isOngoing]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalValue = 0;
    let ongoingCount = 0;
    let completedCount = 0;

    doc.forEach(item => {
      const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
      if (!isNaN(val)) totalValue += val;
      if (isOngoing(item)) ongoingCount++;
      else completedCount++;
    });

    return { totalValue, ongoingCount, completedCount, total: doc.length };
  }, [doc, isOngoing]);

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
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <EmptyState
          type="error"
          title="Failed to load projects"
          message="We couldn't fetch the consultancy projects data. Please check your connection and try again."
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[95%] mx-auto p-4" id="consultancy-top">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Briefcase className="text-purple-700" size={36} />
          Consultancy Projects
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Industry collaboration and consulting engagements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Projects</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Value</p>
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
          placeholder="Search projects by title, investigator, organization..."
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
          Showing {processedData.length} of {doc.length} projects
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
        {/* Mobile scroll hint */}
        <p className="sm:hidden text-center text-sm text-gray-500 py-2">← Scroll horizontally to see more →</p>
        <table className="min-w-full divide-y divide-gray-200 table-zebra">
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Title</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Principal Investigator</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Industry</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Sanction Date</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Duration</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Value</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-0">
                  <EmptyState
                    type="no-results"
                    title="No projects found"
                    message="Try adjusting your search or filters to find what you're looking for."
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const ongoing = isOngoing(item);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-base font-medium text-gray-800">{item["Title"]}</td>
                    <td className="px-4 py-3 text-base text-gray-800">{item["Investigator(s)"]}</td>
                    <td className="px-4 py-3 text-base text-gray-800">{item["Sponsoring Organization"]}</td>
                    <td className="px-4 py-3 text-base text-gray-800 whitespace-nowrap">{item["Sanction date"] || "N/A"}</td>
                    <td className="px-4 py-3 text-base text-gray-800 whitespace-nowrap">{item["Duration (years)"] || "N/A"} mo</td>
                    <td className="px-4 py-3 text-base text-gray-800 whitespace-nowrap">₹{(parseFloat(item["Value (₹1,00,000)"]) * 100000).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-base">
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




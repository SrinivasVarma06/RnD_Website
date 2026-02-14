import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Search, BookOpen, Users, Building2 } from 'lucide-react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Pagination } from '../components/ProjectFilters';
import { getApiUrl } from '../config/api';

const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '') || '';

const ResearchAreas = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(getApiUrl('research-areas'));
        const rawData = response.data || [];
        const allData = rawData
          .filter(row => row['ProfName'] || row['Name'])
          .map((row, idx) => ({
            id: idx,
            ProfName: row['ProfName'] || row['Name'] || '',
            Department: row['Department'] || '',
            AreaofInterest: (row['AreaofInterest__Area'] || row['Areas of Interest'] || row['AreaofInterest'] || '')
              .split(',')
              .map((area, areaIdx) => ({ id: areaIdx, Area: area.trim() }))
              .filter(a => a.Area)
          }));
        setData(allData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique departments
  const departments = useMemo(() => {
    return [...new Set(data.map((item) => item.Department).filter(Boolean))].sort();
  }, [data]);

  // Filter and process data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Search filter (name or research topic)
    if (search.length >= 2) {
      const searchLower = normalize(search);
      filtered = filtered.filter(item => {
        const nameMatch = normalize(item.ProfName).includes(searchLower);
        const topicMatch = item.AreaofInterest?.some(area => 
          normalize(area.Area).includes(searchLower)
        );
        return nameMatch || topicMatch;
      });
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(item => item.Department === departmentFilter);
    }

    return filtered;
  }, [data, search, departmentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const uniqueProfs = data.filter(d => d.ProfName).length;
    const uniqueDepts = new Set(data.map(d => d.Department).filter(Boolean)).size;
    const totalAreas = data.reduce((sum, d) => sum + (d.AreaofInterest?.length || 0), 0);
    return { uniqueProfs, uniqueDepts, totalAreas };
  }, [data]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter, itemsPerPage]);

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
    <div className="max-w-[95%] mx-auto p-4" id="research-top">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <BookOpen className="text-purple-700" size={36} />
          Research Areas
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Faculty members and their areas of research interest</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Faculty Members</p>
              <p className="text-3xl font-bold text-gray-800">{stats.uniqueProfs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <Building2 className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Departments</p>
              <p className="text-3xl font-bold text-purple-600">{stats.uniqueDepts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-600" size={24} />
            <div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Research Areas</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalAreas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or research topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Items Per Page */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Show per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Results Count */}
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
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Name</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Department</th>
              <th className="px-4 py-3.5 text-left text-base font-semibold text-white">Areas of Interest</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No matching research areas found.
                </td>
              </tr>
            ) : (
              paginatedData.map((prof) => (
                <tr key={prof.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-base font-medium text-gray-900">{prof.ProfName}</td>
                  <td className="px-4 py-3 text-base text-gray-700">{prof.Department}</td>
                  <td className="px-4 py-3 text-base text-gray-700">
                    <ul className="list-disc ml-4 space-y-0.5">
                      {prof.AreaofInterest.map((area) => (
                        <li key={area.id}>{area.Area}</li>
                      ))}
                    </ul>
                  </td>
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

export default ResearchAreas;




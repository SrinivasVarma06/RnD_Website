import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const ProjectFilters = ({
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  departments = [],
  agencyFilter,
  setAgencyFilter,
  agencies = [],
  itemsPerPage,
  setItemsPerPage,
  showAgencyFilter = true,
  showDepartmentFilter = true,
}) => {
  const shouldShowDeptFilter = showDepartmentFilter && departments.length > 0;
  
  const clearAllFilters = () => {
    setStatusFilter('all');
    if (setDepartmentFilter) setDepartmentFilter('all');
    if (setAgencyFilter) setAgencyFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || 
    (shouldShowDeptFilter && departmentFilter !== 'all') || 
    (agencyFilter && agencyFilter !== 'all');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter size={18} />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {shouldShowDeptFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {showAgencyFilter && agencies.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Funding Agency</label>
            <div className="relative">
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Agencies</option>
                {agencies.map((agency, idx) => (
                  <option key={idx} value={agency}>{agency}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Show</label>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')} className="hover:text-purple-900">
                <X size={14} />
              </button>
            </span>
          )}
          {shouldShowDeptFilter && departmentFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Dept: {departmentFilter}
              <button onClick={() => setDepartmentFilter('all')} className="hover:text-green-900">
                <X size={14} />
              </button>
            </span>
          )}
          {agencyFilter && agencyFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Agency: {agencyFilter}
              <button onClick={() => setAgencyFilter('all')} className="hover:text-purple-900">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;

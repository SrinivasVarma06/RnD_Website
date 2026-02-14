import React, { useEffect, useState, useMemo } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Pagination } from '../components/ProjectFilters';
import { Search, Filter, X, ChevronDown, Megaphone } from 'lucide-react';
import { getApiUrl } from '../config/api';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Filter states
    const [agencyFilter, setAgencyFilter] = useState('all');
    const [deadlineFilter, setDeadlineFilter] = useState('all');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(getApiUrl('opportunities'));
                const data = await res.json();
                const today = new Date();

                const filtered = data.filter(entry => {
                    const deadlineStr = entry.Deadline?.trim();
                    const deadlineDate = new Date(deadlineStr);
                    deadlineDate.setDate(deadlineDate.getDate() + 1);
                    const isRolling = /rolling/i.test(deadlineStr);
                    const isFutureDate = deadlineStr && !isNaN(deadlineDate) && deadlineDate >= today;
                    return isRolling || isFutureDate;
                });

                setOpportunities(filtered);
            } catch (err) {
                console.error('Error fetching opportunities:', err);
                setError('Could not load opportunities.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    // Extract unique agencies
    const agencies = useMemo(() => {
        const agencySet = new Set();
        opportunities.forEach(item => {
            // Handle the typo in the data (Agnecy instead of Agency)
            const agency = item.Agnecy || item.Agency || '';
            if (agency && agency.trim()) {
                agencySet.add(agency.trim());
            }
        });
        return Array.from(agencySet).sort();
    }, [opportunities]);

    // Get deadline categories
    const getDeadlineCategory = (deadlineStr) => {
        if (!deadlineStr) return 'unknown';
        if (/rolling/i.test(deadlineStr)) return 'rolling';
        
        const deadlineDate = new Date(deadlineStr);
        if (isNaN(deadlineDate)) return 'unknown';
        
        const today = new Date();
        const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) return 'week';
        if (diffDays <= 30) return 'month';
        if (diffDays <= 90) return 'quarter';
        return 'later';
    };

    // Filter and search data
    const processedData = useMemo(() => {
        let filtered = [...opportunities];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(item =>
                [item.Scheme, item.Agnecy, item.Agency, item.Deadline]
                    .join(' ').toLowerCase().includes(searchLower)
            );
        }

        // Agency filter
        if (agencyFilter !== 'all') {
            filtered = filtered.filter(item => {
                const agency = item.Agnecy || item.Agency || '';
                return agency.toLowerCase() === agencyFilter.toLowerCase();
            });
        }

        // Deadline filter
        if (deadlineFilter !== 'all') {
            filtered = filtered.filter(item => {
                const category = getDeadlineCategory(item.Deadline);
                return category === deadlineFilter;
            });
        }

        return filtered;
    }, [opportunities, search, agencyFilter, deadlineFilter]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedData.slice(start, start + itemsPerPage);
    }, [processedData, currentPage, itemsPerPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, agencyFilter, deadlineFilter, itemsPerPage]);

    const clearAllFilters = () => {
        setAgencyFilter('all');
        setDeadlineFilter('all');
        setSearch('');
    };

    const hasActiveFilters = agencyFilter !== 'all' || deadlineFilter !== 'all' || search !== '';

    if (isLoading) return <PageSkeleton />;

    return (
        <div id='opportunities-top' className="max-w-[95%] mx-auto p-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
                    <Megaphone className="text-purple-700" size={36} />
                    Call for Proposals
                </h1>
                <p className="text-gray-600 mt-3 text-base md:text-lg">Explore upcoming funding opportunities and grant schemes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 md:p-6">
                    <p className="text-base md:text-lg text-gray-600 font-medium">Total Opportunities</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>{opportunities.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-purple-200 p-5 md:p-6 bg-purple-50">
                    <p className="text-base md:text-lg text-purple-600 font-medium">Agencies</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{agencies.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-green-200 p-5 md:p-6 bg-green-50">
                    <p className="text-base md:text-lg text-green-600 font-medium">This Week</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#15803d' }}>
                        {opportunities.filter(o => getDeadlineCategory(o.Deadline) === 'week').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-orange-200 p-5 md:p-6 bg-orange-50">
                    <p className="text-base md:text-lg text-orange-600 font-medium">Rolling Deadline</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#ea580c' }}>
                        {opportunities.filter(o => getDeadlineCategory(o.Deadline) === 'rolling').length}
                    </p>
                </div>
            </div>

            {error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : opportunities.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No current opportunities with upcoming deadlines.</div>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by scheme, agency..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filters */}
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Agency Filter */}
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

                            {/* Deadline Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Deadline</label>
                                <div className="relative">
                                    <select
                                        value={deadlineFilter}
                                        onChange={(e) => setDeadlineFilter(e.target.value)}
                                        className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="all">All Deadlines</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="quarter">Next 3 Months</option>
                                        <option value="later">Later</option>
                                        <option value="rolling">Rolling Deadline</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Items Per Page */}
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

                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                                {agencyFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                        Agency: {agencyFilter}
                                        <button onClick={() => setAgencyFilter('all')} className="hover:text-purple-900">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {deadlineFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        Deadline: {deadlineFilter === 'week' ? 'This Week' : 
                                                   deadlineFilter === 'month' ? 'This Month' : 
                                                   deadlineFilter === 'quarter' ? 'Next 3 Months' : 
                                                   deadlineFilter === 'later' ? 'Later' : 'Rolling'}
                                        <button onClick={() => setDeadlineFilter('all')} className="hover:text-green-900">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {processedData.length} of {opportunities.length} opportunities
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr className='bg-purple-800'>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-base">Scheme</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-base">Agency</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-base">Deadline</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-base">Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No opportunities found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item, idx) => {
                                        const deadlineCategory = getDeadlineCategory(item.Deadline);
                                        return (
                                            <tr
                                                key={idx}
                                                className="hover:bg-gray-50 border-b border-gray-200 transition duration-150"
                                            >
                                                <td className="px-6 py-4 text-base text-gray-800">{item.Scheme}</td>
                                                <td className="px-6 py-4 text-base text-gray-800">{item.Agnecy || item.Agency}</td>
                                                <td className="px-6 py-4 text-base text-gray-800">{item.Deadline}</td>
                                                <td className="px-6 py-4 text-base">
                                                    {item.Link ? (
                                                        <a
                                                            href={item.Link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                                                        >
                                                            View / Apply
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">N/A</span>
                                                    )}
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
                </>
            )}
        </div>
    );
};

export default Opportunities;




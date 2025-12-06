import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Link } from 'react-scroll';
import { ProjectFilters, Pagination } from '../components/ProjectFilters';
import { Search, CalendarDays, IndianRupee, Users, Calendar, CheckCircle2 } from 'lucide-react';

export default function Workshops() {
    const [info, setInfo] = useState([]);
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

    const SPREADSHEET_ID = '1NKU2N_sag8rOG87o2V9n9hN2Z4pXeBuG';
    const GID = '1544214083';
    const CSV_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;

    const sanitizeHeader = (header) => {
        if (header.includes('Value') && header.includes('₹1,00,000')) {
            return 'value_inr_lakh';
        }
        if (header.includes('Sanction date')) {
            return 'sanction_date';
        }
        if (header.includes('Duration (years)')) {
            return 'duration_years';
        }
        return header
            .trim()
            .replace(/[^a-zA-Z0-9_]+/g, '_')
            .replace(/_+/g, '_')
            .toLowerCase();
    };

    const parseCsvLine = (line) => {
        const result = [];
        let inQuote = false;
        let currentField = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
                if (inQuote && i > 0 && line[i - 1] === '"') {
                    currentField += '"';
                }
            } else if (char === ',' && !inQuote) {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        result.push(currentField.trim());
        return result;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(CSV_EXPORT_URL);
                const csvText = res.data;

                const rawLines = csvText.split('\n');
                let dataLines = [];
                let tempLine = '';
                let inQuote = false;

                for (const line of rawLines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine === '' && !inQuote) continue;

                    const quoteCount = (trimmedLine.match(/"/g) || []).length;
                    if (quoteCount % 2 !== 0) {
                        inQuote = !inQuote;
                    }

                    tempLine += trimmedLine;
                    if (!inQuote) {
                        dataLines.push(tempLine);
                        tempLine = '';
                    } else {
                        tempLine += '\n';
                    }
                }

                if (dataLines.length === 0) {
                    throw new Error("No data found in the CSV file.");
                }

                const rawHeaders = parseCsvLine(dataLines[0]);
                const headers = rawHeaders.map(sanitizeHeader);

                const parsedData = dataLines.slice(1).map(line => {
                    const values = parseCsvLine(line);
                    let obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = (values[index] || '').trim();
                    });
                    return obj;
                }).filter(item => Object.values(item).some(val => val !== ''));

                setInfo(parsedData);
            } catch (err) {
                console.error("Failed to fetch workshop documents:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [CSV_EXPORT_URL]);

    function parseDateStr(dateStr) {
        if (!dateStr || dateStr.toLowerCase() === 'n/a') return null;
        const parts = dateStr.split(/[-./#]/);
        if (parts.length !== 3) return null;
        let year = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1;
        let day = parseInt(parts[2], 10);
        if (year > 31) {
            return new Date(year, month, day);
        }
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
    }

    const isOngoing = useCallback((item) => {
        const sanctionDate = parseDateStr(item.sanction_date);
        if (!sanctionDate) return true;
        const duration = parseFloat(item.duration_years) || 0;
        const endDate = new Date(sanctionDate);
        endDate.setFullYear(endDate.getFullYear() + duration);
        return endDate > new Date();
    }, []);

    const departments = useMemo(() => {
        const depts = new Set();
        info.forEach(item => {
            const name = item.name || item.coordinator || '';
            const match = name.match(/\(([^)]+)\)/);
            if (match) depts.add(match[1].trim());
        });
        return Array.from(depts).sort();
    }, [info]);

    const processedData = useMemo(() => {
        let filtered = [...info];
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(item => {
                const values = Object.values(item).join(" ").toLowerCase();
                return values.includes(searchLower);
            });
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => {
                const ongoing = isOngoing(item);
                return statusFilter === 'ongoing' ? ongoing : !ongoing;
            });
        }
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(item => {
                const values = Object.values(item).join(" ").toLowerCase();
                return values.includes(departmentFilter.toLowerCase());
            });
        }
        filtered.sort((a, b) => {
            const dateA = parseDateStr(a.sanction_date);
            const dateB = parseDateStr(b.sanction_date);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return filtered;
    }, [info, search, statusFilter, departmentFilter, sortOrder, isOngoing]);

    const stats = useMemo(() => {
        let totalValue = 0, ongoingCount = 0, completedCount = 0;
        info.forEach(item => {
            const rawValue = item.value_inr_lakh;
            if (rawValue) {
                const numericValue = parseFloat(String(rawValue).replace(/[^0-9.]/g, ''));
                if (!isNaN(numericValue)) {
                    totalValue += numericValue * 100000;
                }
            }
            if (isOngoing(item)) ongoingCount++; else completedCount++;
        });
        return { totalValue, ongoingCount, completedCount, total: info.length };
    }, [info, isOngoing]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedData.slice(start, start + itemsPerPage);
    }, [processedData, currentPage, itemsPerPage]);

    useEffect(() => { setCurrentPage(1); }, [search, statusFilter, departmentFilter, itemsPerPage]);

    const getDisplayKey = (key) => {
        if (key === 'value_inr_lakh') return 'Value (₹ Lakhs)';
        if (key === 'sanction_date') return 'Sanction Date';
        if (key === 'duration_years') return 'Duration (Years)';
        return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    if (loading) return <PageSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 text-red-600 text-center">
                <p className="text-xl font-semibold">Error: {error.message}</p>
            </div>
        );
    }

    const displayColumns = info.length > 0 ? Object.keys(info[0]) : [];

    return (
        <div className="max-w-[95%] mx-auto p-4" id="workshops-top">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
                    <CalendarDays className="text-purple-700" size={36} />
                    Workshops
                </h1>
                <p className="text-gray-600 mt-3 text-base md:text-lg">Conferences, seminars, and training programs</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
                    <p className="text-base md:text-lg text-gray-600 font-medium">Total Workshops</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937' }}>{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
                    <p className="text-base md:text-lg text-gray-600 font-medium">Total Funding</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>₹{stats.totalValue.toLocaleString('en-IN')}</p>
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
                <input type="text" placeholder="Search workshops..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <ProjectFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} departmentFilter={departmentFilter}
                setDepartmentFilter={setDepartmentFilter} departments={departments} itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage} showAgencyFilter={false} />

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Showing {processedData.length} of {info.length} workshops</p>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    {displayColumns.length > 0 && (
                        <thead className="bg-purple-800">
                            <tr>
                                {displayColumns.map((key, index) => (
                                    <th key={index} className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white whitespace-nowrap">
                                        {getDisplayKey(key)}
                                    </th>
                                ))}
                                <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white">Status</th>
                            </tr>
                        </thead>
                    )}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length === 0 ? (
                            <tr><td colSpan={displayColumns.length + 1} className="px-4 py-8 text-center text-gray-500">No workshops found</td></tr>
                        ) : paginatedData.map((item, idx) => {
                            const ongoing = isOngoing(item);
                            return (
                                <tr key={idx} className="hover:bg-gray-50">
                                    {displayColumns.map((key, i) => (
                                        <td key={i} className="px-4 py-3 text-sm text-gray-700 whitespace-normal" style={{ maxWidth: '300px' }}>
                                            {item[key] === '' ? '-' : item[key]}
                                        </td>
                                    ))}
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

            <Link to="workshops-top" spy={true} smooth={true} offset={-100} duration={500}
                className="fixed bottom-6 right-6 bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-800 transition duration-300 cursor-pointer z-50">↑</Link>
        </div>
    );
}




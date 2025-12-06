import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { BookOpen, TrendingUp, Users, Calendar, Award, FileText } from 'lucide-react';

const PURPLE_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6d28d9', '#5b21b6', '#4c1d95'];

export default function Statsofpublications() {
  const [loading, setLoading] = useState(true);
  const [publicationsData, setPublicationsData] = useState([]);
  const [patentsData, setPatentsData] = useState([]);

  const URLS = {
    publications: "https://opensheet.vercel.app/10P7vgxarVBixJkawH_SrFf3FaITKWeNLkc2rwPj0aoo/Sheet1",
    patents: "https://opensheet.vercel.app/1GwrkMQ6uIeKmUU8yhEpZce-cTnGDcvNlj6KwYR6CrBE/Sheet1"
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [publications, patents] = await Promise.all([
          fetch(URLS.publications).then(r => r.json()),
          fetch(URLS.patents).then(r => r.json())
        ]);
        setPublicationsData(publications || []);
        setPatentsData(patents || []);
      } catch (err) {
        console.error("Failed to fetch publication data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [URLS.patents, URLS.publications]);

  // Extract year from publication
  const extractYear = (item) => {
    // Try Year column first
    const year = item["Year"] || item["year"] || item["Publication Year"];
    if (year) {
      const parsed = parseInt(year);
      if (parsed >= 2015 && parsed <= 2030) return parsed;
    }
    return null;
  };

  // Publications by Year
  const publicationsByYear = useMemo(() => {
    const yearData = {};
    
    publicationsData.forEach(item => {
      const year = extractYear(item);
      if (year) {
        if (!yearData[year]) yearData[year] = { year, count: 0 };
        yearData[year].count += 1;
      }
    });

    return Object.values(yearData).sort((a, b) => a.year - b.year);
  }, [publicationsData]);

  // Cumulative publications
  const cumulativePublications = useMemo(() => {
    let cumulative = 0;
    return publicationsByYear.map(item => {
      cumulative += item.count;
      return { ...item, cumulative };
    });
  }, [publicationsByYear]);

  // Top Journals
  const topJournals = useMemo(() => {
    const journalData = {};
    
    publicationsData.forEach(item => {
      const journal = item["Source title"] || item["Journal"] || item["journal"] || item["Conference"] || '';
      const shortJournal = journal.substring(0, 50).trim();
      if (shortJournal && shortJournal.length > 2) {
        if (!journalData[shortJournal]) journalData[shortJournal] = { journal: shortJournal, count: 0 };
        journalData[shortJournal].count += 1;
      }
    });

    return Object.values(journalData)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [publicationsData]);

  // Patents by Year
  const patentsByYear = useMemo(() => {
    const yearData = {};
    
    patentsData.forEach(item => {
      const year = item["Year"] || item["year"] || item["Filing Year"];
      if (year) {
        const parsed = parseInt(year);
        if (parsed >= 2015 && parsed <= 2030) {
          if (!yearData[parsed]) yearData[parsed] = { year: parsed, filed: 0, granted: 0 };
          // Check if patent is granted
          const status = (item["Status"] || item["status"] || '').toLowerCase();
          if (status.includes('grant')) {
            yearData[parsed].granted += 1;
          } else {
            yearData[parsed].filed += 1;
          }
        }
      }
    });

    return Object.values(yearData).sort((a, b) => a.year - b.year);
  }, [patentsData]);

  // Author frequency
  const topAuthors = useMemo(() => {
    const authorData = {};
    
    publicationsData.forEach(item => {
      const authors = item["Authors"] || item["authors"] || item["Author"] || '';
      // Split by common separators
      const authorList = authors.split(/[,;]/).map(a => a.trim()).filter(a => a.length > 2);
      authorList.forEach(author => {
        // Clean author name
        const cleanAuthor = author.replace(/\d+/g, '').trim().substring(0, 30);
        if (cleanAuthor.length > 2) {
          if (!authorData[cleanAuthor]) authorData[cleanAuthor] = { author: cleanAuthor, count: 0 };
          authorData[cleanAuthor].count += 1;
        }
      });
    });

    return Object.values(authorData)
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [publicationsData]);

  // Summary stats
  const summaryStats = useMemo(() => {
    return {
      totalPublications: publicationsData.length,
      totalPatents: patentsData.length,
      yearsActive: publicationsByYear.length,
      avgPerYear: publicationsByYear.length > 0 
        ? Math.round(publicationsData.length / publicationsByYear.length) 
        : 0
    };
  }, [publicationsData, patentsData, publicationsByYear]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-[95%] mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <BookOpen className="text-purple-700" size={36} />
          Publications Statistics
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Dynamic visualization of research publications and patents</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base font-medium mb-1">
            <FileText size={16} />
            Total Publications
          </div>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{summaryStats.totalPublications}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base font-medium mb-1">
            <Award size={16} />
            Total Patents
          </div>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{summaryStats.totalPatents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base font-medium mb-1">
            <Calendar size={16} />
            Years Active
          </div>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a78bfa' }}>{summaryStats.yearsActive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base font-medium mb-1">
            <TrendingUp size={16} />
            Avg. Per Year
          </div>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a78bfa' }}>{summaryStats.avgPerYear}</p>
        </div>
      </div>

      {/* Chart 1: Publications by Year with Trend */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={24} />
          Publications by Year
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={cumulativePublications} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="count" name="Publications" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              name="Cumulative" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row with two charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Chart 2: Top Journals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="text-purple-600" size={24} />
            Top Journals/Venues
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topJournals} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: '#6b7280' }} />
              <YAxis 
                type="category" 
                dataKey="journal" 
                tick={{ fill: '#6b7280', fontSize: 10 }} 
                width={120}
                tickFormatter={(v) => v.length > 20 ? v.substring(0, 20) + '...' : v}
              />
              <Tooltip />
              <Bar dataKey="count" name="Publications" fill="#7c3aed" radius={[0, 4, 4, 0]}>
                {topJournals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PURPLE_COLORS[index % PURPLE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Publications Distribution Pie */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            Top Contributing Authors
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={topAuthors.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ author, count }) => `${author.substring(0, 10)}: ${count}`}
                outerRadius={110}
                dataKey="count"
                nameKey="author"
              >
                {topAuthors.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PURPLE_COLORS[index % PURPLE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Patents by Year */}
      {patentsByYear.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="text-purple-600" size={24} />
            Patents by Year
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={patentsByYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="filed" name="Filed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="granted" name="Granted" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Publications Yearly Summary Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Yearly Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Year</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Publications</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Cumulative</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cumulativePublications.map((item, idx) => {
                const prevCount = idx > 0 ? cumulativePublications[idx - 1].count : 0;
                const growth = prevCount > 0 ? ((item.count - prevCount) / prevCount * 100).toFixed(0) : '-';
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-purple-700 font-bold">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.cumulative}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {growth !== '-' && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(growth) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




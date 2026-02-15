import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { BookOpen, TrendingUp, Calendar, Award, FileText } from 'lucide-react';
import { getApiUrl } from '../config/api';



export default function Statsofpublications() {
  const [loading, setLoading] = useState(true);
  const [publicationsData, setPublicationsData] = useState([]);
  const [patentsData, setPatentsData] = useState([]);
  const [yearlyPage, setYearlyPage] = useState(1);
  const YEARLY_PER_PAGE = 10;

  const URLS = {
    publications: getApiUrl('publications'),
    patents: getApiUrl('patents')
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

  const extractYear = (item) => {
    const year = item["Year"] || item["year"] || item["Publication Year"];
    if (year) {
      const parsed = parseInt(year);
      if (parsed >= 2015 && parsed <= 2030) return parsed;
    }
    return null;
  };

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

  const cumulativePublications = useMemo(() => {
    let cumulative = 0;
    return publicationsByYear.map(item => {
      cumulative += item.count;
      return { ...item, cumulative };
    });
  }, [publicationsByYear]);



  const patentsByYear = useMemo(() => {
    const yearData = {};
    
    patentsData.forEach(item => {
      const year = item["Year"] || item["year"] || item["Filing Year"];
      if (year) {
        const parsed = parseInt(year);
        if (parsed >= 2015 && parsed <= 2030) {
          if (!yearData[parsed]) yearData[parsed] = { year: parsed, filed: 0, granted: 0 };
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

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={24} />
          Publications by Year
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={cumulativePublications} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              tick={{ fill: '#7c3aed' }} 
              label={{ value: 'Publications', angle: -90, position: 'insideLeft', fill: '#7c3aed' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fill: '#06b6d4' }} 
              label={{ value: 'Cumulative', angle: 90, position: 'insideRight', fill: '#06b6d4' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="Publications" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulative" 
              name="Cumulative" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>



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

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Yearly Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                <th className="px-6 py-3 text-left text-base font-medium text-white">Year</th>
                <th className="px-6 py-3 text-left text-base font-medium text-white">Publications</th>
                <th className="px-6 py-3 text-left text-base font-medium text-white">Cumulative</th>
                <th className="px-6 py-3 text-left text-base font-medium text-white">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cumulativePublications
                .slice((yearlyPage - 1) * YEARLY_PER_PAGE, yearlyPage * YEARLY_PER_PAGE)
                .map((item, idx) => {
                  const actualIdx = (yearlyPage - 1) * YEARLY_PER_PAGE + idx;
                  const prevCount = actualIdx > 0 ? cumulativePublications[actualIdx - 1].count : 0;
                  const growth = prevCount > 0 ? ((item.count - prevCount) / prevCount * 100).toFixed(0) : '-';
                  return (
                    <tr key={actualIdx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-base text-gray-900">{item.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-purple-700 font-bold">{item.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{item.cumulative}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base">
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
        
        {cumulativePublications.length > YEARLY_PER_PAGE && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {((yearlyPage - 1) * YEARLY_PER_PAGE) + 1} to {Math.min(yearlyPage * YEARLY_PER_PAGE, cumulativePublications.length)} of {cumulativePublications.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setYearlyPage(prev => Math.max(prev - 1, 1))}
                disabled={yearlyPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  yearlyPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {yearlyPage} of {Math.ceil(cumulativePublications.length / YEARLY_PER_PAGE)}
              </span>
              <button
                onClick={() => setYearlyPage(prev => Math.min(prev + 1, Math.ceil(cumulativePublications.length / YEARLY_PER_PAGE)))}
                disabled={yearlyPage >= Math.ceil(cumulativePublications.length / YEARLY_PER_PAGE)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  yearlyPage >= Math.ceil(cumulativePublications.length / YEARLY_PER_PAGE)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




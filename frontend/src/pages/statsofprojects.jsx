import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { TrendingUp, Building2, Calendar, IndianRupee, PieChartIcon, BarChart3 } from 'lucide-react';
import { getApiUrl } from '../config/api';

const PURPLE_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6d28d9', '#5b21b6', '#4c1d95'];
const PROJECT_COLORS = { sponsored: '#7c3aed', consultancy: '#06b6d4', csr: '#10b981', sgnf: '#f59e0b' };

export default function Statsofprojects() {
  const [loading, setLoading] = useState(true);
  const [sponsoredData, setSponsoredData] = useState([]);
  const [consultancyData, setConsultancyData] = useState([]);
  const [csrData, setCsrData] = useState([]);
  const [sgnfData, setSgnfData] = useState([]);

  const URLS = {
    sponsored: getApiUrl('sponsored'),
    consultancy: getApiUrl('consultancy'),
    csr: getApiUrl('csr'),
    sgnf: getApiUrl('sgnf')
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [sponsored, consultancy, csr, sgnf] = await Promise.all([
          fetch(URLS.sponsored).then(r => r.json()),
          fetch(URLS.consultancy).then(r => r.json()),
          fetch(URLS.csr).then(r => r.json()),
          fetch(URLS.sgnf).then(r => r.json())
        ]);
        setSponsoredData(sponsored || []);
        setConsultancyData(consultancy || []);
        setCsrData(csr || []);
        setSgnfData(sgnf || []);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [URLS.consultancy, URLS.csr, URLS.sgnf, URLS.sponsored]);

  const extractYear = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase() === 'n/a') return null;
    if (/^\d{4}[-/#]/.test(dateStr)) return parseInt(dateStr.substring(0, 4));
    const parts = dateStr.split(/[-/#.]/);
    if (parts.length === 3) {
      const last = parseInt(parts[2]);
      if (last > 1900 && last < 2100) return last;
      const first = parseInt(parts[0]);
      if (first > 1900 && first < 2100) return first;
    }
    return null;
  };

  const extractDept = (name) => {
    if (!name) return 'Other';
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : 'Other';
  };

  const getValue = (item) => {
    const val = item["Value (₹1,00,000)"] || item["value_inr_lakh"] || item["Value"] || 0;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  const fundingByYear = useMemo(() => {
    const yearData = {};
    
    const processData = (data, type, dateKey) => {
      data.forEach(item => {
        const year = extractYear(item[dateKey] || item["Sanction date"] || item["Sanction Date"]);
        if (year && year >= 2015 && year <= 2030) {
          if (!yearData[year]) yearData[year] = { year, sponsored: 0, consultancy: 0, csr: 0, sgnf: 0, total: 0 };
          const value = getValue(item);
          yearData[year][type] += value;
          yearData[year].total += value;
        }
      });
    };

    processData(sponsoredData, 'sponsored', 'Sanction Date');
    processData(consultancyData, 'consultancy', 'Sanction Date');
    processData(csrData, 'csr', 'Sanction Date');
    processData(sgnfData, 'sgnf', 'Sanction date');

    return Object.values(yearData).sort((a, b) => a.year - b.year);
  }, [sponsoredData, consultancyData, csrData, sgnfData]);

  const projectsByYear = useMemo(() => {
    const yearData = {};
    
    const processData = (data, type, dateKey) => {
      data.forEach(item => {
        const year = extractYear(item[dateKey] || item["Sanction date"] || item["Sanction Date"]);
        if (year && year >= 2015 && year <= 2030) {
          if (!yearData[year]) yearData[year] = { year, sponsored: 0, consultancy: 0, csr: 0, sgnf: 0, total: 0 };
          yearData[year][type] += 1;
          yearData[year].total += 1;
        }
      });
    };

    processData(sponsoredData, 'sponsored', 'Sanction Date');
    processData(consultancyData, 'consultancy', 'Sanction Date');
    processData(csrData, 'csr', 'Sanction Date');
    processData(sgnfData, 'sgnf', 'Sanction date');

    return Object.values(yearData).sort((a, b) => a.year - b.year);
  }, [sponsoredData, consultancyData, csrData, sgnfData]);

  const projectsByDept = useMemo(() => {
    const deptData = {};
    
    const processData = (data) => {
      data.forEach(item => {
        const name = item["Investigator(s)"] || item["Name "] || item["PI"] || '';
        const dept = extractDept(name);
        if (!deptData[dept]) deptData[dept] = { department: dept, count: 0, value: 0 };
        deptData[dept].count += 1;
        deptData[dept].value += getValue(item);
      });
    };

    processData(sponsoredData);
    processData(consultancyData);
    processData(csrData);
    processData(sgnfData);

    return Object.values(deptData)
      .filter(d => d.department !== 'Other')
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [sponsoredData, consultancyData, csrData, sgnfData]);

  const projectTypeDistribution = useMemo(() => {
    const calcTotal = (data) => data.reduce((sum, item) => sum + getValue(item), 0);
    return [
      { name: 'Sponsored', value: calcTotal(sponsoredData), count: sponsoredData.length, fill: PROJECT_COLORS.sponsored },
      { name: 'Consultancy', value: calcTotal(consultancyData), count: consultancyData.length, fill: PROJECT_COLORS.consultancy },
      { name: 'CSR', value: calcTotal(csrData), count: csrData.length, fill: PROJECT_COLORS.csr },
      { name: 'SGNF', value: calcTotal(sgnfData), count: sgnfData.length, fill: PROJECT_COLORS.sgnf }
    ];
  }, [sponsoredData, consultancyData, csrData, sgnfData]);

  const topAgencies = useMemo(() => {
    const agencyData = {};
    
    sponsoredData.forEach(item => {
      const agency = item["Sponsoring Agency-Scheme"] || item["Sponsoring Agency"] || 'Unknown';
      const shortAgency = agency.split('-')[0].trim().substring(0, 30);
      if (!agencyData[shortAgency]) agencyData[shortAgency] = { agency: shortAgency, value: 0, count: 0 };
      agencyData[shortAgency].value += getValue(item);
      agencyData[shortAgency].count += 1;
    });

    return Object.values(agencyData)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sponsoredData]);

  const summaryStats = useMemo(() => {
    const totalProjects = sponsoredData.length + consultancyData.length + csrData.length + sgnfData.length;
    const totalFunding = projectTypeDistribution.reduce((sum, p) => sum + p.value, 0);
    return { totalProjects, totalFunding };
  }, [projectTypeDistribution, sponsoredData, consultancyData, csrData, sgnfData]);

  const formatCurrency = (value) => `₹${(value / 100).toFixed(1)}Cr`;
  const formatLakhs = (value) => `₹${value.toFixed(1)}L`;

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-[95%] mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <BarChart3 className="text-purple-700" size={36} />
          Projects Statistics
        </h1>
        <p className="text-gray-600 mt-3 text-base md:text-lg">Dynamic visualization of research project data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Projects</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{summaryStats.totalProjects}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Total Funding</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a855f7' }}>{formatCurrency(summaryStats.totalFunding)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Sponsored Projects</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#a78bfa' }}>{sponsoredData.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5">
          <p className="text-base md:text-lg text-gray-600 font-medium">Consultancy Projects</p>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#22d3ee' }}>{consultancyData.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={24} />
          Funding by Year (in Lakhs)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fundingByYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip 
              formatter={(value, name) => [`₹${value.toFixed(2)} Lakhs`, name.charAt(0).toUpperCase() + name.slice(1)]}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="sponsored" name="Sponsored" stackId="a" fill={PROJECT_COLORS.sponsored} radius={[0, 0, 0, 0]} />
            <Bar dataKey="consultancy" name="Consultancy" stackId="a" fill={PROJECT_COLORS.consultancy} />
            <Bar dataKey="csr" name="CSR" stackId="a" fill={PROJECT_COLORS.csr} />
            <Bar dataKey="sgnf" name="SGNF" stackId="a" fill={PROJECT_COLORS.sgnf} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Number of Projects by Year
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={projectsByYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Area type="monotone" dataKey="total" name="Total" fill="#ddd6fe" stroke="#7c3aed" />
            <Bar dataKey="sponsored" name="Sponsored" fill={PROJECT_COLORS.sponsored} />
            <Bar dataKey="consultancy" name="Consultancy" fill={PROJECT_COLORS.consultancy} />
            <Bar dataKey="csr" name="CSR" fill={PROJECT_COLORS.csr} />
            <Bar dataKey="sgnf" name="SGNF" fill={PROJECT_COLORS.sgnf} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChartIcon className="text-purple-600" size={24} />
            Funding Distribution by Type
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={projectTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                dataKey="value"
              >
                {projectTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatLakhs(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="text-purple-600" size={24} />
            Funding by Department (Top 10)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={projectsByDept} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: '#6b7280' }} tickFormatter={(v) => `₹${v}L`} />
              <YAxis type="category" dataKey="department" tick={{ fill: '#6b7280', fontSize: 12 }} width={50} />
              <Tooltip formatter={(value) => formatLakhs(value)} />
              <Bar dataKey="value" name="Funding (Lakhs)" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <IndianRupee className="text-purple-600" size={24} />
          Top Funding Agencies (Sponsored Projects)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topAgencies} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="agency" 
              tick={{ fill: '#6b7280', fontSize: 11 }} 
              angle={-30} 
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: '#6b7280' }} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip 
              formatter={(value) => [formatLakhs(value), 'Funding']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Bar dataKey="value" name="Funding" fill="#7c3aed" radius={[4, 4, 0, 0]}>
              {topAgencies.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PURPLE_COLORS[index % PURPLE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Summary by Project Type</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Project Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Number of Projects</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Total Funding</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white">Avg. Funding/Project</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectTypeDistribution.map((type, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: type.fill }}></span>
                      {type.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{type.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-purple-700 font-medium">{formatLakhs(type.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {type.count > 0 ? formatLakhs(type.value / type.count) : '₹0L'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




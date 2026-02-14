import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, TrendingUp, Target, BookOpen, Users, Award, FileText, IndianRupee } from 'lucide-react';
import { getApiUrl } from '../../config/api';

const SHEETS = {
  consultancy: getApiUrl('consultancy'),
  sponsored: getApiUrl('sponsored'),
  csrProjects: getApiUrl('csr'),
  sgnf: getApiUrl('sgnf'),
  publications: getApiUrl('publications'),
  patents: getApiUrl('patents'),
};

const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const frameRef = useRef();

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();
    const startValue = countRef.current;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration]);

  return count;
};

// Stat Card Component with enhanced hover effects
const StatCard = ({ icon: Icon, label, value, subValue, color, isLoading }) => {
  const animatedValue = useCountUp(value, 1500);
  
  // Get gradient colors based on border color
  const getGradient = () => {
    if (color.includes('purple')) return 'from-purple-50 to-white';
    if (color.includes('green')) return 'from-green-50 to-white';
    if (color.includes('orange')) return 'from-orange-50 to-white';
    if (color.includes('red')) return 'from-red-50 to-white';
    return 'from-gray-50 to-white';
  };

  return (
    <div className={`bg-gradient-to-br ${getGradient()} rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-4 border-l-4 ${color} cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm md:text-base font-medium mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {animatedValue.toLocaleString('en-IN')}
            </p>
          )}
          {subValue && !isLoading && (
            <p className="text-sm md:text-base text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={30} className={color.replace('border-', 'text-').replace('-500', '-600')} />
        </div>
      </div>
    </div>
  );
};

const StatisticsDashboard = ({ refreshInterval = 60000 }) => {
  const [stats, setStats] = useState({
    consultancy: { count: 0, value: 0 },
    sponsored: { count: 0, value: 0 },
    csrProjects: { count: 0, value: 0 },
    sgnf: { count: 0, value: 0 },
    publications: 0,
    patents: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch from Google Sheets (parallel)
      const [consultancyRes, sponsoredRes, csrRes, sgnfRes, publicationsRes, patentsRes] = await Promise.all([
        fetch(SHEETS.consultancy).then(r => r.json()).catch(() => []),
        fetch(SHEETS.sponsored).then(r => r.json()).catch(() => []),
        fetch(SHEETS.csrProjects).then(r => r.json()).catch(() => []),
        fetch(SHEETS.sgnf).then(r => r.json()).catch(() => []),
        fetch(SHEETS.publications).then(r => r.json()).catch(() => []),
        fetch(SHEETS.patents).then(r => r.json()).catch(() => []),
      ]);

      // Calculate consultancy stats
      let consultancyValue = 0;
      consultancyRes.forEach(item => {
        const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
        if (!isNaN(val)) consultancyValue += val;
      });

      // Calculate sponsored stats
      let sponsoredValue = 0;
      sponsoredRes.forEach(item => {
        const val = parseInt(item["Value (₹1,00,000)"]) * 100000;
        if (!isNaN(val)) sponsoredValue += val;
      });

      // Calculate CSR stats
      let csrValue = 0;
      csrRes.forEach(item => {
        const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
        if (!isNaN(val)) csrValue += val;
      });

      // Calculate SGNF stats
      let sgnfValue = 0;
      sgnfRes.forEach(item => {
        const val = parseFloat(item["Value (₹1,00,000)"]) * 100000;
        if (!isNaN(val)) sgnfValue += val;
      });

      setStats({
        consultancy: { count: consultancyRes.length, value: consultancyValue },
        sponsored: { count: sponsoredRes.length, value: sponsoredValue },
        csrProjects: { count: csrRes.length, value: csrValue },
        sgnf: { count: sgnfRes.length, value: sgnfValue },
        publications: publicationsRes.length,
        patents: patentsRes.length,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const totalProjects = stats.consultancy.count + stats.sponsored.count + stats.csrProjects.count + stats.sgnf.count;
  const totalFunding = stats.consultancy.value + stats.sponsored.value + stats.csrProjects.value + stats.sgnf.value;

  return (
    <div className="w-full py-6 px-4">
      <div className="max-w-7xl mx-auto mb-8 px-4 py-6 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Research at a Glance
          </h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={Briefcase}
          label="Consultancy Projects"
          value={stats.consultancy.count}
          subValue={`₹${(stats.consultancy.value / 10000000).toFixed(2)} Cr`}
          color="border-purple-500"
          isLoading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Sponsored Projects"
          value={stats.sponsored.count}
          subValue={`₹${(stats.sponsored.value / 10000000).toFixed(2)} Cr`}
          color="border-purple-500"
          isLoading={loading}
        />
        <StatCard
          icon={Target}
          label="CSR Projects"
          value={stats.csrProjects.count}
          subValue={`₹${(stats.csrProjects.value / 10000000).toFixed(2)} Cr`}
          color="border-green-500"
          isLoading={loading}
        />
        <StatCard
          icon={FileText}
          label="SGNF Projects"
          value={stats.sgnf.count}
          subValue={`₹${(stats.sgnf.value / 10000000).toFixed(2)} Cr`}
          color="border-orange-500"
          isLoading={loading}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
        <StatCard
          icon={Award}
          label="Patents"
          value={stats.patents}
          color="border-red-500"
          isLoading={loading}
        />
        <StatCard
          icon={BookOpen}
          label="Publications"
          value={stats.publications}
          color="border-orange-500"
          isLoading={loading}
        />
      </div>

      {/* Summary Banner */}
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl p-6 md:p-8 text-white shadow-lg" style={{ background: 'linear-gradient(to right, #7c3aed, #9333ea)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <p className="text-base md:text-lg font-medium mb-2" style={{ color: '#c7d2fe' }}>Total Research Projects</p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'white' }}>
                {loading ? '...' : totalProjects.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-base md:text-lg font-medium mb-2" style={{ color: '#c7d2fe' }}>Total Research Funding</p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <IndianRupee size={26} />
                {loading ? '...' : `${(totalFunding / 10000000).toFixed(2)} Cr`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Box,
  MenuItem,
} from '@mui/material';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Link } from 'react-scroll';

const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '') || '';

const ResearchAreas = () => {
  const [data, setData] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let allData = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await axios.get(
            `https://rnd.iitdh.ac.in/strapi/api/research-areas?populate=*&pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`
          );
          const results = response.data?.data || [];
          const meta = response.data?.meta?.pagination || {};
          allData = [...allData, ...results];
          hasMore = page < meta.pageCount;
          page += 1;
        }
        setData(allData);
        setTotalPages(Math.ceil(allData.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);   

  const isSearching = 
    normalize(nameSearch).length >= 3 ||
    normalize(topicSearch).length >= 3 ||
    selectedDept !== '';

  const uniqueDepartments = [
    ...new Set(data.map((item) => item.Department).filter(Boolean)),
  ];

  const filteredData = isSearching ? data.filter((item) => {
    const nameMatch = normalize(item.ProfName).includes(normalize(nameSearch));
    const deptMatch = selectedDept ? item.Department === selectedDept : true;
    const topicMatch = topicSearch
      ? item.AreaofInterest?.some((area) =>
        normalize(area.Area).includes(normalize(topicSearch))
      )
      : true;

    return nameMatch && deptMatch && topicMatch;
  }) : data;

  const paginatedData = isSearching ? filteredData : filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id='research-top' className="p-4 max-w-screen-xl mx-auto">
      <Box sx={{ maxWidth: '95%', mx: 'auto', p: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          Academics and Research Areas
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            size="small"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Filter by Department"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Departments</MenuItem>
            {uniqueDepartments.map((dept, idx) => (
              <MenuItem key={idx} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Search by Research Topic"
            variant="outlined"
            size="small"
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
          />
        </Box>
      </Box>

      <div className="p-4" id="research-areas-table">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-800">
              <tr>
                <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white tracking-wide">
                  Department
                </th>
                <th className="px-4 py-3.5 text-left text-sm md:text-base font-semibold text-white tracking-wide">
                  Areas of Interest
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-6">
                    <PageSkeleton />
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((prof) => (
                  <tr key={prof.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">
                      {prof.ProfName}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      {prof.Department}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      <ul className="list-disc ml-4 space-y-0.5">
                        {prof.AreaofInterest.map((area) => (
                          <li key={area.id}>{area.Area}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-gray-50">
                  <td
                    colSpan="3"
                    className="px-4 py-6 text-center text-gray-500 text-sm sm:text-base"
                  >
                    No matching research areas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && !isSearching &&(
        <div className="flex justify-center items-center mt-4 flex-wrap gap-2 text-sm sm:text-base">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="cursor-pointer px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`cursor-pointer px-3 py-1 rounded border ${page === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="cursor-pointer px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {/* Back to Top Button */}
      <div className="cursor-pointer text-center mt-10">
        <Link
          to="research-top"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 cursor-pointer z-50"
        >
          ↑
        </Link>
      </div>
    </div>
  );
};

export default ResearchAreas;




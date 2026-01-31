import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import searchData from '../searchData.jsx';
import './searchresults.css';
import PageHeader from '../components/PageHeader/PageHeader';

// Helper to check if link is external
const isExternalLink = (link) => link && (link.startsWith('http://') || link.startsWith('https://'));

export default function Searchresults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredResults = searchData.filter(item =>
    item.content.toLowerCase().includes(query) || 
    item.title.toLowerCase().includes(query) ||
    item.displaycontent.toLowerCase().includes(query) ||
    item.page.toLowerCase().includes(query)
  );

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.page]) {
      acc[item.page] = [];
    }
    acc[item.page].push(item);
    return acc;
  }, {});

  return (
    <div id='search-top' className='searchresults'>
      <PageHeader 
        title={`Search Results: "${query}"`} 
        subtitle={`Found ${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
        icon="🔍"
      />
      
      {filteredResults.length > 0 ? (
        Object.entries(groupedResults).map(([page, items]) => (
          <div key={page} className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-600 rounded"></span>
              {page}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 bg-white">
                  {isExternalLink(item.link) ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="!text-purple-600 font-medium underline hover:text-purple-800"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link to={item.link} className="!text-purple-600 font-medium underline hover:text-purple-800">
                      {item.title}
                    </Link>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{item.displaycontent}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔎</div>
          <p className="text-gray-600 text-lg">No matching results found for "{query}"</p>
          <p className="text-gray-400 mt-2">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
}




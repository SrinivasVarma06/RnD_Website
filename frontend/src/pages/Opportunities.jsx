import React, { useEffect, useState } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { Link } from 'react-scroll';

const CACHE_KEY = 'cachedOpportunities';
const CACHE_TIMESTAMP_KEY = 'opportunitiesCacheTimestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in ms

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(
                    'https://opensheet.vercel.app/1t352KbG0gFpu_QK7BVjBrcwLy5Kthq4JmHRy_AtVHUM/Sheet1'
                );
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

                localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
                localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

                setOpportunities(filtered);
            } catch (err) {
                console.error('Error fetching opportunities:', err);
                setError('Could not load opportunities.');
            } finally {
                setIsLoading(false);
            }
        };

        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (
            cachedData &&
            cacheTimestamp &&
            now - parseInt(cacheTimestamp, 10) < CACHE_DURATION
        ) {
            setOpportunities(JSON.parse(cachedData));
            setIsLoading(false);
        } else {
            fetchOpportunities();
        }
    }, []);

    return (
        <>
            <div id='opportunities-top' className="px-4 py-8 max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3">Call for Proposals</h1>
                <p className="text-gray-600 mb-8 text-base md:text-lg">Explore upcoming funding opportunities and grant schemes</p>

                {isLoading ? (
                    <PageSkeleton />
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : opportunities.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No current opportunities with upcoming deadlines.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr className='bg-purple-800'>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-sm md:text-base">Scheme</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-sm md:text-base">Agency</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-sm md:text-base">Deadline</th>
                                    <th className="text-left text-white font-semibold px-6 py-3.5 text-sm md:text-base">Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opportunities.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 border-b border-gray-200 transition duration-150"
                                    >
                                        <td className="px-6 py-4 text-gray-800">{item.Scheme}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.Agnecy}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.Deadline}</td>
                                        <td className="px-6 py-4">
                                            {item.Link ? (
                                                <a
                                                    href={item.Link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-600 hover:underline font-medium"
                                                >
                                                    View / Apply
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Back to Top Button */}
            <div className="cursor-pointer text-center mt-10">
                <Link
                    to="opportunities-top"
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 cursor-pointer z-50"
                >
                    ↑
                </Link>
            </div>
        </>
    );
};

export default Opportunities;




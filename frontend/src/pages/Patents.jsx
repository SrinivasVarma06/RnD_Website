import { useState, useEffect } from 'react';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import "./searchresults.css"

const Patents = () => {
    const [patentData, setPatentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [entries,setEntries] = useState('');
    const [number,setNumber] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(getApiUrl('patents'));
                setPatentData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchNumber = async () => {
        try {
            const response = await axios.get(getApiUrl('patents-count'));
            const csvString = response.data;
            const parsedNumber = typeof csvString === 'object' && csvString.count != null ? csvString.count : parseFloat(csvString);

            if (!isNaN(parsedNumber)) {
            setNumber(parsedNumber);
            } else {
            setNumber(null);
            }

        } catch (err) {
            console.error("Failed to fetch number:", err);
            setNumber(null);
        }
    };

    fetchNumber();
  }, [])

    useEffect(()=>{
        let count=0;

        patentData.map((item)=>{
            count++;
        })
        
        setEntries(count)
    },[patentData])

    if (loading) {
        return (
            <PageSkeleton />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 text-gray-800 flex flex-col justify-center items-center text-red-600">
                <p className="text-xl font-semibold">Error: {error.message}</p>
            </div>
        );
    }

    return (   
        <div className="p-6">
            <h1 id='patents-top' className='text-3xl font-bold text-center text-gray-800 mb-6'>PATENTS</h1>
            
            <ul className='project-summary'>
                <li><b>Total Patents: </b>{entries}</li>
                <li><b>Total Patents Submitted: </b>{number} </li>
            </ul>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    {patentData.length > 0 && (
                        <thead className="bg-purple-800">
                            <tr>
                                {Object.keys(patentData[0]).map((key) => (
                                    <th
                                        key={key}
                                        className="px-6 py-3.5 text-left text-base font-semibold text-white"
                                    >
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patentData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                {Object.keys(patentData[0]).map((key, i) => (
                                    <td
                                        key={i}
                                        className="px-6 py-4 whitespace-normal text-base text-gray-700"
                                    >
                                        {item[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Patents;



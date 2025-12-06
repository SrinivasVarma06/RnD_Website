import React, { useEffect, useState } from 'react';
import AltCarousel from '../components/Carousel/AltCarousel';
import StatisticsDashboard from '../components/StatisticsDashboard/StatisticsDashboard';
import { Link } from 'react-scroll';

const Home = () => {
    const [driveImages, setDriveImages] = useState([]);

    
   useEffect(() => {
  const fetchStrapiImages = async () => {
    const url = "https://rnd.iitdh.ac.in/strapi/api/upload/files"; 

    try {
      const res = await fetch(url);
      const data = await res.json();

      
      const imageUrls = data
        .filter((file) => file.mime.includes("image/"))
        .map((file) => file.url.startsWith("http") ? file.url : `http://localhost:1337${file.url}`);

      setDriveImages(imageUrls);
    } catch (err) {
      console.error("Error fetching Strapi images:", err);
    }
  };

  fetchStrapiImages();
}, []);

    const allImages = [...driveImages];

    return (
        <>
            {/* Carousel Section */}
            <div id='home-top' className="py-6 px-4 md:px-8">
                <div className="">
                    <AltCarousel images={allImages} />
                </div>
            </div>

            {/* Statistics Dashboard Section */}
            <StatisticsDashboard />

            {/* Back to Top Button */}
            <div className="cursor-pointer text-center mt-10">
                <Link
                    to="home-top"
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

export default Home;



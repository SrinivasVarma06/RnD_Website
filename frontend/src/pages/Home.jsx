import React, { useEffect, useState } from 'react';
import AltCarousel from '../components/Carousel/AltCarousel';
import StatisticsDashboard from '../components/StatisticsDashboard/StatisticsDashboard';

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
                <AltCarousel images={allImages} />
            </div>

            {/* Statistics Dashboard Section */}
            <StatisticsDashboard />
        </>
    );
};

export default Home;



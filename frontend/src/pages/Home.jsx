import React, { useEffect, useState } from 'react';
import AltCarousel from '../components/Carousel/AltCarousel';
import StatisticsDashboard from '../components/StatisticsDashboard/StatisticsDashboard';
import { getApiUrl } from '../config/api';

const convertToDriveDirectUrl = (url) => {
    if (!url) return null;
    
    if (url.includes('lh3.googleusercontent.com')) {
        return url;
    }
    
    let fileId = null;
    
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) fileId = match1[1];
    
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) fileId = match2[1];
    
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    
    return url;
};

const Home = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarouselImages = async () => {
            try {
                const response = await fetch(getApiUrl('carousel'));
                if (!response.ok) throw new Error('Failed to fetch');
                
                const data = await response.json();
                
                if (data && Array.isArray(data) && data.length > 0) {
                    const imageUrls = data
                        .map(item => item.URL || item.url || item.ImageURL || item.Image || item.image || item.Link || item.link)
                        .filter(Boolean)
                        .map(convertToDriveDirectUrl)
                        .filter(Boolean);
                    
                    if (imageUrls.length > 0) {
                        setImages(imageUrls);
                    }
                }
            } catch (err) {
                console.error("Error fetching carousel images:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselImages();
    }, []);

    return (
        <>
            <div id='home-top' className="py-6 px-4 md:px-8">
                {!loading && images.length > 0 && <AltCarousel images={images} />}
            </div>

            <StatisticsDashboard />
        </>
    );
};

export default Home;



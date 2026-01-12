import React, { useEffect, useState } from 'react';
import AltCarousel from '../components/Carousel/AltCarousel';
import StatisticsDashboard from '../components/StatisticsDashboard/StatisticsDashboard';

// Google Sheet for carousel images - admins can add/remove images by editing the sheet
// Sheet: https://docs.google.com/spreadsheets/d/1vWcPPCIsbXw0O8zwvjXAkXn0Hg7zY0pUWwUCJ_jTkjc/edit
// Tab name: "Carousel Images"
// IMPORTANT: Each image in Google Drive must be shared as "Anyone with the link" → Viewer
const CAROUSEL_SHEET_URL = 'https://opensheet.vercel.app/1vWcPPCIsbXw0O8zwvjXAkXn0Hg7zY0pUWwUCJ_jTkjc/Carousel%20Images';

// Convert Google Drive share URL to direct image URL using lh3.googleusercontent.com (more reliable)
const convertToDriveDirectUrl = (url) => {
    if (!url) return null;
    
    // Already in lh3 format
    if (url.includes('lh3.googleusercontent.com')) {
        return url;
    }
    
    // Extract file ID from various Google Drive URL formats
    let fileId = null;
    
    // Format: /file/d/FILE_ID/
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) fileId = match1[1];
    
    // Format: id=FILE_ID
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) fileId = match2[1];
    
    if (fileId) {
        // Use lh3.googleusercontent.com format - works better for embedding
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
                const response = await fetch(CAROUSEL_SHEET_URL);
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
            {/* Carousel Section */}
            <div id='home-top' className="py-6 px-4 md:px-8">
                {!loading && images.length > 0 && <AltCarousel images={images} />}
            </div>

            {/* Statistics Dashboard Section */}
            <StatisticsDashboard />
        </>
    );
};

export default Home;



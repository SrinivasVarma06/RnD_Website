import React, { useState, useEffect } from "react";
import PageSkeleton from "../components/LoadingSkeleton/PageSkeleton";
import DOMPurify from "dompurify";
import { getContentUrl } from '../config/api';

const Message = () => {
  const [docContent, setDocContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicGoogleDocContent = async () => {
      try {
        const response = await fetch(getContentUrl('dean-message'));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDocContent(DOMPurify.sanitize(data.html));
      } catch (err) {
        setError(err);
        console.error("Failed to fetch Dean's message:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicGoogleDocContent();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10 text-center text-red-500">
          Error loading message: {error.message}
          <p>Please ensure the Google Doc is publicly accessible ('Anyone with the link can view').</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="
          text-center
          text-[24px] md:text-[30px] lg:text-[30px]
          font-semibold
          !text-purple-600
          font-lato
          not-italic
          leading-normal
          tracking-[1.8px]
          py-8
        ">
          Message from Dean
        </h1>
        <div className="relative w-full">
          <div
            className="doc-content-wrapper prose max-w-none font-lato text-black text-justify text-[16px] md:text-[18px] leading-[150%] tracking-[0.9px]"
            dangerouslySetInnerHTML={{ __html: docContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;



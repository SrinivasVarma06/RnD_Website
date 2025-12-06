import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFErrorFallback from './PDFErrorFallback';
import './PDFViewer.css';

// Set up the worker source for PDF.js
// Use HTTPS for the worker to ensure it works in all environments
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  // Get the absolute URL for the PDF file
  const absolutePdfUrl = pdfFile.startsWith('http') 
    ? pdfFile 
    : `${window.location.origin}${pdfFile}`;

  // Function to run after successful PDF load
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Function to handle document error
  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
    setError(true);
    // Switch to fallback on error
    setUseFallback(true);
  }

  // Go to previous page
  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }

  // Go to next page
  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }

  // Switch to fallback iframe view
  function switchToFallback() {
    setUseFallback(true);
  }

  // Calculate container ref for responsive sizing
  const containerRef = React.useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    // Initial width calculation
    updateWidth();

    // Update width on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Iframe Fallback View - Use object instead of iframe to prevent recursive loading
  if (useFallback) {
    return (
      <div className="pdf-viewer" ref={containerRef}>
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            Using simplified PDF viewer. For best experience, make sure you have a PDF viewer installed.
          </div>
        </div>
        <div className="object-container" style={{ width: '100%', height: '600px' }}>
          <object 
            data={absolutePdfUrl} 
            type="application/pdf"
            width="100%" 
            height="100%" 
            style={{ border: 'none', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <p>
              Your browser does not support embedded PDFs.
              <a 
                href={absolutePdfUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 ml-1"
              >
                Click here to download the PDF file.
              </a>
            </p>
          </object>
        </div>
        <div className="mt-4 text-center">
          <a 
            href={absolutePdfUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open PDF in New Tab
          </a>
        </div>
      </div>
    );
  }

  // Standard view with React-PDF
  if (error) {
    return <PDFErrorFallback pdfFile={absolutePdfUrl} />;
  }

  return (
    <div className="pdf-viewer" ref={containerRef}>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      <div className="pdf-container">
        <Document
          file={absolutePdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          }
          className="flex flex-col items-center"
          error={<PDFErrorFallback pdfFile={absolutePdfUrl} />}
          noData={<PDFErrorFallback pdfFile={absolutePdfUrl} />}
        >
          <Page 
            pageNumber={pageNumber} 
            width={width ? Math.min(width, 800) : 600}
            className="shadow-md"
            renderTextLayer={false} // Turn off text layer to improve performance
            renderAnnotationLayer={false} // Turn off annotations to improve performance
            error={<PDFErrorFallback pdfFile={absolutePdfUrl} />}
          />
        </Document>
      </div>

      {!loading && !error && (
        <div className="flex flex-col items-center mt-4">
          <div className="text-sm text-gray-600 mb-2">
            Page {pageNumber} of {numPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-purple-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 bg-purple-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <a 
              href={absolutePdfUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open PDF
            </a>
            <button
              onClick={switchToFallback}
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v4m0 4h.01M8.438 4.952l-.707.707M15.569 4.952l.707.707M9 12a3 3 0 11 6 0 3 3 0 01-6 0z" />
              </svg>
              Switch to Simple Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer; 
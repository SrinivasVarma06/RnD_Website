import React from 'react';
import './funding_statistics.css'

import pdf2 from '../assets/i10.jpg';
import pdf3 from '../assets/i11.jpg';

export default function Office_statistics() {
  const pdfs = [pdf2,pdf3];

  return (
    <div className='statistics'>
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Office Statistics</h1>
       {pdfs.map((pdf, index) => (
        <section key={index} style={{ marginBottom: '2rem' }}>
          <img src={pdf} alt="" className='images' />
        </section>
      ))}
        
      
    </div>
  );
}




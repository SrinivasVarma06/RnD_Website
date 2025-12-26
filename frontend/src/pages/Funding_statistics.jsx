import React from 'react';
import './funding_statistics.css'
import pdf1 from '../assets/i1.png';
import pdf2 from '../assets/i2.png';
import pdf3 from '../assets/i3.png';

export default function Funding_statistics() {
  const pdfs = [pdf1, pdf2, pdf3];

  return (
    <div id='funding-top' className='statistics'>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Statistics</h1>
      {pdfs.map((pdf, index) => (
        <section key={index} style={{ marginBottom: '2rem' }}>
          <img src={pdf} alt="" className='images' />
        </section>
      ))}
    </div>

  );
}




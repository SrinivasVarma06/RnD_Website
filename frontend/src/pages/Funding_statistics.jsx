import React from 'react';
import './funding_statistics.css'
import pdf1 from '../assets/i1.png';
import pdf2 from '../assets/i2.png';
import pdf3 from '../assets/i3.png';
import { Link } from 'react-scroll';

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
      {/* Back to Top Button */}
      <div className="cursor-pointer text-center mt-10">
        <Link
          to="funding-top"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 cursor-pointer z-50"
        >
          ↑
        </Link>
      </div>
    </div>

  );
}




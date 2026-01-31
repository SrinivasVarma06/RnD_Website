import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  // Projects - actual routes in the website
  const projectsLinks = [
    { name: 'Sponsored Projects', href: '/Projects/Sponsored' },
    { name: 'Consultancy Projects', href: '/Projects/Consultancy' },
    { name: 'CSR Projects', href: '/Projects/Csr' },
    { name: 'SGNF', href: '/Projects/sgnf' },
    { name: 'Fellowships', href: '/Projects/Fellowships' },
    { name: 'Workshops', href: '/Projects/Workshops' },
  ];

  // Research & Publications
  const researchLinks = [
    { name: 'Research Areas', href: '/research-areas' },
    { name: 'Publications', href: '/publications' },
    { name: 'Patents', href: '/patents' },
    { name: 'Labs', href: '/Labs/cse' },
    { name: 'IRINS', href: 'https://iitdh.irins.org/' },
  ];

  // People - links to the R&D people page sections
  const peopleLinks = [
    { name: 'Dean', href: '/people#Dean' },
    { name: 'Associate Dean', href: '/people#AssociateDean' },
    { name: 'Faculty In-Charge', href: '/people#Faculty-In-Charge' },
    { name: 'Staff', href: '/people#Staff' },
    { name: 'Former Deans', href: '/people#Former-Deans' },
  ];

  // Quick Access - split into 2 columns
  const quickAccessCol1 = [
    { name: 'Documents', href: '/documents' },
    { name: 'Forms', href: '/forms' },
    { name: 'Call for Proposals', href: '/opportunities' },
    { name: 'Funding Statistics', href: '/FundingStatistics' },
    { name: 'Feedback', href: '/feedback' },
  ];

  const quickAccessCol2 = [
    { name: 'Ethics Committee', href: '/Committees/ethicscommittee' },
    { name: 'Biosafety Committee', href: '/Committees/biosafety' },
    { name: 'IPR Committee', href: '/Committees/ipr' },
    { name: 'CSR Donations', href: 'https://iitdh.ac.in/csr-contribution' },
    { name: 'IIT Dharwad', href: 'https://www.iitdh.ac.in' },
  ];

  const isExternal = (href) => href.startsWith('http');

  const linkStyle = {
    color: '#ffffff',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
  };

  const headingStyle = {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '14px',
    whiteSpace: 'nowrap',
  };

  return (
    <footer style={{ 
      backgroundColor: '#89288f', 
      marginTop: '40px', 
      padding: '32px 24px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'nowrap', 
          gap: '24px',
          justifyContent: 'space-between',
          overflowX: 'auto'
        }}>
          
          {/* Institute Info */}
          <div style={{ flex: '0 0 auto', minWidth: '220px' }}>
            <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px', marginBottom: '14px', whiteSpace: 'nowrap' }}>
              INDIAN INSTITUTE OF<br />TECHNOLOGY DHARWAD
            </h3>
            <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>PERMANENT CAMPUS</p>
            <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>CHIKKAMALLIGAWAD</p>
            <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>DHARWAD - 580 011</p>
            <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>KARNATAKA</p>
            <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '14px' }}>BHARATA (INDIA)</p>
            
            <div>
              <a 
                href="mailto:pro@iitdh.ac.in" 
                style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
              >
                <Mail size={14} color="#ffffff" />
                pro@iitdh.ac.in
              </a>
              <a 
                href="https://www.iitdh.ac.in/contact"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
              >
                <Phone size={14} color="#ffffff" />
                Contact Us
              </a>
            </div>
          </div>

          {/* Projects Column */}
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={headingStyle}>PROJECTS</h4>
            {projectsLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                target={isExternal(link.href) ? '_blank' : undefined} 
                rel={isExternal(link.href) ? 'noopener noreferrer' : undefined} 
                style={linkStyle}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Research Column */}
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={headingStyle}>RESEARCH</h4>
            {researchLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                target={isExternal(link.href) ? '_blank' : undefined} 
                rel={isExternal(link.href) ? 'noopener noreferrer' : undefined} 
                style={linkStyle}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* People Column */}
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={headingStyle}>PEOPLE</h4>
            {peopleLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                style={linkStyle}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Quick Access - 2 columns */}
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={headingStyle}>QUICK ACCESS</h4>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                {quickAccessCol1.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    target={isExternal(link.href) ? '_blank' : undefined} 
                    rel={isExternal(link.href) ? 'noopener noreferrer' : undefined} 
                    style={linkStyle}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div>
                {quickAccessCol2.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    target={isExternal(link.href) ? '_blank' : undefined} 
                    rel={isExternal(link.href) ? 'noopener noreferrer' : undefined} 
                    style={linkStyle}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

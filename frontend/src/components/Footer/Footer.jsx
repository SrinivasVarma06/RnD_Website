import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Globe, User, Building2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // R&D Office Staff Information
  const staffContacts = [
    {
      name: 'Prof. XYZ',
      designation: 'Dean (R&D)',
      email: 'deanrnd@iitdh.ac.in',
      phone: '+91-836-2212900',
      location: 'Admin Block, Room 101'
    },
    {
      name: 'Dr. ABC',
      designation: 'Associate Dean (R&D)',
      email: 'adeanrnd@iitdh.ac.in',
      phone: '+91-836-2212901',
      location: 'Admin Block, Room 102'
    },
    {
      name: 'Mr. Staff Name',
      designation: 'Technical Officer',
      email: 'rnd.officer@iitdh.ac.in',
      phone: '+91-836-2212902',
      location: 'R&D Section, Room 103'
    },
    {
      name: 'Ms. Staff Name',
      designation: 'Administrative Assistant',
      email: 'rnd.admin@iitdh.ac.in',
      phone: '+91-836-2212903',
      location: 'R&D Section, Room 104'
    }
  ];

  const researchLinks = [
    { name: 'Sponsored Projects', href: '/sponsored' },
    { name: 'Consultancy Projects', href: '/consultancy' },
    { name: 'CSR Projects', href: '/csrprojects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Patents', href: '/patents' },
    { name: 'Call for Proposals', href: '/opportunities' },
  ];

  const peopleLinks = [
    { name: 'Dean (R&D)', href: '/people#Dean' },
    { name: 'Associate Dean', href: '/people#AssociateDean' },
    { name: 'Faculty In-Charge', href: '/people#Faculty-In-Charge' },
    { name: 'Staff', href: '/people#Staff' },
  ];

  const quickAccessLinks = [
    { name: 'Forms', href: '/forms' },
    { name: 'Documents', href: '/documents' },
    { name: 'Funding Statistics', href: '/funding-statistics' },
    { name: 'Feedback', href: '/feedback' },
    { name: 'IIT Dharwad Main Site', href: 'https://www.iitdh.ac.in', external: true },
    { name: 'Intranet', href: 'https://intranet.iitdh.ac.in', external: true },
  ];

  return (
    <footer className="bg-purple-900 text-gray-200 mt-10" style={{ color: '#ffffff' }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Institute Info - 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-start gap-3 mb-4">
              <img 
                src="https://www.iitdh.ac.in/sites/default/files/logo_1.png" 
                alt="IIT Dharwad Logo" 
                className="h-16 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h3 style={{ color: '#ffffff' }} className="text-white text-xl font-bold mb-2">INDIAN INSTITUTE OF TECHNOLOGY DHARWAD</h3>
            <p style={{ color: '#ffffff' }} className="text-white text-base font-semibold mb-4">Research & Development Section</p>
            
            <div className="flex items-start gap-2 text-base text-white">
              <MapPin size={18} className="mt-0.5 flex-shrink-0 text-white" />
              <div className="text-white">
                <p className="text-white">Permanent Campus</p>
                <p className="text-white">Chikkamalligawad</p>
                <p className="text-white">Dharwad - 580 011</p>
                <p className="text-white">Karnataka, INDIA</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <a href="mailto:pro@iitdh.ac.in" className="flex items-center gap-2 text-base text-white hover:text-white transition-colors">
                <Mail size={16} className="text-white" />
                pro@iitdh.ac.in
              </a>
              <a href="tel:+918362212900" className="flex items-center gap-2 text-base text-white hover:text-white transition-colors">
                <Phone size={16} className="text-white" />
                +91-836-2212900
              </a>
            </div>
          </div>

          {/* Research Links - 2 cols */}
          <div className="lg:col-span-2">
            <h4 style={{ color: '#ffffff' }} className="text-white font-extrabold mb-2 text-xl uppercase tracking-wide border-b-2 border-purple-400 pb-1">Research</h4>
            <ul className="space-y-1">
              {researchLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white hover:text-white text-base transition-colors flex items-center gap-1">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* People Links - 2 cols */}
          <div className="lg:col-span-2">
            <h4 style={{ color: '#ffffff' }} className="text-white font-extrabold mb-2 text-xl uppercase tracking-wide border-b-2 border-purple-400 pb-1">People</h4>
            <ul className="space-y-1">
              {peopleLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white hover:text-white text-base transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 style={{ color: '#ffffff' }} className="text-white font-extrabold mt-3 mb-2 text-xl uppercase tracking-wide border-b-2 border-purple-400 pb-1">Quick Access</h4>
            <ul className="space-y-1">
              {quickAccessLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-white hover:text-white text-base transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    {link.external && <ExternalLink size={14} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Staff Contact Information - 5 cols */}
          <div className="lg:col-span-5">
            <h4 style={{ color: '#ffffff' }} className="text-white font-extrabold mb-2 text-xl uppercase tracking-wide border-b-2 border-purple-400 pb-1 flex items-center gap-2">
              <User size={20} />
              R&D Office Staff Contact
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {staffContacts.map((staff, index) => (
                <div key={index} className="bg-purple-800/50 rounded-lg p-2 hover:bg-purple-800 transition-colors">
                  <h5 className="text-white font-semibold text-sm">{staff.name}</h5>
                  <p className="text-white text-xs mb-1">{staff.designation}</p>
                  
                  <div className="space-y-0.5">
                    <a href={`mailto:${staff.email}`} className="flex items-center gap-2 text-sm text-white hover:text-white transition-colors">
                      <Mail size={14} className="text-white" />
                      {staff.email}
                    </a>
                    {staff.phone && (
                      <a href={`tel:${staff.phone}`} className="flex items-center gap-2 text-sm text-white hover:text-white transition-colors">
                        <Phone size={14} className="text-white" />
                        {staff.phone}
                      </a>
                    )}
                    {staff.location && (
                      <div className="flex items-center gap-2 text-sm text-white">
                        <Building2 size={14} className="text-white" />
                        {staff.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* General Contact */}
            <div className="mt-2 p-2 bg-purple-800/30 rounded-lg border border-purple-700">
              <h5 style={{ color: '#ffffff' }} className="text-white font-semibold text-sm mb-1">General R&D Enquiries</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                <a href="mailto:deanrnd@iitdh.ac.in" className="flex items-center gap-2 text-white hover:text-white transition-colors">
                  <Mail size={14} className="text-white" />
                  deanrnd@iitdh.ac.in
                </a>
                <a href="tel:+918362212900" className="flex items-center gap-2 text-white hover:text-white transition-colors">
                  <Phone size={14} className="text-white" />
                  +91-836-2212900
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-purple-950 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white text-xs text-center md:text-left">
              © {currentYear} Indian Institute of Technology Dharwad. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="https://www.iitdh.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                <Globe size={12} />
                IIT Dharwad Main Website
              </a>
              <a 
                href="/feedback" 
                className="text-white hover:text-white text-sm transition-colors"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

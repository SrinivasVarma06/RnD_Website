import React from 'react';
import { Link } from 'react-scroll';
import { Mail, Globe } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import Deans from './Deans.jsx';
const API_URL = "https://rnd.iitdh.ac.in/strapi/api/people?populate=*&sort=createdAt:desc";

// Navigation Card Component
const NavCard = ({ title, icon, targetId }) => {
  return (
    <Link
      to={targetId}
      spy={true}
      smooth={true}
      offset={-100}
      duration={500}
      className="cursor-pointer"
    >
      <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow duration-300 hover:bg-purple-50 h-full flex flex-col items-center justify-center">
        <div className="text-purple-600 mb-3 text-3xl">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">View Members</p>
      </div>
    </Link>
  );
};

// Section Component
const Section = ({ id, title, children }) => {
  return (
    <div id={id} className="py-10 scroll-mt-[100px]">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">{title}</h2>
      {children}
    </div>
  );
};

const SubSection = ({ title, children }) => {
  return (
    <div className="py-6">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 pb-1 border-b border-gray-200">{title}</h3>
      {children}
    </div>
  );
};

// Faculty Card Component

const FacultyCard = ({ name, title, imageUrl, expertise, email, website }) => {
  // console.log(JSON.stringify(title))
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full
                    hover:shadow-lg cursor-pointer transition-shadow duration-300 ease-in-out">
      {/* Image Section */}
      <div className="w-48 h-48 mx-auto mt-4 mb-2 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentNode.classList.add("flex", "items-center", "justify-center");
            }}
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 
              .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 
              0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Text Section */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-purple-600 font-medium">
          {title.split('//').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {expertise && (
          <div className="mt-2">
            <p className="text-sm text-gray-700 font-medium">Research Areas</p>
            <div className="text-sm text-gray-600 whitespace-pre-line">
              {expertise}
            </div>
          </div>
        )}


      </div>

      {/* Contact Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-1">
        {email && (
          <div className="flex items-center text-sm text-gray-700">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <a href={`mailto:${email}`} className="text-purple-600 hover:underline truncate">
              {email}
            </a>
          </div>
        )}

        {website && (
          <div className="flex items-center text-sm text-gray-700">
            <Globe className="w-4 h-4 mr-2 text-gray-500" />
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline truncate">
              Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};




// Staff Card Component
const StaffCard = ({ name, title, imageUrl, email }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full
                    hover:shadow-lg cursor-pointer transition-shadow duration-300 ease-in-out">
      <div className="p-4 flex items-start border-b border-gray-100">
        <div className="flex-shrink-0 mr-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite fallback loop
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : null}
            <div className={`text-4xl text-purple-200 ${imageUrl ? 'hidden' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-purple-600 truncate">{title}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 text-sm flex-grow">
        {email && (
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <a href={`mailto:${email}`} className="text-purple-600 hover:underline truncate">{email}</a>
          </div>
        )}
      </div>
    </div>
  );
};


const OutStaffCard = ({ name }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full
                    hover:shadow-lg cursor-pointer transition-shadow duration-300 ease-in-out">
      <div className="p-4 flex items-start border-b border-gray-100">
        <div className="min-w-0">
          <h4 className="text-lg text-gray-800 truncate">{name}</h4>
        </div>
      </div>
    </div>
  );
};




// People Page Component
const People = () => {

  const [allPeople, setAllPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorized lists (computed from allPeople)
  const Dean = allPeople.filter((p) => p.type === "dean");
  const AssociateDean = allPeople.filter((p) => p.type === "associateDean").sort((a,b) => a.name.localeCompare(b.name));
  const facultyMembers = allPeople.filter(
    (p) =>
      p.type === "faculty" ||
      (p.type === "facultyInCharge" || p.type === "faculty-in-charge") // support variants
  ).sort((a,b) => a.name.localeCompare(b.name));
  const staffMembers = allPeople.filter((p) => p.type === "staff");
  const outSourcedStaff = staffMembers.filter((p) => p.title.toLowerCase().includes("outsourced")).sort((a,b) => a.name.localeCompare(b.name));

  const staffMembersFiltered = staffMembers.filter((p) => !p.title.toLowerCase().includes("outsourced"));

  // Update staffMembers to exclude outsourced
  // console.log(staffMembersFiltered);

  //console.log(outSourcedStaff);

  // console.log("dean" + Dean);
  // console.log("staff" + staffMembers)

  useEffect(() => {
    // Try cache first
    const cached = localStorage.getItem("people_cache_v1");
    if (cached) {
      setAllPeople(JSON.parse(cached));
      setLoading(false);
    }

    // Always update in background
    axios
      .get(API_URL)
      .then((res) => {
        // Strapi v4 response: res.data.data is array of { id, attributes: { ...fields } }
        const fetched = res.data.data;
        setAllPeople(fetched);
        localStorage.setItem("people_cache_v1", JSON.stringify(fetched));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        if (!cached) setAllPeople([]); // No data at all
      });
  }, []);

  // Optional: show loading state
  if (loading && allPeople.length === 0)
    return (
      <PageSkeleton />
    );

  // Error box if fetch failed and no data
  if (error && allPeople.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-red-50 border border-red-200 rounded-lg shadow p-6 my-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load people data</h2>
        <p className="text-red-600 mb-2">
          There was a problem fetching the people data from the server.
        </p>
        <p className="text-sm text-red-500 mb-4">
          Please check your internet connection or try again later.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div id="people-top" className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3">People</h1>
        <p className="text-gray-600 text-base md:text-lg">
          Meet the Dean, Associate Dean, faculty Incharge and staff of the Research and Development Section.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <NavCard
          title="Dean"
          icon={<i className="fas fa-user-tie"></i>}
          targetId="Dean"
        />
        <NavCard
          title="Associate Dean"
          icon={<i className="fas fa-chalkboard-teacher"></i>}
          targetId="AssociateDean"
        />
        <NavCard
          title="Faculty In-Charge"
          icon={<i className="fas fa-users"></i>}
          targetId="Faculty-In-Charge"
        />
        <NavCard
          title="Staff"
          icon={<i className="fas fa-user-graduate"></i>}
          targetId="Staff"
        />
        <NavCard
          title="Former Deans"
          icon={<i className="fas fa-archive"></i>}
          targetId="Former-Deans"
        />
      </div>

      {/* Dean Section */}
      <Section id="Dean" title="Dean">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Dean.map((member) => (
            <FacultyCard key={member.id} {...member} />
          ))}
        </div>
      </Section>

      {/* AssociateDean Section */}
      <Section id="AssociateDean" title="Associate Dean">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AssociateDean.map((member) => (
            <FacultyCard key={member.id} {...member} />
          ))}
        </div>
      </Section>

      {/* Faculty In-Charge Section */}
      <Section id="Faculty-In-Charge" title="Faculty In-Charge">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facultyMembers.map((member) => (
            <FacultyCard key={member.id} {...member} />
          ))}
        </div>
      </Section>

      {/* Staff Section */}
      <Section id="Staff" title="Staff">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembersFiltered.map((member) => (
            <StaffCard key={member.id} {...member} />  
          ))}
          <SubSection title="Outsourced Staff">
            <div className='grid gap-6'>
              {outSourcedStaff.map((member) => (
                <OutStaffCard key={member.id} name={member.name} />
              ))}
            </div>
          </SubSection>
        </div>
      </Section>

      {/* Former Deans Section */}
      <Section id="Former-Deans" title="Former Deans">
        <Deans />
      </Section>

      {/* Back to Top Button */}
      <div className="cursor-pointer text-center mt-10">
        <Link
          to="people-top"
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
};

export default People;




// App.jsx 
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import PageSkeleton from './components/LoadingSkeleton/PageSkeleton';
import "./pages/labs/nodata.css";
import LabSubNavbar from './components/labnav';
import AdminGate from "./admin/adminGate";

// Lazy load ALL pages for better code splitting
const Home = lazy(() => import('./pages/Home'));
const Forms = lazy(() => import('./pages/Forms'));
const Statsofprojects = lazy(() => import('./pages/statsofprojects'));
const ResearchAreas = lazy(() => import('./pages/ResearchAreas'));
const Statsofpublications = lazy(() => import('./pages/statsofpublications'));
const Message = lazy(() => import('./pages/Message'));
const Fellowship = lazy(() => import('./pages/Fellowship'));
const Workshops = lazy(() => import('./pages/Workshops'));
const Biosafety = lazy(() => import('./pages/biosafety'));
const People = lazy(() => import('./pages/People'));
const Sponsored = lazy(() => import('./pages/Sponsored'));
const Consultancy = lazy(() => import('./pages/Consultancy'));
const CSRP = lazy(() => import('./pages/CSRProjects'));
const Funding = lazy(() => import('./pages/Funding_statistics'));
const Office = lazy(() => import('./pages/Office_statistics'));
const Documents = lazy(() => import('./pages/Documents'));
const Searchresults = lazy(() => import('./pages/searchresults'));
const Ipr = lazy(() => import('./pages/iprcommittee'));
const Ethics = lazy(() => import('./pages/ethicscommitte'));
const Publications = lazy(() => import('./pages/Publications'));
const Csr = lazy(() => import('./pages/Csr'));
const Deans = lazy(() => import('./pages/Deans'));
const Sgnf = lazy(() => import('./pages/sgnf'));
const Patents = lazy(() => import('./pages/Patents'));
const Cse = lazy(() => import('./pages/labs/cse'));
const Human = lazy(() => import('./pages/labs/humanities'));
const Bio = lazy(() => import('./pages/labs/biosciences'));
const Maths = lazy(() => import('./pages/labs/mathematics'));
const Phy = lazy(() => import('./pages/labs/physics'));
const Che = lazy(() => import('./pages/labs/chemistry'));
const Mech = lazy(() => import('./pages/labs/mechanical'));
const Cheeng = lazy(() => import('./pages/labs/chemicaleng'));
const Civil = lazy(() => import('./pages/labs/civil'));
const Eece = lazy(() => import('./pages/labs/ece'));
const Feedback = lazy(() => import('./pages/feedback'));
const Opportunities = lazy(() => import('./pages/Opportunities'));

// ScrollToTop logic inside App.jsx
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const isLabsPage = location.pathname.startsWith('/Labs');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Topbar 
        toggleMobileMenu={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div 
        className={`sm:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-grow relative" style={{ paddingTop: '70px' }}>
        <div 
          className={`fixed top-[70px] left-0 bottom-0 w-[280px] sm:w-[220px] lg:w-[250px] z-40 
            bg-white shadow-md transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
        >
          <Navbar closeMenu={() => setIsMobileMenuOpen(false)} />
        </div>

        <div className="w-full sm:pl-[220px] lg:pl-[250px] flex flex-col min-h-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs />
          
          <div key={location.pathname} className="max-w-full overflow-x-hidden flex-grow">
            {/* Scroll restoration on route change */}
            <ScrollToTop />
            {isLabsPage && <LabSubNavbar />}
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/people" element={<People />} />
                <Route path="/research-areas" element={<ResearchAreas />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/patents" element={<Patents />} />
                <Route path="/deans" element={<Deans />} />
                <Route path="/search" element={<Searchresults />} />
                <Route path="/feedback" element={<Feedback />} />
                {/* Documents route aliases for both /documents and /Documents */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/Documents" element={<Documents />} />
                {/* Statistics Pages */}
                <Route path="/FundingStatistics" element={<Funding />} />
                <Route path="/statistics/Office" element={<Office />} />
                <Route path="/statistics/projects" element={<Statsofprojects />} />
                <Route path="/statistics/publications" element={<Statsofpublications />} />
                {/* Projects */}
                <Route path="/Projects/Sponsored" element={<Sponsored />} />
                <Route path="/Projects/Consultancy" element={<Consultancy />} />
                <Route path="/Projects/Csr" element={<CSRP />} />
                <Route path="/Projects/Fellowships" element={<Fellowship />} />
                <Route path="/Projects/Workshops" element={<Workshops />} />
                <Route path="/Projects/sgnf" element={<Sgnf />} />
                <Route path="/Committees/ethicscommittee" element={<Ethics />} />
                <Route path="/Committees/biosafety" element={<Biosafety />} />
                <Route path="/Committees/ipr" element={<Ipr />} />
                <Route path="/admin" element={<AdminGate />} />
                <Route path="/Labs/cse" element={<Cse />} />
                <Route path="/Labs/civil" element={<Civil />} />
                <Route path="/Labs/eece" element={<Eece />} />
                <Route path="/Labs/biosciences" element={<Bio />} />
                <Route path="/Labs/humanities" element={<Human />} />
                <Route path="/Labs/mechanical" element={<Mech />} />
                <Route path="/Labs/chemistry" element={<Che />} />
                <Route path="/Labs/chemicaleng" element={<Cheeng />} />
                <Route path="/Labs/physics" element={<Phy />} />
                <Route path="/Labs/mathematics" element={<Maths />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <BackToTop />
        </div>
      </div>
    </div>
  );
}

export default App;

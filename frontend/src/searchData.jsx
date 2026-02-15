const searchData = [
  {
    page: 'Home',
    title: 'Welcome to R&D Section',
    content: 'Welcome to the Research and Development (rnd) Section of IIT Dharwad.',
    displaycontent: 'Welcome to the Research and Development Section of IIT Dharwad.',
    link: '/'
  },
  {
    page: 'Home',
    title: 'Latest Proposals',
    content: 'Explore the latest research proposals and projects.',
    displaycontent: 'Latest research proposals',
    link: '/'
  },
  {
    page: 'Home',
    title: 'Latest Proposals',
    content: 'Stay updated with the latest news and announcements.',
    displaycontent: 'Latest news and announcements',
    link: '/'
  },

  {
    page: 'People',
    title: 'Faculty & People',
    content: 'Meet the people of R&D Section - Dean, Associate Dean, faculty Incharge and staff with their research areas and expertise.',
    displaycontent: 'Faculty and staff profiles',
    link: '/people'
  },
  {
    page: 'People',
    title: 'Staff',
    content: 'Department staff, administrative team and people working in R&D section.',
    displaycontent: 'Administrative staff',
    link: '/people'
  },
  {
    page: 'People',
    title: 'Dean',
    content: 'Research and development section dean and associate dean, key people in leadership.',
    displaycontent: 'Dean and Associate Dean',
    link: '/people'
  },
  {
    page: 'Deans',
    title: 'Former Deans',
    content: 'Former Deans and Associate Deans of Research and Development Section, past leadership.',
    displaycontent: 'Former R&D leadership',
    link: '/deans'
  },

  {
    page: 'Sponsored Projects',
    title: 'Sponsored Projects',
    content: 'Sponsored research projects funded by government agencies like DST, SERB, DRDO, DBT, CSIR and other funding bodies.',
    displaycontent: 'Government funded research projects',
    link: '/Projects/Sponsored'
  },
  {
    page: 'Consultancy Projects',
    title: 'Consultancy Projects',
    content: 'Industry consultancy projects, industrial collaboration, corporate partnerships and consulting services.',
    displaycontent: 'Industry consultancy and collaboration',
    link: '/Projects/Consultancy'
  },
  {
    page: 'CSR Projects',
    title: 'CSR Projects',
    content: 'Corporate Social Responsibility projects, CSR funding, CSR initiatives and activities.',
    displaycontent: 'CSR funded projects',
    link: '/Projects/Csr'
  },
  {
    page: 'SGNF',
    title: 'SGNF',
    content: 'Startup and innovation projects, SGNF grants, seed funding for startups.',
    displaycontent: 'Startup and innovation funding',
    link: '/Projects/sgnf'
  },
  {
    page: 'Fellowships',
    title: 'Fellowships',
    content: 'Research fellowships, PhD fellowships, postdoctoral fellowships, JRF, SRF, RA positions.',
    displaycontent: 'Research fellowship opportunities',
    link: '/Projects/Fellowships'
  },
  {
    page: 'Workshops',
    title: 'Workshops',
    content: 'Research workshops, conferences, seminars, training programs and academic events.',
    displaycontent: 'Workshops and conferences',
    link: '/Projects/Workshops'
  },

  {
    page: 'Documents',
    title: 'Office Memorandums',
    content: 'Official office memorandums and circulars, OM documents.',
    displaycontent: 'Office memorandums',
    link: '/documents'
  },
  {
    page: 'Documents',
    title: 'Manpower',
    content: 'OM for Engagement of Manpower, JRF/SRF/RA Positions, Other than JRF/SRF/RA Positions, ANRF Sponsored Projects',
    displaycontent: 'Manpower engagement OMs',
    link: '/documents'
  },
  {
    page: 'Documents',
    title: 'Circulars and Office Orders',
    content: 'Circulars and Office Orders, Special provisions in amended GFRs 2017, Enhancement in ceilings for procurement, Committee for allocation of Research Labs, Relaxation from obtaining prior approval for procurement of consumable, expenditures on contingency of sponsored projects, PPT for Generation of GeM Non availability report, General Financial Rules 2017, TA/DA rates for students and project staffs, Revision of Intellectual Property Rights (IPR) Policy guidelines, Circulation of R&D Procurement Referencer, Streamlining of Manpower Recruitment Process for Sponsored Research and Consultancy Projects, Provision for Temporary Loan for Payment of Project Staff Salaries, Implementation of Distribution of charges collected from testing services by SCIF/DCIF, Formation of Department level Standing committees (DLSC) for Authorization of Proprietary Article Certificate (PAC), Implementation of revised Overhead charges for consultancy projects',
    displaycontent: 'Circulars and office orders',
    link: '/documents'
  },
  {
    page: 'Documents',
    title: 'Administrative Documents',
    content: 'Forms, guidelines, and administrative notices.',
    displaycontent: 'Administrative documents',
    link: '/documents'
  },

  {
    page: 'Funding Statistics',
    title: 'Research Funding',
    content: 'Information about research grants and funding opportunities, funding Agency, statistics, graphs, charts.',
    displaycontent: 'Research funding info',
    link: '/FundingStatistics'
  },
  {
    page: 'Funding Statistics',
    title: 'Funding Agencies',
    content: 'Bhabha Atomic Research Centre (BARC), Bill & Melinda Gates Foundation, Board of Research & Nuclear Sciences (BRNS), Central Pollution Control Board (CPCB), Indo French Centre for Advanced Research (IFCPAR), Council of Science & Technology (CST), Council of Scientific & Industrial Research (CSIR), Defence Research & Development Organisation (DRDO), Department of Atomic Energy (DAE), Department of Biotechnology (DBT), Indira Gandhi Center for Advanced Research (IGCAR), Department of Science & Technology (DST), EURAXESS India, Gas Authority of India Ltd (GAIL), Hindustan Shipyard Ltd., Science and Engineering Research Board (SERB), Indian Institute of Technology Bombay, Indian Institute of Tropical Meteorology (IITM)',
    displaycontent: 'List of funding agencies',
    link: '/FundingStatistics'
  },

  {
    page: 'Forms',
    title: 'R&D Forms',
    content: 'Download forms, Word Format, PDF, Request for the Extension of Duration of Project Staff, Disbursal Form for Consultancy Project/Course, Asset Retention / Return Form, Form to be submitted for Projects involving extended Foreign Travel, Project Proposal Submission Form, Reimbursement Form, Advance Form, Settlement Form, TA Form, Indent form A - For direct purchases of value up to ₹ 50,000, Indent form B - For purchases between ₹ 50,001 to ₹ 10 Lakhs, Indent form C - For purchases above ₹ 10 lakhs, Verification Report Form, Project Completion Report, Bank Mandate Form with PFMS details, IIT Dharwad PAN, IIT Dharwad GST registration, Consumable Stock Form',
    displaycontent: 'Project and admin forms',
    link: '/forms'
  },

  {
    page: 'Publications',
    title: 'Publications',
    content: 'Research publications, journal papers, conference papers, articles, academic papers published by faculty.',
    displaycontent: 'Research publications',
    link: '/publications'
  },
  {
    page: 'Patents',
    title: 'Patents',
    content: 'Patents filed, patents granted, intellectual property, innovations, inventions by IIT Dharwad faculty and researchers.',
    displaycontent: 'Patents and innovations',
    link: '/patents'
  },

  {
    page: 'Call for Proposals',
    title: 'Call for Proposals',
    content: 'Open calls, funding opportunities, project vacancies, research opportunities, apply for grants.',
    displaycontent: 'Open funding opportunities',
    link: '/opportunities'
  },

  {
    page: 'Ethics Committee',
    title: 'Institutional Ethics Committee',
    content: 'Institutional Ethics Committee (IEC) Information about the department committee and its members. The Institutional Ethics Committee (IEC) is responsible for ensuring that all research involving human participants is conducted ethically and in compliance with relevant regulations. This includes reviewing research proposals, monitoring ongoing studies, and ensuring the rights and welfare of participants are protected.',
    displaycontent: 'Institutional Ethics Committee (IEC) info',
    link: '/Committees/ethicscommittee'
  },
  {
    page: 'IPR Committee',
    title: 'Intellectual Property Rights Committee',
    content: 'Intellectual Property (IP) policy of IIT Dharwad, safeguarding and managing innovations, research outcomes, and intellectual assets generated by faculty, students, and staff. IPR guidelines, patent filing process.',
    displaycontent: 'Intellectual Property Rights (IPR) info',
    link: '/Committees/ipr'
  },
  {
    page: 'Biosafety Committee',
    title: 'Biosafety Committee',
    content: 'Biosafety Committee information about the department committee and its members, biosafety guidelines, biological research safety.',
    displaycontent: 'Biosafety Committee info',
    link: '/Committees/biosafety'
  },

  {
    page: 'Research Areas',
    title: 'Research Areas',
    content: 'Information about the various research areas within the department. Department. Name, Areas of Interest, research projects, and collaborations, faculty research interests.',
    displaycontent: 'Academics and Research Areas',
    link: '/research-areas'
  },

  {
    page: 'Labs',
    title: 'CSE Labs',
    content: 'Computer Science and Engineering labs, CSE department labs, software labs, hardware labs, research facilities.',
    displaycontent: 'Computer Science Labs',
    link: '/Labs/cse'
  },
  {
    page: 'Labs',
    title: 'Biosciences Labs',
    content: 'Biosciences labs, biology labs, life sciences research facilities.',
    displaycontent: 'Biosciences Labs',
    link: '/Labs/biosciences'
  },
  {
    page: 'Labs',
    title: 'Humanities Labs',
    content: 'Humanities labs, social sciences research facilities.',
    displaycontent: 'Humanities Labs',
    link: '/Labs/humanities'
  },
  {
    page: 'Labs',
    title: 'MMAE Labs',
    content: 'MMAE labs, Mechanical, Materials and Aerospace Engineering labs, manufacturing labs.',
    displaycontent: 'Mechanical Engineering Labs',
    link: '/Labs/mechanical'
  },
  {
    page: 'Labs',
    title: 'Chemistry Labs',
    content: 'Chemistry labs, chemical research facilities, organic chemistry, inorganic chemistry.',
    displaycontent: 'Chemistry Labs',
    link: '/Labs/chemistry'
  },
  {
    page: 'Labs',
    title: 'Chemical Engineering Labs',
    content: 'Chemical Engineering labs, process engineering labs.',
    displaycontent: 'Chemical Engineering Labs',
    link: '/Labs/chemicaleng'
  },
  {
    page: 'Labs',
    title: 'Physics Labs',
    content: 'Physics labs, physics research facilities, experimental physics.',
    displaycontent: 'Physics Labs',
    link: '/Labs/physics'
  },
  {
    page: 'Labs',
    title: 'EECE Labs',
    content: 'EECE labs, Electrical and Electronics Communication Engineering labs, electronics labs.',
    displaycontent: 'EECE Labs',
    link: '/Labs/eece'
  },
  {
    page: 'Labs',
    title: 'Civil Labs',
    content: 'Civil engineering labs, structural engineering labs, construction labs.',
    displaycontent: 'Civil Engineering Labs',
    link: '/Labs/civil'
  },
  {
    page: 'Labs',
    title: 'Mathematics Labs',
    content: 'Mathematics labs, computational mathematics, applied mathematics.',
    displaycontent: 'Mathematics Labs',
    link: '/Labs/mathematics'
  },

  {
    page: 'Feedback',
    title: 'Feedback',
    content: 'Submit feedback, suggestions, complaints, contact R&D section.',
    displaycontent: 'Submit feedback',
    link: '/feedback'
  },

  {
    page: 'CSR Donations',
    title: 'CSR Donations',
    content: 'Corporate Social Responsibility donations, CSR contribution, donate to IIT Dharwad, CSR Brochure, CSR Eligibility Cover Letter, CSR Amendments, DSIR Recognition, Exemption Certificate.',
    displaycontent: 'CSR contribution and donations',
    link: 'https://iitdh.ac.in/csr-contribution'
  },
];

export default searchData;
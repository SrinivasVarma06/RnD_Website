import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { FontSizeProvider } from './context/FontSizeContext.jsx'
import 'flowbite';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FontSizeProvider>
        <App />
      </FontSizeProvider>
    </BrowserRouter>
  </StrictMode>,
)



// {"data":[
//   {
//     "sl_no": 47,
//     "principalInvestigator": "Dr. Nikhil Hegde",
//     "title": "Development of Domain-Specific Language (DSL) for Radio Access Network (RAN) Software",
//     "industry": "Saankhya Labs Private Limited",
//     "sanctiondate": "16.09.2024",
//     "time": 4,
//     "costofprojects": 12
//   },
//   {
//     "sl_no": 46,
//     "principalInvestigator": "Dr. Amarnath Hegde",
//     "title": "Stability analysis of Panam Dam in Gujarat",
//     "industry": "Panam Project Division, Gujarat",
//     "sanctiondate": "12.09.2024",
//     "time": 6,
//     "costofprojects": 30
//   },
//   {
//     "sl_no": 45,
//     "principalInvestigator": "Prof. Ramajee Repaka",
//     "title": "Vetting of HVAC Design of Storage ACCN at AF station Leh",
//     "industry": "Shiva Sharan Gupta & Sons",
//     "sanctiondate": "14.08.2024",
//     "time": 0.5,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 44,
//     "principalInvestigator": "Dr. Omkar B. Bembalge and Dr. Hiranya Deka",
//     "title": "Aerodynamic shape optimization of ceiling fan blades for energy efficiency",
//     "industry": "Crompton Greaves Consumer Electricals Limited, Experience and Innovation Centre",
//     "sanctiondate": "05.08.2024",
//     "time": 6,
//     "costofprojects": 8
//   },
//   {
//     "sl_no": 43,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Proof Check of extended proposed construction of Academic Buildings, at veterinary College, Gadag",
//     "industry": "P Ravindranath Construction Pvt. Ltd.",
//     "sanctiondate": "26.07.2024",
//     "time": 0.75,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 42,
//     "principalInvestigator": "Dr. Sai Ram Boggavarapu",
//     "title": "Modelling and analysis of bearing currents and partial discharges for assessing the reliability of traction motors",
//     "industry": "L&T Technology Services Ltd.",
//     "sanctiondate": "25.07.2024",
//     "time": 6,
//     "costofprojects": 5
//   },
//   {
//     "sl_no": 41,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Preliminary visit to site to check stability of structure to make sure feasibility of proof checking of extended proposed construction of Academic Buildings, Veterinary College, Gadag",
//     "industry": "P Ravindranath Construction Pvt. Ltd.",
//     "sanctiondate": "09.07.2024",
//     "time": 0.25,
//     "costofprojects": 1
//   },
//   {
//     "sl_no": 40,
//     "principalInvestigator": "Prof. V. R. Desai, Dr. Sanatkumar p. Rajamane, Dr. Amarnath Hegde and Dr. Ramesh Nayaka",
//     "title": "Proof checking of structural design and drawing for proposed district office complex, Belagavi",
//     "industry": "Jalavahini Management Services Pvt. Ltd., Dharwad",
//     "sanctiondate": "01.07.2024",
//     "time": 1,
//     "costofprojects": 17
//   },
//   {
//     "sl_no": 39,
//     "principalInvestigator": "Dr. Amar K. Gaonkar",
//     "title": "Method development for FEM vibration assessment",
//     "industry": "Man Energy Solutions India Private Limited",
//     "sanctiondate": "01.07.2024",
//     "time": 12,
//     "costofprojects": 26
//   },
//   {
//     "sl_no": 38,
//     "principalInvestigator": "Prof. Ramajee Repaka",
//     "title": "Vetting of Design and Drawing of AC Plant work for site at common hospital Chandimandir, Chandigarh",
//     "industry": "A.S. Constrction Co.",
//     "sanctiondate": "01.07.2024",
//     "time": 0.5,
//     "costofprojects": 3
//   },
//   {
//     "sl_no": 37,
//     "principalInvestigator": "Dr. Amarnath Hegde and Dr. Ramesh Nayaka",
//     "title": "Stability Investigation work of college of community sciences, UAS, Dharwad",
//     "industry": "University of Agricultural Sciences, Dharwad",
//     "sanctiondate": "18.06.2024",
//     "time": 3,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 36,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Proof Check of Structural Design and Drawing for the Proposed reconstruction of existing ROB No. 290A of span of 1x26.20m PSC grider as 1x30.0m composite grider at km 106/253, at Shantinagar Area, Dabolim, Goa",
//     "industry": "Rail Vikas Nigam Limited, Hubli",
//     "sanctiondate": "28.05.2024",
//     "time": 1,
//     "costofprojects": 11
//   },
//   {
//     "sl_no": 35,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Proof Check of Structural Design and Drawing for the Proposed reconstruction of existing ROB No. 290B-1A of span of 1x26.20m PSC grider as 1x30.0m composite grider at km 106/280, at Shantinagar Area, Dabolim, Goa",
//     "industry": "Rail Vikas Nigam Limited, Hubli",
//     "sanctiondate": "27.05.2024",
//     "time": 0.75,
//     "costofprojects": 0
//   },
//   {
//     "sl_no": 34,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Proof Check of Drawing and Design of foot over Bridge at Heelalige Railaway Station",
//     "industry": "SRICO Projects Pvt. Ltd.",
//     "sanctiondate": "04.05.2024",
//     "time": 0.5,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 33,
//     "principalInvestigator": "Prof. V. R. Desai and Dr. Sanatkumar p. Rajamane",
//     "title": "Vetting of Structural designs and Drawings of the proposed construction of 4-retaining walls of different height at bridge no 111 @ KM:88/800-900 between Holenarasipura-Mavinakere Stations of southwestern railways, Karnataka",
//     "industry": "Dhatri Infra, Bengaluru",
//     "sanctiondate": "30.04.2024",
//     "time": 1,
//     "costofprojects": 12
//   },
//   {
//     "sl_no": 32,
//     "principalInvestigator": "Dr. Hemanth Kumar Chinthapalli",
//     "title": "Concrete Mix Design for EPC Package of Waste to Energy Facility at Hubballi (M20, M25 & M30)",
//     "industry": "Macawber Beekay Pvt. Ltd",
//     "sanctiondate": "18.04.2024",
//     "time": 2.25,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 31,
//     "principalInvestigator": "Prof. V. R. Desai and Dr. Sanatkumar p. Rajamane",
//     "title": "Vetting of Structural designs and Drawings of new foundations to support the existing steel girder near Hassan, Karnataka",
//     "industry": "Rail India Technical and Economic Service (RITES) LTD",
//     "sanctiondate": "12.04.2024",
//     "time": 0.25,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 30,
//     "principalInvestigator": "Prof. V. R. Desai and Dr. Sanatkumar p. Rajamane",
//     "title": "Vetting of the Structural Design of Data Centre Building BM097, Mumbai",
//     "industry": "URC Construction (P) Limited",
//     "sanctiondate": "12.03.2024",
//     "time": 6,
//     "costofprojects": 37
//   },
//   {
//     "sl_no": 29,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Vetting of design of BR.NO. 291 of size 1*1.545m Arch Bridge at CH:107/280 Extended as 1*1.545m RCC slab with pile foundation between Dabolim and Vasco-da-Gama station",
//     "industry": "Rail Vikas Nigam Limited, Hubli",
//     "sanctiondate": "05.02.2024",
//     "time": 1,
//     "costofprojects": 1
//   },
//   {
//     "sl_no": 28,
//     "principalInvestigator": "Dr. Aniketh V. Kataware",
//     "title": "Flexible and rigid pavement design for the Government Medical College, Jalgaon, Maharashtra",
//     "industry": "M/s S. N. Mungale Civil Engineering and Contractors",
//     "sanctiondate": "23.01.2024",
//     "time": 1,
//     "costofprojects": 4
//   },
//   {
//     "sl_no": 27,
//     "principalInvestigator": "Dr. Sai Ram Boggavarapu",
//     "title": "Simulation and Analysis of the early Streamer emission lightning arrester",
//     "industry": "Axis Electrical Components (I) (I) Pvt. Ltd",
//     "sanctiondate": "06.01.2024",
//     "time": 2,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 26,
//     "principalInvestigator": "Dr Amarnath Hegde",
//     "title": "To check the design calculations of PET grids reinforced flexible pavement",
//     "industry": "Strata Geosystems (India) Pvt. Ltd.",
//     "sanctiondate": "01.01.2024",
//     "time": 1.5,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 25,
//     "principalInvestigator": "Dr Amarnath Hegde",
//     "title": "Setting up of multistoried accommodation for patients at Panchavati Campus, AIISH Mysuru",
//     "industry": "AIISH Mysuru",
//     "sanctiondate": "01.01.2024",
//     "time": 1,
//     "costofprojects": 18
//   },
//   {
//     "sl_no": 24,
//     "principalInvestigator": "Dr. Aniket Kataware",
//     "title": "Stage wise inspection of the project construction and development of Kendriya Vidyalaya at Rameshwaram (TN)",
//     "industry": "M R Protech",
//     "sanctiondate": "11.09.2023",
//     "time": 24,
//     "costofprojects": 89
//   },
//   {
//     "sl_no": 23,
//     "principalInvestigator": "Dr Ch hemant Kumar",
//     "title": "Vetting of steel doors (design validiation and vetting of rolling and sliding steel doors)",
//     "industry": "Sannidhi technologies",
//     "sanctiondate": "08.08.2023",
//     "time": 1.5,
//     "costofprojects": 4
//   },
//   {
//     "sl_no": 22,
//     "principalInvestigator": "Dr. Konjengbam Anand",
//     "title": "Dvara Solutions PLTD",
//     "industry": "Dvara Solutions PLTD",
//     "sanctiondate": "31.07.2023",
//     "time": 24,
//     "costofprojects": 1
//   },
//   {
//     "sl_no": 21,
//     "principalInvestigator": "Dr. Ramesh Nayaka",
//     "title": "Validiation and Vetting of Structural Designs and Drawing of the proposed PEB structures for Taloja plant in Navi Mumbai",
//     "industry": "Ellora EPC Pvt. Ltd",
//     "sanctiondate": "12.06.2023",
//     "time": 1,
//     "costofprojects": 5
//   },
//   {
//     "sl_no": 20,
//     "principalInvestigator": "Dr. Aniket Kataware",
//     "title": "Hubballi-Chikjajuru Doubling project- Third party Quality Audit for Major Bridges",
//     "industry": "South Western Railways",
//     "sanctiondate": "29.03.2023",
//     "time": 1,
//     "costofprojects": 23
//   },
//   {
//     "sl_no": 19,
//     "principalInvestigator": "Dr. S R M Prasanna",
//     "title": "Reatainer consultant for Development of futuristic AI and machine learning based spoken language technology products",
//     "industry": "Brane Enterprises pvt ltd",
//     "sanctiondate": "02.03.2023",
//     "time": 12,
//     "costofprojects": 31
//   },
//   {
//     "sl_no": 18,
//     "principalInvestigator": "Dr. Pratyasa Bhui",
//     "title": "Study of Powers System Dynamic Stability islanding scheme for a typical 1400MW system",
//     "industry": "CPRI",
//     "sanctiondate": "18.01.2023",
//     "time": 3,
//     "costofprojects": 14
//   },
//   {
//     "sl_no": 17,
//     "principalInvestigator": "Dr. Aniket Kataware",
//     "title": "Field Visit by Principal Consultant",
//     "industry": "A R THERMOSETS PRIVATE LIMITED",
//     "sanctiondate": "01.12.2022",
//     "time": 0.25,
//     "costofprojects": 2
//   },
//   {
//     "sl_no": 16,
//     "principalInvestigator": "Dr. Naveen MB and Dr. Bharat B N",
//     "title": "Design and development of AI enabled E learning platform and course certification program",
//     "industry": "M/s Ishay Gurukula Pvt Ltd",
//     "sanctiondate": "17.03.2022",
//     "time": 1.5,
//     "costofprojects": 5
//   },
//   {
//     "sl_no": 15,
//     "principalInvestigator": "Dr Naveen MB",
//     "title": "Design and Development of AI enabled e-Learning and Course Certification Platform",
//     "industry": "M/s iShay Infotech, Mysore.",
//     "sanctiondate": "14.03.2022",
//     "time": 5,
//     "costofprojects": 4
//   },
//   {
//     "sl_no": 14,
//     "principalInvestigator": "Prof. S.R.M.Prasanna",
//     "title": "Consultancy Services for speech technology development",
//     "industry": "M/s. ARMSOFTECH Pvt. Ltd. – Chennai",
//     "sanctiondate": "15.01.2022",
//     "time": 12,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 13,
//     "principalInvestigator": "Prof Amar Gaonkar",
//     "title": "Development of in-house Manbo tool proje",
//     "industry": "MAN Energy Solutions Pvt. Ltd.",
//     "sanctiondate": "07.01.2022",
//     "time": 12,
//     "costofprojects": 0
//   },
//   {
//     "sl_no": 12,
//     "principalInvestigator": "Prof Rajshekhar V Bhat",
//     "title": "MACHINE LEARNING BASED MULTI-TARGET",
//     "industry": "M/s bharat Electronics Ltd",
//     "sanctiondate": "10.05.2021",
//     "time": 4,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 11,
//     "principalInvestigator": "Prof Amar Gaonkar",
//     "title": "DESIGN ANALYSIS AND CONSULTATION OF 6 MM",
//     "industry": "M/s bharat Electronics Ltd",
//     "sanctiondate": "06.02.2021",
//     "time": 3,
//     "costofprojects": 7
//   },
//   {
//     "sl_no": 10,
//     "principalInvestigator": "Prof. S.R.M.Prasanna",
//     "title": "Consultancy Services for speech technology development",
//     "industry": "M/s. ARMSOFTECH Pvt. Ltd. – Chennai",
//     "sanctiondate": "15.01.2021",
//     "time": 12,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 9,
//     "principalInvestigator": "Prof. Samarth S. Raut",
//     "title": "Research & Advisory and Review Meetings / Discussions HEXERO INNOVATIONS PRIVATE LIMITED,",
//     "industry": "HEXERO INNOVATIONS PRIVATE LIMITED,",
//     "sanctiondate": "01.08.2020",
//     "time": 12,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 8,
//     "principalInvestigator": "Prof SRM Prasanna",
//     "title": "Retainer consulatation for the development of healthcare watch and handhels device",
//     "industry": "HEXERO INNOVATIONS PRIVATE LIMITED,",
//     "sanctiondate": "28.07.2020",
//     "time": 12,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 7,
//     "principalInvestigator": "Prof. Nagesh R. Iyer",
//     "title": "Third Party Quality Audit Of Construction & Development Work of Kendriya Vidhyalayas (at three Locations in the State of Karnataka)",
//     "industry": "National Projects Constructions Corporation Ltd.",
//     "sanctiondate": "30.05.2020",
//     "time": 12,
//     "costofprojects": 23
//   },
//   {
//     "sl_no": 6,
//     "principalInvestigator": "Prof. S.R.M.Prasanna",
//     "title": "Consultancy Services for speech technology development",
//     "industry": "M/s. ARMSOFTECH Pvt. Ltd. – Chennai",
//     "sanctiondate": "15.01.2020",
//     "time": 12,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 5,
//     "principalInvestigator": "Prof. Sangamesh Deepak R",
//     "title": "Design, fabrication and demonstration of a cooking robot",
//     "industry": "Magic Lamp Technologies Pvt. Ltd.",
//     "sanctiondate": "03.10.2019",
//     "time": 3,
//     "costofprojects": 1
//   },
//   {
//     "sl_no": 4,
//     "principalInvestigator": "Prof. Naveen M B & Prof. Bharath B N &",
//     "title": "GBPS Wireless Modem Development",
//     "industry": "MMRFIC Technology Pvt. Ltd.",
//     "sanctiondate": "12.06.2019",
//     "time": 3,
//     "costofprojects": 6
//   },
//   {
//     "sl_no": 3,
//     "principalInvestigator": "Prof. S.R.M.Prasanna",
//     "title": "Development of Automatic Speech Recognition Techniques and Languages Identification Techniques",
//     "industry": "Bharath Electronics Limited, Central Research Laboratory Bangalore",
//     "sanctiondate": "28.11.2018",
//     "time": 6,
//     "costofprojects": 41
//   },
//   {
//     "sl_no": 2,
//     "principalInvestigator": "Prof. Rajeswara Rao",
//     "title": "Optimization of cost effective methods for the existing epoxy resin based floor coating",
//     "industry": "Colour Plus Poyurethanes Pvt. Hubli",
//     "sanctiondate": "08.08.2018",
//     "time": 10,
//     "costofprojects": 12
//   },
//   {
//     "sl_no": 1,
//     "principalInvestigator": "Prof. Rajeswara Rao",
//     "title": "Optimizing preparation and formulation of polyurethane based coating on open mould matrix to achieve smooth surface",
//     "industry": "Colour Plus Poyurethanes Pvt. Hubli",
//     "sanctiondate": "05.07.2018",
//     "time": 6,
//     "costofprojects": 4
//   }
// ]}
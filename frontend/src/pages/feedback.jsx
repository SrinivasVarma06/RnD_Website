import React from 'react';
import { Users, Briefcase, Globe } from 'lucide-react'; 

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="w-full bg-white shadow-2xl rounded-xl p-8 md:p-12 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-gray-800 mb-8 md:mb-12 leading-tight">
          Share Your Valuable Feedback
        </h1>

        <p className="text-base md:text-lg text-center text-gray-600 mb-10 md:mb-14 max-w-4xl mx-auto">
          Your insights help us improve! Please choose a category below to provide your feedback.
          <br />
          For any direct queries, you can reach out at: <a href="mailto:adean.rnd@iitdh.ac.in" className="text-purple-600 hover:underline">adean.rnd@iitdh.ac.in</a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          <FeedbackCard
            icon={<Users className="w-12 h-12 text-purple-600" />}
            title="R&D Office Faculty"
            description="Provide feedback on the R&D office faculty members."
            link="https://forms.gle/HfZuTLkVnZTPftcE7" 
          />

          <FeedbackCard
            icon={<Briefcase className="w-12 h-12 text-purple-600" />}
            title="R&D Office Staff"
            description="Share your thoughts on the R&D office support staff."
            link="https://docs.google.com/forms/d/e/1FAIpQLSfC5uvnnEm3ntgZ5yN7Cf4WL2stzdleijrvB6ezRTcXQvgo3Q/viewform?usp=publish-editor" 
          />

          <FeedbackCard
            icon={<Globe className="w-12 h-12 text-green-600" />}
            title="The Website"
            description="Help us improve the website's usability and content."
            link="https://docs.google.com/forms/d/e/1FAIpQLScc-dxJfrynIKM19jXZrWaeood5ZSvdTtTt7jlBWKkXwUJAKA/viewform?usp=dialog" 
          />

        </div>
      </div>
    </div>
  );
};

const FeedbackCard = ({ icon, title, description, link }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="mb-4 p-3 bg-gray-100 rounded-full">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <a
        href={link}
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 text-lg"
      >
        Give Feedback
        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </a>
    </div>
  );
};

export default Feedback;




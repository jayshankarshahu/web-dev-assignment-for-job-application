import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faPhone, 
  faEnvelope, 
  faSpinner, 
  faExclamationTriangle, 
  faSchool,
  faArrowLeft,
  faMapMarkerAlt,
  faCity,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const SchoolDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch individual school data
  useEffect(() => {
    if (!id) return; // Wait for router to be ready

    const fetchSchool = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/schools/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch school details');
        }

        if (result.success) {
          setSchool(result.data.school);
        } else {
          throw new Error(result.message || 'School not found');
        }
      } catch (error) {
        console.error('Error fetching school:', error);
        setError(error.message);
        
        // Show error toast
        toast.error(`❌ ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            spin 
            className="text-4xl text-blue-600 mb-4"
          />
          <p className="text-gray-600 text-lg">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="w-24 h-24 mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">School Not Found</h3>
          <p className="text-gray-500 mb-6">
            {error || 'The school you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBack}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go Back
            </button>
            <Link href="/showSchools">
              <span className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 text-center">
                View All Schools
              </span>
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </button>
            <Link href="/showSchools">
              <span className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                View All Schools
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* School Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* School Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-50 to-indigo-100">
            <img
              src={school.image || '/api/placeholder/800/400'}
              alt={school.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f3f4f6"/>
                    <g transform="translate(400,200)">
                      <circle cx="0" cy="-30" r="25" fill="#6b7280"/>
                      <rect x="-40" y="-5" width="80" height="50" fill="#6b7280" rx="8"/>
                      <rect x="-30" y="5" width="60" height="30" fill="#f3f4f6" rx="3"/>
                      <text x="0" y="80" font-family="Arial, sans-serif" font-size="20" fill="#6b7280" text-anchor="middle">
                        School Image
                      </text>
                    </g>
                  </svg>
                `)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {/* School Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">
                {school.name}
              </h1>
              <div className="flex items-center text-white/90">
                <FontAwesomeIcon icon={faSchool} className="w-5 h-5 mr-2" />
                <span className="text-lg">Educational Institution</span>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Location Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon 
                        icon={faLocationDot} 
                        className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">Full Address</p>
                        <p className="text-gray-600 mt-1">{school.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon 
                        icon={faCity} 
                        className="w-5 h-5 text-green-500 flex-shrink-0" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">City</p>
                        <p className="text-gray-600">{school.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon 
                        icon={faFlag} 
                        className="w-5 h-5 text-purple-500 flex-shrink-0" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">State</p>
                        <p className="text-gray-600">{school.state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon 
                        icon={faPhone} 
                        className="w-5 h-5 text-green-500 flex-shrink-0" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">Phone Number</p>
                        <a 
                          href={`tel:+91${school.contact}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          +91 {school.contact}
                        </a>
                      </div>
                    </div>

                    {school.email_id && (
                      <div className="flex items-start space-x-3">
                        <FontAwesomeIcon 
                          icon={faEnvelope} 
                          className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" 
                        />
                        <div>
                          <p className="font-medium text-gray-900">Email Address</p>
                          <a 
                            href={`mailto:${school.email_id}`}
                            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 break-all"
                          >
                            {school.email_id}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`tel:+91${school.contact}`}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                  <span>Call School</span>
                </a>
                
                {school.email_id && (
                  <a 
                    href={`mailto:${school.email_id}`}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>
                )}

                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${school.address}, ${school.city}, ${school.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                  <span>View on Map</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetail;
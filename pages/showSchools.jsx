import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faEye, faSpinner, faExclamationTriangle, faSchool } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const ShowSchools = () => {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const schoolsPerPage = 9; // 3x3 grid

  // Fetch schools from API with pagination
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for pagination
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: schoolsPerPage.toString()
        });

        const response = await fetch(`/api/schools?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch schools');
        }

        if (result.success) {
          setSchools(result.data.schools || []);
          setTotalSchools(result.data.total || 0);
          
          if (result.data.schools?.length === 0 && currentPage === 1) {
            toast.info("📚 No schools found in the database", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else {
          throw new Error(result.message || 'API returned unsuccessful response');
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        
        // Show error toast
        toast.error(`❌ ${error.message || 'Failed to load schools. Please try again.'}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setSchools([]);
        setTotalSchools(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [currentPage, schoolsPerPage]); // Re-fetch when page changes

  // Read page from URL query on mount
  useEffect(() => {
    if (router.isReady) {
      const pageFromQuery = parseInt(router.query.page, 10);
      if (pageFromQuery && pageFromQuery !== currentPage) {
        setCurrentPage(pageFromQuery);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.page]);

  // Calculate total pages based on server response
  const totalPages = Math.ceil(totalSchools / schoolsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
        router.push({
        pathname: router.pathname,
        query: { ...router.query, page: pageNumber },
      }, undefined, { shallow: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    // Reset to first page and retry
    setCurrentPage(1);
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
          <p className="text-gray-600 text-lg">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FontAwesomeIcon icon={faSchool} className="mr-3 text-blue-600" />
                Schools Directory
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover {totalSchools} schools across India
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Page {currentPage} of {totalPages}</span>
                <span>•</span>
                <span>{totalSchools} total schools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {schools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {schools.map((school) => (                
                
                <div
                  key={school.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >
                  {/* School Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
                    <img        
                      src={school.image || '/api/placeholder/300/200'}
                      alt={school.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#f3f4f6"/>
                            <g transform="translate(150,100)">
                              <circle cx="0" cy="-20" r="15" fill="#6b7280"/>
                              <rect x="-25" y="-5" width="50" height="30" fill="#6b7280" rx="5"/>
                              <rect x="-20" y="0" width="40" height="20" fill="#f3f4f6" rx="2"/>
                              <text x="0" y="45" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">
                                School Image
                              </text>
                            </g>
                          </svg>
                        `)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* School Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {school.name}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-3">
                        <FontAwesomeIcon 
                          icon={faLocationDot} 
                          className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" 
                        />
                        <div className="text-sm text-gray-600">
                          <p>{school.address}</p>
                          <p className="font-medium text-gray-900">{school.city}, {school.state}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon 
                          icon={faPhone} 
                          className="w-4 h-4 text-green-500 flex-shrink-0" 
                        />
                        <span className="text-sm text-gray-600">{school.contact}</span>
                      </div>

                      {school.email_id && (
                        <div className="flex items-center space-x-3">
                          <FontAwesomeIcon 
                            icon={faEnvelope} 
                            className="w-4 h-4 text-red-500 flex-shrink-0" 
                          />
                          <span className="text-sm text-gray-600 truncate">{school.email_id}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <a
                        href={`/showSchools/${school.id}`}
                        className="w-full cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        <span>View Details</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing{' '}
                <span className="font-medium">
                  {((currentPage - 1) * schoolsPerPage) + 1}
                </span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(currentPage * schoolsPerPage, totalSchools)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalSchools}</span>
                {' '}schools
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Show pages around current page */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    
                    // Only show pages within 2 of current page
                    if (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-4">
              {schools.length === 0 && !loading 
                ? "There are currently no schools in the database or failed to load data."
                : "There are currently no schools in the database."
              }
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSchools;
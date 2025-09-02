import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faSchool } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faSchool} className="text-blue-600 text-5xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            School Management
          </h1>
        </div>

        {/* Buttons */}
        <div className="space-y-4 flex flex-col">
          <Link href="/addSchool">
            <span className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md">
              <FontAwesomeIcon icon={faPlus} className="text-lg" />
              <span>Add School</span>
            </span>
          </Link>

          <Link href="/showSchools">
            <span className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md">
              <FontAwesomeIcon icon={faEye} className="text-lg" />
              <span>View Schools</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
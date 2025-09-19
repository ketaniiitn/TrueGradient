import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/signin'); 
    }
  };

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">TrueGradient Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to TrueGradient!</h2>
            <p className="text-gray-600 mb-4">
              You have successfully signed in to your account. This is your dashboard where you can access all features.
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Backend Test Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend Connection</h2>
            <p className="text-gray-600 mb-4">
              Test your backend connection and API endpoints.
            </p>
            <button
              onClick={() => navigate('/test')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Test Backend
            </button>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="text-gray-600 space-y-2">
              <li>✅ User Authentication</li>
              <li>✅ JWT Token Management</li>
              <li>✅ Protected Routes</li>
              <li>✅ Redux State Management</li>
              <li>🚧 More features coming soon...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
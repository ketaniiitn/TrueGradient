import { useState } from 'react';
import { apiService } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await apiService.testConnection();
      setStatus(`✅ Connected: ${response.data.message}`);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 w-full max-w-md border border-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">TrueGradient</h1>
          <p className="text-gray-600">Backend Connection Test</p>

          <div className="bg-gray-50 rounded-lg p-5 shadow-inner">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <p
              className={`mt-2 font-medium text-base ${
                status.includes('✅')
                  ? 'text-green-600'
                  : status.includes('❌')
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {status}
            </p>
          </div>

          <button
            onClick={testConnection}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-white font-semibold transition-all ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                    0 0 5.373 0 12h4zm2 5.291A7.962 
                    7.962 0 014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Testing...
              </>
            ) : (
              'Test Backend Connection'
            )}
          </button>

          <div className="pt-6 text-xs text-gray-500 space-y-1">
            <p>
              <span className="font-medium">Backend:</span> http://127.0.0.1:5000
            </p>
            <p>
              <span className="font-medium">Frontend:</span> http://localhost:5174
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;

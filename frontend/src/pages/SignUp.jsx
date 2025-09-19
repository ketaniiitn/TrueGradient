import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../store/slices/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({ username: false, password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // We'll create this later
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Map backend errors
  useEffect(() => {
    if (!error) return;
    if (error.toLowerCase().includes('exists')) {
      setFormErrors((prev) => ({ ...prev, username: 'Username already exists' }));
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const isPasswordValid = Object.values(passwordValidation).every(valid => valid);
      if (!isPasswordValid) {
        errors.password = 'Password does not meet all requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Re-validate individual field
    setFormErrors((prev) => {
      const next = { ...prev };
      if (name === 'username') {
        if (!formData.username.trim()) next.username = 'Username is required';
        else if (formData.username.length < 3) next.username = 'Username must be at least 3 characters long';
        else delete next.username;
      }
      if (name === 'password') {
        if (!formData.password) next.password = 'Password is required';
        else if (!Object.values(passwordValidation).every(Boolean)) next.password = 'Password does not meet all requirements';
        else delete next.password;
      }
      if (name === 'confirmPassword') {
        if (!formData.confirmPassword) next.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match';
        else delete next.confirmPassword;
      }
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password requirements
    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value)
      });
    }

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ username: true, password: true, confirmPassword: true });
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(registerUser({
        username: formData.username,
        password: formData.password
      })).unwrap();
      // Navigation will be handled by useEffect
    } catch (err) {
      // Error is handled by Redux slice
      console.error('Registration failed:', err);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      <span className="mr-2">
        {isValid ? '✓' : '✗'}
      </span>
      {text}
    </div>
  );

  const showUsernameError = (touched.username || submitted) && formErrors.username;
  const showPasswordError = (touched.password || submitted) && formErrors.password;
  const showConfirmError = (touched.confirmPassword || submitted) && formErrors.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
          <p className="text-gray-600">Create an account to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!showUsernameError}
              aria-describedby={showUsernameError ? 'signup-username-error' : undefined}
              placeholder="Choose a username"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all shadow-sm ${
                showUsernameError ? 'border-red-400 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {showUsernameError && <p id="signup-username-error" className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!showPasswordError}
                aria-describedby={showPasswordError ? 'signup-password-error' : undefined}
                placeholder="Create a password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all shadow-sm ${
                  showPasswordError ? 'border-red-400 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l-3-3m0 0l-3 3m3-3l3 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {showPasswordError && <p id="signup-password-error" className="mt-1 text-sm text-red-600">{formErrors.password}</p>}

            {/* Password validation feedback */}
            {formData.password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-1 shadow-inner">
                <ValidationItem 
                  isValid={passwordValidation.length} 
                  text="At least 8 characters" 
                />
                <ValidationItem 
                  isValid={passwordValidation.uppercase} 
                  text="One uppercase letter" 
                />
                <ValidationItem 
                  isValid={passwordValidation.lowercase} 
                  text="One lowercase letter" 
                />
                <ValidationItem 
                  isValid={passwordValidation.number} 
                  text="One number" 
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!showConfirmError}
                aria-describedby={showConfirmError ? 'signup-confirm-error' : undefined}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all shadow-sm ${
                  showConfirmError ? 'border-red-400 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l-3-3m0 0l-3 3m3-3l3 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {showConfirmError && <p id="signup-confirm-error" className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
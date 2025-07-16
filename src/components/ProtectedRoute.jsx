import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorAlert from './ErrorAlert';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    // Not logged in, redirect to signin
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!currentUser.emailVerified) {
    // Show alert and block access
    return (
      <>
        <ErrorAlert
          message="Please verify your email to access this page."
          open={showAlert}
          onClose={() => setShowAlert(false)}
        />
        {/* Optionally redirect to signin or another page */}
        <Navigate to="/signin" state={{ from: location }} replace />
      </>
    );
  }

  return children;
}

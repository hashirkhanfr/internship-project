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
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!currentUser.emailVerified) {
    return (
      <>
        <ErrorAlert
          message="Please verify your email to access this page."
          open={showAlert}
          onClose={() => setShowAlert(false)}
        />
        <Navigate to="/signin" state={{ from: location }} replace />
      </>
    );
  }

  return children;
}

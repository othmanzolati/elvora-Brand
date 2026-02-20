import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  const location = useLocation();

  // 1. Ila baqi Supabase kiy-féri-fi l-session (Loading = true)
  // Mat-dir hta chi Redirect. Khlli l-page t-tsenna.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner khfif bach i-fhem l-user beli l-app kat-checki */}
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-sm font-medium">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  // 2. Ghir mli i-tsali l-Loading (loading = false)
  // 3ad n-choufou wach mconnecti (isAuthenticated)
  if (!isAuthenticated) {
    // Kan-siftoh l-login o kan-7fdo fin bgha i-mchi f 'state'
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Ila mconnecti o kolchi nadi, bghat l-page t-tla3
  return children;
};

export default ProtectedRoute;
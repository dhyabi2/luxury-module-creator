
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "../modules/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-brand text-white px-6 py-3 rounded-sm hover:bg-brand/90 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              to="/watches"
              className="border border-gray-300 px-6 py-3 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Browse Watches
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;

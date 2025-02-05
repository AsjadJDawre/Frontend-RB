import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      <h1 className="text-9xl font-extrabold text-red-500">404</h1>
      <h2 className="text-4xl font-semibold mt-4">Oops! Page Not Found</h2>
      <p className="text-lg mt-2 text-gray-400">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-6">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Go Home
        </Link>
      </div>

      <div className="mt-10 animate-pulse">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
          alt="Lost"
          className="w-40 opacity-70"
        />
      </div>
    </div>
  );
};

export default NotFound;

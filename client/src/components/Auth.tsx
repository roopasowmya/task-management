import { Link } from "react-router-dom";

interface AuthProps {}
const Auth: React.FC<AuthProps> = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Welcome</h2>
        <ul className="w-full flex flex-col gap-4">
          <li>
            <Link
              to="/SignUp"
              className="block w-full text-center bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              to="/Login"
              className="block w-full text-center bg-green-500 text-white py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Auth;

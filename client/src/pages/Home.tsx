import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Home: React.FC = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState("Ranjeet");
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/users/${userId}/`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userDetails = await response.json();
        setUsername(userDetails.userName);
        setNumberOfTasks(userDetails.noOfTask);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError("Error fetching user details.");
          console.error("Error fetching user details:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    return () => controller.abort(); // Cleanup on unmount
  }, [userId]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded-lg shadow-lg text-center mt-20">
      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading user details...</p>
      ) : error ? (
        <p className="text-red-500 font-medium">{error}</p>
      ) : (
        <>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 flex items-center justify-center bg-blue-500 text-white rounded-full text-3xl font-bold shadow-md">
              {username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-semibold mt-4 text-gray-800">
              Welcome, <span className="text-blue-600">{username}!</span>
            </h2>
          </div>

          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Manage your tasks efficiently. Add, update, and track your progress
            effortlessly.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6 w-full sm:w-3/4 mx-auto">
            <p className="text-lg font-medium text-gray-800">
              Number of Tasks:{" "}
              <span className="font-bold text-blue-600">{numberOfTasks}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
              onClick={() => navigate(`/user/${userId}/TaskList`)}
            >
              Show All Tasks
            </button>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105 focus:ring-4 focus:ring-green-300"
              onClick={() => navigate(`/user/${userId}/CreateTask`)}
            >
              Create New Task
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Home: React.FC = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState("Ranjeet");
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/`
        );
        if (response.ok) {
          const userDetails = await response.json();
          setUsername(userDetails.userName);
          setNumberOfTasks(userDetails.noOfTask);
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, [userId]);
  const handleShowAllTasks = () => {
    navigate(`/user/${userId}/TaskList`);
  };
  const handleCreateTask = () => {
    navigate(`/user/${userId}/CreateTask`);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded-lg shadow-lg text-center">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 flex items-center justify-center bg-blue-500 text-white rounded-full text-3xl font-bold shadow-md">
          {username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-semibold mt-4">Welcome, {username}!</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Manage your tasks efficiently. Add, update, and track your progress
        easily.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
        <p className="text-lg font-medium">
          Number of Tasks:{" "}
          <span className="font-bold text-blue-600">{numberOfTasks}</span>
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={handleShowAllTasks}
        >
          Show All Tasks
        </button>
        <button
          className="bg-green-500 text-white py-2 px-5 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          onClick={handleCreateTask}
        >
          Create New Task
        </button>
      </div>
    </div>
  );
};

export default Home;

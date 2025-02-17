"use server";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadLine, setDeadline] = useState("");
  const [workOfStatus, setWorkStatus] = useState("not-started");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTask = async () => {
    if (!taskName || !description || !deadLine) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    const createTaskData = {
      taskName,
      description,
      deadLine,
      workOfStatus,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/api/user/${userId}/task/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createTaskData),
        }
      );

      if (response.ok) {
        navigate(`/user/${userId}/TaskList`);
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error: any) {
      console.error("Error creating task:", error.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4">
          Create New Task
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-gray-700">Task Name:</span>
          <input
            className="border w-full p-2 rounded mt-1 focus:ring focus:ring-blue-300"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Description:</span>
          <textarea
            className="border w-full p-2 rounded mt-1 focus:ring focus:ring-blue-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Deadline:</span>
          <input
            className="border w-full p-2 rounded mt-1 focus:ring focus:ring-blue-300"
            type="date"
            value={deadLine}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Work Status:</span>
          <select
            className="border w-full p-2 rounded mt-1 focus:ring focus:ring-blue-300"
            value={workOfStatus}
            onChange={(e) => setWorkStatus(e.target.value)}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <div className="flex justify-between mt-4">
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <button
            className={`px-6 py-2 text-white rounded-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleCreateTask}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

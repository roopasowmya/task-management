import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface User {
  userId: string;
  userName: string;
  numberOfTasks: number;
}

interface Task {
  taskId: number;
  taskName: string;
  deadLine: string;
  workOfStatus: string;
  description: string;
}

const TaskList: React.FC = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, tasksResponse] = await Promise.all([
          fetch(`http://localhost:8081/api/users/${userId}/`),
          fetch(`http://localhost:8081/api/user/${userId}/tasks/`),
        ]);

        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");

        const userData = await userResponse.json();
        const userTasks = await tasksResponse.json();

        setUserDetails(userData);
        setTasks(userTasks);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditTask = (taskId: number) => {
    navigate(`/user/${userId}/${taskId}`);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(
        `http://localhost:8081/api/user/${userId}/${taskId}/`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    } catch (error: any) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleMarkAsComplete = async (taskId: number) => {
    try {
      const markAsCompleteResponse = await fetch(
        `http://localhost:8081/api/user/${userId}/${taskId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workOfStatus: "Complete",
            deadLine: "2000-01-01",
            taskName: "Completed",
          }),
        }
      );

      // if (markAsCompleteResponse.ok) {
      //   setTasks((prevTasks) =>
      //     prevTasks.filter((task) => task.taskId !== taskId)
      //   );
      // } else {
      //   throw new Error("Failed to mark task as complete");
      // }
    } catch (error: any) {
      console.error("Error marking task as complete:", error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {userDetails && (
        <>
          <h2 className="text-2xl mb-4">{`Task List for ${userDetails.userName}`}</h2>
        </>
      )}

      {tasks.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            You have {tasks.length} tasks pending
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Task Name</th>
                  <th className="py-3 px-6 text-left">DeadLine</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr
                    key={task.taskId}
                    className={`hover:bg-gray-100 transition-all ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-6">{task.taskId}</td>
                    <td className="py-3 px-6 font-medium">{task.taskName}</td>
                    <td className="py-3 px-6">{task.deadLine}</td>
                    <td
                      className={`py-3 px-6 font-semibold ${
                        task.workOfStatus === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {task.workOfStatus}
                    </td>
                    <td className="py-3 px-6 flex space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => handleEditTask(task.taskId)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDeleteTask(task.taskId)}
                      >
                        Delete
                      </button>
                      {task.workOfStatus !== "Completed" && (
                        <button
                          className="text-green-500 hover:text-green-700 transition"
                          onClick={() => handleMarkAsComplete(task.taskId)}
                        >
                          Mark as Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-500 text-center mt-10 animate-bounce">
            No tasks available 😴
          </h2>
        </>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all"
      >
        Create Task
      </button>
    </div>
  );
};

export default TaskList;

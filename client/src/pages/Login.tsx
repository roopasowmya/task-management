import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const performLogin = async (userName: string, password: string) => {
    setLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("http://localhost:8081/api/users/signing/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setUserId(result.userId);
      } else {
        setLoginError(result.message || "Invalid username or password");
      }
    } catch (error) {
      setLoginError("Something went wrong. Please try again.");
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      navigate(`/user/${userId}/Home/`);
    }
  }, [userId, navigate]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setLoginError("Username and password are required.");
      return;
    }
    performLogin(username, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md mx-auto p-6 border rounded shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <label className="block mb-3">
          <span className="text-gray-700">Username:</span>
          <input
            className="border w-full p-2 mt-1 rounded focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-700">Password:</span>
          <input
            className="border w-full p-2 mt-1 rounded focus:outline-none focus:ring focus:border-blue-500"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
        {loginError && (
          <p className="text-red-500 text-sm mb-2">{loginError}</p>
        )}
        <button
          className={`w-full p-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;

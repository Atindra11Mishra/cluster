import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, authenticated } = usePrivy();
  const navigate = useNavigate();

  if (authenticated) {
    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Login with Privy</h2>

        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

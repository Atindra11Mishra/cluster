import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectWallet from "../Home/ConnectWallet";
import TwitterAuth from "../Home/TwitterAuth";

const Dashboard = () => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();
  const { username, address } = useParams();

  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect to URL with username & address if missing
  useEffect(() => {
    const userNameFromPrivy = user?.twitter?.username || "guest";
    const walletAddressFromPrivy = user?.wallet?.address || "null";

    if (!username || !address) {
      navigate(`/dashboard/${userNameFromPrivy}/${walletAddressFromPrivy}`);
    } else {
      fetchScore(username, address);
    }
  }, [username, address, user, navigate]);

  const fetchScore = async (username, address) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/score/get-score/${username}/${address}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch score");

      setScoreData(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md p-4 flex items-center justify-between px-8">
        <h1 className="text-xl font-bold text-gray-300">Cluster Protocol</h1>
        <button className="text-gray-400 hover:text-white transition">Home</button>
        <div className="flex items-center space-x-4">
          <p className="text-gray-300">{username || "Guest"}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Score Display */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-2xl text-center border border-gray-700">
          <h2 className="text-4xl font-bold text-green-400 mb-6">Your Score</h2>

          {loading ? (
            <p className="text-gray-400 mb-6">Calculating...</p>
          ) : scoreData ? (
            <div className="mb-6">
              <p className="text-6xl font-extrabold text-white">{scoreData.score}</p>
              <p className="text-lg text-gray-400 mt-2">{scoreData.title}</p>
            </div>
          ) : (
            <p className="text-gray-400 mb-6">Score not available.</p>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {!address || address === "null" ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-red-500">Connect Wallet to Increase Score</h3>
              <ConnectWallet />
            </div>
          ) : null}

          {!user.twitter && <TwitterAuth />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

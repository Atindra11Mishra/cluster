import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScore } from "../redux/scoreSlice"; // Import Redux action

import TwitterAuth from "../Home/TwitterAuth";
import WalletConnect from "../Home/WalletConnect";
import DownloadButton from "../Home/DownloadButton"; // Import Download Button

const Dashboard = () => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();
  const { username, address } = useParams();
  const dispatch = useDispatch();

  // ✅ Get global score from Redux
  const totalScore = useSelector((state) => state.score.totalScore);
  const scoreTitle = useSelector((state) => state.score.title);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch score on component mount & when Twitter login happens
  useEffect(() => {
    const userNameFromPrivy = user?.twitter?.username || user.wallet.id || "guest";
    const walletAddressFromPrivy = user?.wallet?.address || "null";

    if (!username || !address) {
      navigate(`/dashboard/${userNameFromPrivy}/${walletAddressFromPrivy}`);
    } else {
      fetchScore(username, address);
    }
  }, [username, address, user.twitter]); // ✅ Refetch when user logs in via Twitter

  // ✅ Function to Fetch Score from Backend
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

      dispatch(setScore(data)); // ✅ Store updated score in Redux
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
          ) : (
            <div className="mb-6">
              <p className="text-6xl font-extrabold text-white">{totalScore}</p>
              <p className="text-lg text-gray-400 mt-2">{scoreTitle}</p>
            </div>
          )}
           {/* Download & Share Score Section */}
          <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
            <DownloadButton score={totalScore} />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* If no Wallet is Connected, Show Wallet Button */}
          
         
          {/* If no Twitter is Connected, Show Twitter Auth */}
          {!user.twitter && <TwitterAuth />}
          <WalletConnect />

          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

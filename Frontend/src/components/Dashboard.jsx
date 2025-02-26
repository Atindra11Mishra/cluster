import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import ConnectWallet from '../Home/ConnectWallet'
import TwitterAuth from "../Home/TwitterAuth";

const Dashboard = () => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-green-600 font-medium">Welcome {user?.twitter?.username || user?.wallet?.address}</p>

        {user.profile?.imageUrl && (
          <img src={user.profile.imageUrl} alt="Profile" className="w-20 h-20 rounded-full mx-auto my-4" />
        )}

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
        {user.wallet?"":<ConnectWallet/>}
        {user.twitter?"":<TwitterAuth/>}
      </div>
    </div>
  );
};

export default Dashboard;

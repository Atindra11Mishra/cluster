import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (authenticated) {
      console.log("Privy User Data:", user); // ✅ Debugging: Log user object
      setUserData({
        name: user?.name || "N/A",
        email: user?.email || "N/A",
        profileImage: user?.profile?.imageUrl || "",
        twitterUsername: user?.twitter?.username || "N/A",
        twitterProfileImage: user?.twitter?.profileImage || "",
      });
    }
  }, [authenticated, user]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Twitter Login with Privy</h1>
      {authenticated ? (
        <>
          <p className="mb-2">Welcome {user.twitter?.name}</p>
          

          {/* Display profile images */}
          {userData?.profileImage && (
            <img
              src={userData.profileImage}
              alt="User Profile"
              className="w-20 h-20 rounded-full mt-2"
            />
          )}
          {userData?.twitterProfileImage && (
            <img
              src={userData.twitterProfileImage}
              alt="Twitter Profile"
              className="w-20 h-20 rounded-full mt-2"
            />
          )}

          <button onClick={logout} className="px-4 py-2 mt-4 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded">
          Login with Twitter
        </button>
      )}
    </div>
  );
}

export default Home;

import { useState } from "react";
import { auth, twitterProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function TwitterAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  console.log(user)

  // 🔹 Login with Twitter
  const loginWithTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      setUser(result.user); 
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!user ? (
        <button
          onClick={loginWithTwitter}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Sign in with Twitter
        </button>
      ) : (
        <div className="text-center">
          <p className="text-green-600 font-bold">Welcome, {user.displayName}!</p>
         
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default TwitterAuth;
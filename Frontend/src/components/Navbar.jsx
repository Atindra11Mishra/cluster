import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const { login, logout, authenticated } = usePrivy();

  return (
    <nav className="bg-black text-white py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold">Twitter Data Fetcher</h1>
      <div className="flex space-x-6">
        {!authenticated ? (
          <button onClick={() => login()} className="text-white">
            Login with Twitter
          </button>
        ) : (
          <button onClick={logout} className="text-white">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

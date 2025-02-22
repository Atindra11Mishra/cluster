import { PrivyProvider } from "@privy-io/react-auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </PrivyProvider>
  );
}

export default App;

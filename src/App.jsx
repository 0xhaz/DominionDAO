import Home from "./views/Home";
import Header from "./components/Header";
import Proposal from "./views/Proposal";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { isWalletConnected, getInfo } from "./Blockchain.services";
import CreateProposal from "./components/CreateProposal";

const App = () => {
  useEffect(async () => {
    await isWalletConnected();
    await getInfo();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-300 dark:bg-[#212936]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal/:id" element={<Proposal />} />
      </Routes>
      <CreateProposal />
    </div>
  );
};

export default App;

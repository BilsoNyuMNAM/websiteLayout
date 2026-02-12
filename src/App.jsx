import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InspectorProvider } from './context/InspectorContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import InspectorPage from './pages/InspectorPage';

function App() {
  return (
    <InspectorProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inspect" element={<InspectorPage />} />
        </Routes>
      </Router>
    </InspectorProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topic from './pages/Topic';
import ExplanationLog from './pages/ExplanationLogs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Topic />} />
        <Route path="/catalog" element={<ExplanationLog />} />
      </Routes>
    </Router>
  );
}

export default App;
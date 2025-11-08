import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="Landing" element={<Landing />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
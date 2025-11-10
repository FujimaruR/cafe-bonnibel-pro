import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Location from './pages/Location';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import CheckOut from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="Landing" element={<Landing />} />
          <Route path="About" element={<AboutUs />} />
          <Route path="Contact" element={<ContactUs />} />
          <Route path="Location" element={<Location />} />
          <Route path="Menu" element={<Menu />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="CheckOut" element={<CheckOut />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
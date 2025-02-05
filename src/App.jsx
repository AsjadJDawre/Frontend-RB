import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './component/Login'
import Dashboard from './component/Dashboard';
import AdminDashboard from './component/AdminDashboard';
import Register from './component/Register'
// import Booking from './component/booking';
import Booking from './component/Booking'
import Userdashboard from './component/Userdashboard';
import SuccessPage from './component/Successful-payment';
import Test from './component/Test';
import BookingHistory from './component/BookingHistory';
import AdminSuccess from './component/AdminSuccess';
import AdminMessage from './component/AdminMessage';
import Notice from './component/Notice';
import NotFound from "./component/NotFound";

function App() {
  return (
<>
<Router>


<Routes>

  <Route path="/" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/user-dashboard" element={<Userdashboard />} />
  <Route path="/user-booking" element={<Booking />} />
  <Route path="/booking-history" element={<BookingHistory />} />
  <Route path="/successful Booking" element={<SuccessPage />} />
  <Route path="/successful-AdminBooking" element={<AdminSuccess />} />
  <Route path="/admin-message" element={<AdminMessage />} />
  <Route path="/notice" element={<Notice />} />
  <Route path="/Test" element={<Test />} />
  <Route path="/Admin" element={<AdminDashboard />} />

  <Route path="*" element={<NotFound />} />

</Routes>


</Router>


</>

  )
}

export default App
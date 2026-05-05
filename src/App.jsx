import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import SubmitEvent from './pages/SubmitEvent'
import Admin from './pages/Admin'
import FeaturedSuccess from './pages/FeaturedSuccess'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  if (isAdmin) {
    return <Admin />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/submit" element={<SubmitEvent />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/featured-success" element={<FeaturedSuccess />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App

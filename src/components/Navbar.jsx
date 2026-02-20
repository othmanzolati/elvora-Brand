import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext' // 1. Import useAdmin

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { cart } = useCart()
  const { isAuthenticated } = useAdmin() // 2. Check wach mconnecti
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // 3. Logic: Ila mconnecti, ddo l-panel. Ila la, ddo l-login.
  const adminPath = isAuthenticated ? '/admin' : '/admin/login'

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COLLECTION', path: '/collection' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'Admin Panel', path: adminPath } // Khdem b variable adminPath
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold font-heading">
            ELVORA
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Icon link */}
            <Link to={adminPath} className={`p-2 rounded-full transition-colors ${isAuthenticated ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}>
              <User className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
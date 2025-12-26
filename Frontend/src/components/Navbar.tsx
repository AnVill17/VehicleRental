import { motion } from 'framer-motion';
import { Car, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/my-rentals', label: 'My Rentals' },
    { href: '/messages', label: 'Messages' },
    { href: '/profile', label: 'Profile' },
  ];

  const lenderLinks = [
    { href: '/lender/dashboard', label: 'Dashboard' },
    { href: '/lender/vehicles', label: 'Vehicles' },
    { href: '/lender/requests', label: 'Requests' },
    { href: '/lender/messages', label: 'Messages' },
    { href: '/lender/profile', label: 'Profile' },
  ];

  const links = user?.role === 'lender' ? lenderLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass-strong"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Car className="w-6 h-6 text-primary" />
            </motion.div>
            <span className="text-xl font-display font-bold gradient-text">
              VehiRent
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`nav-link ${
                      location.pathname === link.href ? 'nav-link-active' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user?.name}
                    </span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-muted hover:bg-destructive/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup">
                  <motion.button
                    className="btn-primary text-sm py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden overflow-hidden ${mobileMenuOpen ? 'pb-4' : ''}`}
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-2 pt-2">
            {isAuthenticated ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === link.href
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-left text-destructive hover:bg-destructive/20 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

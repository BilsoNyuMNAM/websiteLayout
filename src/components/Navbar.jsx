import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isInspector = location.pathname === '/inspect';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-dot">●</span>
            <span className="logo-text">INSPECTOR_V2</span>
          </Link>
        </div>

        <div className="navbar-center">
          {!isInspector && (
            <>
              <Link to="/" className="nav-link">DOCUMENTATION</Link>
              <Link to="/" className="nav-link">MODULES</Link>
              <Link to="/" className="nav-link">MANIFESTO</Link>
            </>
          )}
          {isInspector && (
            <div className="inspector-url-bar">
              <span className="target-badge">TARGET</span>
              <span className="target-url">https://example-studio.com/portfolio/2024</span>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {!isInspector && (
            <>
              <span className="version-badge">v0.0.304</span>
              <button className="login-btn">LOGIN</button>
            </>
          )}
          {isInspector && (
            <div className="render-status">
              <span className="status-dot"></span>
              <span>RENDER_COMPLETE</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

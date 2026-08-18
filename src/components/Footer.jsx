import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-logo">
            LKM <span>Beauty</span>
          </div>
          <p className="footer-tag">
            Korean skincare and makeup, chosen for real routines.
          </p>
        </div>

        <div className="footer-col">
          <span className="eyebrow">Explore</span>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <span className="eyebrow">Studio</span>
          <Link to="/admin/login">Admin login</Link>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} LKM Beauty. All rights reserved.</span>
      </div>
    </footer>
  );
}
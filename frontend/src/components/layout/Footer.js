import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-simple">
      <div className="footer-content">
        <p>
          Built with <span className="tech-highlight">React</span> & <span className="tech-highlight">FastAPI</span> • 
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
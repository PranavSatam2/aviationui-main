import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-light p-0 fixed-bottom" style={{zIndex : 10}}>
      <div className="container text-center text-dark">
        <p className="mt-2">&copy; 2025 <span className="font-weight-bold" style={{color: 'black'}}>AMC Technology</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
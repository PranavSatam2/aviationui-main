import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import LoginPage from "./LoginPage";

const Header = () => {
  return (
      
    <div className="col-md-12" style={{height : '40px'}}> 
      <div className="row">
        <header className="col-md-12 headertext-center card d-flex align-items-end" style={{height : '40px'}}>
          <div className="col-md-12 right-content d-flex align-items-center justify-content-end  ">
            <span className="username mx-2">Pawan Panchal</span>
            <img  src="" alt="Profile" className="rounded-circle m-1" style={{height : '30px', width : '30px'}} />
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;

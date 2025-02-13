import React from "react";

const Header = () => {
  return (
      
    <div className="col-md-12" style={{height : '65px'}}> 
      <div className="row">
        <header className="col-md-12 headertext-center card d-flex align-items-end" style={{height : '77px'}}>
          <div className="col-md-12 right-content d-flex align-items-center justify-content-end  ">
            <span className="username mx-2">Pranav Satam</span>
            <img  src="src\static\img\prfileLogo.png" alt="Profile" className="rounded-circle m-1" style={{height : '30px', width : '30px'}} />
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;

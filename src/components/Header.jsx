import React from "react";

const Header = () => {
  return (
    <div className="col-md-12" style={{ height: '65px' }}> 
      <div className="row">
        <header 
          className="col-md-12 d-flex align-items-center shadow-sm"
          style={{ 
            height: '60px', 
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e9f2',
            padding: '0 24px'
          }}
        >
          <div className="col-md-6 d-flex align-items-center">
      <h6 className="mb-0 fw-semibold" style={{ 
        color: '#1B74E4', 
        fontWeight: 'bold', 
        fontFamily: '"Poppins", sans-serif', 
        fontSize: '1.5rem'
      }}>
        Inventory Management System
      </h6>
    </div>
          
          <div className="col-md-6 d-flex align-items-center justify-content-end">
            <div className="d-flex align-items-center me-4">
              <i className="fa-regular fa-clock me-2" style={{ color: '#6c757d' }}></i>
              <span style={{ fontSize: '14px', color: '#6c757d', marginright:'8px' }}>
                Login: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div 
              className="d-flex align-items-center"
              style={{ 
                padding: '6px 12px', 
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0ecff'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f6ff'}
            >
              <span 
                className="username me-2"
                style={{ 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1B74E4',
                  marginright:'5px',
                }}
              >
                Pranav Satam
              </span>
              <div style={{ 
                height: '36px', 
                width: '36px', 
                border: '2px solid #1B74E4',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img  
                  src="src\static\img\prfileLogo.png" 
                  alt="Profile" 
                  style={{ 
                    height: '36px', 
                    width: '36px',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;

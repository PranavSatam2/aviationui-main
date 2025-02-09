import React, { useState } from "react";

const Footer = () => {

  // Variable

  const [showModal, setShowModal] = useState(false);  //Modal Variable

  // This function open modal
  const openModal = () => 
  {
    setShowModal(true);
  };

  // This function close modal
  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <div className="">
      {/* Modal to display message  */}
      {showModal && (
        <div className="modal fade show" id="displayMsgModal" tabIndex="-1" role="dialog" aria-labelledby="displayMsgModalLabel" aria-hidden="true" style={{ display: 'block' }} >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="displayMsgModalLabel">Modal title</h5>
                <button type="button" className="close" onClick={closeModal} aria-label="Close" >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>...</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}> Close </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Start */}
      <footer className="bg-white text-light p-0 fixed-bottom" style={{ zIndex: 10 }}>
        <div className="container text-center text-dark">
          <p className="mt-2">&copy; 2025 <span className="font-weight-bold" style={{ color: 'black' }}>AMC Technology</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>

  );
};

export default Footer;
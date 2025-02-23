import React, { useState, useImperativeHandle, forwardRef } from 'react';

const MyModalComponent = forwardRef(({ modalTitle, modalBodyContent, buttonLabel }, ref) => {
  const [showModal, setShowModal] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Exposing functions to the parent using `useImperativeHandle`
  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <>
      {/* Modal */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        id="displayMsgModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="displayMsgModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? 'block' : 'none' }}  
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="displayMsgModalLabel">
                {modalTitle || "Modal Title"}
              </h5>
              <button
                type="button"
                className="close"
                onClick={closeModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{modalBodyContent || "Default Modal Body"}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default MyModalComponent;

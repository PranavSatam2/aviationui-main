const GeneralTab = ({
  dataMap,
  handleChange,
  validateDataType,
  validateLen,
  errors,
  disabledField
}) => {
  function validateMailId(event) {
    const email = event.target.value;
    const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailValidator.test(email)) {
      event.target.classList.add("is-invalid");
      event.target.classList.remove("is-valid");
    } else {
      event.target.classList.remove("is-invalid");
      event.target.classList.add("is-valid");
    }
  }

  return (
    <div className="m-2 p-2 mt-2">
      {/* Supplier/Sub-Contractor Details */}
      <div className="col-md-12 mb-1 d-flex">
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-6 pt-2" htmlFor="supplierName">
              Supplier/Sub-Contractor Name
              <span className="text-danger mx-1 " style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="text"
              name="supplierName"
              id="supplierName"
              placeholder="Supplier/Sub-Contractor Name"
              value={dataMap.supplierName}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "A");
                validateLen(event, 0, 50);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.supplierName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.supplierName}
            </div>
          )}
        </div>

        {/* <div className="col-md-6 ">
                        <div className="row">
                            <label className="col-md-4 pt-2" 
                                htmlFor="name">Form 
                                <span 
                                    className="text-danger mx-1 " 
                                    style={{fontSize : '17px'}}>*
                                </span>
                            </label>
                            <input 
                                className="col-md-8 form-control" 
                                type="text" 
                                name="formNum" 
                                id="formNum" 
                                placeholder="Form Number" 
                                value={dataMap.formId } 
                                onChange={handleChange} 
                                onInput={(event) => {validateDataType(event, 'ANS'); validateLen(event, 0, 10);}}/>
                        </div>
                    </div> */}
      </div>

      <hr className="mx-0 my-2 p-0 border" />

      {/* Contact Details */}
      <div className="col-md-12 d-flex mb-1" style={{justifyContent:'space-between'}}>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="phoneNumber">
              Phone Number
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="number"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="Phone Number"
              value={dataMap.phoneNumber}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "N");
                validateLen(event, 10, 10);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.phoneNumber && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.phoneNumber}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="faxNum">
              Fax Number
            </label>
            <input
              className="col-md-8 form-control"
              type="number"
              name="faxNum"
              id="faxNum"
              placeholder="Fax Number"
              value={dataMap.faxNum}
              onChange={handleChange}
              disabled={disabledField}
            />
          </div>
        </div>
      </div>

      {/* Email & Address */}
      <div className="col-md-12 d-flex mb-3" style={{justifyContent:'space-between'}}>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="email">
              Email ID
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="email"
              name="email"
              id="email"
              placeholder="Email ID"
              value={dataMap.email}
              onChange={handleChange}
              onInput={(event) => {
                validateMailId(event);
              }}
              required
              disabled={disabledField}
            />
          </div>
          {errors.email && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.email}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="address">
              Address
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="text"
              name="address"
              id="address"
              placeholder="Address"
              value={dataMap.address}
              onChange={handleChange}
              onInput={(event) => {
                validateLen(event, 1, 150);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.address && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.address}
            </div>
          )}
        </div>
      </div>

      <hr className="mx-0 my-2 p-0 border " />

      {/* Quality Manager Details */}
      <h5 className="mb-3 fw-bold text-dark" >Quality Manager Details</h5>
      <div className="col-md-12 d-flex"  style={{justifyContent:'space-between'}}>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="qualityManagerName">
              Name
              <span className="text-danger mx-1 " style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="text"
              name="qualityManagerName"
              id="qualityManagerName"
              placeholder="Quality Manager Name"
              value={dataMap.qualityManagerName}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "A");
                validateLen(event, 0, 30);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.qualityManagerName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerName}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label
              className="col-md-4 pt-2"
              htmlFor="qualityManagerPhoneNumber"
            >
              Phone Number
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="number"
              name="qualityManagerPhoneNumber"
              id="qualityManagerPhoneNumber"
              placeholder="Quality Manager Number"
              value={dataMap.qualityManagerPhoneNumber}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "N");
                validateLen(event, 0, 10);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.qualityManagerPhoneNumber && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerPhoneNumber}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-12">
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="qualityManagerEmailId">
              Email ID
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="email"
              name="qualityManagerEmailId"
              id="qualityManagerEmailId"
              placeholder="Quality Manager Email"
              value={dataMap.qualityManagerEmailId}
              onChange={handleChange}
              onInput={(event) => {
                validateMailId(event);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.qualityManagerEmailId && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerEmailId}
            </div>
          )}
        </div>
      </div>

      <hr className="mx-0 my-2 p-0 border " />

      {/* Sales Representative Details */}
      <h5 className="mb-3 fw-bold text-dark">Sales Representative Details</h5>
      <div className="col-md-12 d-flex"  style={{justifyContent:'space-between'}}>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="saleRepresentativeName">
              Name
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="text"
              name="saleRepresentativeName"
              id="saleRepresentativeName"
              placeholder="Sales Representative Name"
              value={dataMap.saleRepresentativeName}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "A");
                validateLen(event, 0, 100);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.saleRepresentativeName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativeName}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label
              className="col-md-4 pt-2"
              htmlFor="saleRepresentativeEmailId"
            >
              Email ID
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="email"
              name="saleRepresentativeEmailId"
              id="saleRepresentativeEmailId"
              placeholder="Sales Representative Email"
              value={dataMap.saleRepresentativeEmailId}
              onChange={handleChange}
              onInput={(event) => {
                validateMailId(event);
              }}
              disabled={disabledField}
              required
            />
          </div>
          {errors.saleRepresentativeEmailId && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativeEmailId}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-12 mb-2">
        <div className="col-md-5">
          <div className="row">
            <label
              className="col-md-4 pt-2"
              htmlFor="saleRepresentativePhoneNumber"
            >
              Phone Number
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control"
              type="number"
              name="saleRepresentativePhoneNumber"
              id="saleRepresentativePhoneNumber"
              placeholder="Sales Representative Number"
              value={dataMap.saleRepresentativePhoneNumber}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "N");
                validateLen(event, 10, 10);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.saleRepresentativePhoneNumber && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativePhoneNumber}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;

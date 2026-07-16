const MaterialAndOther = ({
  dataMap,
  handleChange,
  validateDataType,
  actionPerformed,
  errors,
  disabledField,
}) => {
  return (
    <div className="row m-2 p-2 mt-4">
      {/* --- Are equipment calibrated? --- */}
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Are equipment calibrated?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex align-items-center">
              {["Yes", "No", "N/A"].map((val, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`equipCalibrated_${val}`}
                    name="equipCalibrated"
                    value={val}
                    checked={dataMap.equipCalibrated === val}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`equipCalibrated_${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
              {errors.equipCalibrated && (
                <div style={{ color: "red" }}>{errors.equipCalibrated}</div>
              )}
            </div>
          </div>
        </div>

        {/* --- Are gauges certified? --- */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Are gauges and test equipment periodically certified, and are
              records maintained for frequency of recalibration?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex align-items-center">
              {["Yes", "No", "N/A"].map((val, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`recalibration_${val}`}
                    name="recalibration"
                    value={val}
                    checked={dataMap.recalibration === val}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`recalibration_${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
              {errors.recalibration && (
                <div style={{ color: "red" }}>{errors.recalibration}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Are gauges available and sufficient? --- */}
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Are gauges, test equipment available and sufficient for our scope
              of work?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex align-items-center">
              {["Yes", "No", "N/A"].map((val, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`scopeOfWork_${val}`}
                    name="scopeOfWork"
                    value={val}
                    checked={dataMap.scopeOfWork === val}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`scopeOfWork_${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
              {errors.scopeOfWork && (
                <div style={{ color: "red" }}>{errors.scopeOfWork}</div>
              )}
            </div>
          </div>
        </div>

        {/* --- Safety program --- */}
        <div className="row mt-2">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is there adequate area & safety programs in place?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex align-items-center">
              {["Yes", "No", "N/A"].map((val, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`safetyProgram_${val}`}
                    name="safetyProgram"
                    value={val}
                    checked={dataMap.safetyProgram === val}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`safetyProgram_${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
              {errors.safetyProgram && (
                <div style={{ color: "red" }}>{errors.safetyProgram}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Housekeeping --- */}
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is there a procedure in place for housekeeping?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex align-items-center">
              {["Yes", "No", "N/A"].map((val, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`houseKeeping_${val}`}
                    name="houseKeeping"
                    value={val}
                    checked={dataMap.houseKeeping === val}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`houseKeeping_${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
              {errors.houseKeeping && (
                <div style={{ color: "red" }}>{errors.houseKeeping}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialAndOther;

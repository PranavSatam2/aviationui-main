const MaterialAndOther = ({
  dataMap,
  handleChange,
  validateDataType,
  actionPerformed,
  errors,
}) => {
  return (
    <div className="row m-2 p-2 mt-4">
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-7">
              Are equipment calibrated?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="equipCalibrated1"
                  name="equipCalibrated"
                  value="Yes"
                  checked={dataMap.equipCalibrated === "Yes"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="equipCalibrated1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="equipCalibrated2"
                  name="equipCalibrated"
                  value="No"
                  checked={dataMap.equipCalibrated === "No"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="equipCalibrated2"
                >
                  No
                </label>
              </div>
              {errors.equipCalibrated && (
                <div style={{ color: "red" }}>{errors.equipCalibrated}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-7">
              Are gauges and test equipment periodically certified, and are
              records maintained for frequency of recalibration?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="recalibration1"
                  name="recalibration"
                  value="Yes"
                  checked={dataMap.recalibration === "Yes"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="recalibration1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="recalibration2"
                  name="recalibration"
                  value="No"
                  checked={dataMap.recalibration === "No"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="recalibration2"
                >
                  No
                </label>
              </div>
              {errors.recalibration && (
                <div style={{ color: "red" }}>{errors.recalibration}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-7">
              Are gauges, test equipment available and sufficient for our scope
              of work?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="scopeOfWork1"
                  name="scopeOfWork"
                  value="Yes"
                  checked={dataMap.scopeOfWork === "Yes"}
                  onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="scopeOfWork1">
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="scopeOfWork2"
                  name="scopeOfWork"
                  value="No"
                  checked={dataMap.scopeOfWork === "No"}
                  onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="scopeOfWork2">
                  No
                </label>
              </div>
              {errors.scopeOfWork && (
                <div style={{ color: "red" }}>{errors.scopeOfWork}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-7">
              Is there adequate area & safety programs in place?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="safetyProgram1"
                  name="safetyProgram"
                  value="Yes"
                  checked={dataMap.safetyProgram === "Yes"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="safetyProgram1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="safetyProgram2"
                  name="safetyProgram"
                  value="No"
                  checked={dataMap.safetyProgram === "No"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="safetyProgram2"
                >
                  No
                </label>
              </div>
              {errors.safetyProgram && (
                <div style={{ color: "red" }}>{errors.safetyProgram}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-7">
              Is there a procedure in place for housekeeping?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="houseKeeping1"
                  name="houseKeeping"
                  value="Yes"
                  checked={dataMap.houseKeeping === "Yes"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="houseKeeping1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="houseKeeping2"
                  name="houseKeeping"
                  value="No"
                  checked={dataMap.houseKeeping === "No"}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="houseKeeping2"
                >
                  No
                </label>
              </div>
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

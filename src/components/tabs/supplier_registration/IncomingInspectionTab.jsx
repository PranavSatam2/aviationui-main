const IncomingInspectionTab = ({
  dataMap,
  handleChange,
  validateDataType,
  errors,
  disabledField,
}) => {
  return (
    <div className="row m-2 p-2 mt-4">
      {/* ------------------------ Q1 ------------------------ */}
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is the incoming process documented?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`processDocumented_${option}`}
                    name="processDocumented"
                    value={option}
                    checked={dataMap.processDocumented === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`processDocumented_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.processDocumented && (
                <div style={{ color: "red" }}>{errors.processDocumented}</div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------ Q2 ------------------------ */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              What sampling plan is used for incoming inspection?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`samplingIncomingInsp_${option}`}
                    name="samplingIncomingInsp"
                    value={option}
                    checked={dataMap.samplingIncomingInsp === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`samplingIncomingInsp_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.samplingIncomingInsp && (
                <div style={{ color: "red" }}>{errors.samplingIncomingInsp}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------ Q3 ------------------------ */}
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is Objective evidence of receiving inspection results maintained
              in file?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`receivingInspectionResultsOnFile_${option}`}
                    name="receivingInspectionResultsOnFile"
                    value={option}
                    checked={dataMap.receivingInspectionResultsOnFile === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`receivingInspectionResultsOnFile_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.receivingInspectionResultsOnFile && (
                <div style={{ color: "red" }}>
                  {errors.receivingInspectionResultsOnFile}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------ Q4 ------------------------ */}
        <div className="row mt-3">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is lot number or other traceability identification maintained?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`identificationMaintained_${option}`}
                    name="identificationMaintained"
                    value={option}
                    checked={dataMap.identificationMaintained === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`identificationMaintained_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.identificationMaintained && (
                <div style={{ color: "red" }}>
                  {errors.identificationMaintained}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------ Q5 ------------------------ */}
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is incoming material kept separate from inspected material?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`sepInsMaterial_${option}`}
                    name="sepInsMaterial"
                    value={option}
                    checked={dataMap.sepInsMaterial === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`sepInsMaterial_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.sepInsMaterial && (
                <div style={{ color: "red" }}>{errors.sepInsMaterial}</div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------ Q6 ------------------------ */}
        <div className="row mt-3">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Is there any procedure for isolating nonconforming material?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`nonConMaterial_${option}`}
                    name="nonConMaterial"
                    value={option}
                    checked={dataMap.nonConMaterial === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`nonConMaterial_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.nonConMaterial && (
                <div style={{ color: "red" }}>{errors.nonConMaterial}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------ Q7 ------------------------ */}
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8">
              Are deviations that affect the customer's requirement referred to
              customers for disposition?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map((option, idx) => (
                <div className="form-check mx-3 p-0" key={idx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`affectCusReq_${option}`}
                    name="affectCusReq"
                    value={option}
                    checked={dataMap.affectCusReq === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`affectCusReq_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.affectCusReq && (
                <div style={{ color: "red" }}>{errors.affectCusReq}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingInspectionTab;

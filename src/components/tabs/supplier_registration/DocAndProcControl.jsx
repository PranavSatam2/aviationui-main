const DocAndProcControl = ({
  dataMap,
  handleChange,
  validateDataType,
  errors,
  disabledField
}) => {
  return (
    <div className="row m-2 p-2">
      <div className="col-md-12">
        {/* 1️⃣ Written Work Instructions */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8 px-2 py-1">
              Are written work instructions available at work stations?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map(option => (
                <div key={option} className="form-check mx-3 p-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`writtenWorkInstructionsAvaibleInStation_${option}`}
                    name="writtenWorkInstructionsAvaibleInStation"
                    value={option}
                    checked={
                      dataMap.writtenWorkInstructionsAvaibleInStation === option
                    }
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`writtenWorkInstructionsAvaibleInStation_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.writtenWorkInstructionsAvaibleInStation && (
                <div style={{ color: "red" }}>
                  {errors.writtenWorkInstructionsAvaibleInStation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2️⃣ Final Inspection Evidence */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8 px-2 py-1">
              Does the finished product show evidence of final inspection
              acceptance?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map(option => (
                <div key={option} className="form-check mx-3 p-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`finalInspectionEvidence_${option}`}
                    name="finalInspectionEvidence"
                    value={option}
                    checked={dataMap.finalInspectionEvidence === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`finalInspectionEvidence_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.finalInspectionEvidence && (
                <div style={{ color: "red" }}>
                  {errors.finalInspectionEvidence}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3️⃣ Statistical Methods */}
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8 px-2 py-1">
              Are statistical methods used to control the process?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map(option => (
                <div key={option} className="form-check mx-3 p-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`statisMethod_${option}`}
                    name="statisMethod"
                    value={option}
                    checked={dataMap.statisMethod === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`statisMethod_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.statisMethod && (
                <div style={{ color: "red" }}>{errors.statisMethod}</div>
              )}
            </div>
          </div>
        </div>

        {/* 4️⃣ Supplied Document */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-8 px-2 py-1">
              Are procedures in place for control of customer-supplied documents?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              {["Yes", "No", "N/A"].map(option => (
                <div key={option} className="form-check mx-3 p-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`suppliedDocument_${option}`}
                    name="suppliedDocument"
                    value={option}
                    checked={dataMap.suppliedDocument === option}
                    onChange={handleChange}
                    disabled={disabledField}
                  />
                  <label
                    className="form-check-label pt-1"
                    htmlFor={`suppliedDocument_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
              {errors.suppliedDocument && (
                <div style={{ color: "red" }}>{errors.suppliedDocument}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5️⃣ Include Method */}
      <div className="col-md-12">
        {[
          {
            key: "includeMethod",
            label:
              "Does range procedure include a method for handling revision changes & obsolete documents?"
          },
          {
            key: "qualityCapabilities",
            label:
              "Are quality capabilities of suppliers evaluated prior to procurement?"
          },
          {
            key: "approvedSupplierList",
            label: "Do you have an approved supplier list?"
          },
          {
            key: "marketPrice",
            label: "Is the supplier competent with respect to market price?"
          },
          {
            key: "certifiedTestReports",
            label:
              "Are certified test reports & certifications of conformance obtained on purchased material?"
          },
          {
            key: "supplierOnTimeDelivery",
            label: "Is the supplier capable of on-time delivery?"
          }
        ].map(({ key, label }) => (
          <div className="row" key={key}>
            <div className="col-md-12 d-flex">
              <label className="col-form-label col-md-8 px-2 py-1">
                {label}
                <span
                  className="text-danger mx-1"
                  style={{ fontSize: "17px" }}
                >
                  *
                </span>
              </label>
              <div className="d-flex">
                {["Yes", "No", "N/A"].map(option => (
                  <div key={option} className="form-check mx-3 p-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`${key}_${option}`}
                      name={key}
                      value={option}
                      checked={dataMap[key] === option}
                      onChange={handleChange}
                      disabled={disabledField}
                    />
                    <label
                      className="form-check-label pt-1"
                      htmlFor={`${key}_${option}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
                {errors[key] && (
                  <div style={{ color: "red" }}>{errors[key]}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocAndProcControl;

import React from "react";

const SupplierAnalysisTab = ({
  dataMap,
  handleChange,
  validateDataType,
  validateLen,
  errors,
  disabledField,
}) => {
  return (
    <div className="container-fluid p-3">
      <div className="row g-3">
        {/* ✅ Left Column */}
        <div className="col-md-6">
          {/* Core Product / Process */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              What are your core product/process{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              placeholder="Enter here"
              type="text"
              name="coreProcess"
              className="form-control uniform-input"
              value={dataMap.coreProcess}
              onChange={handleChange}
              onInput={(e) => validateDataType(e, "ANS")}
              disabled={disabledField}
            />
          </div>
          {errors.coreProcess && (
            <div className="text-end text-danger small">
              {errors.coreProcess}
            </div>
          )}

          {/* ISO Registered */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              ISO Registered <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4 align-items-center">
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="isoRegisteredYes"
                  name="isoRegistered"
                  value="Yes"
                  checked={dataMap.isoRegistered === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="isoRegisteredYes" className="form-check-label">
                  Yes
                </label>
              </div>
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="isoRegisteredNo"
                  name="isoRegistered"
                  value="No"
                  checked={dataMap.isoRegistered === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="isoRegisteredNo" className="form-check-label">
                  No
                </label>
              </div>
            </div>
          </div>
          {errors.isoRegistered && (
            <div className="text-end text-danger small">
              {errors.isoRegistered}
            </div>
          )}

          {/* CAR 145 / DGCA Approval */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              CAR 145 / DGCA Approved <span className="text-danger"></span>
            </label>
            <div className="d-flex gap-4 align-items-center">
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="carDgcaYes"
                  name="carDgcaApproval"
                  value="Yes"
                  checked={dataMap.carDgcaApproval === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="carDgcaYes" className="form-check-label">
                  Yes
                </label>
              </div>
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="carDgcaNo"
                  name="carDgcaApproval"
                  value="No"
                  checked={dataMap.carDgcaApproval === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="carDgcaNo" className="form-check-label">
                  No
                </label>
              </div>
            </div>
          </div>
          {errors.carDgcaApproval && (
            <div className="text-end text-danger small">
              {errors.carDgcaApproval}
            </div>
          )}

          {/* Quality Manual */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Quality Manuals <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4 align-items-center">
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="quaManualYes"
                  name="quaManual"
                  value="Yes"
                  checked={dataMap.quaManual === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="quaManualYes" className="form-check-label">
                  Yes
                </label>
              </div>
              <div className="form-check d-flex align-items-center m-0">
                <input
                  className="form-check-input me-2"
                  type="radio"
                  id="quaManualNo"
                  name="quaManual"
                  value="No"
                  checked={dataMap.quaManual === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label htmlFor="quaManualNo" className="form-check-label">
                  No
                </label>
              </div>
            </div>
          </div>
          {errors.quaManual && (
            <div className="text-end text-danger small">{errors.quaManual}</div>
          )}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              ISO Certificate
            </label>
            <input
              type="text"
              name="isoCertificate"
              placeholder="Enter here"
              className="form-control uniform-input"
              value={dataMap.isoCertificate}
              onChange={handleChange}
              onInput={(e) => validateDataType(e, "ANS-")}
              disabled={disabledField}
            />
          </div>
          {errors.isoCertificate && (
            <div className="text-end text-danger small">
              {errors.isoCertificate}
            </div>
          )}
        </div>

        {/* ✅ Right Column */}
        <div className="col-md-6">
          {/* Years in Business */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Years in Business
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              placeholder="Enter here"
              type="number"
              name="workYear"
              className="form-control uniform-input"
              value={dataMap.workYear}
              onChange={handleChange}
              onInput={(e) => {
                validateDataType(e, "N");
                validateLen(e, 0, 4);
              }}
              disabled={disabledField}
            />
          </div>

          {/* ISO Standard (text input now) */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              ISO Standard <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="isoStandard"
              placeholder="Enter here"
              className="form-control uniform-input"
              value={dataMap.isoStandard}
              onChange={handleChange}
              onInput={(e) => validateDataType(e, "ANS-")}
              disabled={disabledField}
            />
          </div>
          {errors.isoStandard && (
            <div className="text-end text-danger small">
              {errors.isoStandard}
            </div>
          )}

          {/* Registration Plans */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Registration Plans
            </label>
            <input
              placeholder="Enter here"
              type="text"
              name="isoRegistrationPlans"
              className="form-control uniform-input"
              value={dataMap.isoRegistrationPlans}
              onChange={handleChange}
              onInput={(e) => {
                validateDataType(e, "ANS");
                validateLen(e, 1, 50);
              }}
              disabled={disabledField}
            />
          </div>

          {/* Number of Employees */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Total Employees
            </label>
            <input
              placeholder="Enter here"
              type="number"
              name="numEmp"
              className="form-control uniform-input"
              value={dataMap.numEmp}
              onChange={handleChange}
              onInput={(e) => validateDataType(e, "N")}
              disabled={disabledField}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Operating Shifts */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Operating Shifts
            </label>
            <input
              placeholder="Enter here"
              type="number"
              name="numOpeShift"
              className="form-control uniform-input"
              value={dataMap.numOpeShift}
              onChange={handleChange}
              onInput={(e) => validateDataType(e, "N")}
              disabled={disabledField}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Annual Turnover */}
          <div className="mb-3 d-flex align-items-center">
            <label className="col-md-5 col-form-label text-end pe-2">
              Annual Turnover <span className="text-danger">*</span>
            </label>
            <input
              placeholder="Enter here"
              type="number"
              name="turnOver"
              className="form-control uniform-input"
              value={dataMap.turnOver}
              onChange={handleChange}
              onInput={(e) => {
                  validateDataType(e, "N");
                      validateLen(e,1,15);
              }}
              disabled={disabledField}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          {errors.turnOver && (
            <div className="text-end text-danger small">{errors.turnOver}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalysisTab;

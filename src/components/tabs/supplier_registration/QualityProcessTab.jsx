const QualityProcessTab = ({
  dataMap,
  handleChange,
  validateDataType,
  errors,
  disabledField
}) => {
  return (
    <div className="row m-2 p-2 mt-4">
      <div className="col-md-12 mb-0">
        <div className="col-md-12 d-flex">
          <label className="col-form-label col-md-9 px-0">
            Does quality assurance have independence from manufacturing?
            <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
              *
            </span>
          </label>
          <div className="d-flex pl-1">
            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="independenceManuf1"
                name="independenceManuf"
                value="Yes"
                checked={dataMap.independenceManuf === "Yes"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label
                className="form-check-label pt-1"
                htmlFor="independenceManuf1"
              >
                Yes
              </label>
            </div>

            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="independenceManuf2"
                name="independenceManuf"
                value="No"
                checked={dataMap.independenceManuf === "No"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label
                className="form-check-label pt-1"
                htmlFor="independenceManuf2"
              >
                No
              </label>
            </div>
            {errors.independenceManuf && (
              <div style={{ color: "red" }}>{errors.independenceManuf}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-9">
              Do you have a documented operative system for internal and
              external corrective and preventive action?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="documentedOperative1"
                  name="documentedOperative"
                  value="Yes"
                  checked={dataMap.documentedOperative === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="documentedOperative1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="documentedOperative2"
                  name="documentedOperative"
                  value="No"
                  checked={dataMap.documentedOperative === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="documentedOperative2"
                >
                  No
                </label>
              </div>
              {errors.documentedOperative && (
                <div style={{ color: "red" }}>{errors.documentedOperative}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 mb-3">
        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-9">
              Are there documented procedures for identification, collation,
              filing, storage, & maintenance of quality records?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="documentedProcedure1"
                  name="documentedProcedure"
                  value="Yes"
                  checked={dataMap.documentedProcedure === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="documentedProcedure1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="documentedProcedure2"
                  name="documentedProcedure"
                  value="No"
                  checked={dataMap.documentedProcedure === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="documentedProcedure2"
                >
                  No
                </label>
              </div>
              {errors.documentedProcedure && (
                <div style={{ color: "red" }}>{errors.documentedProcedure}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-9">
              Does your system assure that products shipped meet customer
              applicable revision of specifications?
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="d-flex">
              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="productShipment1"
                  name="productShipment"
                  value="Yes"
                  checked={dataMap.productShipment === "Yes"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="productShipment1"
                >
                  Yes
                </label>
              </div>

              <div className="form-check mx-3 p-0">
                <input
                  className="form-check-input"
                  type="radio"
                  id="productShipment2"
                  name="productShipment"
                  value="No"
                  checked={dataMap.productShipment === "No"}
                  onChange={handleChange}
                  disabled={disabledField}
                />
                <label
                  className="form-check-label pt-1"
                  htmlFor="productShipment2"
                >
                  No
                </label>
              </div>
              {errors.productShipment && (
                <div style={{ color: "red" }}>{errors.productShipment}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityProcessTab;

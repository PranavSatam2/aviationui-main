

const QualityProcessTab = ({dataMap, handleChange, validateDataType}) =>
{
    return (
        <div className="row m-2 p-2 mt-4">
            <div className="col-md-12 mb-3">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does quality assurance have independence form manufacture</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="independenceManuf1" name="independenceManuf" value={dataMap.independenceManuf} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="independenceManuf1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="independenceManuf2" name="independenceManuf" value={dataMap.independenceManuf} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="independenceManuf2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Do you have documented operative system for internal and external corrective and preventive action</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedOperative1" name="documentedOperative" value={dataMap.documentedOperative} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedOperative1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedOperative2" name="documentedOperative" value={dataMap.documentedOperative} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedOperative2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-3">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are there documented procedure for identification, colation, filling, storage, & maintenance of quality record</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedProcedure1" name="documentedProcedure" value={dataMap.documentedProcedure} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedProcedure1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedProcedure2" name="documentedProcedure" value={dataMap.documentedProcedure} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedProcedure2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does your system assured that product shipped meet customer applicable revision of specification</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="productShipment1" name="productShipment" value={dataMap.productShipment} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="productShipment1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="productShipment2" name="productShipment" value={dataMap.productShipment} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="productShipment2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default QualityProcessTab
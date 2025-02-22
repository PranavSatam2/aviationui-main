

const QualityProcessTab = ({dataMap, handleChange, validateDataType}) =>
{
    return (
        <div className="row m-2 p-2 mt-4">
<<<<<<< Updated upstream
            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does quality assurance have independence form manufacture <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="independenceManuf1" name="independenceManuf" value={dataMap.independenceManuf} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="independenceManuf1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="independenceManuf2" name="independenceManuf" value={dataMap.independenceManuf} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="independenceManuf2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="independenceManuf3" name="independenceManuf" value={dataMap.independenceManuf} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="independenceManuf3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Do you have documented operative system for internal and external corrective and preventive action <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedOperative1" name="documentedOperative" value={dataMap.documentedOperative} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedOperative1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedOperative2" name="documentedOperative" value={dataMap.documentedOperative} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedOperative2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedOperative3" name="documentedOperative" value={dataMap.documentedOperative} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedOperative3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are there documented procedure for identification, colation, filling, storage, & maintenance of quality record <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedProcedure1" name="documentedProcedure" value={dataMap.documentedProcedure} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedProcedure1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedProcedure2" name="documentedProcedure" value={dataMap.documentedProcedure} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedProcedure2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="documentedProcedure3" name="documentedProcedure" value={dataMap.documentedProcedure} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="documentedProcedure3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does your system assured that product shipped meet customer applicable revision of specification <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="productShipment1" name="productShipment" value={dataMap.productShipment} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="productShipment1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="productShipment2" name="productShipment" value={dataMap.productShipment} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="productShipment2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="productShipment3" name="productShipment" value={dataMap.productShipment} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="productShipment3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
=======
            <div className="col-md-12 mb-3">
            <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="independenceManuf">
            Does quality assurance have independence from manufacturing?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="independenceManuf"
                    name="independenceManuf"
                    value="Yes" 
                    checked={dataMap.independenceManuf === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="independenceManuf" >Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="independenceManuf"
                    name="independenceManuf"
                    value="No" 
                    checked={dataMap.independenceManuf === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="independenceManuf">No</label>
            </div>
        </div>
    </div>
                <div className="row">
    <div className="col-md-12 d-flex">
        <label className="col-form-label col-md-6" htmlFor="documentedOperative">
            Do you have a documented operative system for internal and external corrective and preventive action?
        </label>
        <div className="d-flex">
            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="documentedOperative" 
                    name="documentedOperative" 
                    value="Yes" 
                    checked={dataMap.documentedOperative === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="documentedOperative">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="documentedOperative" 
                    name="documentedOperative" 
                    value="No" 
                    checked={dataMap.documentedOperative === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="documentedOperative">No</label>
            </div>
        </div>
    </div>
</div>

            </div>

           <div className="col-md-12 mb-3">
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="documentedProcedure">
                Are there documented procedures for identification, collation, filing, storage, & maintenance of quality records?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="documentedProcedure" 
                        name="documentedProcedure" 
                        value="Yes" 
                        checked={dataMap.documentedProcedure === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="documentedProcedure">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="documentedProcedure" 
                        name="documentedProcedure" 
                        value="No" 
                        checked={dataMap.documentedProcedure === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="documentedProcedure">No</label>
>>>>>>> Stashed changes
                </div>
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" htmlFor="productShipment">
                Does your system assure that products shipped meet customer applicable revision of specifications?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="productShipment" 
                        name="productShipment" 
                        value="Yes" 
                        checked={dataMap.productShipment === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="productShipment">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="productShipment" 
                        name="productShipment" 
                        value="No" 
                        checked={dataMap.productShipment === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="productShipment">No</label>
                </div>
            </div>
        </div>
    </div>
</div>


        </div>
    )
}

export default QualityProcessTab
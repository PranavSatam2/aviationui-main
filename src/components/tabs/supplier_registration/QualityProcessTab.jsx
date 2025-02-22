

const QualityProcessTab = ({dataMap, handleChange, validateDataType}) =>
    {
        return (
            <div className="row m-2 p-2 mt-4">
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
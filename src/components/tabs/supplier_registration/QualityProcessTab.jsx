

const QualityProcessTab = ({dataMap, handleChange, validateDataType}) =>
    {
        return (
            <div className="row m-2 p-2 mt-4">
                <div className="col-md-12 mb-3">
                <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6">
                Does quality assurance have independence from manufacturing?
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="independenceManuf1"
                        name="independenceManuf"
                        value="Yes" 
                        checked={dataMap.independenceManuf === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="independenceManuf1" >Yes</label>
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
                    />
                    <label className="form-check-label pt-1" htmlFor="independenceManuf2">No</label>
                </div>
            </div>
        </div>
                    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6" >
                Do you have a documented operative system for internal and external corrective and preventive action?
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
                    />
                    <label className="form-check-label pt-1" htmlFor="documentedOperative1">Yes</label>
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
                    />
                    <label className="form-check-label pt-1" htmlFor="documentedOperative2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
               <div className="col-md-12 mb-3">
        <div className="row">
            <div className="col-md-12 d-flex">
                <label className="col-form-label col-md-6">
                    Are there documented procedures for identification, collation, filing, storage, & maintenance of quality records?
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
                        />
                        <label className="form-check-label pt-1" htmlFor="documentedProcedure1">Yes</label>
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
                        />
                        <label className="form-check-label pt-1" htmlFor="documentedProcedure2">No</label>
                    </div>
                </div>
            </div>
        </div>
    
        <div className="row">
            <div className="col-md-12 d-flex">
                <label className="col-form-label col-md-6" >
                    Does your system assure that products shipped meet customer applicable revision of specifications?
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
                        />
                        <label className="form-check-label pt-1" htmlFor="productShipment1">Yes</label>
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
                        />
                        <label className="form-check-label pt-1" htmlFor="productShipment2">No</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
            </div>
        )
    }
    
    export default QualityProcessTab
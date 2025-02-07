

const DocAndProcControl = ({dataMap, handleChange, validateDataType}) => 
{
    return (
        <div className="row m-2 p-2 mt-4">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="processDocumented">Are written work instructions available at work stations</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="instructionStation1" name="instructionStation" value={dataMap.instructionStation} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="instructionStation1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="instructionStation2" name="instructionStation" value={dataMap.instructionStation} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="instructionStation2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does finish product shows evidence of final inspection acceptance </label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="finalInsAcc1" name="finalInsAcc" value={dataMap.finalInsAcc} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="finalInsAcc1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="finalInsAcc2" name="finalInsAcc" value={dataMap.finalInsAcc} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="finalInsAcc2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are statistical methods is use to control the process</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="statisMethod1" name="statisMethod" value={dataMap.statisMethod} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="statisMethod1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="statisMethod2" name="statisMethod" value={dataMap.statisMethod} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="statisMethod2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6">Are procedures in place for control of customers supplied documents</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="suppliedDocument1" name="suppliedDocument" value={dataMap.suppliedDocument} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="suppliedDocument1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="suppliedDocument2" name="suppliedDocument"  value={dataMap.suppliedDocument} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="suppliedDocument2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Does rage procedure include method for handling revision change & absolute documents</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="includeMethod1" name="includeMethod"  value={dataMap.includeMethod} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="includeMethod1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="includeMethod2" name="includeMethod"  value={dataMap.includeMethod} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="includeMethod2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are Quality capabilities of suppliers evaluated prior to procurement</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="qualityCapabilities1" name="qualityCapabilities" value={dataMap.qualityCapabilities} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="qualityCapabilities1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="qualityCapabilities2" name="qualityCapabilities" value={dataMap.qualityCapabilities} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="qualityCapabilities2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6">Do you have approved supplier list</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="approvedSupplier1" name="approvedSupplier" value={dataMap.approvedSupplier} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="approvedSupplier1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="approvedSupplier2" name="approvedSupplier" value={dataMap.approvedSupplier} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="approvedSupplier2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6">is Supplier competent with respect to market to market price</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="marketPrice1" name="marketPrice" value={dataMap.marketPrice} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="marketPrice1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="marketPrice2" name="marketPrice" value={dataMap.marketPrice} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="marketPrice2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are Certified test reports & certifications of conformance obtained on purchased material</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="certifiedReport1" name="certifiedReport" value={dataMap.certifiedReport} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="certifiedReport1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="certifiedReport2" name="certifiedReport" value={dataMap.certifiedReport} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="certifiedReport2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">is Supplier capable for in time delivery</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="supplierCapable1" name="supplierCapable" value={dataMap.supplierCapable} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="supplierCapable1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="supplierCapable2" name="supplierCapable" value={dataMap.supplierCapable} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="supplierCapable2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocAndProcControl
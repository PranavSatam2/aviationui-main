const GeneralTab = () => {
    return (
        <fieldset className="border border-dark rounded-lg m-2 p-2" style={{ height: '380px', overflowY: 'auto' }}>
            <legend className="w-auto text-dark fs-5 px-2 " style={{ fontWeight: 'bold', fontSize: '1rem' }}>General Information </legend>

            <div className="col-md-12">
                <div className="col-md-6 ">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="name">Supplier/Sub-Contractor name</label>
                        <input className="col-md-8 form-control" type="text" name="name" id="name" placeholder="Full Name" />
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="phoneNum">Phone Number</label>
                        <input className="col-md-8 form-control" type="number" name="phoneNum" id="phoneNum" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="faxNum">Fax Number</label>
                        <input className="col-md-8 form-control" type="number" name="faxNum" id="faxNum" />
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="email">Email Id</label>
                        <input className="col-md-8 form-control" type="email" name="email" id="email" required/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="address">Address</label>
                        <input className="col-md-8 form-control" type="text" name="address" id="address" />
                    </div>
                </div>
            </div>

            <hr className="m-0 my-4 p-0 border "/>

            <div className="col-md-12 d-flex">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qualityManager">Quality Manager</label>
                        <input className="col-md-8 form-control" type="text" name="qualityManager" id="qualityManager" placeholder=""/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="qmPhoneNum">Phone Number</label>
                        <input className="col-md-8 form-control" type="number" name="qmPhoneNum" id="qmPhoneNum" />
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex">
                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2" htmlFor="qmEmail">Email Id</label>
                        <input className="col-md-8 form-control" type="text" name="qmEmail" id="qmEmail" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <label className="col-md-4 pt-2 text-start pl-5" htmlFor="SaleResp">Sales Representative</label>
                        <input className="col-md-8 form-control" type="text" name="SaleResp" id="SaleResp" />
                    </div>
                </div>
            </div>

        </fieldset>
    );
};

export default GeneralTab;


// ############################# VALIDATION ###############################


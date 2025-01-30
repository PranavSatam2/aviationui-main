import { REST_API_BASE_URL } from "./BaseService";
import axios from "axios";

// ############## SERVICE #############################

let service_API = REST_API_BASE_URL + "/storeAcceptance"

export const liststore = () =>  axios.get(service_API);
export const createStore = (Store) => axios.post(service_API, Store);
export const deleteStore = (StoreId) => axios.delete(`${service_API}/${StoreId}`)
export const editStore = (empId, empData) => axios.put(`${service_API}/${empId}`, empData)
export const StoreDetail = (empId) => axios.get(`${service_API}/${StoreId}`)

// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login"

export const login = (loginData) => axios.post(login_API, loginData)



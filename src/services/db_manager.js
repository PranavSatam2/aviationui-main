import axios from "axios";
import { REST_API_BASE_URL } from "./base_services";


// ######################### ROUTE #########################
let STORE_URL = REST_API_BASE_URL + "/storeAcceptance"



// ######################### DB_MANAGER #########################

// Store Acceptance
export const createStore = (Store) => axios.post(STORE_URL, Store);
export const listAllStore = () =>  axios.get(`${STORE_URL}/`);
export const deleteStore = (StoreId) => axios.delete(`${STORE_URL}/${StoreId}`)
export const updateStore = (StoreId, Store) => axios.put(`${STORE_URL}/${StoreId}`, Store)
export const getStoreDetail = (StoreId) => axios.get(`${STORE_URL}/${StoreId}`)




// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login"

export const login = (loginData) => axios.post(login_API, loginData);

// ######################### Products #####################

let product_API = REST_API_BASE_URL + "/products"

export const addProducts = () => axios.get(product_API);


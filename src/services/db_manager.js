import axios from "axios";
import { REST_API_BASE_URL } from "./base_services";


// ######################### ROUTE #########################
let STORE_URL       = REST_API_BASE_URL + "/storeAcceptance"
let SUPPLIER_URL    = REST_API_BASE_URL + "/api/supplier"
let PRODUCT_URL     = REST_API_BASE_URL + "/api/product"



// ######################### DB_MANAGER #########################

// Store Acceptance
export const createStore = (Store) => axios.post(STORE_URL, Store);
export const listAllStore = () =>  axios.get(`${STORE_URL}/`);
export const deleteStore = (StoreId) => axios.delete(`${STORE_URL}/${StoreId}`)
export const updateStore = (StoreId, Store) => axios.put(`${STORE_URL}/${StoreId}`, Store)
export const getStoreDetail = (StoreId) => axios.get(`${STORE_URL}/${StoreId}`)

// Supplier Registration
// export const createSupplier = (Supplier) => axios.post(SUPPLIER_URL, Supplier);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteSupplier = (SupplierId) => axios.delete(`${SUPPLIER_URL}/${SupplierId}`)
export const updateSupplier = (SupplierId, Supplier) => axios.put(`${SUPPLIER_URL}/${SupplierId}`, Supplier)
export const getSupplierDetail = (SupplierId) => axios.get(`${SUPPLIER_URL}/${SupplierId}`)

export const listAllSupplier = () => {
    return axios.get(`${SUPPLIER_URL}/`)
      .then(response => {
        return response.data; // Return the data when the promise resolves
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error); // Handle error
        throw error; // Rethrow or handle the error
      });
  };

  export const createSupplier = (Supplier) => {
    return axios.post(`${SUPPLIER_URL}/supplierReg`,Supplier)
      .then(response => {
        return response.data; // Return the data when the promise resolves
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error); // Handle error
        throw error; // Rethrow or handle the error
      });
  };

// Product
export const createProduct = (Product) => axios.post(`${PRODUCT_URL}/create`, Product);
export const listAllProduct = () =>  axios.get(`${PRODUCT_URL}/`);
export const deleteProduct = (ProductId) => axios.delete(`${PRODUCT_URL}/${ProductId}`)
export const updateProduct = (ProductId, Product) => axios.put(`${PRODUCT_URL}/${ProductId}`, Product)
export const getProductDetail = (ProductId) => axios.get(`${PRODUCT_URL}/${ProductId}`)




// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login"

export const login = (loginData) => axios.post(login_API, loginData);

// ######################### PRODUCT #####################

let product_API = REST_API_BASE_URL + "/api/product"

// export const createProduct = (product) => axios.post(product_API, product);


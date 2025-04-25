import axios from "axios";
import { REST_API_BASE_URL } from "./base_services";
import axiosInstance from "../axiosConfig";
// ######################### ROUTE #########################
let STORE_URL = REST_API_BASE_URL + "/storeAcceptance";
let SUPPLIER_URL = REST_API_BASE_URL + "/api/supplier";
let PRODUCT_URL = REST_API_BASE_URL + "/api/product";
let MATERIAL_URL = REST_API_BASE_URL + "/api/mrn";
let MATERIAL_REQUISITION = REST_API_BASE_URL + "/api/material-requisitions";
let PURCHASE_REQUISITION = REST_API_BASE_URL + "/api/purchase-requisitions";
let PARTANDDESCRIPTION =REST_API_BASE_URL + "/api/parts"
// ######################### DB_MANAGER #########################

// Store Acceptance
export const createStore = (Store) => axiosInstance.post(STORE_URL, Store);
// export const listAllStore = () =>  axios.get(`${STORE_URL}/`);
export const deleteStore = (StoreId) => axiosInstance.delete(`${STORE_URL}/${StoreId}`);
export const updateStore = (StoreId, Store) =>
  axiosInstance.put(`${STORE_URL}/${StoreId}`, Store);
export const getStoreDetail = (StoreId) => axiosInstance.get(`${STORE_URL}/${StoreId}`);

export const listAllStore = () => {
  return axiosInstance
    .get(`${STORE_URL}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching store:", error);
      throw error;
    });
};

//Material Requisition
export const createMaterialRequisition = (Requisition) =>
  axiosInstance.post(MATERIAL_REQUISITION, Requisition);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteMaterialRequisition = (RequisitionId) =>
  axiosInstance.delete(`${MATERIAL_REQUISITION}/${RequisitionId}`);
export const updateMaterialRequisition = (RequisitionId, Requisition) =>
  axiosInstance.put(`${MATERIAL_REQUISITION}/${RequisitionId}`, Requisition);
export const getMaterialRequisitionDetail = (RequisitionId) =>
  axiosInstance.get(`${MATERIAL_REQUISITION}/${RequisitionId}`);

export const listAllMaterialRequisition = () => {
  return axiosInstance
    .get(`${MATERIAL_REQUISITION}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Material requisition:", error);
      throw error;
    });
};

//Purchase Requistion
export const createPurchaseRequisition = (Purchase) =>
  axios.post(`${PURCHASE_REQUISITION}/batch`, Purchase);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deletePurchaseRequisition = (PurchaseId) =>
  axios.delete(`${PURCHASE_REQUISITION}/${PurchaseId}`);
export const updatePurchaseRequisition = (PurchaseId, Purchase) =>
  axios.put(`${PURCHASE_REQUISITION}/${PurchaseId}`, Purchase);
export const getPurchaseRequisitionDetail = (PurchaseId) =>
  axios.get(`${PURCHASE_REQUISITION}/${PurchaseId}`);

export const listAllPurchaseRequisition = () => {
  return axiosInstance
    .get(`${PURCHASE_REQUISITION}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Purchase requisition:", error);
      throw error;
    });
};

export const fetchPartNumbersAndDescriptions=()=>{
  return axios
  .get(`${PARTANDDESCRIPTION}`)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.error("Error fetching PARTS AND DESCRIPTIONS:", error);
    throw error;
  });
}
// Supplier Registration
export const createSupplier = (Supplier) =>
  axiosInstance.post(`${SUPPLIER_URL}/supplierReg`, Supplier);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteSupplier = (SupplierId) =>
  axiosInstance.delete(`${SUPPLIER_URL}/${SupplierId}`);
export const updateSupplier = (SupplierId, Supplier) =>
  axiosInstance.put(`${SUPPLIER_URL}/${SupplierId}`, Supplier);
export const getSupplierDetail = (SupplierId) =>
  axiosInstance.get(`${SUPPLIER_URL}/${SupplierId}`);

export const listAllSupplier = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};

//checker
export const getpendingAllSupplier = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/getPendingSupplierList?userRole=M&userAction=1`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};
//editapproveSupplier
export const getEditingSupplierList = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/getEditingSupplierList?userRole=M&userAction=3`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};
export const ApproveSupplier = (Supplier) =>
  axiosInstance.post(`${SUPPLIER_URL}/approve`, Supplier);

// ######################### PRODUCT #########################
export const createProduct = (Product) =>
  axiosInstance.post(`${PRODUCT_URL}/create`, Product);
export const listAllProduct = () => axiosInstance.get(`${PRODUCT_URL}`);
export const deleteProduct = (productId) => {
  console.log(`Deleting product with ID: ${productId}`); // Log for debugging
  return axiosInstance.delete(`${PRODUCT_URL}/${productId}`);
};
export const updateProduct = (ProductId, Product) =>
  axiosInstance.put(`${PRODUCT_URL}/${ProductId}`, Product);
export const getProductDetail = (ProductId) =>
  axiosInstance.get(`${PRODUCT_URL}/${ProductId}`);

// ######################### MATERIAL #########################
export const addMaterialNote = (Material) =>
  axiosInstance.post(`${MATERIAL_URL}`, Material);
export const listAllMaterials = () => axiosInstance.get(`${MATERIAL_URL}`);
export const deleteMaterial = (materialId) => {
  console.log(`Deleting material with ID: ${materialId}`); // Log for debugging
  return axiosInstance.delete(`${MATERIAL_URL}/${materialId}`);
};
export const updateMaterial = (MaterialId, Material) =>
  axiosInstance.put(`${MATERIAL_URL}/${MaterialId}`, Material);
export const getMaterialDetail = (MaterialId) =>
  axiosInstance.get(`${MATERIAL_URL}/${MaterialId}`);
// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login"
let USER_API = REST_API_BASE_URL + "/api/roles/addUser"
let VIEW_USER_API = REST_API_BASE_URL + "/api/roles/viewUser"
let ROLE_API = REST_API_BASE_URL + "/api/roles"

export const login = (loginData) => axiosInstance.post(login_API, loginData);
export const  createUser = (Login) => axiosInstance.post(USER_API, Login);
export const listAllUser = () =>  axiosInstance.get(`${VIEW_USER_API}`);
export const addRole = () =>  axiosInstance.get(`${ROLE_API}/addRole`,Role);






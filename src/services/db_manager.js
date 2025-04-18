import axios from "axios";
import { REST_API_BASE_URL } from "./base_services";

// ######################### ROUTE #########################
let STORE_URL = REST_API_BASE_URL + "/storeAcceptance";
let SUPPLIER_URL = REST_API_BASE_URL + "/api/supplier";
let PRODUCT_URL = REST_API_BASE_URL + "/api/product";
let MATERIAL_URL = REST_API_BASE_URL + "/api/mrn";
let MATERIAL_REQUISITION = REST_API_BASE_URL + "/api/material-requisitions";
let PURCHASE_REQUISITION = REST_API_BASE_URL + "/api/purchase-requisitions";
// ######################### DB_MANAGER #########################

// Store Acceptance
export const createStore = (Store) => axios.post(STORE_URL, Store);
// export const listAllStore = () =>  axios.get(`${STORE_URL}/`);
export const deleteStore = (StoreId) => axios.delete(`${STORE_URL}/${StoreId}`);
export const updateStore = (StoreId, Store) =>
  axios.put(`${STORE_URL}/${StoreId}`, Store);
export const getStoreDetail = (StoreId) => axios.get(`${STORE_URL}/${StoreId}`);

export const listAllStore = () => {
  return axios
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
  axios.post(MATERIAL_REQUISITION, Requisition);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteMaterialRequisition = (RequisitionId) =>
  axios.delete(`${MATERIAL_REQUISITION}/${RequisitionId}`);
export const updateMaterialRequisition = (RequisitionId, Requisition) =>
  axios.put(`${MATERIAL_REQUISITION}/${RequisitionId}`, Requisition);
export const getMaterialRequisitionDetail = (RequisitionId) =>
  axios.get(`${MATERIAL_REQUISITION}/${RequisitionId}`);

export const listAllMaterialRequisition = () => {
  return axios
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
  axios.post(MATERIAL_REQUISITION, Purchase);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deletePurchaseRequisition = (PurchaseId) =>
  axios.delete(`${MATERIAL_REQUISITION}/${PurchaseId}`);
export const updatePurchaseRequisition = (PurchaseId, Purchase) =>
  axios.put(`${MATERIAL_REQUISITION}/${PurchaseId}`, Purchase);
export const getPurchaseRequisitionDetail = (PurchaseId) =>
  axios.get(`${MATERIAL_REQUISITION}/${PurchaseId}`);

export const listAllPurchaseRequisition = () => {
  return axios
    .get(`${PURCHASE_REQUISITION}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Purchase requisition:", error);
      throw error;
    });
};

// Supplier Registration
export const createSupplier = (Supplier) =>
  axios.post(`${SUPPLIER_URL}/supplierReg`, Supplier);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteSupplier = (SupplierId) =>
  axios.delete(`${SUPPLIER_URL}/${SupplierId}`);
export const updateSupplier = (SupplierId, Supplier) =>
  axios.put(`${SUPPLIER_URL}/${SupplierId}`, Supplier);
export const getSupplierDetail = (SupplierId) =>
  axios.get(`${SUPPLIER_URL}/${SupplierId}`);

export const listAllSupplier = () => {
  return axios
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
  return axios
    .get(`${SUPPLIER_URL}/getPendingSupplierList`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};
export const ApproveSupplier = (Supplier) =>
  axios.post(`${SUPPLIER_URL}/approve`, Supplier);

// ######################### PRODUCT #########################
export const createProduct = (Product) =>
  axios.post(`${PRODUCT_URL}/create`, Product);
export const listAllProduct = () => axios.get(`${PRODUCT_URL}`);
export const deleteProduct = (productId) => {
  console.log(`Deleting product with ID: ${productId}`); // Log for debugging
  return axios.delete(`${PRODUCT_URL}/${productId}`);
};
export const updateProduct = (ProductId, Product) =>
  axios.put(`${PRODUCT_URL}/${ProductId}`, Product);
export const getProductDetail = (ProductId) =>
  axios.get(`${PRODUCT_URL}/${ProductId}`);

// ######################### MATERIAL #########################
export const addMaterialNote = (Material) =>
  axios.post(`${MATERIAL_URL}`, Material);
export const listAllMaterials = () => axios.get(`${MATERIAL_URL}`);
export const deleteMaterial = (materialId) => {
  console.log(`Deleting material with ID: ${materialId}`); // Log for debugging
  return axios.delete(`${MATERIAL_URL}/${materialId}`);
};
export const updateMaterial = (MaterialId, Material) =>
  axios.put(`${MATERIAL_URL}/${MaterialId}`, Material);
export const getMaterialDetail = (MaterialId) =>
  axios.get(`${MATERIAL_URL}/${MaterialId}`);
// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login";

export const login = (loginData) => axios.post(login_API, loginData);

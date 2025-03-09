import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { deleteProduct, getProductDetail, listAllProduct } from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import 'datatables.net';

const ProductList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listAllProduct();
        console.log("API Response:", response);  // Debug log
        setTableData(response.data || []);
        //setTableData(response || []);
      } catch (error) {
        console.error("Error fetching materials", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Current table data:", tableData);  // Debug log

    if (tableData.length > 0) {
      if (dataTableInstance.current) {
        console.log("Destroying existing DataTable");
        dataTableInstance.current.destroy();
      }

      setTimeout(() => {
        if (tableRef.current) {
          console.log("Initializing DataTable");
          dataTableInstance.current = $(tableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
            responsive: true,
            destroy: true
          });
        } else {
          console.error("TableRef is null, DataTable cannot initialize.");
        }
      }, 100);  // Add slight delay to ensure table is in DOM
    }
  }, [tableData]);

  // Handle delete action
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(productId);
        console.log('Delete response:', response); // Log the response
        setProducts(products.filter((product) => product.id !== productId)); // Update the product list
        alert("Product deleted successfully!");

        // Re-fetch the product list after successful deletion
        const response1 = await listAllProduct(); // Fetch updated products
        setProducts(response1.data); // Update the state with the new product list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product.");
      }
    }
  };


  const handleEdit = (productId) => {
    navigate(`/editProduct/${productId}`); // Navigate to the edit page with productId as URL param
  };

  // const deleteSelectedElement = async (materialId) => {
  //     if (window.confirm("Are you sure you want to delete this item?")) {
  //         try {
  //             await deleteMaterial(materialId);

  //             // Directly filter out the deleted material from tableData
  //             setTableData(prevData => prevData.filter(material => material.materialId !== materialId));

  //         } catch (error) {
  //             console.error("Failed to delete material", error);
  //             alert("Failed to delete material. Please try again.");
  //         }
  //     }
  // };

  const editSelectedElement = async (productId) => {
    try {
      const response = await getProductDetail(productId);
      const ProductData = response?.data;


      if (ProductData) {
        navigate('/EditProduct', { state: { productId, ProductData } });
      }
    } catch (error) {
      console.error("Error fetching material details: ", error);
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
            <h5 className="h5 mx-3 mb-0 text-gray-800">View Product</h5>
          </div>
        </div>

        <div className="card border border-dark shadow mx-4 my-4 p-2" style={{ height: '500px' }}>
          <div className="col-md-12">
            <div className="table-responsive overflow-auto px-0 mt-4" style={{ width: '100%' }}>
              <table ref={tableRef} className="table border" style={{ width: "100%", tableLayout: "fixed" }}>
                <thead className="position-sticky sticky-top bg-light">
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Material Classification</th>
                    <th>Description</th>
                    <th>UOM</th>
                    <th>OEM</th>
                    <th>NHA</th>
                    <th>CMM Reference Number</th>
                    <th>Date</th>
                    <th>Registered By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>{product.materialClassification}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.unitOfMeasurement}</td>
                        <td>{product.oem}</td>
                        <td>{product.nha}</td>
                        <td>{product.cmmReferenceNumber}</td>
                        <td>{product.registrationDate}</td>
                        <td>{product.registeredBy}</td>
                        <td>
                          <span className="ms-1 text-danger" onClick={() => handleDelete(product.productId)}>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                          <span className="mx-1 text-primary" onClick={() => handleEdit(product.productId)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProductList;

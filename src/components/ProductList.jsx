import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { deleteProduct, listAllProduct } from "../services/db_manager"; // Assuming these functions are defined in your `db_manager`

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products when the component is mounted
    const fetchProducts = async () => {
      try {
        const response = await listAllProduct(); // Fetch products from the database
        setProducts(response.data); // Assuming response.data contains the list of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete action
  let productId = products.id;
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


  return (
      <div className="wrapper">
        <Sidebar />
        <div className="content" style={{ marginLeft: '280px' }}>
          <Header />
          
          {/* Title Header */}
          <div className="d-flex align-items-center px-4 py-3" style={{ 
            backgroundColor: '#1B74E4', 
            color: 'white',
            borderBottom: '1px solid #0b5ed7'
          }}>
            <div>
              <h5 className="fw-semibold mb-1">Product List</h5>
              <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>View and manage all registered products</p>
            </div>
          </div>
          
          <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f0f6ff' }}>
            <div className="card border-0 shadow-sm" style={{ 
              borderRadius: '10px', 
              overflow: 'hidden',
              borderTop: '3px solid #1B74E4'
            }}>
              <div className="card-body p-0">
                {/* Table Filter/Search Header */}
                <div className="d-flex justify-content-between align-items-center p-3" style={{ 
                  backgroundColor: '#e0ecff',
                  borderBottom: '1px solid #c9dcff'
                }}>
                  <div className="d-flex align-items-center">
                    <div className="input-group" style={{ width: '250px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search products..." 
                        style={{ 
                          borderRadius: '6px 0 0 6px',
                          borderColor: '#c9dcff',
                          marginBottom: '2px',
                          fontSize: '14px'
                        }}
                      />
                      <button 
                        className="btn btn-outline-primary" 
                        type="button" 
                        style={{ 
                          borderRadius: '0 6px 6px 0',
                          borderColor: '#c9dcff',
                          borderLeft: 'none',
                          backgroundColor: 'white',
                          marginRight: '5px',
                          color: '#1B74E4'
                        }}
                      >
                        <i className="fa-solid fa-search"></i>
                      </button>
                    </div>
                    <select 
                      className="form-select ms-3" 
                      style={{ 
                        width: '180px', 
                        borderColor: '#c9dcff',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">All Classifications</option>
                      <option value="Consumable">Consumable</option>
                      <option value="Spare part">Spare part</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Chemical">Chemical</option>
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ 
                      borderRadius: '6px',
                      backgroundColor: '#1B74E4',
                      border: 'none',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                  >
                    <i className="fa-solid fa-plus me-1"></i> Add Product
                  </button>
                </div>
                
                {/* Table with responsive scrolling */}
                <div className="table-responsive overflow-auto px-0">
                  <table
                    id="dataTable"
                    className="table mb-0"
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: "0"
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#f5f7fa' }}>
                        <th 
                          style={{ 
                            width: "3%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          ID
                        </th>
                        <th 
                          style={{ 
                            width: "9%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          Name
                        </th>
                        <th 
                          style={{ 
                            width: "15%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          Material Classification
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          Description
                        </th>
                        <th 
                          style={{ 
                            width: "5%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          UOM
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          OEM
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          NHA
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          CMM Reference
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          Date
                        </th>
                        <th 
                          style={{ 
                            width: "10%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057'
                          }}
                        >
                          Registered By
                        </th>
                        <th 
                          style={{ 
                            width: "8%", 
                            borderBottom: '2px solid #e9ecef',
                            padding: '14px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#495057',
                            textAlign: 'center'
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <tr 
                            key={product.id || index}
                            style={{ 
                              backgroundColor: index % 2 === 0 ? 'white' : '#fbfbfd',
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid #f2f4f8'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f9ff'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fbfbfd'}
                          >
                            <td style={{ padding: '12px' }}>
                              <span style={{ fontWeight: '500', color: '#1B74E4' }}>
                                {product.productId}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ fontWeight: '500' }}>
                                {product.productName}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span className="badge" style={{ 
                                backgroundColor: 'rgba(27, 116, 228, 0.1)', 
                                color: '#1B74E4',
                                padding: '5px 8px',
                                fontWeight: '500',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}>
                                {product.materialClassification}
                              </span>
                            </td>
                            <td style={{ 
                              padding: '12px',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {product.productDescription}
                            </td>
                            <td style={{ padding: '12px' }}>{product.unitOfMeasurement}</td>
                            <td style={{ padding: '12px' }}>{product.oem}</td>
                            <td style={{ padding: '12px' }}>{product.nha}</td>
                            <td style={{ padding: '12px' }}>{product.cmmRef1}</td>
                            <td style={{ padding: '12px' }}>{product.registrationDate}</td>
                            <td style={{ padding: '12px' }}>{product.registeredBy}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <div className="d-flex justify-content-center gap-2">
                                {/* Edit Button */}
                                <button
                                  onClick={() => handleEdit(product.productId)}
                                  className="btn p-1"
                                  style={{ 
                                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Edit Product"
                                >
                                  <i className="fa-solid fa-pen-to-square" style={{ color: '#ffc107' }}></i>
                                </button>
                                
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDelete(product.productId)}
                                  className="btn p-1"
                                  style={{ 
                                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Delete Product"
                                >
                                  <i className="fa-solid fa-trash" style={{ color: '#dc3545' }}></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center py-4">
                            <div className="d-flex flex-column align-items-center">
                              <div 
                                style={{ 
                                  backgroundColor: '#e0ecff',
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: '12px'
                                }}
                              >
                                <i className="fa-solid fa-box-open" style={{ fontSize: '24px', color: '#1B74E4' }}></i>
                              </div>
                              <h6 className="mb-1" style={{ color: '#495057' }}>No Products Available</h6>
                              <p className="text-muted mb-3" style={{ fontSize: '14px' }}>No product records found in the system</p>
                              <button 
                                className="btn btn-primary btn-sm" 
                                style={{ 
                                  backgroundColor: '#1B74E4',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 16px',
                                  fontSize: '13px'
                                }}
                              >
                                <i className="fa-solid fa-plus me-1"></i> Add First Product
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination footer */}
                {products.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center p-3" style={{ 
                    backgroundColor: '#e0ecff',
                    borderTop: '1px solid #c9dcff'
                  }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '14px' }}>
                        Showing <span className="fw-medium">{products.length}</span> of <span className="fw-medium">{products.length}</span> products
                      </span>
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" style={{ borderRadius: '4px 0 0 4px' }}>
                            <i className="fa-solid fa-chevron-left"></i>
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#" style={{ backgroundColor: '#1B74E4', borderColor: '#1B74E4' }}>1</a>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                          <a className="page-link" href="#" style={{ borderRadius: '0 4px 4px 0' }}>
                            <i className="fa-solid fa-chevron-right"></i>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    );
};

export default ProductList;

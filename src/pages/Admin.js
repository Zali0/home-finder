import React, { useEffect, useState, useContext } from 'react';
import './Admin.css';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const { user, logout } = useContext(AuthContext);

  const userData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin"
  };

  const property = {
    title: "",
    price: "",
    type: "Sale",
    availability: "Available",
    location: "",
    description: "",
    imageUrl: "",
    bedrooms: "",
    bathrooms: "",
    parking: "Garage Available",
    kitchen: "",
    size: ""
  };

  const [UserFormData, setUserFormData] = useState(userData);
  const [PropertyFormData, setPropertyFormData] = useState(property);

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of cards per page

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...UserFormData,
      [name]: value
    });
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setPropertyFormData({
      ...PropertyFormData,
      [name]: value
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchProperties();
    fetchPurchases();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);  
      setUsers(response.data);
    } catch(error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
      alert("Failed to delete user. Please try again.");
    }
  };

  const [activeTab, setActiveTab] = useState('users');

  const addUser = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user`, UserFormData);
      toast.success("User added successfully!");
      
      setUserFormData(userData);
      fetchUsers();
    } catch (error) {
      toast.error("Error adding user:", error.response ? error.response.data : error.message);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${editUserId}`, UserFormData);
      toast.success("User updated successfully!");
      setUserFormData(userData);
      setIsEditingUser(false);
      setEditUserId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Error updating user:", error.response ? error.response.data : error.message);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const addProperty = async () => {
    if (!PropertyFormData.title || !PropertyFormData.price || !PropertyFormData.imageUrl || !PropertyFormData.location) {
      toast.error("Fill all required fields!");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/property`, PropertyFormData);
      toast.success("Property added successfully!");
      setPropertyFormData(property);
      fetchProperties();
    } catch (error) {
      console.error("Error adding property:", error.response ? error.response.data : error.message);
      toast.error("Failed to add property. Please try again.");
    }
  };

  const updateProperty = async () => {
    if (!PropertyFormData.title || !PropertyFormData.price) {
      toast.error("Title and Price are required!");
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${editPropertyId}`, PropertyFormData);
      toast.success("Property updated successfully!");
      setPropertyFormData(property);
      setIsEditingProperty(false);
      setEditPropertyId(null);
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error.response ? error.response.data : error.message);
      toast.error("Failed to update property. Please try again.");
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/${id}`);
      toast.success("Property deleted successfully!");
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error.response ? error.response.data : error.message);
      toast.error("Failed to delete property. Please try again.");
    }
  };



// everything should be fine okay

  const filteredProperties = properties
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  // Pagination logic for properties
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);



  // States for purchases
  const [purchases, setPurchases] = useState([]);
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [purchaseSort, setPurchaseSort] = useState("");
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState("");

  // Fetch purchases
  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchases`);
      setPurchases(res.data);
      // console.log(res.data)
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };



    // Delete purchase
  const deletePurchase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/purchases/${id}`);
      toast.success("Purchase deleted successfully!");
      fetchPurchases();
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Failed to delete purchase.");
    }
  };




  // Filter & sort purchases
  const filteredPurchases = purchases
    .filter(p => 
      p.email.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.item.toLowerCase().includes(purchaseSearch.toLowerCase())
    )
    .filter(p => (purchaseStatusFilter ? p.status === purchaseStatusFilter : true))
    .sort((a, b) => {
      if (purchaseSort === "amountAsc") return a.amount - b.amount;
      if (purchaseSort === "amountDesc") return b.amount - a.amount;
      if (purchaseSort === "dateNewest") return new Date(b.date) - new Date(a.date);
      if (purchaseSort === "dateOldest") return new Date(a.date) - new Date(b.date);
      return 0;
    });


    // Pagination for purchases
  const [purchasePage, setPurchasePage] = useState(1);
  const purchaseIndexOfLast = purchasePage * itemsPerPage;
  const purchaseIndexOfFirst = purchaseIndexOfLast - itemsPerPage;
  const currentPurchases = filteredPurchases.slice(purchaseIndexOfFirst, purchaseIndexOfLast);
  const totalPurchasePages = Math.ceil(filteredPurchases.length / itemsPerPage);




  return (
    <div className="admin-container">
      <div style={{display:'flex'}}>
        <h2 className="mb-4" style={{width: "40%"}}>Admin Dashboard</h2>
        <div style={{width: "60%", display: "flex", justifyContent:'right', alignItems: "center"}}>
          <h5>Welcome {user?.name}</h5>
          <button className="btn btn-dark" style={{marginLeft:'30px', marginRight:'20px'}} onClick={() => window.confirm("Are you sure you want to logout?") && logout()}>Logout</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties</button>
        <button className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>Purchases</button>
      
      </div>

      {activeTab === 'users' && (
        <section>
          <div className="form mb-4" style={{ textAlign: 'center', padding:'10px' }}>
            <input placeholder="Name" type="text" name="name" value={UserFormData.name} onChange={handleUserChange} />
            <input placeholder="Email" type="email" name="email" value={UserFormData.email} onChange={handleUserChange} />
            
            <input placeholder="Password" type="password" name="password" value={isEditingUser ?  bcyrpt.hash(UserFormData.password, 10) : UserFormData.password} onChange={handleUserChange} disabled={isEditingUser} />


            <select name="role" value={UserFormData.role} onChange={handleUserChange} style={{ width: '200px', padding: '14px', marginLeft: '20px', borderRadius: '7px', border: '1px solid #ccc' }}>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {isEditingUser ? (
              <button className="btn btn-warning btn-md" onClick={updateUser} style={{ marginLeft: '50px' }}>Update User</button>
            ) : (
              <button className="btn btn-primary btn-md" onClick={addUser} style={{ marginLeft: '50px' }}>Add User</button>
            )}
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData, index) => (
                  <tr key={userData._id}>
                    <td>{index + 1}</td>
                    <td>{userData.name}</td>
                    <td>{userData.email}</td>
                    <td>{userData.role}</td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-success btn-sm" onClick={() => {
                        setIsEditingUser(true);
                        setEditUserId(userData._id);
                        setUserFormData({
                          name: userData.name,
                          email: userData.email,
                          password: userData.password,
                          role: userData.role,
                        });
                      }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => {
                        if (window.confirm(`Are you sure you want to delete user ${userData.name}?`)) {
                          deleteUser(userData._id);
                        }
                      }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'properties' && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.25fr' }}> 
            <div>
              <div className="filter-bar">
                <input type="text" placeholder="Search by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="">Sort</option>
                  <option value="asc">Price: Low → High</option>
                  <option value="desc">Price: High → Low</option>
                </select>
              </div> 
              
              <div className="card-grid">
                {currentProperties.map((p) => (
                  <div key={p._id} className="card" style={{width: '250px', height: '400px'}}>
                    <img src={p.imageUrl} alt={p.title} />
                    <h3>{p.title}</h3>
                    <p>{p.location}</p>
                    <p>Ghc {p.price}</p>
                    <p><strong>{p.type}</strong> | {p.availability}</p>
                    <div>
                      <button className="btn btn-success btn-sm m-2" onClick={() => {
                        setIsEditingProperty(true);
                        setEditPropertyId(p._id);
                        setPropertyFormData(p);
                      }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => {if (window.confirm("Are you sure you want to delete this property?")) {deleteProperty(p._id);}}}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="form" style={{height: "500px"}}>
              <h4 className='m-3 text-center mb-4'> Properties Update</h4>
              <input type="text" name="title" value={PropertyFormData.title} onChange={handlePropertyChange} placeholder="Title" />
              <input type="text" name="location" value={PropertyFormData.location || ""} onChange={handlePropertyChange} placeholder="Location" />
              <input type="number" name="price" value={PropertyFormData.price} onChange={handlePropertyChange} placeholder="Price" />
              <input type="text" name="imageUrl" value={PropertyFormData.imageUrl || ""} onChange={handlePropertyChange} placeholder="Image URL" />
              <input type="text" name="description" value={PropertyFormData.description || ""} onChange={handlePropertyChange} placeholder="Description" />
              <select name="type" value={PropertyFormData.type} onChange={handlePropertyChange}>
                <option value="Rent">Rent</option>
                <option value="Sale">Sale</option>
              </select>
              <select name="availability" value={PropertyFormData.availability} onChange={handlePropertyChange}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <input type="number" name="bedrooms" value={PropertyFormData.bedrooms} onChange={handlePropertyChange} placeholder="Bedrooms" min="0" />
              <input type="number" name="bathrooms" value={PropertyFormData.bathrooms} onChange={handlePropertyChange} placeholder="Bathrooms" min="0" />
              <select name="parking" value={PropertyFormData.parking} onChange={handlePropertyChange}>
                <option value="Garage Available">Garage Available</option>
                <option value="No Parking">No Parking</option>
              </select>
              <input type="number" name="kitchen" value={PropertyFormData.kitchen} onChange={handlePropertyChange} placeholder="Kitchens" min="0" />
              <input type="number" name="size" value={PropertyFormData.size} onChange={handlePropertyChange} placeholder="Building Size (sq ft)" min="0" />
              {isEditingProperty ? (
                <button className="submit-btn" onClick={updateProperty}>Update Property</button>
              ) : (
                <button className="submit-btn" onClick={addProperty}>Add Property</button>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'purchases' && (
        <section>
          <div className="filter-bar mb-3" style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search by email or item..."
              value={purchaseSearch}
              onChange={(e) => setPurchaseSearch(e.target.value)}
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
            <select
              value={purchaseStatusFilter}
              onChange={(e) => setPurchaseStatusFilter(e.target.value)}
              className="form-select"
              style={{ maxWidth: "200px" }}
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={purchaseSort}
              onChange={(e) => setPurchaseSort(e.target.value)}
              className="form-select"
              style={{ maxWidth: "200px" }}
            >
              <option value="">Sort</option>
              <option value="amountAsc">Amount: Low → High</option>
              <option value="amountDesc">Amount: High → Low</option>
              <option value="dateNewest">Newest First</option>
              <option value="dateOldest">Oldest First</option>
            </select>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead className="table">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Item</th>
                  <th>Product ID</th>
                  <th>Date & Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  currentPurchases.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td>{p.email}</td>
                      <td>Ghc {p.amount}</td>
                      <td>{p.item}</td>
                      <td>{p.propertyId}</td>
                      <td>{new Date(p.date).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePurchase(p._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No purchases found</td>
                  </tr>
                )}
              </tbody>
            </table>


                {/* Pagination */}
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${purchasePage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPurchasePage(prev => prev - 1)}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPurchasePages)].map((_, index) => (
                    <li key={index} className={`page-item ${purchasePage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPurchasePage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${purchasePage === totalPurchasePages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPurchasePage(prev => prev + 1)}>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

          </div>
        </section>
      )}


    </div>
  );
}

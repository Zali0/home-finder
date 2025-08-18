import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import "./User.css";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from '../auth/AuthContext';


export default function User() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);


  const { user, logout } = useContext(AuthContext);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };



 




  const handlePayment = (amount, email, propertyId) => {
    let handler = window.PaystackPop.setup({
      key: 'pk_test_c7d31ea5e0db80dfbcfc815e09d923f1e61e00ce', // your public key
      email: email,
      amount: amount * 100,
      currency: "GHS", // or NGN
      ref: "" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        // Send reference to backend for verification
        verifyPayment(response.reference, propertyId, amount, email);
      },
      onClose: function () {
        alert("Payment window closed");
      },
    });
    handler.openIframe();
  };



  const createPurchase = async (propertyId, amount, email) => {
  try {
    const property = properties.find((p) => p._id === propertyId);
    console.log("Property bought: " + (property))
    await axios.post("http://localhost:7000/api/purchase", {
      email,
      amount,
      propertyId,
      item: `${property?.title} - ${property?.type}`,
    });

    toast.success("Purchase record created!");
  } catch (error) {
    console.error("Error creating purchase:", error);
    toast.error("Could not save purchase record.");
  }
  };




  const verifyPayment = async (reference, propertyId, amount, email) => {
    try {
      const res = await axios.post("http://localhost:7000/api/verify-payment", {
        reference,
        propertyId,
        amount,
        email,
      });

      if (res.data.status === "success") {
        toast.success("Payment verified and saved!", { duration: 5000});


        // Create purchase record
        await createPurchase(propertyId, amount, email);



        // Optionally update property availability on UI
        updatePropertyStatus(propertyId);
        // fetchProperties();

      } else {
        alert("Payment verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error verifying payment");
    }
  };



  const updatePropertyStatus = async (propertyId) => {
    try {
      await axios.put(`http://localhost:7000/api/properties/${propertyId}`, {
        availability: "Unavailable",
      });
      toast.success("Property marked as unavailable!");
      fetchProperties(); // Refresh list
      closeModal(); // Close modal after update
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };


  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const filteredProperties = properties
    .filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) => (typeFilter ? p.type === typeFilter : true))
    .filter((p) =>
      availabilityFilter ? p.availability === availabilityFilter : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // adjust for how many cards you want per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  return (
    <div className="user-page pt-5 ps-4"  style={{width: '100%'} }>
      <div style={{display:'flex'}}>
        <h2 style={{width: "40%"}}>Available Properties</h2>
        <div style={{width: "60%", display: "flex", justifyContent:'right', alignItems: "center"}}>
          <h5 style={{}}>Welcome {user?.name}</h5>
          <button className="btn btn-dark" style={{marginLeft:'30px', marginRight:'20px'}} onClick={() => window.confirm("Are you sure you want to logout?") && logout()}>Logout</button>
        </div>
      </div>
      
      

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Rent">For Rent</option>
          <option value="Sale">For Sale</option>
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>



      <div className="card-grid" style={{ width: "100%", display: "grid" }}>
        {currentItems.map((p) => (
          <div
            key={p._id}
            className="card"
            style={{ width: "250px", height: "400px", margin: "5px" }}
          >
            <img src={p.imageUrl} alt={p.title} />
            <h3>{p.title}</h3>
            <p>{p.location}</p>
            <p>Gh¢ {p.price}</p>
            <p>
              <strong>{p.type}</strong> • {p.availability}
            </p>
            <div
              className="btn-group"
              style={{ width: "80%", margin: "0 auto", marginTop: "10px" }}
            >
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={() => openModal(p)}
                style={{ marginRight: "10px" }}
                disabled={p.availability === "Unavailable"}
              >
                <i className="fa-solid fa-circle-info"></i>
              </button>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                style={{ marginLeft: "10px" }}
              >
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bootstrap Pagination */}
      <nav aria-label="Page navigation example" style={{ marginTop: "20px" }}>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>


        
      {showModal && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: "90%"}}>
            
            {/* Right Side */}
            <div className="modal-right-side">
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                onClick={closeModal}
                style={{ cursor: 'pointer', fontSize: '17px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </span>
              <img src={selectedProperty.imageUrl} alt={selectedProperty.title} style={{height: "35%"}} />
              <h3>{selectedProperty.title}</h3>
              <p><strong>Location:</strong> {selectedProperty.location}</p>
              <p><strong>Price:</strong> Gh¢ {selectedProperty.price}</p>
              <p><strong>Type:</strong> {selectedProperty.type}</p>
              <p><strong>Availability:</strong> {selectedProperty.availability}</p>
              <button className="buy-btn" onClick={() => handlePayment(selectedProperty.price, user?.email, selectedProperty._id)}>
                {selectedProperty.type === "Rent" ? "Rent Now" : "Buy Now"}
              </button>
            </div>

            {/* Left Side */}
            <div className="modal-left-side" style={{ padding: '10px' }}>
              <h4>Property Details</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '15px', lineHeight: '2.0' }}>
                <li>
                  <i className="fa-solid fa-bed" style={{ marginRight: '8px', color: '#555' }}></i>
                  {Number(selectedProperty.bedrooms) > 0 ? selectedProperty.bedrooms : "N/A"} Bedrooms
                </li>
                <li>
                  <i className="fa-solid fa-bath" style={{ marginRight: '8px', color: '#555' }}></i>
                  {Number(selectedProperty.bathrooms) > 0 ? selectedProperty.bathrooms : "N/A"} Bathrooms
                </li>
                <li>
                  <i className="fa-solid fa-utensils" style={{ marginRight: '8px', color: '#555' }}></i>
                  {Number(selectedProperty.kitchen) > 0 ? selectedProperty.kitchen : "N/A"} Kitchen
                </li>
                <li>
                  <i className="fa-solid fa-car" style={{ marginRight: '8px', color: '#555' }}></i>
                  {selectedProperty.parking ? "Garage Available" : "No Parking"}
                </li>
                <li>
                  <i className="fa-solid fa-ruler-combined" style={{ marginRight: '8px', color: '#555' }}></i>
                  {Number(selectedProperty.size) > 0 ? selectedProperty.size : "N/A"} sq ft
                </li>
                <p><strong>Description:</strong> {selectedProperty.description} </p>
              </ul>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";
import Loading from "./Loading";

export default function Shipping() {
  const [product, setProduct] = useState();
  const [input, setInput] = useState();

  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      setInput({
        name: data.name,
        description: data.description,
        category: data.category_id,
        quantity: data.quantity,
        price: data.price,
        image: data.image,
      });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`/products/update/${id}`, { input }).then(() => (window.location.href = "/admin"));
  };

  const handleChange = (event) => {
    if (event.target) {
      setInput({ ...input, [event.target.name]: event.target.value });
    } else {
      setInput({ ...input, category: event.value });
    }
  };

  const options = [
    { value: "1", label: "Video Games" },
    { value: "2", label: "TV & Home Appliances" },
    { value: "3", label: "Music & DVD" },
    { value: "4", label: "Musical Instruments" },
    { value: "5", label: "Books" },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <div className="container my-5 d-flex justify-content-center">
        <form className="col col-md-8 col-lg-5 col-xl-3" onSubmit={handleSubmit}>
          <div className="form-group my-2">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" name="name" id="name" onChange={handleChange} defaultValue={product?.name} />
          </div>
          <div className="form-group my-2">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              id="description"
              onChange={handleChange}
              defaultValue={product?.description}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="category">Category</label>
            <Select options={options} defaultValue={options[product?.category_id - 1]} onChange={handleChange} />
          </div>
          <div className="form-group my-2">
            <label htmlFor="quantity">Quantity</label>
            <input type="text" className="form-control" name="quantity" id="quantity" onChange={handleChange} defaultValue={product?.quantity} />
          </div>
          <div className="form-group my-2">
            <label htmlFor="price">Price</label>
            <input type="text" className="form-control" name="price" id="price" onChange={handleChange} defaultValue={product?.price} />
          </div>
          <div className="form-group my-2">
            <label htmlFor="image">Image</label>
            <input type="text" className="form-control" name="image" id="image" onChange={handleChange} defaultValue={product?.image} />
          </div>

          <button type="submit" className="btn btn-primary my-2 d-block mx-auto">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

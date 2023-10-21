import { Fragment, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function AdminLogin() {
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });
  const [validated] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
        console.log("attempting to log in!");
      // Login using next-auth
    } catch (err) {
      console.error(err);
    }
    // Reset form data
    setUserFormData({
      username: "",
      password: "",
    });
  };
  return (
    <Fragment>
    <h1>MODAL</h1>
      <Modal show={true} >
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
          <button type="button" aria-label="Close">
            x
          </button>
        </Modal.Header>
       <Form
          noValidate
          validated={validated}
          className="form-login"
          onSubmit={handleFormSubmit}
        >
          <Form.Group>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={userFormData.username}
              required
            />
            <Form.Control.Feedback type="invalid">
              Username is required!
            </Form.Control.Feedback>
          </Form.Group>
         
          <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required!
            </Form.Control.Feedback>
          </Form.Group>
         
          <Button
            disabled={!(userFormData.email && userFormData.password)}
            type="submit"
            variant="success"
            className="login-signup-button"
          >
            Submit
          </Button>
        </Form> 
      </Modal>
    </Fragment>
  );
}

export default AdminLogin;

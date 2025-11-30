import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";


const Register = ()=> {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        user_type: "customer",
    })

    const [error, setError] = useState('')
    const [loading, setloading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const  handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.password_confirm){
            return setError('passwords do not match')
        }

        setloading(true)

        try {
            const result = await register(formData)
            // console.log(result)
            if (result.success) {
                navigate('/login', {state: { message: 'Registration successfull please log in. '} })
            } else {
                setError(result.error);
                setError(result.error?.detail || 'Registration failed ')
            }
        } catch (error) {
            setError(`An error occured. please try again: ${error}`)
        }finally{
            setloading(false)
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                <Card>

                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>

                                <Form.Group className='mb-3'>
                                <Form.Label>User Type</Form.Label>
                                <Form.Select
                                name="user_type"
                                value={formData.user_type}
                                onChange={handleChange}
                                >
                                
                                <option value="customer">Customer</option>
                                <option value="vendor">Vendor</option>

                                </Form.Select>
                                </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                type="password"
                                name="password_confirm"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                                />
                            </Form.Group>


                                <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                                >
                                    {loading ? 'creating Account...' : 'Sign Up'}
                                </Button>

                        </Form>

                        <div className='text-center mt-3'>
                            <Link to="/login">Already have an account? Log In</Link>

                        </div>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    )

}
export default Register
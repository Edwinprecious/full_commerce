import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Footer = () => {
    return (
        <footer className='bg-dark text-light py-4 mt-5'>
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>Temu Commerce</h5>
                        <p>Your trusted online shopping destination for quality products at great prices.</p>
                    </Col>
                    <Col md={2}>
                        <h5>Quick Links</h5>
                        <ul className='list-unstyled'>
                            <li><Link to="/" className='text-light'>Home</Link></li>
                            <li><Link to="/products" className='text-light'>Products</Link></li>
                            <li><Link to="/categories" className='text-light'>Categories</Link></li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <h6>Customer Service</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/contact" className='text-light'>Contact Us</Link></li>
                            <li><Link to="/shipping" className='text-light'>Shipping Info</Link></li>
                            <li><Link to="/returns" className='text-light'>Returns</Link></li>
                        </ul>
                    </Col>
                    <Col md={2}>
                    <h6>Account</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/login" className='text-light'>Login</Link></li>
                            <li><Link to="/register" className='text-light'>Register</Link></li>
                            <li><Link to="/orders" className='text-light'> My Orders</Link></li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <h6>Follow Us</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/facebook" className='text-light'>Facebook</Link></li>
                            <li><Link to="/twitter" className='text-light'>Twitter</Link></li>
                            <li><Link to="/instagram" className='text-light'>Instagram</Link></li>
                        </ul>
                    </Col>
                </Row>
                <hr className='my-4' />
                <Row>
                    <Col className='text-center'>
                        <p>&copy; 2023 Temu Commerce. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
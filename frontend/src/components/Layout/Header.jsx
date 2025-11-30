import React from 'react'
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from  '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Header.css'


const Header = () => {
        
        const { user, logout, isAuthenticated } = useAuth()
        const { cartItemsCount } = useCart()
        const navigate = useNavigate()

const handlelogout = () => {
        logout()
        navigate('/')

}        

        return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Container>
                        <Navbar.Brand as={Link} to="/">
                        Temu Commerce
                        </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='me-auto'>
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                                <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                        </Nav>

                        <Nav>
                                {isAuthenticated ? (
                                        <>
                                        <Nav.Link as={Link} to="/cart" className="position-relative">
                                        Cart
                                        {cartItemsCount > 0 && (
                                                <Badge bg="danger" className="cart-badge">
                                                        {cartItemsCount}
                                                </Badge>
                                        )}
                                        </Nav.Link>   

                                        <Dropdown align="end">
                                                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                                        {user?.first_name || user?.email}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                        <Dropdown.Item as={Link} to="/profile">
                                                        Profile
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link} to="/orders">
                                                        My Orders
                                                        </Dropdown.Item>
                                                        {user?.user_type === 'vendor' && (
                                                        <Dropdown.Item as={Link} to="/vendor/dashboard">
                                                                Vendor Dashboard 
                                                        </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={handlelogout}>
                                                                Logout
                                                        </Dropdown.Item>
                                                </Dropdown.Menu>
                                        </Dropdown>
                                        </>
                                ):(
                                        <>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                        <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                        </>
                                )}
                        </Nav>
                </Navbar.Collapse>
                </Container>

        </Navbar>
        )
}


export default Header
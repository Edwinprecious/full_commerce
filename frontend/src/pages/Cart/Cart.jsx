import React from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  console.log('cart:', cart);

  if (!cart || !cart.items || cart.items.length === 0) {
    
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4">
              <h2>Your Cart is Empty</h2>
              <p className="text-muted">Add some products to your cart to get started.</p>
            </div>
            <Button as={Link} to="/products" variant="primary">
              Continue Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

    const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Shopping Cart ({cart.total_items} items)</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {cart.items.map(item => (
                        <tr key={item.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                    src={item.product.primary_image?.image || '/images/placeholder.jpg'}
                                    alt={item.product.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="rounded me-3"
                                    />
                                <div>
                                    <h6 className="mb-1">{item.product.name}</h6>
                                    {item.variant && (
                                        <small className="text-muted">
                                            {item.variant.name}: {item.variant.value}
                                        </small>
                                    )}
                                    </div>
                                </div>
                            </td>
                            <td>{item.unit_price}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                    -
                                    </Button>
                                    <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    style={{ width: '70px', margin: '0 10px'}}
                                    min = "1"
                                    />
                                    <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                    +
                                    </Button>
                                </div>
                            </td>
                            <td>₦{item.total_price}</td>
                            <td>
                                <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                >
                                Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Order Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₦{cart.subtotal || 0}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>₦{cart.tax_amount || 0}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>₦{cart.shipping_cost || 0}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total:</span>
                <span>₦{cart.total || 0}</span>
              </div>
             
                <Button 
                 variant="primary" 
                 size='lg'
                 className='w-100 mb-2'
                 onClick={handleCheckout} 
                 >
                    Proceed to Checkout
                </Button>

                <Button as={ Link } to="/products" variant="outline-primary" className='w-100'>
                    continue shopping 
                </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart
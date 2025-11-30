
import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import OrdersAPI, { ordersAPI } from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Checkout = () => {
    const { cart, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        shippingAddress: {
            street_address: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
        },
        billingAddress: {
            same_as_shipping: true,
            street_address: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
        },
    
        paymentMethod: 'card',
        saveShippingAddress: true,
    })

    if (!cart || cart.items.length === 0) {
        navigate('/cart')
        return null
    }

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const orderData = {
                shipping_address: formData.shippingAddress,
                billing_address: formData.billingAddress,
                payment_method: formData.paymentMethod
            }

            const response = await ordersAPI.create(orderData)
            await clearCart()
            
            toast.success('Order placed successfully')
            navigate(`/orders/${response.data.id}`)
        } catch (error) {
            toast.error('failed to place order, please try again.')
            console.error('order error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!cart) return <LoadingSpinner />

    return (
       <Container className='py-4'>
        <Row>
            <Col lg={8}>
            <Card className='mb-4'>
                <Card.Header>
                    <h4 className='mb-0'> Shipping Address</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.shippingAddress.street_address}
                                onChange={e => handleInputChange('shippingAddress', 'street_address', e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.shippingAddress.city}
                                onChange={e => handleInputChange('shippingAddress', 'city', e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.shippingAddress.state}
                                onChange={e => handleInputChange('shippingAddress', 'state', e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.shippingAddress.postal_code}
                                onChange={e => handleInputChange('shippingAddress', 'postal_code', e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className='mb-3'
                        >
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                            type='text'
                            required
                            value={formData.shippingAddress.country}
                            onChange={e => handleInputChange('shippingAddress', 'country', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Check
                        type='checkbox'
                        label='Save this address for future orders'
                        checked={formData.billingAddress.same_as_shipping}
                        onChange={e => handleInputChange('billingAddress', 'same_as_shipping', e.target.checked)}
                        />
                    </Form>
                </Card.Body>
            </Card>

            <Card className='mb-4'>
                <Card.Header>
                    <h4 className='mb-0'>Billing Address</h4>
                </Card.Header>
                <Card.Body>
                    
                    <Form.Check
                    type='checkbox'
                    label='Same as shipping address'
                    checked={formData.billingAddress.same_as_shipping}
                    onChange={e => handleInputChange('billingAddress', 'same_as_shipping', e.target.checked)}
                    className='mb-3'
                    />

                    { !formData.billingAddress.same_as_shipping && (
                        
                        <Row>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.billingAddress.street_address}
                                onChange={e => handleInputChange('billingAddress', 'street_address', e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                            <Col mb={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.billingAddress.city}
                                onChange={e => handleInputChange('billingAddress', 'city', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.billingAddress.state}
                                onChange={e => handleInputChange('billingAddress', 'state', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.billingAddress.postal_code}
                                onChange={e => handleInputChange('billingAddress', 'postal_code', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col mb={12}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                type='text'
                                required
                                value={formData.billingAddress.country}
                                onChange={e => handleInputChange('billingAddress', 'country', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}    
            </Card.Body>
        </Card>

        <Card>
            <Card.Header>
                <h4 className='mb-0'>Payment method</h4>
            </Card.Header>
            <Card.Body>
                <Form.Group>
                    <Form.Check
                        type='radio'
                        label='Credit/Debit Card'
                        name='payment_method'
                        value='card'
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => setFormData(prev => ({...prev, paymentMethod: e.target.value}))}
                        className='mb-2'
                    />
                    <Form.Check
                        type='radio'
                        label='PayPal'
                        name='paymentMethod'
                        value='paypal'
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={(e) => setFormData(prev => ({...prev, paymentMethod: e.target.value}))}
                        className='mb-2'
                    />
                    <Form.Check
                        type='radio'
                        label="cash on Delivery"
                        name='paymentMethod'
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />

                </Form.Group>
            </Card.Body>
        </Card>       
        </Col>

        <Col lg={4}>
            <Card>
                <Card.Header>
                    <h4 className='mb-0'>Order Summary</h4>
                </Card.Header>
                <Card.Body>
                    {cart.items.map(item => (
                        <div key={item.id} className='d-flex justify-content-between align-items-center mb-2'>
                            <div>
                                <small>{item.product.name}</small>
                                {item.variant && (
                                    <>
                                    <br />
                                    <small className='text-muted'>{item.variant.value}</small></>
                                )}
                                <br />
                                <small className='text-muted'>Quantity: {item.quantity}</small>
                            </div>
                        
                            <small>${item.total_price}</small>
                        </div>
                    ))}

                    <hr />

                    <div className='d-flex justify-content-between mb-1'>
                        <strong>Subtotal</strong>
                        <span>${cart.subtotal}</span>
                    </div>

                    <div className='d-flex justify-content-between mb-1'>
                        <strong>Shipping:</strong>
                        <span>${cart.shipping_cost || 0}</span>
                    </div>

                    <div className='d-flex justify-content-between mb-1'>
                        <strong>Tax:</strong>
                        <span>${cart.tax || 0}</span>
                    </div>

                    <div className='d-flex justify-content-between mb-1'>
                        <strong>Discount:</strong>
                        <span className='text-danger'>-${cart.discount_amount || 0}</span>
                    </div>
                    <hr />

                    <div className='d-flex justify-content-between mb-3'>
                        <strong>Total:</strong>
                        <strong>${cart.total}</strong>
                    </div>

                    <Button 
                     variant='primary' 
                     size='lg'
                     className='w-100'
                     onClick={handleSubmit}
                     disabled={loading}
                     >
                        {loading ? 'Placing Order...' : 'place order'}
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    </Row>
    </Container>
    )
}

export default Checkout
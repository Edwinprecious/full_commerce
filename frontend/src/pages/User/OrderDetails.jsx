import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap'
import { useQuery, useQueryClient } from 'react-query'
import { ordersAPI } from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const OrderDetails = () => {
  const { orderId } = useParams()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery(['order', orderId], () => ordersAPI.retrieve(orderId))

  if (isLoading) return <LoadingSpinner />
  if (!order) return <div>Order not found</div>

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'warning',
      processing: 'info',
      shipped: 'success',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary'
    }
    return variants[status] || 'secondary'
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.cancel(orderId)
        queryClient.invalidateQueries(['order', orderId])
      } catch (error) {
        console.error('Failed to cancel order:', error)
      }
    }
  }

  return (
    <Container className='py-4'>
      <Row>
        <Col>
        <h2 className='mb-4'>Order Details</h2>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={8}>
        <Card>
            <Card.Header>
                <h5 className='mb-0'>Order Items</h5>
            </Card.Header>
            <Card.Body>
                <Table responsive>
                    <thead>
                        <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>

                        </tr>
            
                    </thead>
                    <tbody>
                        {order.data.items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <img 
                                        src={item.product.primary_image?.image || '/images/placeholder.jpg'}
                                         alt={item.product.name}
                                         style={{ width: '50px', height: '50px', objectFit: 'cover'}}
                                         className='rounded mb-3'

                                         />
                                         <div>
                                            <h6 className='mb-0'>{item.product.name}</h6>
                                            {item.variants && (
                                                <small className='text-muted'>
                                                    {item.variants.name}: {item.variants.value}

                                                </small>
                                            )}
                                         </div>

                                    </div>
                                </td>
                                <td>${item.unit_price}</td>
                                <td>${item.quantity}</td>
                                <td>${item.total_price}</td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
        </Col>
        <Col md={4}>
        <Card className='mb-3'>
            <Card.Header>
                <h5 className='mb-0'>Order summary</h5>
            </Card.Header>
            <Card.Body>
                <div className='d-flex justify-content-between mb-2'>
                    <span>Subtotal:</span>
                    <span>${order.data.subtotal}</span>

                </div>
                <div className='d-flex justify-content-between mb-2'>
                    <span>Shipping:</span>
                    <span>${order.data.shipping_cost}</span>

                </div>
                <div className='d-flex justify-content-between mb-2'>
                <span>Shipping:</span>
                <span>${order.data.shipping_cost}</span>

                </div>
                <div className='d-flex justify-content-between mb-2'>
                    <span>Tax:</span>
                    <span>${order.data.tax_amount}</span>

                </div>

                <div className='d-flex justify-content-between mb-2'>
                    <span>Discount:</span>
                    <span className='text-danger'>-${order.data.discount_amount}</span>

                </div>
                <hr/>
                <div className='d-flex justify-content-between mb-2'>
                    <strong>Total:</strong>
                    <strong>${order.data.total}</strong>
                    

                </div>
                

            </Card.Body>
        </Card>

        <Card className='mb-3'>
            <Card.Header>
                <h5 className='mb-0'>Order Status</h5>
            </Card.Header>
            <Card.Body>
                <div className='mb-2'>
                    <strong>Status:</strong> {' '}
                    <Badge bg={getStatusVariant(order.data.status)}>
                        {order.data.status}

                    </Badge>

                </div>
                <div className='mb-2'>
                    <strong>Payment:</strong>{' '}
                    <Badge bg={order.data.payment_status === 'paid' ? 'success' : 'warning'}>
                        {order.data.payment_status}

                    </Badge>

                </div>
                {order.data.status === 'pending' && (
                    <Button variant='outline-danger' size="sm" onClick={handleCancelOrder}>
                        Cancel Order
                    </Button>
                )}
            </Card.Body>
        </Card>
        <Card>
            <Card.Header>
                <h5 className='mb-0'>Shipping Address</h5>
            </Card.Header>
            <Card.Body>
                <address>
                    {order.data.shipping_address.street_address} <br />
                    {order.data.shipping_address.city}, {order.data.shipping_address.state} <br />
                    {order.data.shipping_address.country} {order.data.shipping_address.postal_code}
                </address>
            </Card.Body>
        </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default OrderDetails
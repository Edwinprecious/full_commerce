import React from 'react'
import { Container, Table, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'

import { ordersAPI } from '../../services/api'
import LoadingSpinner from'../../components/UI/LoadingSpinner'  

const Orders = () => {
    const { data: Orders, isLoading }= useQuery(
        ['orders'], () => ordersAPI.list()
    )
    console.log('orders', Orders)

    if (isLoading) return <LoadingSpinner />

    const getStatusVariant = (status) => {
        const variants = {
            pending: 'warning',
            confirmed: 'info',
            processing: 'primary',
            shipped: 'success',
            delivered: 'success',
            cancelled: 'danger',
            refunded: 'secondary'
        }
        return variants[status] || 'secondary'
    }
    return(
        <Container className='py-4'>
            <h2 className='mb-4'>My orders</h2>
            {Orders?.data?.length === 0 ? (
                <div className='text-center py-5'>
                    <h4>No orders found</h4>
                    <p>You haven't placed any orders yet.</p>
                    <Button as={Link} to="/products" variant='primary'>
                    Start Shopping

                    </Button>

                </div>
            ) :(
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Orders?.data?.results?.map(order =>(
                            <tr key={order.id}>
                                <td>{order.order_number}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>${order.total}</td>
                                <td>
                                    <Badge bg={getStatusVariant(order.status)}>
                                        {order.status}
                                    </Badge>

                                </td>
                                <td>
                                    <Button as={Link} to={`/orders/${order.id}`} variant='outline-primary' size='sm'>
                                    View Details
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
}
export default Orders
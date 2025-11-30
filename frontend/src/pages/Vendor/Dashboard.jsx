import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { vendorAPI } from '../../services/api'

const VendorDashoard = () => {
    const { data, stats } = useQuery('vendor-stats', vendorApi.getStats)

    return (
        <Container className='py-4'>
            <h2 className='mb-4'>Vendor Dashboard</h2>

            <Row className='mb-4'>
                <Col mb={3}>
                    <Card className='text-center'>
                        <Card.Body>
                            <Card.Title>Total Products</Card.Title>
                            <h3>{stats?.data?.total_products || 0}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col mb={3}>
                    <Card className='text-center'>
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <h3>{stats?.data?.total_orders || 0}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col mb={3}>
                    <Card className='text-center'>
                        <Card.Body>
                            <Card.Title>pending orders</Card.Title>
                            <h3>{stats?.data?.pending_orders || 0}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col mb={3}>
                    <Card className='text-center'>
                        <Card.Body>
                            <Card.Title>Total Revenue</Card.Title>
                            <h3>{stats?.data?.total_revenue || 0}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col mb={6}>
                    <Card>
                        <Card.Header>
                            <h5 className='mb-0'>Recent orders</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Recent orders list would go here */}
                            <p>No recent orders</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col mb={6}>
                    <Card>
                        <Card.Header>
                            <h5 className='mb-0'>Low Stock Products</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Low stock products list would go here */}
                            <p>No low stock products</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default VendorDashoard
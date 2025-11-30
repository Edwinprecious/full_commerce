import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

const NotFound = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} className='text-center'>
                    <h1 className="display-1">404</h1>
                    <h2 className='mb-4'>Page Not Found</h2>
                    <p className="mb-4">The page you are looking for does not exist or has been removed</p>
                    <Button as={Link} to="/" variant="primary">Go Home</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound
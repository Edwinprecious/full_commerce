import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { productsAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const Categories = () => {
    const { data: categories, isLoading } = useQuery("categories", productsAPI.categories)
    console.log('categories', categories)

    if (isLoading)  return <LoadingSpinner />

    return (
        <Container className="py-4">
            <h2 className="text-center mb-4">Product Categories</h2>
            <Row>
                {categories?.data?.categories?.map(category => (
                    <Col key={category.id} lg={4} mb={6} className="mb-4">
                        <Card as={Link} to={`/categories/${category.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <Card.Img 
                                variant="top" 
                                src={category.image || "/images/placeholder.jpg"}
                                style={{ height: '200px', objectFit: 'cover' }} 
                                />
                            <Card.Body className="text-center">
                                <Card.Title>{category.name}</Card.Title>
                                <Card.Text>{category.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Categories
                               
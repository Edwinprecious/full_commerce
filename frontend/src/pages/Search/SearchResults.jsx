import React from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "react-query";
import { productsAPI } from "../../services/api";
import ProductCard from "../../components/Products/ProductCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q")

    const { data: products, isLoading } = useQuery(
        ["search", query], 
        () => productsAPI.list({ search: query }),
        { enabled: !!query }
    )

    if (isLoading) return <LoadingSpinner />

    return (
        <Container className="py-4">
            <Row>
                <Col>
                    <h2 className=" mb-4">Search Results for "{query}"</h2>
                </Col>
            </Row>

                {products?.data?.results?.length === 0 ? (
                    <Row>
                        <Col className="text-center py-5">   
                            <h4>No products found</h4>
                            <p>Try adjusting your serach terms or filters</p>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        {products?.data?.results?.map(product => (
                            <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
    )
}

export default SearchResults
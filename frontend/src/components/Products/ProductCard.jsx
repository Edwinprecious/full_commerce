import React from "react";
import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from "react-router-dom";
// import { useCart } from '../context/CartContext'
import { useCart } from "../../context/CartContext";
// import { preinitModule } from "react-dom";
import { ROOT } from "../../services/api";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart()

    const handleAddToCart = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        addToCart(product.id)
    }

    return (
        <Card className="product-card h-100">
            <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                <Card.Img
                variant="top"
                src={ROOT + product.primary_image?.image || '/images/placeholder.jpg'}
                className="product-image"
                />

                <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6">{product.name}</Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                        {product.short_description}
                    </Card.Text>

                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="h5 text-primary">${product.price}</span>
                                {product.compare_price && (
                                    <small className="text-muted ms-2 price-original">
                                        ${product.compare_price}
                                    </small>
                                )}
                            </div>
                            {product.discount_percentage > 0 && (
                                <Badge bg="danger" className="price-discount">
                                    -{product.discount_percentage}%
                                </Badge>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <small className={product.in_stock ? 'text-success': 'text-danger'}>
                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </small>
                            {product.average_rating && (
                                <small className="text-warning">
                                    {product.average_rating} ({product.review_count})
                                </small>
                            )}

                        </div>
                        <button
                        variant="primary"
                        size="sm"
                        className="w-100 mt-2"
                        onClick={handleAddToCart}
                        disabled={!product.in_stock}
                        >
                            {product.in_stock ? 'Add to Cart': 'Out of Stock'}

                        </button>

                    </div>
                </Card.Body>
                
            </Link>
        </Card>
    )
}
export default ProductCard
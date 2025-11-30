import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { Container,Badge,Form, Tab, Tabs, Row, Col, Card, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { productsAPI, reviewsAPI } from "../../services/api";
import { useCart } from "../../context/CartContext";
import ReviewList from "../../components/Reviews/ReviewList";
import ProductCard from "../../components/Products/ProductCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { use } from "react";


const ProductDetails = () => {
    const { slug } = useParams()
    const { addToCart } = useCart()
    const [ selectedVariant, setSelectedVariant ] = useState(null)
    const [ quantity, setQuantity ] = useState(1)
    const [ activeImage, setActiveImage ] = useState(0)

    const { data: productResponse, isLoading } = useQuery(
        ['product', slug], 
        () => productsAPI.retrieve(slug)
    )

    const product = productResponse?.data ?? productResponse
                                                                                            
    const { data: relatedProducts } = useQuery(
        ['related-products', slug], 
        () => productsAPI.related(slug),
        { enabled: !!product }
    )

    const { data: reviews } = useQuery(
        ['reviews', product?.id], 
        () => reviewsAPI.list(product?.id),
        { enabled: !!product }
    )

    if(isLoading) return <LoadingSpinner />
    if (!product) return <div>Product not found</div>

    const handleAddToCart = () => {
        addToCart(product.id, quanatity, selectedVariant?.id)
    }

    const primaryImage = product.image?.find(img => img.is_primary) || product.images?.[0]
    const images = product.images || []

    return (
        <Container className="py-4">
            <Row>
                {/* Product images */}
                <Col lg={6}>
                    <div className="mb-3">
                        <img 
                        src={images[activeImage]?.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }} />
                    </div>
                    {images.lenght > 1 && (
                        <Row>
                            {images.map((image, index) => (
                                <Col key={image.id} xs={3} className="mb-2">
                                    <img 
                                    src={image.image}
                                    alt={image.alt_text}
                                    className={ `img-thumbnail cursor-pointer ${activeImage === index ? 'border-primary' : ''}`}
                                    style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                                    onClick={() => setActiveImage(index)}
                                     />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>

                {/* Product info */}
                <Col lg={6}>
                    <h1>{product.name}</h1>

                    <div className="mb-3">
                        {product.average_rating && (
                            <div className="d-flex align-items-center mb-2">
                                <Badge bg="warning" className="me-2">
                                    {product.average_rating} ⭐
                                </Badge>
                                <span className="text-muted">({product.reviews_count} reviews)</span>
                            </div>
                        )}

                        {product.featured && (
                            <Badge bg="success" className="me-2">
                                Featured
                            </Badge>
                        )}
                        <Badge bg={product.in_stock ? 'success' : 'danger'}>
                            {product.in_stock ? 'In stock' : 'Out of stock'}
                        </Badge>
                    </div>

                    <div className="mb-3">
                        <h3 className=" text-primary">${product.price}</h3>
                        {product.compare_price && product.compare_price > product.price && (
                            <div>
                                <small className="text-muted price-original me-2">
                                    ${product.compare_price}
                                </small>
                                <Badge bg="danger">
                                    Save {product.discount_percentage}%
                                </Badge>
                            </div>
                        )}
                    </div>
                    <p className="lead">{product.short_description}</p>

                    {/* Product variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-3">
                            <h5>Options</h5>
                            {product.variants.map(variant => (
                                <Button
                                key={variant.id}
                                variant={selectedVariant?.id === variant.id ? 'primary' : 'outline-primary'}
                                size="sm"
                                className="me-2 mb-2"
                                onClick={() => setSelectedVariant(variant)}
                                >
                                    {variant.value}
                                    {variant.price_adjustment > 0 && ` (+$${variant.price_adjustment})` }
                                </Button>
                            ))}
                                        
                        </div>
                    )}
                            
                    {/* Quantity and Add to Cart */}
                    <Row className="mb-4">
                    <Col sm={4}>
                        <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                        </Form.Group>
                    </Col>
                    <Col sm={8} className="d-flex align-items-end">
                        <Button
                        variant="primary"
                        size="lg"
                        className="w-100"
                        onClick={handleAddToCart}
                        disabled={!product.in_stock}
                        >
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </Col>
                    </Row>

                    {/* Product Features */}
                    <Card className="mb-3">
                    <Card.Body>
                        <Row>
                        <Col xs={6} className="text-center">
                            <div className="text-primary mb-1">🚚</div>
                            <small>Free Shipping</small>
                        </Col>

                        <Col xs={6} className="text-center">
                            <div className="text-primary mb-1">↩️</div>
                            <small>30-Day Returns</small>
                        </Col>
                        </Row>
                    </Card.Body>
                    </Card>
                <Col/>
            <Row/>

                    {/* Product Details Tabs */}
        <Row className="mt-5">
            <Col>
                <Tabs defaultActiveKey="description" className="mb-3">
                    <Tab eventKey="description" title="Description">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />

                        {/* Attributes */}
                        {product.attributes && product.attributes.length > 0 && (
                        <div className="mt-4">
                            <h5>Specifications</h5>
                            <Row>
                            {product.attributes.map(attr => (
                                <Col key={attr.id} md={6}>
                                <strong>{attr.name}:</strong> {attr.value}
                                </Col>
                            ))}
                            </Row>
                        </div>
                        )}
                    </Tab>

                    <Tab eventKey="reviews" title={`Reviews (${product.review_count || 0})`}>
                        <ReviewList
                        productId={product.id}
                        reviews={reviews?.data}
                        averageRating={product.average_rating}
                        reviewCount={product.review_count}
                        />
                    </Tab>
                </Tabs>
            </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts?.data && relatedProducts.data.length > 0 && (
        <Row className="mt-5">
            <Col>
            <h3>Related Products</h3>
            <Row>
                {relatedProducts.data.map(product => (
                <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                    <ProductCard product={product} />
                </Col>
                ))}
            </Row>
            </Col>
        </Row>
      )}

                </Col>
            </Row>
        </Container>
    )
  
}    

export default ProductDetails



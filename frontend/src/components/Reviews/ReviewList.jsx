import React, { useState } from 'react'
import { Card, Form, Button, Row, Col, Badge} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { reviewsAPI } from '../../services/api'


const ReviewList = ({ productId, reviews, averageRating, reviewCount }) => {
    const { isAuthenticated } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await reviewsAPI.create(productId, formData)
            setShowForm(false)
            setFormData({
                rating: 5,
                title: '',
                comment: ''
            })
                //refresh reviews
            } catch (error) {
                console.log('Failed to submit review', error)
            }
        }

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5>Custormers Reviews</h5>
                        <div className="d-flex align-items-center">
                            <Badge bg="warning" className="me-2">
                                {averageRating} ⭐
                            </Badge>
                            <span className='text-muted'>({reviewCount} reviews)</span>
                        </div>
                    </div>
                    {isAuthenticated && (
                        <Button variant='primary' onClick={() => setShowForm(!showForm)}>Add Review</Button>
                    )}
                </div>

                {showForm && (
                    <Card className="mb-4">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-3'>  
                                    <Form.Label>Rating</Form.Label>
                                        <Form.Select
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        >
                                            <option value={5}>5 ⭐ - Excellent</option>
                                            <option value={4}>4 ⭐ - Very Good</option>
                                            <option value={3}>3 ⭐ - Good</option>
                                            <option value={2}>2 ⭐ - Fair</option>
                                            <option value={1}>1 ⭐ - Poor</option>
                                        </Form.Select>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Review</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">Submit Review</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                )}

                {reviews?.map((review) => (
                    <Card className="mb-3" key={review.id}>
                        <Card.Body>
                            <Row>
                                <Col mb={8}>
                                    <h6>{review.title}</h6>
                                    <div className="mb-2">
                                        <Badge bg="warning">{review.rating} ⭐</Badge>
                                        <span className="text-muted ms-2">by {review.user.first_name} {review.user.last_name}</span>
                                    </div>
                                    <p className='mb-0'>{review.comment}</p>
                                </Col>
                                <Col mb={4} className="text-end">
                                    <small className="text-muted">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </small>
                                    {review.is_verified && (
                                        <Badge bg="success" className="ms-2">Verified purchase</Badge>
                                    )}
                                    
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        )

                
    }

export default ReviewList    
// frontend/src/pages/node/profile.tsx

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Tab, Tabs, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const {user, updateProfile} = useAuth()
  const { formData, setFormData } = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    date_of_birth: user?.date_of_birth || '',
    phone_number: user?.phone_number || '',
    avatar: null
  })
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const submitData = new FormData()
    submitData.append('first_name', formData.first_name)
    submitData.append('last_name', formData.last_name)
    submitData.append('date_of_birth', formData.date_of_birth)
    submitData.append('phone_number', formData.phone_number)
    if (formData.avatar){
        submitData.append('avatar', formData.avatar)
    }

    try {
      const result = await updateProfile(submitData)
      if (result.success) {
        setMessage('Profile updated successfully')
      } else {
        setError(result.error ?.detail || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occured. Please try again')
    } finally {
      setLoading(false)
    }
    }
  

  return (
      <Container className='py-4'>
        <Row>
           <Col md={8} className='mx-auto'>
              <h2 className="text-center mb-4">user Profile</h2>
              <Tabs defaultActiveKey="profile" className="mb-3">
                <Tab eventKey="profile" title="Profile information">
                    <Card>
                        <Card.Body>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" name="first_name" value={formData?.first_name} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" name="last_name" value={formData?.last_name} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={user?.email} disabled />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" name="phone_number" value={formData?.phone_number} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control type="date" name="date_of_birth" value={formData?.date_of_birth} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Avatar</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="securrity" title="security">
                    <Card>
                        <Card.Body>
                            <h5>Change Password</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Button variant="primary">update Password</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Tab>
               </Tabs>     
           </Col>
        </Row>
      </Container>
    )

}

export default Profile  
import React, { useState } from 'react'
import { Container, Row, Col, Button, Form, Modal, Card, Badge } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { userAPI } from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const Addresses = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const queryClient = useQueryClient()

  const { data: addresses, isLoading } = useQuery('addresses', userAPI.getAddresses)

  const mutation = useMutation(
    (data) =>
      editingAddress
        ? userAPI.updateAddress(editingAddress.id, data)
        : userAPI.createAddress(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses')
        setShowModal(false)
        setEditingAddress(null)
      }
    }
  )

  const deleteMutation = useMutation(
    (id) => userAPI.deleteAddress(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses')
      }
    }
  )

  const [formData, setFormData] = useState({
    address_type: 'shipping',
    street_address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    is_default: false
  })

  const handleShow = (address = null) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        address_type: address.address_type,
        street_address: address.street_address,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postal_code,
        is_default: address.is_default
      })
    } else {
      setEditingAddress(null)
      setFormData({
        address_type: 'shipping',
        street_address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        is_default: false
      })
    }

    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingAddress(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Container className='py-4'>
      <Row>
        <Col>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2>My Addresses</h2>
            <Button variant='primary' onClick={() => handleShow()}>
              Add New Address
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {addresses?.data?.map(address => (
          <Col key={address.id} md={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  {address.address_type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
                  {address.is_default && <Badge bg="primary" className='ms-2'>Default</Badge>}
                </Card.Title>
                <Card.Text>
                  {address.street_address}<br />
                  {address.city}, {address.state}<br />
                  {address.country} {address.postal_code}
                </Card.Text>

                <Button variant='outline-primary' size='sm' className='me-2' onClick={() => handleShow(address)}>
                  Edit
                </Button>
                <Button variant='outline-danger' size='sm' onClick={() => handleDelete(address.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAddress ? "Edit Address" : "Add New Address"}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className='mb-3'>
              <Form.Label>Address Type</Form.Label>
              <Form.Select name="address_type" value={formData.address_type} onChange={handleChange}>
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type='text'
                name='street_address'
                value={formData.street_address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type='text'
                    name='postal_code'
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type='checkbox'
              name='is_default'
              label='Set as default address'
              checked={formData.is_default}
              onChange={handleChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Cancel
            </Button>

            <Button variant='primary' type='submit'>
              {mutation.isLoading ? 'Saving...' : 'Save Address'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Addresses
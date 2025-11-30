import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { productsAPI } from '../../services/api'
import ProductCard from '../../components/Products/ProductCard'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

// import { list } from '../../context/CartContext'

const ProductList = () => {


  const { slug } = useParams()

  const [filters, setFilters] = useState({
    category: '',
    search: '',
    min_price: '',
    max_price: '',
    in_stock: false,
    featured: false,
    ordering: '-created_at'
  })

//   const list = async (filters) => {
//   const token = localStorage.getItem("access");
//   return axios.get("/api/products/products/", {
//     params: filters,
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };


  const { data, isLoading, isError } = useQuery(
    ['products', filters],
    () => productsAPI.list(filters),
    { keepPreviousData: true }
  )

  const categoriesQuery = useQuery('categories', productsAPI.categories)
  console.log('categoriesQuery:', categoriesQuery);
  const productsQuery = useQuery('products', productsAPI.products)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

//   useEffect(() => {
//   if (data) {
//     console.log("API response:", data);
//   }
// }, [data]);



  useEffect(() => {
  if (slug && categoriesQuery.data?.data?.categories) {
    const matchedCategory = categoriesQuery.data.data.categories.find(
      (cat) => cat.slug === slug
    )
    if (matchedCategory) {
      setFilters((prev) => ({
        ...prev,
        category: matchedCategory.id
      }))
    }
  }
}, [slug, categoriesQuery.data])


  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      min_price: '',
      max_price: '',
      in_stock: false,
      featured: false,
      ordering: '-created_at'
    })
  }


  const products = data?.results || []
  // const totalCount = data?.count || 0
  console.log('products:', products);
  console.log("Parsed products:", data?.data?.results || data?.data?.products || data?.data);
  console.log("Full response object:", data);
console.log("Axios payload:", data?.data);


  // alert (json.string)
  console.log('products data', data);
  console.log('products data type:', typeof data?.data);
  console.log('products data.data:', data?.data);

  console.log("CATEGORIES RESPONSE:", categoriesQuery.data);
  console.log("products RESPONSE:", productsQuery.data);


  const hasFilters = Object.values(filters).some(
    value => value !== '' && value !== false && value !== '-created_at'
  )

if (isLoading) {
  console.log("Loading products...");
}
if (isError) {
  console.log("Error fetching products");
}
if (data) {
  console.log("Raw API response:", data);
  console.log("Parsed products:", data?.data?.results || data?.data?.products || data?.data);
}

if (data) {
  console.log("API response:", data);
}


  return (
    <Container className="py-4">
      <Row>

        {/* Sidebar */}
        <Col lg={3}>
          
          <div className="filter-sidebar" style={{ position: "sticky", top: "70px" }}>

            <h5>Filters</h5>

            <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {Array.isArray(categoriesQuery.data?.data?.categories) &&
                categoriesQuery.data?.data?.categories?.map(category => (
                  
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>

                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="1000"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="In Stock Only"
                checked={filters.in_stock}
                onChange={(e) => handleFilterChange('in_stock', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Featured Products"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
              </Form.Select>
            </Form.Group>

            {hasFilters && (
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear Filters
              </Button>
            )}
          </div>
        </Col>

        {/* Products Section */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Products</h4>
            <small className="text-muted">
              Showing {products.length} of {data?.count || 0} products
            </small>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <div className="text-center py-5">
              <p className="text-danger">Failed to load products. Please try again.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <Row>
              {products.map(product => (
                <Col key={product.id} lg={4} md={6} className="mb-4">
                  <ProductCard product={product} />
                  

                </Col>
              ))}
            </Row>
          )}
        </Col>

      </Row>
    </Container>
  )
}

export default ProductList

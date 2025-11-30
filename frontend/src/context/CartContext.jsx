import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within an CartProvider");
    }
return context;
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)
    const { isAuthenticated, authChecked } = useAuth()
    const [fetchAttempted, setFetchAttempted] = useState(false)


    // useEffect(() => {
    //     fetchCart()
    // }, [])

    const fetchCart = async () => {
        // Only fetch if authenticated and we haven't already attempted

        if (!isAuthenticated){
            return
        }

        try {
            setLoading(true)
            const response = await cartAPI. retrieve()
            setCart(response.data)
            setFetchAttempted(true)
        } catch (error) {
            console.log('Failed to fetch cart', error)
            setCart(null)
            setFetchAttempted(true)
            

            // only show error non-auth errors
            if (error.response?.status !== 401){
                toast.error('Failed to load cart, you\'re not logged in')
            }
        } finally {
            setLoading(false)
        }
    }

    const addToCart = async (productId, quantity = 1, variantId = null) => { 
        if (!isAuthenticated){
            toast.error('please login to add items to cart')
            return false
        }
       try {
        await cartAPI.addItem({ 
            product_id: productId, 
            quantity: quantity, 
            variant_id: variantId 
        })
        await fetchCart()
        toast.success('Product added to cart successfully!')
        return true
       } catch (error) {
        toast.error('Failed to add product to cart.', error)
        const message = error.response?.data?.detail || 'Failed to add product to cart'
        toast.error(message)
        return false
       }
    }

    const updateCartItem = async (itemId, quantity) => {
        try {
            if (quantity === 0) {
                await removeFromCart(itemId)
            } else {
                await cartAPI.updateItem(itemId, { quantity })
                await fetchCart()
                toast.success('Cart updated successfully!')
            }
        } catch (error) {
            toast.error('Failed to update cart:', error)
            toast.error('Failed to update cart item')
        }
    }

    const removeFromCart = async (itemId) => {
        try {
            await cartAPI.removeItem(itemId)
            await fetchCart()
            toast.success('item removed from cart')
            return true
        } catch (error) {
            console.error('Failed to remove from cart:', error)
            toast.error('Failed to remove item from cart.')
            return false
        }
    }
        
    const clearCart = async () => {
        try {
            await cartAPI.clear()
            await fetchCart()
            toast.success('Cart cleared')
            return true
        } catch (error) {
            console.error('Failed to clear cart:', error)
            toast.error('Failed to clear cart.')
            return false
        }
    }

    // Reset fetech attempt when auth state changes


    useEffect(() => {
        if (isAuthenticated){
            setFetchAttempted(false)
        }else {
            setCart(null)
            setFetchAttempted(false)
        }
    }, [isAuthenticated])

    // Fetch cart only when authenticated and auth check is complete

    useEffect(()=>{
        if (isAuthenticated && authChecked && !fetchAttempted){
            fetchCart()
        }
    },[isAuthenticated, authChecked, fetchAttempted])

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        cartItemsCount: cart?.total_items || 0, 
        cartSubtotal: cart?.subtotal || 0
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
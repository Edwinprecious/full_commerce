import React, {createContext, useContext, useState, useEffect} from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
// import { useAuth } from "../../../context/AuthContext";

const AuthContext = createContext()

export const useAuth = () => {
        const context = useContext(AuthContext)
        if (!context) {
                throw new Error('useAuth must be within an AuthProvider')
        }
        return context
}

export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(true)
        const [authChecked, setAuthChecked] = useState(false)

        useEffect(()=>{
                checkAuth()
        },[])

        const checkAuth = async () => {
                const token = localStorage.getItem('access_token');
        if(!token){
                // setUser(null)
                setLoading(false);
                setAuthChecked(true);
                return
        }
                try {
                        const response = await authAPI.profile()
                        setUser(response.data)
                        
                } catch (error) {
                        console.log(`check auth error:  ${error}`)
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        setUser(null);
                }finally {
                        setLoading(false)
                        setAuthChecked(true);
                }
        }

        const login = async (Credentials) => {
                try {
                        const response = await authAPI.login(Credentials)
                        const {access, refresh, user} = response.data

                        localStorage.setItem('access_token', access)
                        localStorage.setItem('refresh_token', refresh)
                        setUser(user)

                        toast.success('Login successful')
                        return { success: true, user }
                }catch (error) {
                        console.log('login error:', error)
                        const message = error.response?.data?.details || error.response?.data?.non_field_errors?.[0] || 'Login failed. please check your credentials.'
                        toast.error('Login failed. please check your credentials.')
                        return {
                                success: false, 
                                error: {
                                        details: message,
                                        ...error.response?.data
                                }
                        }
                }
        }

        const register = async (userData) => {
                try {
                        const response = await authAPI.register(userData)
                        toast.success('Registration successful! please login.')
                        return {success: true}
                }catch (error) {
                        toast.error('Registration failed. please try again.')
                        return {success: false, error: error.response?.data }
                }
        }

        const logout = async () => {
                try {
                        await authAPI.logout()
                }catch (error) {
                        console.error('Logout error.', error)
                }finally {
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        setUser(null)
                        toast.success('Logged out sucessfull!')
                }
        }

        const updatedProfile = async (data) => {
                try {
                        const response = await authAPI.updatedProfile(data)
                        setUser(response.data)
                        toast.success('Profile updated successfully!')
                        return { success: true }
                }catch (error) {
                        toast.error('Failed to update profile.')
                        return { sucess: false, error: error.response?.data}
                }
        }

        const value = {
                user,
                loading,
                login,
                register,
                logout,
                updatedProfile,
                authChecked,
                isAuthenticated: !!user,
        }

        return(
                <AuthContext.Provider value={value}>
                        {children}
                </AuthContext.Provider>
        )
}
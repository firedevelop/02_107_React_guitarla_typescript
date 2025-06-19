import { useState, useEffect, useMemo } from "react"
import db from "../data/db"
import type { CartItem, Guitar } from "../types"

export default function useCart(){
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
      
     const [data] = useState(db);
     const [cart, setCart] = useState(initialCart)
    
     useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
     }, [cart])
     function addToCart(item : Guitar){
    
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if(itemExists>=0){
            if(cart[itemExists].quantity >= 5) return
            const updateCart = [...cart]
            updateCart[itemExists].quantity++
            setCart(updateCart)
        }else{
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])
            
        }
     }
    
     function removeFromCart(id : Guitar['id']){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
        
     }
    
     function decreaseQuantity(id : Guitar['id']){
        const updateCart = cart.map( item => {
            if(item.id === id && item.quantity > 1){
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
     }
    
     function increaseQuantity(id : Guitar['id']){
        const updateCart = cart.map( item => {
            if(item.id === id && item.quantity < 5){
                return{
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
     }
    
     function clearCart(){
        setCart([])
     }

    // State derivado

    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo( () => cart.reduce((total,item) => total + (item.quantity * item.price), 0), [cart])

     return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
     }
}
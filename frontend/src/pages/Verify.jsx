import React, { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  // ضفنا backendUrl هنا عشان نعرف نكلم السيرفر
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
  
  // صلحنا الأقواس خليناها [] بدل {}
  const [searchParams, setSearchParams] = useSearchParams()

  // صلحنا حرف الـ P عشان يطابق المتغير اللي فوق
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null
      }
      
      // صلحنا الـ backendUrl وضفنا الـ / قبل api وتأكدنا من اسم المسار
      const response = await axios.post(
        backendUrl + '/api/order/verifyStripe', 
        { success, orderId }, 
        { headers: { token } }
      )

      if (response.data.success) {
        setCartItems({})
        navigate('/orders')
      } else {
        navigate('/cart')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token])

  return (
    <div >
    </div>
  )
}

export default Verify

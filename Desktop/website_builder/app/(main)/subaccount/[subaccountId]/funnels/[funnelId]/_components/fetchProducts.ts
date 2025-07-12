"use server"
import { getConnectAccountProducts } from '@/lib/stripe/stripe-actions'

const fetchProducts = async (connectedId: string) => {
  const products = await getConnectAccountProducts( connectedId )
  return products
}

export default fetchProducts
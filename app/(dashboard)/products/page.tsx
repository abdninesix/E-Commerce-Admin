"use client"

import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { columns } from '@/components/products/ProductColumns'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Products = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      })
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("[products_GET]", error);
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  console.log(products)

  return loading ? <Loader/> : (
    <div>
      <div className='flex justify-between'>
        <p className='text-heading2-bold'>Products</p>
        <Button onClick={()=>router.push("/products/new")} className='bg-blue-1 text-white'><Plus/>Create Product</Button>
      </div>
      <Separator className='bg-gray-1 my-4'/>
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  )
}

export default Products
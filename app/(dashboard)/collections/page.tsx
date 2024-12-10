'use client'

import { columns } from '@/components/collections/CollectionColumns';
import { DataTable } from '@/components/custom ui/DataTable';
import Loader from '@/components/custom ui/Loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Collections = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      })
      const data = await res.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.error("[collections_GET]", error);
    }
  }

  useEffect(() => {
    getCollections()
  }, [])

  console.log(collections)

  return loading ? <Loader/> : (
    <div>
      <div className='flex justify-between'>
        <p className='text-heading2-bold'>Collections</p>
        <Button onClick={()=>router.push("/collections/new")} className='bg-blue-1 text-white'><Plus/>Create Collection</Button>
      </div>
      <Separator className='bg-gray-1 my-4'/>
      <DataTable columns={columns} data={collections} searchKey="title" />
    </div>
  )
}

export default Collections
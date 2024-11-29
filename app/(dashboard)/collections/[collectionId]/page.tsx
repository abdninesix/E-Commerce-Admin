'use client'

import CollectionForm from '@/components/collections/CollectionForm'
import Loader from '@/components/custom ui/Loader'
import React, { useEffect, useState } from 'react'

const CollectionDetails = ({params}:{params: {collectionId: string}}) => {

  const [loading, setLoading] = useState(true)
  const [collectionDetails, setCollectionDetails] = useState<CollectionType|null>(null)
  const getCollectionDetails = async () => {
    try {
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCollectionDetails(data)
      setLoading(false)
    } catch (error) {
      console.log("[CollectionId_GET]", error)
    }
  }

  useEffect(() => {
    getCollectionDetails()
  },[])

  return loading ? <Loader/> : (
    <div className='p-10'>
        <p className='text-heading2-bold'>Collection details</p>
        <CollectionForm initialData={collectionDetails}/>
    </div>
  )
}

export default CollectionDetails
'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from 'react-hot-toast'

interface DeleteProps {
  id: string;
}

const Delete: React.FC<DeleteProps> = ({id}) => {

  const [loading, setLoading] = useState(false)
  const onDelete = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        window.location.href="/collections"
        toast.success("Collection deleted")
      }
    } catch (error) {
      console.log(error)
      toast.error("Soemthing went wrong. Try again.")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className='bg-red-1 text-white'>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white text-gray-1'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-red-1'>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className='bg-red-1 text-white'>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default Delete
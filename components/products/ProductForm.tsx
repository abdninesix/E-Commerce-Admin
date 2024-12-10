'use client'

import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import ImageUpload from '../custom ui/ImageUpload'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Delete from '../custom ui/Delete'
import MultiText from '../custom ui/MultiText'
import MultiSelect from '../custom ui/MultiSelect'
import Loader from '../custom ui/Loader'

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(1000).trim(),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
})

interface ProductFormProps {
  initialData? : ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData, collections: initialData.collections.map((collection) => collection._id),
    } : {
      title: "", description: "", media: [], category: "", collections: [], tags: [], sizes: [], colors: [], price: 0.1, expense: 0.1,
    },
  })

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET"
      })
      const data = await res.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.log("CollectionS_GET", error)
      toast.error("Something went wrong! Please try again")
    }
  }

  useEffect(() => {
    getCollections()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      setLoading(true)
      const url = initialData ? `/api/products/${initialData._id}` : "/api/products"; //Another way to do this is const params = useParams() and then replace initialData._id with params.collecitonId
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        setLoading(false)
        toast.success(`Product ${initialData ? "updated" : "created"}`)
        window.location.href = "/products"
        router.push("/products")
      }
    } catch (error) {
      console.log("[Product_POST]", error)
      toast.error("Failed to create product. Please try again.")
    }
  }

  return loading ? <Loader /> : (
    <div>
      {initialData ? (
        <div className='flex items-center justify-between'>
          <p className='text-heading2-bold'>Edit product</p>
          <Delete item='product' id={initialData._id} />
        </div>

      ) : (
        <p className='text-heading2-bold'>Create product</p>
      )}
      <Separator className='bg-gray-1 mt-4 mb-7' />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="description" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.1$" {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.1$" {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="category" {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) => field.onChange([...field.value.filter((item) => item !== tagToRemove)])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Search collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) => field.onChange([...field.value, _id])}
                        onRemove={(idToRemove) => field.onChange([...field.value.filter((collectionId) => collectionId !== idToRemove)])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="colors"
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="sizes"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (size) => size !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='flex gap-10'>
            <Button type="submit" className='bg-blue-1 text-white'>Submit</Button>
            <Button type="button" onClick={() => router.push('/products')} className='bg-blue-1 text-white'>Discard</Button>
          </div>
        </form>
      </Form>

    </div>
  )
}

export default ProductForm
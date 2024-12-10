'use client'

import React, { useState } from 'react'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';


interface MultiSelectProps {
    placeholder: string; collections: CollectionType[]; value: string[]; onChange: (value: string) => void; onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ placeholder, collections, value, onChange, onRemove }) => {

    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    let selected: CollectionType[]

    if (value.length === 0) {
        selected = []
    } else {
        selected = value.map((id) => collections.find((collection) => collection._id === id)) as CollectionType[]
    }

    const selectables = collections.filter((collection) => !selected.includes(collection))

    return (
        <Command className='overflow-visible bg-white'>
            <div className='flex flex-col'>
                <CommandInput placeholder={placeholder} value={inputValue} onValueChange={setInputValue} onBlur={() => setOpen(false)} onFocus={() => setOpen(true)} />
                <div className='flex gap-1 flex-wrap'>
                    {selected.map((collection) => (
                        <Badge key={collection._id} className='bg-gray-1 text-white'>
                            {collection.title}
                            <button className='ml-1 hover:text-red-1' onClick={() => onRemove(collection._id)}><X className='w-3 h-3' /></button>
                        </Badge>
                    ))}
                </div>

            </div>

            <div className='relative mt-2'>
                {open && (
                    <CommandList>
                        <CommandGroup className='absolute w-full z-10 top-0 overflow-auto rounded-md shadow-md'>
                            {selectables.map((collection) => (
                                <CommandItem className='cursor-pointer hover:text-blue-1' key={collection._id} onSelect={() => { onChange(collection._id); setInputValue("");}} onMouseDown={(e) => e.preventDefault()}>
                                    {collection.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                )}
            </div>
        </Command>

    )
}

export default MultiSelect
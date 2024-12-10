'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface MultiTextProps {
    placeholder: string; value: string[]; onChange: (value: string) => void; onRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({ placeholder, value, onChange, onRemove }) => {

    const [inputValue, setInputValue] = useState("");

    const addValue = (item: string) => {
        onChange(item);
        setInputValue("");
    }
    return (
        <>
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addValue(inputValue)
                    }
                }}
            />

            <div className='flex flex-wrap gap-1 mt-4'>
                {value.map((items, index) => (
                    <Badge key={index} className='bg-gray-1 text-white'>
                        {items}
                        <button className='ml-1 rounded-full hover:text-red-1' onClick={()=>onRemove(items)}><X className='h-3 w-3'/></button>
                    </Badge>
                ))}
            </div>
        </>

    )
}

export default MultiText
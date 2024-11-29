import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Plus, Trash } from 'lucide-react';

interface ImageUploadProps {
    value: string[]; onChange: (value: string) => void; onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove }) => {

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    return (
        <div>
            <div className='mb-4 flex flex-wrap items-center gap-4'>
                {value.map((url)=>(
                    <div className='relative h-[200px] w-[200px]'>
                        <div className='absolute top-0 right-0 z-10'><Button onClick={()=>onRemove(url)} size="sm" className='bg-red-1 text-white'><Trash/></Button></div>
                        <Image src={url} alt='collection' fill className='object-cover rounded-lg' />
                    </div>
                    
                ))}
            </div>
            <CldUploadWidget uploadPreset="borcella" onSuccess={onUpload}>
                {({ open }) => {
                    return (
                        <Button onClick={() => open()} className='bg-gray-1 text-white'>
                            <Plus/>
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>

    )
}

export default ImageUpload
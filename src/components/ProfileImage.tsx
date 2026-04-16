import { useRef } from 'react'
import { Trash, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DEFAULT_AVATAR } from '~/lib/constants'
import { compressImage } from '~/lib/helpers'

type ProfileImageProps = {
  image?: string | null
  imageRemoved: boolean
  imagePreview: string | null
  setImageRemoved: (removed: boolean) => void
  setImagePreview: (preview: string | null) => void
}

export default function ProfileImage({
  image,
  imageRemoved,
  imagePreview,
  setImageRemoved,
  setImagePreview,
}: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayImage = imageRemoved ? DEFAULT_AVATAR : imagePreview || image || DEFAULT_AVATAR

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setImagePreview(compressed)
    setImageRemoved(false)
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setImageRemoved(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='relative size-24 rounded-full overflow-hidden ring-2 ring-border'>
        <img src={displayImage} alt='Profile' className='size-full object-cover' />
      </div>
      <Input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
      <div className='flex gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload data-icon='inline-start' className='size-3.5' />
          Upload
        </Button>
        {(image || imagePreview) && !imageRemoved && (
          <Button type='button' variant='destructive' size='sm' onClick={handleRemoveImage}>
            <Trash data-icon='inline-start' className='size-3.5' />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}

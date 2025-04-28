import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function PublishTab() {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    tags: ''
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (100KB limit)
      const maxSizeInBytes = 100 * 1024; // 100KB in bytes
      if (file.size > maxSizeInBytes) {
        toast.error(
          `File size for '${file.name}' exceeds 100KB limit. Please choose a smaller file.`
        );
        setCoverImage(null);
        setCoverImagePreview(null);
        event.target.value = ''; // Clear the input field
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width > 300 || img.height > 300) {
          toast.error(
            `Image dimensions for '${file.name}' must be no larger than 300x300 pixels.`
          );
          setCoverImage(null);
          setCoverImagePreview(null);
          event.target.value = ''; // Clear the input field
        } else {
          setCoverImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setCoverImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      img.onerror = () => {
        toast.error('Failed to load image. Please select a valid image file.');
        setCoverImage(null);
        setCoverImagePreview(null);
        event.target.value = ''; // Clear the input field on error
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.genre ||
      !formData.description ||
      !coverImage
    ) {
      console.error('Please fill in all fields and upload a cover image');
      return;
    }

    try {
      console.log('Form submitted:', formData, coverImage);
      // Reset form after submission
      setFormData({
        name: '',
        genre: '',
        description: '',
        tags: ''
      });
      setCoverImage(null);
      setCoverImagePreview(null);
    } catch (error) {
      console.error('Failed to submit form');
      console.error(error);
    }
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl text-neoplay-green'>
            Publish a New Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='name'>Game Name</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Enter game title'
                className='placeholder:text-gray-500'
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='genre'>Genre</Label>
              <Input
                id='genre'
                name='genre'
                value={formData.genre}
                onChange={handleChange}
                required
                placeholder='Enter game genre'
                className='placeholder:text-gray-500'
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                required
                placeholder='Describe your game'
                className='min-h-[100px] placeholder:text-gray-500'
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='coverImage'>Cover Image</Label>
              <div className='flex items-center'>
                <input
                  id='coverImage'
                  type='file'
                  accept='image/*'
                  onChange={handleCoverImageChange}
                  className='hidden'
                />
                <Button
                  asChild
                  className='bg-neoplay-green hover:bg-neoplay-green-dark text-black cursor-pointer'
                >
                  <label htmlFor='coverImage'>Choose File</label>
                </Button>
                {coverImage && (
                  <span className='ml-2 text-sm text-neoplay-green'>
                    {coverImage.name}
                  </span>
                )}
              </div>
              {coverImagePreview && (
                <div className='mt-2'>
                  <img
                    src={coverImagePreview}
                    alt='Cover Preview'
                    style={{ maxWidth: 100, maxHeight: 100 }}
                  />
                </div>
              )}
            </div>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='tags'>Tags (comma separated)</Label>
              <Input
                id='tags'
                name='tags'
                value={formData.tags}
                onChange={handleChange}
                placeholder='action, adventure, rpg'
                className='placeholder:text-gray-500'
                autoComplete='off'
              />
            </div>
            <Button
              type='submit'
              className='w-full mt-4 bg-neoplay-green hover:bg-neoplay-green-dark text-black'>
              Publish Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublishTab;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PublishTab() {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    coverImageUrl: '',
    tags: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      genre: '',
      description: '',
      coverImageUrl: '',
      tags: ''
    });
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl'>Publish a New Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Game Name</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Enter game name'
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
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                required
                placeholder='Describe your game'
                className='min-h-[100px]'
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='coverImageUrl'>Cover Image URL</Label>
              <Input
                id='coverImageUrl'
                name='coverImageUrl'
                value={formData.coverImageUrl}
                onChange={handleChange}
                required
                placeholder='https://example.com/image.jpg'
                autoComplete='off'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='tags'>Tags (comma separated)</Label>
              <Input
                id='tags'
                name='tags'
                value={formData.tags}
                onChange={handleChange}
                placeholder='action, adventure, rpg'
                autoComplete='off'
              />
            </div>
            <Button type='submit' className='w-full mt-4'>
              Publish Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PublishTab;

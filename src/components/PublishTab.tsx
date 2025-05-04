import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import useCurrentGameState from '@/store/useCurrentGameState';
import { publishGameApi } from '@/api/publishApi';

export function PublishTab() {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    tags: '',
    coverImage: ''
  });

  const { screenshotData, currentGameId, allGameFiles } = useCurrentGameState();

  useEffect(() => {
    if (screenshotData) {
      setFormData((prev) => ({ ...prev, coverImage: screenshotData }));
    }
  }, [screenshotData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.genre ||
      !formData.description ||
      !formData.coverImage
    ) {
      console.error('Please fill in all fields and capture a screenshot');
      return;
    }

    try {
      const response = await publishGameApi({
        ...formData,
        id: currentGameId
      });
      console.log('response', response);

      if (response.published === true) {
        toast.success('Game published successfully');
        setFormData({
          name: '',
          genre: '',
          description: '',
          tags: '',
          coverImage: ''
        });
        return;
      }
      toast.error('Failed to publish game');
    } catch (error) {
      console.error('Failed to submit form');
      console.error(error);
    }
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card className='w-full  border-neoplay-green'>
        <CardHeader>
          <CardTitle className='text-2xl text-neoplay-green'>
            Publish a New Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='name'>Game Title</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='Enter game title'
                className='placeholder:text-gray-500'
                // autoComplete='off'
              />
            </div>
            <div className='grid gap-2 text-neoplay-green'>
              <Label htmlFor='genre'>Genre</Label>
              <Input
                id='genre'
                name='genre'
                value={formData.genre}
                onChange={handleChange}
                required
                placeholder='Enter game genre'
                className='placeholder:text-gray-500'
                // autoComplete='off'
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
                // autoComplete='off'
              />
            </div>
            <div className='mb-4'>
              <div className='grid gap-2 text-neoplay-green'>
                <Label htmlFor='description'>Cover Image</Label>
              </div>
              {formData.coverImage ? (
                <div className='mt-2'>
                  <img
                    src={formData.coverImage}
                    alt='Screenshot Preview'
                    className='max-w-xs max-h-48 object-contain'
                  />
                </div>
              ) : (
                <p className='text-gray-500 text-sm pt-2'>
                  No cover image captured yet, capture on Preview Tab.
                </p>
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
                // autoComplete='off'
              />
            </div>
            <Button
              disabled={allGameFiles.length === 0}
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

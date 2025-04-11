'use client';

import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/lib/api/services/marketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import useUser from '@/hooks/use-user';

export default function ItemDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: user } = useUser();
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['marketplace-item', id],
    queryFn: () => marketplaceService.getItem(id as string)
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['marketplace-messages', id],
    queryFn: () => marketplaceService.getMessages(id as string)
  });

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;
    
    try {
      await marketplaceService.sendMessage({
        item_id: id as string,
        sender_id: user.id,
        receiver_id: item?.seller_id as string,
        message: message.trim()
      });
      setMessage('');
      setShowMessageForm(false);
      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !item) {
    return <div className="container mx-auto p-4">Error loading item</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={item.images[0] || '/placeholder-item.jpg'}
              alt={item.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {item.images.slice(1).map((image, index) => (
              <div key={index} className="relative h-24">
                <Image
                  src={image}
                  alt={`${item.title} - ${index + 2}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
              <CardDescription className="text-xl">₹{item.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{item.condition}</Badge>
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">{item.description}</p>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Seller Information</h3>
                <p>Name: {item.seller?.full_name}</p>
                <p>Student ID: {item.seller?.student_id}</p>
              </div>

              {item.status === 'available' && (
                <div className="space-y-4">
                  <Button className="w-full" onClick={() => setShowMessageForm(!showMessageForm)}>
                    {showMessageForm ? 'Cancel' : 'Contact Seller'}
                  </Button>
                  
                  {showMessageForm && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button className="w-full" onClick={handleSendMessage}>
                        Send Message
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {messages && messages.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{msg.sender?.full_name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
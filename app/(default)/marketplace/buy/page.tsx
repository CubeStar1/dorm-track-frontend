'use client';

import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/lib/api/services/marketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import useUser from '@/hooks/use-user';

export default function BuyMarketplacePage() {
  const router = useRouter();
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('browse');
  const [message, setMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch all available items
  const { data: availableItems, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ['marketplace-available-items'],
    queryFn: marketplaceService.getItems,
    enabled: !!user?.id
  });

  // Fetch items the user is interested in (where they have sent messages)
  const { data: interestedItems, isLoading: isLoadingInterested } = useQuery({
    queryKey: ['marketplace-interested-items'],
    queryFn: async () => {
      const items = await marketplaceService.getItems();
      return items.filter(item => {
        const messages = item.messages || [];
        return messages.some(msg => msg.sender_id === user?.id);
      });
    },
    enabled: !!user?.id
  });

  const handleSendMessage = async (itemId: string, receiverId: string) => {
    if (!message.trim() || !user?.id) return;
    
    try {
      await marketplaceService.sendMessage({
        item_id: itemId,
        sender_id: user.id,
        receiver_id: receiverId,
        message: message.trim()
      });
      setMessage('');
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoadingAvailable || isLoadingInterested) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Buy Items</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems?.filter(item => item.status === 'available' && item.price).map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={item.images[0] || '/placeholder-item.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>₹{item.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <span className="text-sm text-gray-500">{item.condition}</span>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    Seller: {item.seller?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Contact: {item.seller?.phone || 'Not available'}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lost-found" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableItems?.filter(item => item.status === 'available' && !item.price).map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={item.images[0] || '/placeholder-item.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>Lost & Found Item</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    Found by: {item.seller?.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Contact: {item.seller?.phone || 'Not available'}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
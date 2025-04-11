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

export default function SellMarketplacePage() {
  const router = useRouter();
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('my-listings');
  const [message, setMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch items the user is selling
  const { data: sellingItems, isLoading: isLoadingSelling } = useQuery({
    queryKey: ['marketplace-selling-items'],
    queryFn: async () => {
      const items = await marketplaceService.getItems();
      return items.filter(item => item.seller_id === user?.id);
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

  if (isLoadingSelling) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sell Items</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="sell-item">Sell Item</TabsTrigger>
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listings" className="space-y-4">
          {sellingItems?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {item.price ? `₹${item.price}` : 'Lost & Found Item'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={item.images[0] || '/placeholder-item.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">{item.description}</p>
                    <p className="text-sm text-gray-500">Status: {item.status}</p>
                    <p className="text-sm text-gray-500">Category: {item.category}</p>
                    {item.condition && (
                      <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sell-item">
          <Card>
            <CardHeader>
              <CardTitle>Sell an Item</CardTitle>
              <CardDescription>Create a new listing to sell your item</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/marketplace/create?type=sell')}
                className="w-full"
              >
                Create New Listing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lost-found">
          <Card>
            <CardHeader>
              <CardTitle>Lost & Found</CardTitle>
              <CardDescription>Report a lost or found item</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/marketplace/create?type=lost-found')}
                className="w-full"
              >
                Report Lost/Found Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
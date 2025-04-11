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

export default function MarketplaceMessagesPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('buying');
  const [message, setMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch items the user is buying (where they are the buyer in messages)
  const { data: buyingItems, isLoading: isLoadingBuying } = useQuery({
    queryKey: ['marketplace-buying-items'],
    queryFn: async () => {
      const items = await marketplaceService.getItems();
      return items.filter(item => {
        const messages = item.messages || [];
        return messages.some(msg => msg.sender_id === user?.id);
      });
    },
    enabled: !!user?.id
  });

  // Fetch items the user is selling (their own items)
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

  if (isLoadingBuying || isLoadingSelling) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Marketplace Messages</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="buying">Items I'm Buying</TabsTrigger>
          <TabsTrigger value="selling">Items I'm Selling</TabsTrigger>
        </TabsList>

        <TabsContent value="buying" className="space-y-4">
          {buyingItems?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>₹{item.price}</CardDescription>
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
                    <p className="text-sm text-gray-500">Seller: {item.seller?.full_name}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {item.messages?.map((msg) => (
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

                  {selectedItem === item.id && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleSendMessage(item.id, item.seller_id)}
                        className="w-full"
                      >
                        Send Message
                      </Button>
                    </div>
                  )}

                  {selectedItem !== item.id && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedItem(item.id)}
                      className="w-full"
                    >
                      Reply to Seller
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="selling" className="space-y-4">
          {sellingItems?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>₹{item.price}</CardDescription>
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
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {item.messages?.map((msg) => (
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

                  {selectedItem === item.id && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleSendMessage(item.id, item.messages?.[0]?.sender_id || '')}
                        className="w-full"
                      >
                        Send Message
                      </Button>
                    </div>
                  )}

                  {selectedItem !== item.id && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedItem(item.id)}
                      className="w-full"
                    >
                      Reply to Buyer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
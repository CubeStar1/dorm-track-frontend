'use client';

import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/lib/api/services/marketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MarketplacePage() {
  const router = useRouter();
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: marketplaceService.getItems
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error loading items</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <Button onClick={() => router.push('/marketplace/create')}>
          Sell an Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/marketplace/items/${item.id}`)}>
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
                <Badge variant="secondary">{item.condition}</Badge>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Seller: {item.seller?.full_name}
              </div>
              <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 
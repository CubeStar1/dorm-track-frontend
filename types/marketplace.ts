export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type ItemCategory = 'electronics' | 'furniture' | 'books' | 'clothing' | 'other';
export type ItemStatus = 'available' | 'reserved' | 'sold';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  category: ItemCategory;
  images: string[];
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  seller?: {
    full_name: string;
    student_id: string;
  };
}

export interface MarketplaceTransaction {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  item?: MarketplaceItem;
  buyer?: {
    full_name: string;
    student_id: string;
  };
  seller?: {
    full_name: string;
    student_id: string;
  };
}

export interface MarketplaceMessage {
  id: string;
  item_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  sender?: {
    full_name: string;
    student_id: string;
  };
  receiver?: {
    full_name: string;
    student_id: string;
  };
} 
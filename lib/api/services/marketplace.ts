import { MarketplaceItem, MarketplaceTransaction, MarketplaceMessage } from '@/types/marketplace';

export const marketplaceService = {
  // Items
  getItems: async (): Promise<MarketplaceItem[]> => {
    const response = await fetch('/api/marketplace/items');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch items');
    }

    const items = await response.json();
    
    // Fetch messages for each item
    const itemsWithMessages = await Promise.all(
      items.map(async (item: MarketplaceItem) => {
        try {
          const messagesResponse = await fetch(`/api/marketplace/messages?itemId=${item.id}`);
          if (messagesResponse.ok) {
            const messages = await messagesResponse.json();
            return { ...item, messages };
          }
          return item;
        } catch (error) {
          console.error('Error fetching messages for item:', error);
          return item;
        }
      })
    );

    return itemsWithMessages;
  },

  getItem: async (id: string): Promise<MarketplaceItem> => {
    const response = await fetch(`/api/marketplace/items/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch item');
    }

    const item = await response.json();
    
    // Fetch messages for the item
    try {
      const messagesResponse = await fetch(`/api/marketplace/messages?itemId=${id}`);
      if (messagesResponse.ok) {
        const messages = await messagesResponse.json();
        return { ...item, messages };
      }
    } catch (error) {
      console.error('Error fetching messages for item:', error);
    }

    return item;
  },

  createItem: async (item: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at'>): Promise<MarketplaceItem> => {
    const response = await fetch('/api/marketplace/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }

    return response.json();
  },

  updateItem: async (id: string, item: Partial<MarketplaceItem>): Promise<MarketplaceItem> => {
    const response = await fetch(`/api/marketplace/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }

    return response.json();
  },

  deleteItem: async (id: string): Promise<void> => {
    const response = await fetch(`/api/marketplace/items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete item');
    }
  },

  // Transactions
  getTransactions: async (): Promise<MarketplaceTransaction[]> => {
    const response = await fetch('/api/marketplace/transactions');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }

    return response.json();
  },

  createTransaction: async (transaction: Omit<MarketplaceTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<MarketplaceTransaction> => {
    const response = await fetch('/api/marketplace/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }

    return response.json();
  },

  updateTransaction: async (id: string, transaction: Partial<MarketplaceTransaction>): Promise<MarketplaceTransaction> => {
    const response = await fetch(`/api/marketplace/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }

    return response.json();
  },

  // Messages
  getMessages: async (itemId: string): Promise<MarketplaceMessage[]> => {
    const response = await fetch(`/api/marketplace/messages?itemId=${itemId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch messages');
    }

    return response.json();
  },

  sendMessage: async (message: Omit<MarketplaceMessage, 'id' | 'created_at' | 'updated_at'>): Promise<MarketplaceMessage> => {
    const response = await fetch('/api/marketplace/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  },
}; 
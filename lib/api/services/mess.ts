import { createSupabaseBrowser } from '@/lib/supabase/client';
import { MenuItem, FoodImage } from '@/types/mess';

export const messService = {
  getMenu: async (): Promise<MenuItem[]> => {
    const response = await fetch('/api/mess/menu');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch menu');
    }

    return response.json();
  },

  submitFeedback: async (
    menuId: string,
    rating: number,
    feedback: string
  ) => {
    const response = await fetch('/api/mess/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuId,
        rating,
        feedback
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit feedback');
    }

    return response.json();
  },

  getFoodImage: async (foodName: string): Promise<FoodImage> => {
    try {
      const appId = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID;
      const apiKey = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY;
      
      if (!appId || !apiKey) {
        throw new Error('API credentials not configured');
      }

      const response = await fetch(
        'https://trackapi.nutritionix.com/v2/search/instant',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': appId,
            'x-app-key': apiKey
          },
          body: JSON.stringify({
            query: foodName,
            detailed: true
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const foodItem = data.common?.find((item: any) => item.photo?.thumb) || 
                      data.branded?.find((item: any) => item.photo?.thumb);
      
      if (!foodItem || !foodItem.photo?.thumb) {
        throw new Error('No image found');
      }

      return {
        url: foodItem.photo.thumb,
        alt: foodName
      };
    } catch (error) {
      console.error('Error fetching food image for', foodName, ':', error);
      // Return a simple colored background with the first letter
      const colors = ['#FDA4AF', '#FCD34D', '#86EFAC', '#93C5FD', '#C4B5FD'];
      const colorIndex = foodName.charAt(0).toLowerCase().charCodeAt(0) % colors.length;
      const backgroundColor = colors[colorIndex];
      
      return {
        url: `data:image/svg+xml;base64,${btoa(`
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="${backgroundColor}"/>
            <text x="40" y="40" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="24">${foodName.charAt(0).toUpperCase()}</text>
          </svg>
        `.trim())}`,
        alt: foodName
      };
    }
  }
}; 
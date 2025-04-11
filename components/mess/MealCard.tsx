import { Clock, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { MenuItem, FoodImage } from '@/types/mess';

interface MealCardProps {
  mealType: string;
  meal: MenuItem | undefined;
  foodImages: Record<string, FoodImage>;
  onFeedbackClick: (mealType: string, menuId: string) => void;
}

export function MealCard({ mealType, meal, foodImages, onFeedbackClick }: MealCardProps) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">{mealType}</h3>
            <button
              onClick={() => onFeedbackClick(mealType, meal?.id || '')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Give Feedback"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>
      </div>
      
      {meal ? (
        <div className="divide-y">
          {meal.items.map((item: string, index: number) => (
            <div key={index} className="p-4">
              <div className="flex items-start space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={foodImages[item]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMjAgMjBINjBWNDBIMjBWMjBaIiBmaWxsPSIjQ0RDRkRFIi8+PHBhdGggZD0iTTIwIDQwSDYwVjYwSDIwVjQwWiIgZmlsbD0iI0NEQ0ZERSIvPjwvc3ZnPg=='}
                    alt={item}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">No menu available</p>
        </div>
      )}

      {meal && (
        <div className="px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(meal.updated_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
} 
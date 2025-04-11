'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { UtensilsCrossed, Clock } from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import { useToast } from "@/components/ui/use-toast";
import { MealCard } from '@/components/mess/MealCard';
import { FeedbackDialog } from '@/components/mess/FeedbackDialog';
import { messService } from '@/lib/api/services/mess';
import { MenuItem, FoodImage, FeedbackDialogState, DAYS_OF_WEEK, MEAL_TYPES, DayOfWeek } from '@/types/mess';
import { createSupabaseBrowser } from '@/lib/supabase/client';

function MessMenuPage() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const today = new Date().getDay();
    return DAYS_OF_WEEK[today === 0 ? 6 : today - 1];
  });

  const [feedbackDialog, setFeedbackDialog] = useState<FeedbackDialogState>({
    isOpen: false,
    mealType: '',
    day: '',
    menuId: ''
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const { toast } = useToast();

  const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['mess-menu'],
    queryFn: messService.getMenu,
  });

  // Get all unique food items from the menu
  const allFoodItems = menuItems?.flatMap(item => item.items) || [];
  const uniqueFoodItems = [...new Set(allFoodItems)];

  // Fetch images for all unique food items
  const foodImages = useQuery({
    queryKey: ['food-images', uniqueFoodItems],
    queryFn: async () => {
      const images: Record<string, FoodImage> = {};
      await Promise.all(
        uniqueFoodItems.map(async (item) => {
          images[item] = await messService.getFoodImage(item);
        })
      );
      return images;
    },
    enabled: uniqueFoodItems.length > 0,
  });

  const handleFeedbackSubmit = async () => {
    try {
      if (!feedbackDialog.menuId) {
        throw new Error('Menu ID is missing');
      }

      await messService.submitFeedback(
        feedbackDialog.menuId,
        rating,
        feedbackText
      );

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      setFeedbackDialog({ isOpen: false, mealType: '', day: '', menuId: '' });
      setFeedbackText('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || foodImages.isLoading) {
    return (
      <div className="h-full p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || foodImages.error) {
    return (
      <div className="h-full p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800">Error Loading Menu</h2>
          <p className="text-gray-600 mt-2">There was an error loading the mess menu. Please try again later.</p>
        </div>
      </div>
    );
  }

  const filteredMenu = menuItems?.filter((item: MenuItem) => item.day_of_week === selectedDay) || [];

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Mess Menu</h1>
        <p className="text-gray-600 flex items-center">
          <UtensilsCrossed className="w-4 h-4 mr-2" />
          Daily menu and meal schedule
        </p>
      </div>

      {/* Day selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <CustomButton
              key={day}
              variant={selectedDay === day ? "primary" : "outline"}
              onClick={() => setSelectedDay(day)}
              className="px-4 py-2"
            >
              {day}
            </CustomButton>
          ))}
        </div>
      </div>

      {/* Menu cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MEAL_TYPES.map((mealType) => {
          const meal = filteredMenu.find((item: MenuItem) => item.meal_type === mealType);
          return (
            <MealCard
              key={mealType}
              mealType={mealType}
              meal={meal}
              foodImages={foodImages.data || {}}
              onFeedbackClick={(mealType) => {
                if (meal) {
                  setFeedbackDialog({
                    isOpen: true,
                    mealType,
                    day: selectedDay,
                    menuId: meal.id // Use the actual menu ID from the database
                  });
                }
              }}
            />
          );
        })}
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        dialog={feedbackDialog}
        rating={rating}
        feedbackText={feedbackText}
        onOpenChange={(isOpen) => {
          setFeedbackDialog(prev => ({ ...prev, isOpen }));
          if (!isOpen) {
            setFeedbackText('');
            setRating(5);
          }
        }}
        onRatingChange={setRating}
        onFeedbackChange={setFeedbackText}
        onSubmit={handleFeedbackSubmit}
        onCancel={() => setFeedbackDialog({ isOpen: false, mealType: '', day: '', menuId: '' })}
      />

      {/* Schedule information */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Meal Timings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Breakfast</h4>
              <p className="text-gray-600">7:30 AM - 9:30 AM</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium">Lunch</h4>
              <p className="text-gray-600">12:30 PM - 2:30 PM</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Dinner</h4>
              <p className="text-gray-600">7:30 PM - 9:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessMenuPage;

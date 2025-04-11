export interface MenuItem {
  id: string;
  hostel_id: string;
  day_of_week: string;
  meal_type: string;
  items: string[];
  created_at: string;
  updated_at: string;
}

export interface FoodImage {
  url: string;
  alt: string;
}

export interface FeedbackDialogState {
  isOpen: boolean;
  mealType: string;
  day: string;
  menuId: string;
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
export type MealType = typeof MEAL_TYPES[number]; 
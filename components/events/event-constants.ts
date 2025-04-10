import type { EventCategory } from '@/lib/api/services/events';

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  cultural: 'Cultural',
  sports: 'Sports',
  academic: 'Academic',
  social: 'Social',
  other: 'Other'
};

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string }> = {
  cultural: { bg: 'bg-pink-100', text: 'text-pink-700' },
  sports: { bg: 'bg-blue-100', text: 'text-blue-700' },
  academic: { bg: 'bg-purple-100', text: 'text-purple-700' },
  social: { bg: 'bg-green-100', text: 'text-green-700' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700' }
};

export const STATUS_COLORS: Record<string, string> = {
  upcoming: 'text-blue-600',
  ongoing: 'text-green-600',
  completed: 'text-gray-600',
  cancelled: 'text-red-600'
}; 
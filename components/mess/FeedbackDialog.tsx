import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from '@/components/ui/custom-button';
import { FeedbackDialogState } from '@/types/mess';

interface FeedbackDialogProps {
  dialog: FeedbackDialogState;
  rating: number;
  feedbackText: string;
  onOpenChange: (open: boolean) => void;
  onRatingChange: (rating: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function FeedbackDialog({
  dialog,
  rating,
  feedbackText,
  onOpenChange,
  onRatingChange,
  onFeedbackChange,
  onSubmit,
  onCancel
}: FeedbackDialogProps) {
  return (
    <Dialog 
      open={dialog.isOpen} 
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mess Feedback</DialogTitle>
          <DialogDescription>
            Share your feedback for {dialog.mealType} on {dialog.day}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRatingChange(star)}
                  className={`p-1 rounded-full transition-colors ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comments</label>
            <Textarea
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => onFeedbackChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <CustomButton
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={onSubmit}
            disabled={!feedbackText.trim()}
          >
            Submit Feedback
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
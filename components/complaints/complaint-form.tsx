'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import CustomButton from '@/components/ui/custom-button';
import { complaintsService, ComplaintType, ComplaintSeverity } from '@/lib/api/services/complaints';

const formSchema = z.object({
  complaint_type: z.enum(['ragging', 'harassment', 'facilities', 'mess', 'other'] as const),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.enum(['low', 'medium', 'high'] as const),
  is_anonymous: z.boolean().default(false),
});

const COMPLAINT_TYPES = [
  { value: 'ragging', label: 'Ragging' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'mess', label: 'Mess' },
  { value: 'other', label: 'Other' },
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplaintForm({ isOpen, onClose }: ComplaintFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaint_type: 'other',
      description: '',
      severity: 'medium',
      is_anonymous: false,
    },
  });

  const { mutate: createComplaint } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      return complaintsService.createComplaint(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint submitted successfully');
      handleClose();
    },
    onError: (error) => {
      toast.error('Failed to submit complaint');
      console.error('Error submitting complaint:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit a Complaint</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => createComplaint(values))} className="space-y-6">
            <FormField
              control={form.control}
              name="complaint_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Complaint</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complaint type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPLAINT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about your complaint..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEVERITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Submit Anonymously</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Your identity will be hidden from other students
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <CustomButton
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                disabled={isSubmitting}
              >
                Submit Complaint
              </CustomButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
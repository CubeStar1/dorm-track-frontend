'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CustomButton from '@/components/ui/custom-button';
import { toast } from 'sonner';

interface MaintenanceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ISSUE_TYPES = [
  'plumbing',
  'electrical',
  'furniture',
  'cleaning',
  'appliance',
  'structural',
  'other'
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export default function MaintenanceRequestForm({ isOpen, onClose }: MaintenanceRequestFormProps) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const queryClient = useQueryClient();

  const { mutate: createRequest, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueType,
          description,
          priority,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create request');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Maintenance request submitted successfully');
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClose = () => {
    setIssueType('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select
              value={issueType}
              onValueChange={setIssueType}
              required
            >
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail"
              required
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={setPriority}
              required
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              isLoading={isPending}
            >
              Submit Request
            </CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
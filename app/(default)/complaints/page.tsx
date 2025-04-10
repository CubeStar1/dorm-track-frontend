'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import CustomButton from '@/components/ui/custom-button';
import ComplaintList from '@/components/complaints/complaint-list';
import ComplaintForm from '@/components/complaints/complaint-form';
import { AlertTriangleIcon, ListIcon, GridIcon } from 'lucide-react';

export default function ComplaintsPage() {
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'table' | 'card'>('table');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">
            Submit and track your complaints
          </p>
        </div>
        <CustomButton
          onClick={() => setShowForm(true)}
          className="md:w-auto w-full"
        >
          <AlertTriangleIcon className="w-4 h-4 mr-2" />
          Submit Complaint
        </CustomButton>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex items-center rounded-lg border p-1 bg-muted/50">
          <button
            className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
              view === 'table' ? 'bg-background shadow-sm' : 'hover:bg-muted'
            }`}
            onClick={() => setView('table')}
          >
            <ListIcon className="w-4 h-4 mr-2" />
            List
          </button>
          <button
            className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
              view === 'card' ? 'bg-background shadow-sm' : 'hover:bg-muted'
            }`}
            onClick={() => setView('card')}
          >
            <GridIcon className="w-4 h-4 mr-2" />
            Grid
          </button>
        </div>
      </div>

      {/* Complaints List */}
      <ComplaintList view={view} />

      {/* Complaint Form Modal */}
      <ComplaintForm 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
} 
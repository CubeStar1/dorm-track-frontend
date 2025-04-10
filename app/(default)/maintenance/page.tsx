'use client';

import { useState } from 'react';
import MaintenanceRequestList from '@/components/maintenance/maintenance-request-list';
import MaintenanceRequestForm from '@/components/maintenance/maintenance-request-form';
import MaintenanceRequestCards from '@/components/maintenance/maintenance-request-cards';
import CustomButton from '@/components/ui/custom-button';
import { PlusIcon, TableIcon, LayoutGridIcon } from 'lucide-react';

export default function MaintenancePage() {
  const [showForm, setShowForm] = useState(false);
  const [viewType, setViewType] = useState<'table' | 'card'>('table');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Maintenance Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Submit and track your maintenance requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl gap-2 p-1">
            <CustomButton
              variant={viewType === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewType('table')}
            >
              <TableIcon className="w-4 h-4" />
            </CustomButton>
            <CustomButton
              variant={viewType === 'card' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewType('card')}
            >
              <LayoutGridIcon className="w-4 h-4" />
            </CustomButton>
          </div>
          <CustomButton
            onClick={() => setShowForm(true)}
            variant="primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Request
          </CustomButton>
        </div>
      </div>

      {viewType === 'table' ? (
        <MaintenanceRequestList />
      ) : (
        <MaintenanceRequestCards />
      )}

      {/* Request Form Modal */}
      <MaintenanceRequestForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}

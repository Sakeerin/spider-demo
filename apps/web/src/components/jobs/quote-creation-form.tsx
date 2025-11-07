'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { jobsApi } from '@/lib/api/jobs';
import { useAuthToken } from '@/lib/auth/use-auth-token';
import type { CreateQuoteDto, CreateMilestoneDto } from '@spider/shared/types/job';

interface QuoteCreationFormProps {
  jobId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface QuoteFormData {
  amount: number;
  document?: string;
  milestones: Array<{
    title: string;
    description?: string;
    amount: number;
    dueDate: string;
  }>;
}

export function QuoteCreationForm({ jobId, onSuccess, onCancel }: QuoteCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthToken();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    defaultValues: {
      amount: 0,
      milestones: [
        {
          title: '',
          description: '',
          amount: 0,
          dueDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones',
  });

  const quoteAmount = watch('amount');
  const milestones = watch('milestones');
  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const amountMismatch = Math.abs(totalMilestoneAmount - quoteAmount) > 0.01;

  const onSubmit = async (data: QuoteFormData) => {
    if (amountMismatch) {
      setError('Milestone amounts must sum to quote amount');
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await jobsApi.createQuote(token, {
        jobId,
        amount: data.amount,
        document: data.document,
        milestones: data.milestones,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create Quote</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Quote Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Total Quote Amount (THB)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Quote amount is required',
            min: { value: 0, message: 'Amount must be positive' },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Quote Document */}
      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
          Quote Document URL (Optional)
        </label>
        <input
          id="document"
          type="url"
          {...register('document')}
          placeholder="https://example.com/quote.pdf"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Milestones */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Milestones</label>
          <button
            type="button"
            onClick={() =>
              append({
                title: '',
                description: '',
                amount: 0,
                dueDate: '',
              })
            }
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Milestone
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    {...register(`milestones.${index}.title`, {
                      required: 'Title is required',
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.milestones?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.milestones[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register(`milestones.${index}.description`)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (THB)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`milestones.${index}.amount`, {
                      required: 'Amount is required',
                      min: { value: 0, message: 'Amount must be positive' },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.milestones?.[index]?.amount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.milestones[index]?.amount?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...register(`milestones.${index}.dueDate`, {
                      required: 'Due date is required',
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.milestones?.[index]?.dueDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.milestones[index]?.dueDate?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amount Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Quote Amount:</span>
            <span className="font-medium">฿{quoteAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Total Milestone Amount:</span>
            <span className={`font-medium ${amountMismatch ? 'text-red-600' : 'text-green-600'}`}>
              ฿{totalMilestoneAmount.toLocaleString()}
            </span>
          </div>
          {amountMismatch && (
            <p className="text-sm text-red-600 mt-2">
              Milestone amounts must equal the quote amount
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || amountMismatch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Quote'}
        </button>
      </div>
    </form>
  );
}

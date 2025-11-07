'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceType } from '@spider/shared/types/common';
import {
  IPortfolioItem,
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from '@spider/shared/types/contractor';

interface PortfolioManagerProps {
  portfolio: IPortfolioItem[];
  onAdd: (data: CreatePortfolioItemDto) => Promise<void>;
  onUpdate: (id: string, data: UpdatePortfolioItemDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PortfolioManager({
  portfolio,
  onAdd,
  onUpdate,
  onDelete,
}: PortfolioManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePortfolioItemDto>();

  const handleAdd = async (data: CreatePortfolioItemDto) => {
    setIsLoading(true);
    try {
      await onAdd(data);
      reset();
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?'))
      return;

    setIsLoading(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isAdding ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit(handleAdd)}
          className="mb-6 p-4 border border-gray-300 rounded-md"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceType"
                {...register('serviceType', {
                  required: 'Service type is required',
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select service type</option>
                {Object.values(ServiceType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URLs (comma-separated){' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="images"
                type="text"
                {...register('images', {
                  required: 'At least one image is required',
                  setValueAs: (value) =>
                    value.split(',').map((url: string) => url.trim()),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.images.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="completedAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Completion Date
              </label>
              <input
                id="completedAt"
                type="date"
                {...register('completedAt')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isPublic')}
                defaultChecked={true}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Make this item public
              </span>
            </label>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Adding...' : 'Add Portfolio Item'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-md overflow-hidden"
          >
            {item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.serviceType.replace(/_/g, ' ')}
              </p>
              {item.description && (
                <p className="text-sm text-gray-700 mb-3">{item.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && !isAdding && (
        <p className="text-center text-gray-500 py-8">
          No portfolio items yet. Add your first project to showcase your work!
        </p>
      )}
    </div>
  );
}

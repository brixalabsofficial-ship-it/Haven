import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { usePropertyStore } from '../../stores/propertyStore';
import { PropertyCategory, ListingStatus, OccupancyType, FurnishingStatus, GenderPreference } from '../../types';
import toast from 'react-hot-toast';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, updateProperty, deleteProperty } = usePropertyStore();

  const property = id ? getPropertyById(id) : undefined;

  if (!property) {
    return (
      <div className="py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Property Listing Not Found</h3>
        <button
          onClick={() => navigate('/broker/listings')}
          className="text-xs font-semibold text-primary underline"
        >
          Return to My Listings
        </button>
      </div>
    );
  }

  const [title, setTitle] = useState(property.title);
  const [category, setCategory] = useState<PropertyCategory>(property.category);
  const [monthlyRent, setMonthlyRent] = useState(property.monthlyRent.toString());
  const [securityDeposit, setSecurityDeposit] = useState(property.securityDeposit.toString());
  const [status, setStatus] = useState<ListingStatus>(property.status);
  const [availableFrom, setAvailableFrom] = useState(property.availableFrom);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>(property.furnishing);
  const [occupancyType, setOccupancyType] = useState<OccupancyType>(property.occupancyType);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(property.genderPreference);
  const [description, setDescription] = useState(property.description);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProperty(property.id, {
      title,
      category,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      status,
      availableFrom,
      furnishing,
      occupancyType,
      genderPreference,
      description,
    });

    toast.success('Listing changes saved successfully');
    navigate('/broker/listings');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete listing "${property.title}"?`)) {
      deleteProperty(property.id);
      toast.success('Listing deleted');
      navigate('/broker/listings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Listings</span>
        </button>

        <button
          onClick={handleDelete}
          className="text-xs font-medium text-destructive hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          <Trash2 size={13} />
          <span>Delete Listing</span>
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Listing Details</h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              >
                <option value="Hostels">Hostels</option>
                <option value="PG Accommodation">PG Accommodation</option>
                <option value="Shared Rooms">Shared Rooms</option>
                <option value="Private Rooms">Private Rooms</option>
                <option value="Flats">Flats</option>
                <option value="Apartments">Apartments</option>
                <option value="Houses">Houses</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md font-bold text-primary"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ListingStatus)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md font-semibold"
              >
                <option value="published">Published (Live)</option>
                <option value="rented">Rented</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Availability</label>
              <input
                type="text"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Occupancy</label>
              <select
                value={occupancyType}
                onChange={(e) => setOccupancyType(e.target.value as OccupancyType)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Four+">Four+</option>
                <option value="Entire Place">Entire Place</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-md shadow-sm flex items-center gap-2"
            >
              <Save size={14} className="text-gold" />
              <span>Update Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

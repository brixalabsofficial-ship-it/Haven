import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Eye, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePropertyStore } from '../../stores/propertyStore';
import { Property, ListingStatus } from '../../types';
import { formatINR } from '../../utils';
import { toast } from 'sonner';

export const BrokerListingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getPropertiesByBroker, updateProperty, deleteProperty, duplicateProperty } = usePropertyStore();

  const brokerId = user?.id || 'broker-1';
  const properties = getPropertiesByBroker(brokerId);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = properties.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const handleStatusChange = (id: string, newStatus: ListingStatus) => {
    updateProperty(id, { status: newStatus });
    toast.success(`Listing status updated to ${newStatus}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete listing "${title}"?`)) {
      deleteProperty(id);
      toast.success('Listing deleted');
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateProperty(id);
    if (duplicated) {
      toast.success(`Duplicated listing created as Draft: ${duplicated.title}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Property Listings</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, update availability, re-publish, or edit specifications for your rental inventory.
          </p>
        </div>

        <Link
          to="/broker/listings/new"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-md transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          <PlusCircle size={15} className="text-gold" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 text-xs">
        {['all', 'published', 'rented', 'draft', 'paused'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
              filterStatus === st
                ? 'bg-primary text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {st} ({st === 'all' ? properties.length : properties.filter((p) => p.status === st).length})
          </button>
        ))}
      </div>

      {/* Listings Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-md border border-gray-100 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Metrics</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.coverImage || prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded-md object-cover shrink-0"
                        />
                        <div className="min-w-0 max-w-[200px]">
                          <Link
                            to={`/property/${prop.id}`}
                            className="font-bold text-gray-900 hover:text-primary transition-colors block truncate"
                          >
                            {prop.title}
                          </Link>
                          <span className="text-[11px] text-gray-400">
                            {prop.occupancyType} • {prop.furnishing}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">{prop.category}</td>
                    <td className="py-3.5 px-4 text-gray-500">{prop.locality}, {prop.city}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 tabular-nums">
                      {formatINR(prop.monthlyRent)}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 font-medium">
                      {prop.availableFrom}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value as ListingStatus)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                          prop.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : prop.status === 'rented'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="rented">Rented</option>
                        <option value="paused">Paused</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Eye size={12} />
                        <span>{prop.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <KeyRound size={12} className="text-gold" />
                        <span>{prop.unlockCount} unlocks</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/broker/listings/${prop.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100"
                          title="Edit Listing"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(prop.id)}
                          className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100"
                          title="Duplicate Listing"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id, prop.title)}
                          className="p-1.5 text-gray-500 hover:text-destructive rounded-md hover:bg-red-50"
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md p-12 text-center border border-dashed border-gray-200 space-y-3">
          <Building size={32} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No properties in this view</h3>
          <p className="text-xs text-gray-500">Click Add New Property to post a hostel, PG, or flat.</p>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle2,
  XCircle,
  Save,
  Tag,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import deliveryService from '@/services/deliveryService';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState([]);
  const [settings, setSettings] = useState({
    pickupEnabled: true,
    pickupLocationName: 'Milton, ON',
    pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
    unservicedAreaMessage: 'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
    eventSetupMessage: 'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Modal State
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [isSubmittingZone, setIsSubmittingZone] = useState(false);

  // Zone Form State
  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    description: '',
    fee: '',
    postalCodes: [],
    isActive: true,
    sortOrder: 0,
  });
  const [postalInput, setPostalInput] = useState('');

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [zonesRes, settingsRes] = await Promise.all([
        deliveryService.getAllZonesAdmin(),
        deliveryService.getSettings(),
      ]);
      setZones(zonesRes.data?.data || []);
      if (settingsRes.data?.data) {
        setSettings(settingsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load delivery configuration:', err);
      toast.error('Failed to load delivery zones and settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      const res = await deliveryService.updateSettingsAdmin(settings);
      setSettings(res.data?.data || settings);
      toast.success('Delivery and pickup settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Open Add Modal
  const handleAddNewZone = () => {
    setEditingZone(null);
    setZoneFormData({
      name: '',
      description: '',
      fee: '',
      postalCodes: [],
      isActive: true,
      sortOrder: zones.length + 1,
    });
    setPostalInput('');
    setIsZoneModalOpen(true);
  };

  // Open Edit Modal
  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneFormData({
      name: zone.name,
      description: zone.description || '',
      fee: zone.fee.toString(),
      postalCodes: [...(zone.postalCodes || [])],
      isActive: zone.isActive,
      sortOrder: zone.sortOrder || 0,
    });
    setPostalInput('');
    setIsZoneModalOpen(true);
  };

  // Postal Code Tag Addition (handles single or comma/space separated inputs)
  const addPostalCodesFromInput = () => {
    if (!postalInput.trim()) return;
    const tokens = postalInput
      .split(/[\s,]+/)
      .map((t) => t.replace(/[^A-Za-z0-9]/g, '').toUpperCase().substring(0, 3))
      .filter((t) => t.length === 3);

    if (tokens.length === 0) {
      toast.error('Please enter valid 3-character Canadian postal prefixes (e.g. L9T)');
      return;
    }

    const uniqueNew = Array.from(new Set([...zoneFormData.postalCodes, ...tokens]));
    setZoneFormData((prev) => ({ ...prev, postalCodes: uniqueNew }));
    setPostalInput('');
  };

  const handlePostalInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addPostalCodesFromInput();
    }
  };

  const removePostalCode = (codeToRemove) => {
    setZoneFormData((prev) => ({
      ...prev,
      postalCodes: prev.postalCodes.filter((c) => c !== codeToRemove),
    }));
  };

  // Save Zone (Create or Update)
  const handleSaveZone = async (e) => {
    e.preventDefault();
    if (!zoneFormData.name.trim()) {
      toast.error('Zone name is required');
      return;
    }
    if (zoneFormData.fee === '' || isNaN(Number(zoneFormData.fee))) {
      toast.error('Please enter a valid delivery fee (e.g. 0, 15, 20)');
      return;
    }
    if (zoneFormData.postalCodes.length === 0) {
      toast.error('Please add at least one 3-character postal code prefix');
      return;
    }

    try {
      setIsSubmittingZone(true);
      const payload = {
        name: zoneFormData.name.trim(),
        description: zoneFormData.description.trim() || null,
        fee: Number(zoneFormData.fee),
        postalCodes: zoneFormData.postalCodes,
        isActive: zoneFormData.isActive,
        sortOrder: Number(zoneFormData.sortOrder) || 0,
      };

      if (editingZone) {
        await deliveryService.updateZoneAdmin(editingZone.id, payload);
        toast.success('Delivery zone updated successfully!');
      } else {
        await deliveryService.createZoneAdmin(payload);
        toast.success('New delivery zone created successfully!');
      }

      setIsZoneModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save delivery zone');
    } finally {
      setIsSubmittingZone(false);
    }
  };

  // Delete Zone
  const confirmDeleteZone = async () => {
    if (!zoneToDelete) return;
    try {
      await deliveryService.deleteZoneAdmin(zoneToDelete.id);
      toast.success(`Deleted zone "${zoneToDelete.name}"`);
      setZoneToDelete(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete delivery zone');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cloud pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
            <Truck size={18} />
            <span>Fulfillment & Logistics</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Delivery Zones & Settings</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage Canadian postal code delivery fees, Milton store pickup, and custom customer notices.
          </p>
        </div>
        <Button
          onClick={handleAddNewZone}
          variant="primary"
          className="flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-auto"
        >
          <Plus size={18} />
          <span>Add Delivery Zone</span>
        </Button>
      </div>

      {/* Global Settings & Free Pickup Card */}
      <div className="bg-white rounded-2xl border border-cloud p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">Store Pickup & Custom Notices</h2>
              <p className="text-xs text-text-muted">Configure Milton store pickup and customer checkout notices</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6 mt-4">
          {/* Pickup Switcher */}
          <div className="bg-cream/40 rounded-xl p-4 border border-cloud/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="pickupEnabled"
                checked={settings.pickupEnabled}
                onChange={(e) => setSettings({ ...settings, pickupEnabled: e.target.checked })}
                className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="pickupEnabled" className="cursor-pointer">
                <span className="font-semibold text-charcoal block">Enable Free Store Pickup (Milton)</span>
                <span className="text-xs text-text-secondary">
                  Allows customers to choose free in-person collection at checkout, bypassing delivery fees.
                </span>
              </label>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full border self-start md:self-auto shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200">
              {settings.pickupEnabled ? 'Pickup Available' : 'Pickup Disabled'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Pickup Location Name
              </label>
              <input
                type="text"
                value={settings.pickupLocationName}
                onChange={(e) => setSettings({ ...settings, pickupLocationName: e.target.value })}
                className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                placeholder="e.g. Milton, ON"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Pickup Address Details
              </label>
              <input
                type="text"
                value={settings.pickupAddress}
                onChange={(e) => setSettings({ ...settings, pickupAddress: e.target.value })}
                className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                placeholder="e.g. Milton, Ontario (Exact address sent in confirmation)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Unserviced Postal Code Message
                </label>
                <span className="text-[11px] text-text-muted">Shown for postal codes outside zones</span>
              </div>
              <textarea
                rows={3}
                value={settings.unservicedAreaMessage}
                onChange={(e) => setSettings({ ...settings, unservicedAreaMessage: e.target.value })}
                className="w-full p-3 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors resize-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Event Orders Setup Notice
                </label>
                <span className="text-[11px] text-text-muted">Shown for grazing/dessert tables</span>
              </div>
              <textarea
                rows={3}
                value={settings.eventSetupMessage}
                onChange={(e) => setSettings({ ...settings, eventSetupMessage: e.target.value })}
                className="w-full p-3 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingSettings}
              className="flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save size={16} />
              <span>Save Pickup & Notice Settings</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Delivery Zones Table Card */}
      <div className="bg-white rounded-2xl border border-cloud shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cloud flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">Configured Delivery Zones</h2>
            <p className="text-xs text-text-muted">
              Matches customer postal code using the first 3 characters (FSA).
            </p>
          </div>
          <div className="text-xs text-text-secondary bg-cream px-3 py-1.5 rounded-lg border border-cloud flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            <span>Calculations run authoritatively on server</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-text-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading delivery zones...</p>
          </div>
        ) : zones.length === 0 ? (
          <div className="p-12 text-center">
            <Truck size={40} className="text-text-muted mx-auto mb-3 opacity-60" />
            <p className="text-base font-semibold text-charcoal">No delivery zones configured yet</p>
            <p className="text-sm text-text-secondary mt-1 mb-4">
              Click &quot;Add Delivery Zone&quot; to configure your first delivery region.
            </p>
            <Button onClick={handleAddNewZone} variant="primary" size="sm">
              Create First Zone
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 border-b border-cloud text-xs font-semibold text-charcoal uppercase tracking-wider">
                  <th className="px-6 py-4">Zone & Description</th>
                  <th className="px-6 py-4">Delivery Fee</th>
                  <th className="px-6 py-4">Postal Code Prefixes (FSA)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cloud text-sm">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-background-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal">{zone.name}</div>
                      {zone.description && (
                        <div className="text-xs text-text-secondary mt-0.5">{zone.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          Number(zone.fee) === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {Number(zone.fee) === 0 ? 'FREE' : formatCurrency(Number(zone.fee))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {zone.postalCodes && zone.postalCodes.length > 0 ? (
                          zone.postalCodes.map((fsa) => (
                            <span
                              key={fsa}
                              className="font-mono text-xs px-2 py-0.5 bg-cream rounded border border-cloud text-charcoal font-medium"
                            >
                              {fsa}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-text-muted italic">No codes configured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {zone.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="default">Disabled</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary-glow rounded-lg transition-colors cursor-pointer"
                          title="Edit Zone"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setZoneToDelete(zone)}
                          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Zone"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Delivery Zone Modal */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-cloud">
              <h3 className="font-serif text-xl font-bold text-charcoal">
                {editingZone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
              </h3>
              <button
                onClick={() => setIsZoneModalOpen(false)}
                className="text-text-muted hover:text-charcoal transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Zone Name *
                </label>
                <input
                  type="text"
                  required
                  value={zoneFormData.name}
                  onChange={(e) => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                  placeholder="e.g. Milton, Oakville & Burlington, Mississauga (West)"
                  className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={zoneFormData.description}
                  onChange={(e) => setZoneFormData({ ...zoneFormData, description: e.target.value })}
                  placeholder="e.g. West Mississauga areas closest to Milton"
                  className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    Delivery Fee ($ CAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={zoneFormData.fee}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, fee: e.target.value })}
                    placeholder="0.00, 15.00, 20.00"
                    className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-[11px] text-text-muted mt-1 block">Set 0 for free delivery</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={zoneFormData.sortOrder}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, sortOrder: e.target.value })}
                    placeholder="1, 2, 3"
                    className="w-full h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Postal Codes Tag Editor */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Postal Code Prefixes (FSA - First 3 Characters) *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={postalInput}
                    onChange={(e) => setPostalInput(e.target.value)}
                    onKeyDown={handlePostalInputKeyDown}
                    placeholder="Type e.g. L9T or paste multiple: L6H, L6J, L6K"
                    className="flex-1 h-11 px-4 bg-cream border border-cloud rounded-lg text-sm outline-none focus:border-primary transition-colors font-mono uppercase"
                  />
                  <Button
                    type="button"
                    onClick={addPostalCodesFromInput}
                    variant="outline"
                    className="h-11 px-4 text-xs font-semibold cursor-pointer"
                  >
                    Add Code
                  </Button>
                </div>
                <span className="text-[11px] text-text-muted block mb-3">
                  Tip: Press Enter or comma to add. You can also paste comma-separated codes all at once!
                </span>

                {/* Selected Tag Chips */}
                <div className="min-h-[70px] max-h-[140px] overflow-y-auto p-3 bg-cream/50 rounded-xl border border-cloud flex flex-wrap gap-2 items-start">
                  {zoneFormData.postalCodes.length === 0 ? (
                    <span className="text-xs text-text-muted italic py-1">
                      No postal code prefixes added yet. Enter 3-character prefixes above.
                    </span>
                  ) : (
                    zoneFormData.postalCodes.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 bg-white border border-cloud rounded-md text-charcoal shadow-2xs"
                      >
                        {code}
                        <button
                          type="button"
                          onClick={() => removePostalCode(code)}
                          className="text-text-muted hover:text-error transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zoneFormData.isActive}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-charcoal">Zone is Active for Checkout</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cloud">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmittingZone}
                  className="cursor-pointer"
                >
                  {editingZone ? 'Save Changes' : 'Create Zone'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(zoneToDelete)}
        onClose={() => setZoneToDelete(null)}
        onConfirm={confirmDeleteZone}
        title="Delete Delivery Zone"
        message={`Are you sure you want to delete the delivery zone "${zoneToDelete?.name}"? Customers with postal codes in this zone will no longer be eligible for this rate.`}
        confirmText="Delete Zone"
      />
    </div>
  );
}

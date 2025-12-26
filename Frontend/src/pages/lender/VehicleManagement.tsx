import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, MapPin, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { Vehicle } from '@/types';
import { mockVehicles } from '@/data/mockData';

const categories = ['car', 'bike', 'suv', 'truck', 'van'] as const;

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    company: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'car' as Vehicle['category'],
    pricePerHour: 0,
    numberPlate: '',
    locationAddress: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenForm = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        image: vehicle.image,
        company: vehicle.company,
        model: vehicle.model,
        year: vehicle.year,
        category: vehicle.category,
        pricePerHour: vehicle.pricePerHour,
        numberPlate: vehicle.numberPlate,
        locationAddress: vehicle.locationAddress || '',
        latitude: vehicle.latitude || null,
        longitude: vehicle.longitude || null,
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        image: '',
        company: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'car',
        pricePerHour: 0,
        numberPlate: '',
        locationAddress: '',
        latitude: null,
        longitude: null,
      });
    }
    setShowFormModal(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          locationAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setLocationLoading(false);
      }
    );
  };

  const handleSave = () => {
    // TODO: Connect to backend API
    if (editingVehicle) {
      setVehicles(
        vehicles.map((v) =>
          v.id === editingVehicle.id
            ? { ...v, ...formData }
            : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        ownerId: 'current-user',
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    // TODO: Connect to backend API
    if (editingVehicle) {
      setVehicles(vehicles.filter((v) => v.id !== editingVehicle.id));
    }
    setShowDeleteModal(false);
    setEditingVehicle(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                My Vehicles
              </h1>
              <p className="text-muted-foreground">
                Manage your vehicle listings
              </p>
            </div>
            <motion.button
              onClick={() => handleOpenForm()}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Vehicle
            </motion.button>
          </motion.div>

          {/* Vehicle Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl overflow-hidden group relative"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <motion.img
                      src={vehicle.image}
                      alt={`${vehicle.company} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => handleOpenForm(vehicle)}
                        className="p-2 rounded-lg glass hover:glow-primary"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="w-4 h-4 text-primary" />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-lg glass hover:glow-destructive"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground">
                      {vehicle.company} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year} • {vehicle.category.toUpperCase()}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {vehicle.numberPlate}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ${vehicle.pricePerHour}/hr
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {vehicles.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg mb-4">
                No vehicles listed yet.
              </p>
              <motion.button
                onClick={() => handleOpenForm()}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Your First Vehicle
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Vehicle Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Vehicle Image
            </label>
            <label className="block cursor-pointer">
              <div className="aspect-video rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Vehicle preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Click to upload image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g., Tesla, BMW"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="e.g., Model S, X5"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                min={2000}
                max={new Date().getFullYear() + 1}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Vehicle['category'],
                  })
                }
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price per Hour ($)
              </label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerHour: parseFloat(e.target.value),
                  })
                }
                min={0}
                step={0.5}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number Plate
              </label>
              <input
                type="text"
                value={formData.numberPlate}
                onChange={(e) =>
                  setFormData({ ...formData, numberPlate: e.target.value })
                }
                placeholder="e.g., ABC-1234"
                className="input-field"
              />
            </div>
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> Vehicle Location
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.locationAddress}
                onChange={(e) =>
                  setFormData({ ...formData, locationAddress: e.target.value })
                }
                placeholder="Enter address or use current location"
                className="input-field"
              />
              <motion.button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="w-full py-2.5 px-4 rounded-lg border border-primary/50 bg-primary/10 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use Current Location
                  </>
                )}
              </motion.button>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-muted-foreground">
                  Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={handleSave}
              className="btn-primary flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
            </motion.button>
            <motion.button
              onClick={() => setShowFormModal(false)}
              className="btn-ghost"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Vehicle"
      >
        <div className="py-4">
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete{' '}
            <span className="text-foreground font-medium">
              {editingVehicle?.company} {editingVehicle?.model}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <motion.button
              onClick={handleDelete}
              className="btn-destructive flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes, Delete
            </motion.button>
            <motion.button
              onClick={() => setShowDeleteModal(false)}
              className="btn-ghost flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VehicleManagement;

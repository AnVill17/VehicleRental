import { motion } from 'framer-motion';
import { Camera, Lock, Mail, Trash2, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { useNavigate } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateAccountDetails, updateAvatar } from '../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Access user from Redux store
  const { user } = useSelector((state: any) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
       
        name: user.userName || user.name || '', 
        email: user.email || '',
      }));
    }
  }, [user]);

  // 1. Handle Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const avatarFormData = new FormData();
      avatarFormData.append("avatar", file);

    
      try {
        await dispatch(updateAvatar(avatarFormData)).unwrap();
        alert("Avatar updated successfully!");
      } catch (error) {
        alert("Failed to update avatar");
      }
    }
  };

  // 2. Handle Profile Update
  const handleSave = async () => {
    try {
        
        await dispatch(updateAccountDetails({ 
            userName: formData.name, 
            email: formData.email 
        })).unwrap();
        
        setIsEditing(false);
        alert("Profile updated!");
    } catch (error) {
        alert("Failed to update profile");
    }
  };

  // 3. Handle Delete / Logout
  const handleDeleteAccount = async () => {
    // delete ka functinaity banaya nhii h backend me time mile to kar lenge 
    await dispatch(logoutUser());
    navigate('/login');
  };

  if (!user) {
      return <div className="p-20 text-center">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Profile
            </h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-muted border-4 border-primary/20 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.userName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
                
               
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-5 h-5 text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="text-foreground p-3 bg-muted rounded-lg">
                    {formData.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="text-foreground p-3 bg-muted rounded-lg">
                    {formData.email}
                  </p>
                )}
              </div>

              {isEditing && (
                <>
                  <div className="neon-line my-6" />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      placeholder="Enter new password"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                      className="input-field"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSave}
                    className="btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit Profile
                </motion.button>
              )}
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-display font-semibold text-destructive mb-4">
                Danger Zone
              </h3>
              <motion.button
                onClick={() => setShowDeleteModal(true)}
                className="btn-destructive flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="py-4">
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently removed.
          </p>
          <div className="flex gap-4">
            <motion.button
              onClick={handleDeleteAccount}
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

export default Profile;
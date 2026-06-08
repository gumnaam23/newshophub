'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Lock,
  LucideIcon,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  emailVerified?: boolean;
}

export default function ProfilePage() {
  const { update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  
  // Profile form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.data);
          setFormData({
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showNotification('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleSignOut = async () => {
      await signOut({ callbackUrl: '/' });
    };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        await update({ name: data.data.name });
        showNotification('Profile updated successfully!', 'success');
      } else {
        showNotification(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
        console.error(error)
      showNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  const validatePassword = () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        showNotification(data.error || 'Failed to change password', 'error');
      }
    } catch (error) {
        console.error(error)
      showNotification('Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Image size must be less than 2MB', 'error');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfile(prev => prev ? { ...prev, avatar: data.data.avatar } : null);
        await update({ avatar: data.data.avatar });
        showNotification('Avatar updated successfully!', 'success');
      } else {
        showNotification(data.error || 'Failed to update avatar', 'error');
      }
    } catch (error) {
        console.error(error)
      showNotification('Failed to update avatar', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  const InfoCard = ({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }
  
  return (
    <>
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar & Info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-20">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={saving}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {profile?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {profile?.role}
                  </p>
                </div>
                
                {/* Account Info */}
                <div className="space-y-3">
                  <InfoCard icon={Mail} title="Email Address" value={profile?.email || 'Not set'} />
                  <InfoCard icon={Calendar} title="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'} />
                  <InfoCard icon={Shield} title="Account Status" value={profile?.emailVerified ? 'Verified' : 'Unverified'} />
                </div>
              </div>
            </div>
            
            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={saving}
                      leftIcon={!saving ? <Save className="w-4 h-4" /> : undefined}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </motion.div>
              
              {/* Password Change Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  {!showPasswordForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Change Password
                    </Button>
                  )}
                </div>
                
                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                            passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                            passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                            passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                          setPasswordErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={saving}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                )}
                
                {!showPasswordForm && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Keep your account secure with a strong password
                  </p>
                )}
              </motion.div>
              
              {/* Account Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Account Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-500" />
                      <div className="text-left">
                        <p className="font-medium text-red-600 dark:text-red-400">Sign Out</p>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Toast */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3"
          style={{
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)'
          }}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <AlertCircle className="w-5 h-5 text-white" />
          )}
          <span className="text-white font-medium">{notification.message}</span>
        </motion.div>
      )}
      
    </>
  );
}


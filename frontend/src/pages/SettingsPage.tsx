import { useState, useEffect, useRef } from "react";
import { User, KeyRound, Check, Mail, Lock, Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/services/api";

const SettingsPage = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form States & Visibility Toggles
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync profile form when user object loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const res = await userApi.updateProfile({ name: profileName, avatar: profileAvatar });
      if (res.status === 'success') {
        // Refresh session context
        login(localStorage.getItem('pagecraft_token') || '', res.data.user);
        toast.success("Profile details updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2000000) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileAvatar(base64String);
      toast.info("New profile image selected. Click 'Save Profile Details' to apply changes.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Profile picture cleared. Click 'Save Profile Details' to apply changes.");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const userInitials = profileName
    ? profileName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="p-8 w-full min-h-screen space-y-8 animate-in fade-in-50 duration-300">

      {/* Settings Title */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your profile picture, personal details, and login password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Profile Details Form */}
        <form onSubmit={handleUpdateProfile} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
              <p className="text-xs text-muted-foreground">Manage your identity and profile picture.</p>
            </div>
          </div>

          {/* Profile Picture Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Profile Picture</label>
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-muted/20 p-4 rounded-xl border border-dashed border-border/80">

              {/* Avatar View Block */}
              <div className="relative h-20 w-20 rounded-full border border-border shadow-sm flex items-center justify-center overflow-hidden bg-muted">
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-muted-foreground">{userInitials}</span>
                )}
              </div>

              {/* Upload Action buttons */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {/* File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    id="avatar-upload-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" /> Upload Photo
                  </Button>

                  {profileAvatar && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={handleRemoveAvatar}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, or GIF. Max size 2MB.
                </p>
              </div>

            </div>
          </div>

          {/* Details input grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter full name"
                  className="pl-10 h-10 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email Address (Read-only)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  value={user?.email || ""}
                  disabled
                  placeholder="email@company.com"
                  className="pl-10 h-10 text-sm bg-muted/40 text-muted-foreground/80 cursor-not-allowed border-border/80"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="gap-2 bg-primary text-primary-foreground font-semibold px-5" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving Details..." : <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Save Profile Details</span>}
            </Button>
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Password & Credentials</h2>
              <p className="text-xs text-muted-foreground">Manage and secure your dashboard credentials.</p>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            {/* Current Password */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-12 h-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password input grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="pl-10 pr-12 h-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10 pr-12 h-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold px-5" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating Password..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SettingsPage;

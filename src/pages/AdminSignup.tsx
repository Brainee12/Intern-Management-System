import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, User } from 'lucide-react';

const AdminSignup = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as 'HR' | 'Supervisor' | 'Mentor' | '',
    profilePhoto: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as 'HR' | 'Supervisor' | 'Mentor'
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Create admin account
    const newAdmin = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    // Auto-login after signup
    dispatch({
      type: 'LOGIN_USER',
      payload: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: 'admin',
        isLoggedIn: true
      }
    });

    toast.success('Admin account created successfully!');
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Intern Management System</h1>
          <p className="text-white/80">Create Admin Account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle>Create Admin Account</CardTitle>
            <CardDescription>
              Set up your administrator profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="profilePhoto"
                    />
                    <Label htmlFor="profilePhoto" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" className="w-full" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Photo
                        </span>
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. Sarah Wilson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR Manager</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/admin-login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - in real app, this would validate against backend
    if (formData.email === 'admin@company.com' && formData.password === 'admin123') {
      dispatch({
        type: 'LOGIN_USER',
        payload: {
          id: '1',
          name: 'Dr. Sarah Wilson',
          email: 'admin@company.com',
          role: 'admin',
          isLoggedIn: true
        }
      });
      toast.success('Login successful!');
      navigate('/admin-dashboard');
    } else {
      toast.error('Invalid credentials. Try admin@company.com / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Intern Management System</h1>
          <p className="text-white/80">Admin Portal</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo credentials: admin@company.com / admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/admin-signup" className="text-primary hover:underline">
                  Sign up here
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

export default AdminLogin;
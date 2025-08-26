import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { LogOut, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_USER' });
    navigate('/');
  };

  if (!state.currentUser) return null;

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Intern Management System
        </h1>
        <span className="text-sm text-muted-foreground">
          {state.currentUser.role === 'admin' ? 'Admin Dashboard' : 'Intern Portal'}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{state.currentUser.name}</span>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
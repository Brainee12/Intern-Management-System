import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext, Intern, Task } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';
import { Users, ClipboardList, BarChart3, FileText, CalendarCheck, Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditInternDialogOpen, setIsEditInternDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    internId: ''
  });
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    date: '',
    image: ''
  });
  const [editingNews, setEditingNews] = useState<any>(null);

  // Stats calculations
  const activeInterns = state.interns.filter(i => i.status === 'active').length;
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;

  const filteredInterns = state.interns.filter(intern => 
    intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteIntern = (internId: string) => {
    dispatch({ type: 'DELETE_INTERN', payload: internId });
    toast.success('Intern deleted successfully');
  };

  const handleUpdateIntern = (updatedIntern: Intern) => {
    dispatch({ type: 'UPDATE_INTERN', payload: updatedIntern });
    setEditingIntern(null);
    setIsEditInternDialogOpen(false);
    toast.success('Intern updated successfully');
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.internId) {
      toast.error('Please fill in required fields');
      return;
    }

    const task = {
      id: Date.now().toString(),
      ...newTask,
      assignedAdminId: state.currentUser?.id || '1',
      status: 'pending' as const
    };

    dispatch({ type: 'ADD_TASK', payload: task });
    setNewTask({ title: '', description: '', deadline: '', internId: '' });
    toast.success('Task created successfully');
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    setEditingTask(null);
    setIsEditTaskDialogOpen(false);
    toast.success('Task updated successfully');
  };
  
  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    toast.success('Task deleted successfully');
  };

  const handleMarkAttendance = (internId: string, status: 'present' | 'absent' | 'late') => {
    const attendance = {
      id: Date.now().toString(),
      internId,
      date: new Date().toISOString().split('T')[0],
      status,
      checkInTime: status === 'present' ? new Date().toLocaleTimeString() : undefined
    };

    dispatch({ type: 'ADD_ATTENDANCE', payload: attendance });
    toast.success(`Attendance marked as ${status}`);
  };

  const handleCreateNews = () => {
    if (!newNews.title || !newNews.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const newsItem = {
      id: Date.now().toString(),
      ...newNews,
      date: newNews.date || new Date().toLocaleDateString(),
      image: newNews.image || '/hero-image.jpg',
      createdBy: state.currentUser?.id || '1',
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_NEWS', payload: newsItem });
    setNewNews({ title: '', description: '', date: '', image: '' });
    toast.success('News item created successfully');
  };

  const handleUpdateNews = (updatedNews: any) => {
    dispatch({ type: 'UPDATE_NEWS', payload: updatedNews });
    setEditingNews(null);
    toast.success('News updated successfully');
  };

  const handleDeleteNews = (newsId: string) => {
    dispatch({ type: 'DELETE_NEWS', payload: newsId });
    toast.success('News deleted successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'interns', label: 'Manage Interns', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: ClipboardList },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'news', label: 'News Management', icon: FileText },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeInterns}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  <BarChart3 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{completedTasks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{pendingTasks}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.tasks.slice(0, 5).map(task => {
                    const intern = state.interns.find(i => i.id === task.internId);
                    return (
                      <div key={task.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {intern?.name}
                          </p>
                        </div>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {task.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interns Management Tab */}
        {activeTab === 'interns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Interns</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search interns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredInterns.map(intern => (
                <Card key={intern.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{intern.name}</h3>
                      <p className="text-sm text-muted-foreground">{intern.email}</p>
                      <p className="text-sm">{intern.university} - {intern.program}</p>
                      <div className="flex gap-1">
                        {intern.skills.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={intern.status === 'active' ? 'default' : 'secondary'}>
                        {intern.status}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingIntern({...intern})}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Intern</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={editingIntern?.name || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                value={editingIntern?.email || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, email: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={editingIntern?.phone || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>University</Label>
                              <Input
                                value={editingIntern?.university || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, university: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Program</Label>
                              <Input
                                value={editingIntern?.program || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, program: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Skills (comma separated)</Label>
                              <Input
                                value={editingIntern?.skills?.join(', ') || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, skills: e.target.value.split(',').map(s => s.trim())})}
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={editingIntern?.startDate || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, startDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={editingIntern?.endDate || ''}
                                onChange={(e) => setEditingIntern({...editingIntern, endDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select
                                value={editingIntern?.status || ''}
                                onValueChange={(value) => setEditingIntern({...editingIntern, status: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="dropped">Dropped</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={() => editingIntern && handleUpdateIntern({...editingIntern})}>
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteIntern(intern.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Task Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Task Title</Label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div>
                      <Label>Assign to Intern</Label>
                      <Select
                        value={newTask.internId}
                        onValueChange={(value) => setNewTask({...newTask, internId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select intern" />
                        </SelectTrigger>
                        <SelectContent>
                          {state.interns.map(intern => (
                            <SelectItem key={intern.id} value={intern.id}>
                              {intern.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {state.tasks.map(task => {
                const intern = state.interns.find(i => i.id === task.internId);
                return (
                  <Card key={task.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Assigned to: <strong>{intern?.name}</strong></span>
                            <span>Deadline: <strong>{new Date(task.deadline).toLocaleDateString()}</strong></span>
                          </div>
                          {task.submissionUrl && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-success">✓ Submitted</span>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                View Submission
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                            {task.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingTask({...task})}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Task Title</Label>
                                  <Input
                                    value={editingTask?.title || ''}
                                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={editingTask?.description || ''}
                                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Assign to Intern</Label>
                                  <Select
                                    value={editingTask?.internId || ''}
                                    onValueChange={(value) => setEditingTask({...editingTask, internId: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {state.interns.map(intern => (
                                        <SelectItem key={intern.id} value={intern.id}>
                                          {intern.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Deadline</Label>
                                  <Input
                                    type="date"
                                    value={editingTask?.deadline || ''}
                                    onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select
                                    value={editingTask?.status || ''}
                                    onValueChange={(value) => setEditingTask({...editingTask, status: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={() => editingTask && handleUpdateTask({...editingTask})}>
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Attendance Management</h2>
            
            <div className="grid gap-4">
              {state.interns.map(intern => (
                <Card key={intern.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold">{intern.name}</h3>
                      <p className="text-sm text-muted-foreground">{intern.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(intern.id, 'present')}
                        className="text-success hover:bg-success/10"
                      >
                        Present
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(intern.id, 'late')}
                        className="text-warning hover:bg-warning/10"
                      >
                        Late
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(intern.id, 'absent')}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Absent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* News Management Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">News Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create News Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newNews.title}
                        onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                        placeholder="Enter news title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newNews.description}
                        onChange={(e) => setNewNews({...newNews, description: e.target.value})}
                        placeholder="Enter news description"
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        value={newNews.date}
                        onChange={(e) => setNewNews({...newNews, date: e.target.value})}
                        placeholder="e.g., Dec 25, 2024"
                      />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={newNews.image}
                        onChange={(e) => setNewNews({...newNews, image: e.target.value})}
                        placeholder="Enter image URL (optional)"
                      />
                    </div>
                    <Button onClick={handleCreateNews}>Create News</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {state.news.map(newsItem => (
                <Card key={newsItem.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold">{newsItem.title}</h3>
                        <p className="text-sm text-muted-foreground">{newsItem.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Date: <strong>{newsItem.date}</strong></span>
                          <span>Created: <strong>{new Date(newsItem.createdAt).toLocaleDateString()}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingNews(newsItem)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit News Item</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Title</Label>
                                <Input
                                  value={editingNews?.title || ''}
                                  onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={editingNews?.description || ''}
                                  onChange={(e) => setEditingNews({...editingNews, description: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Date</Label>
                                <Input
                                  value={editingNews?.date || ''}
                                  onChange={(e) => setEditingNews({...editingNews, date: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Image URL</Label>
                                <Input
                                  value={editingNews?.image || ''}
                                  onChange={(e) => setEditingNews({...editingNews, image: e.target.value})}
                                />
                              </div>
                              <Button onClick={() => handleUpdateNews(editingNews)}>
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNews(newsItem.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Intern Performance Report</CardTitle>
                  <CardDescription>Download comprehensive performance data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Report</CardTitle>
                  <CardDescription>Download attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Analytics</CardTitle>
                  <CardDescription>Task completion and progress metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-medium">{((completedTasks / totalTasks) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Tasks per Intern</span>
                      <span className="font-medium">{(totalTasks / activeInterns).toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intern Statistics</CardTitle>
                  <CardDescription>Overview of intern program metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Interns</span>
                      <span className="font-medium">{activeInterns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Programs</span>
                      <span className="font-medium">{state.interns.filter(i => i.status === 'completed').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext, Intern } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';
import { User, ClipboardList, Calendar, FileText, Settings, Upload, Download, Clock, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const InternDashboard = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Intern | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionComment, setSubmissionComment] = useState('');

  // Get current intern data
  const currentIntern = state.interns.find(i => i.id === state.currentUser?.id);
  const myTasks = state.tasks.filter(t => t.internId === state.currentUser?.id);
  const myAttendance = state.attendance.filter(a => a.internId === state.currentUser?.id);
  const myFeedback = state.feedback.filter(f => f.internId === state.currentUser?.id);

  // Stats calculations
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = myTasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;

  const handleProfileUpdate = () => {
    if (currentIntern && profileData) {
      const updatedIntern = { ...currentIntern, ...profileData };
      dispatch({ type: 'UPDATE_INTERN', payload: updatedIntern });
      setEditingProfile(false);
      setProfileData(null);
      toast.success('Profile updated successfully!');
    }
  };

  const handleTaskProgress = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    const task = myTasks.find(t => t.id === taskId);
    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, status }
      });
      toast.success(`Task marked as ${status}`);
    }
  };

  const handleFileUpload = (taskId: string, file?: File) => {
    // If file is provided as parameter, set it as submissionFile
    if (file) {
      setSubmissionFile(file);
      return;
    }
    
    if (!submissionFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // Simulate file upload
    const fileUrl = URL.createObjectURL(submissionFile);
    const task = myTasks.find(t => t.id === taskId);
    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          ...task,
          submissionUrl: fileUrl,
          submissionComment: submissionComment,
          submissionFileName: submissionFile.name,
          submittedAt: new Date().toISOString(),
          status: 'completed'
        }
      });
      
      // Reset form fields
      setSubmissionFile(null);
      setSubmissionComment('');
      
      toast.success('Assignment submitted successfully!');
    }
  };

  const handleDocumentUpload = () => {
    if (!uploadingDocument || !documentTitle.trim()) {
      toast.error('Please provide both a document and a title');
      return;
    }

    if (!currentIntern) {
      toast.error('User not found');
      return;
    }

    // Create a URL for the file
    const fileUrl = URL.createObjectURL(uploadingDocument);
    
    // Create a new document object
    const newDocument = {
      id: Date.now().toString(),
      internId: currentIntern.id,
      title: documentTitle,
      fileUrl: fileUrl,
      fileName: uploadingDocument.name,
      uploadDate: new Date().toISOString(),
      fileType: uploadingDocument.type,
      fileSize: uploadingDocument.size
    };
    
    // Add document to state
    dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
    
    // Reset form
    setUploadingDocument(null);
    setDocumentTitle('');
    
    toast.success('Document uploaded successfully!');
  };

  if (!currentIntern || !state.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {currentIntern.name}! 👋</h1>
          <p className="text-muted-foreground">Here's your internship progress and updates.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'profile', label: 'Profile', icon: Settings }
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
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{completedTasks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{inProgressTasks}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTasks}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Your latest assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Your progress overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Task Completion Rate</span>
                      <span className="font-medium">
                        {myTasks.length > 0 ? ((completedTasks / myTasks.length) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-medium">
                        {myFeedback.length > 0 ? 
                          (myFeedback.reduce((sum, f) => sum + f.rating, 0) / myFeedback.length).toFixed(1) : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feedback Count</span>
                      <span className="font-medium">{myFeedback.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Tasks & Assignments</h2>
            
            <div className="grid gap-4">
              {myTasks.map(task => (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-muted-foreground">{task.description}</p>
                          <p className="text-sm mt-2">
                            <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {task.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleTaskProgress(task.id, 'in-progress')}
                          >
                            Start Task
                          </Button>
                        )}
                        {task.status === 'in-progress' && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Submit Assignment
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Submit Assignment</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Upload File</Label>
                                    <Input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setSubmissionFile(file);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label>Comments</Label>
                                    <Textarea
                                      placeholder="Add any comments about your submission"
                                      value={submissionComment}
                                      onChange={(e) => setSubmissionComment(e.target.value)}
                                    />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Supported formats: PDF, DOC, DOCX, ZIP
                                  </p>
                                  <Button 
                                    onClick={() => handleFileUpload(task.id)}
                                    disabled={!submissionFile}
                                  >
                                    Submit Assignment
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTaskProgress(task.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          </>
                        )}
                        {task.status === 'completed' && (
                          <div className="space-y-2 w-full">
                            {task.submissionUrl && (
                              <div className="border p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium">Submission</p>
                                    <p className="text-xs text-muted-foreground">
                                      {task.submissionFileName || 'Submitted file'} - {new Date(task.submittedAt || '').toLocaleString()}
                                    </p>
                                    {task.submissionComment && (
                                      <p className="text-xs mt-1 italic">Comment: {task.submissionComment}</p>
                                    )}
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(task.submissionUrl, '_blank')}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    View Submission
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Attendance</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Check-in</CardTitle>
                  <CardDescription>Mark your attendance for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const attendance = {
                        id: Date.now().toString(),
                        internId: currentIntern.id,
                        date: new Date().toISOString().split('T')[0],
                        status: 'present' as const,
                        checkInTime: new Date().toLocaleTimeString()
                      };
                      dispatch({ type: 'ADD_ATTENDANCE', payload: attendance });
                      toast.success('Checked in successfully!');
                    }}
                  >
                    Check In
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>Your attendance record</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Days</span>
                      <span className="font-medium">{myAttendance.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Present</span>
                      <span className="font-medium text-success">
                        {myAttendance.filter(a => a.status === 'present').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late</span>
                      <span className="font-medium text-warning">
                        {myAttendance.filter(a => a.status === 'late').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent</span>
                      <span className="font-medium text-destructive">
                        {myAttendance.filter(a => a.status === 'absent').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Documents & Resources</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>Upload your resume, certificates, or reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Document Title</Label>
                      <Input 
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>
                    <div>
                      <Label>Select File</Label>
                      <Input 
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadingDocument(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleDocumentUpload}
                      disabled={!uploadingDocument || !documentTitle.trim()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Uploaded Documents</CardTitle>
                  <CardDescription>Documents you've uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.documents.filter(doc => doc.internId === currentIntern.id).length > 0 ? (
                      state.documents
                        .filter(doc => doc.internId === currentIntern.id)
                        .map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="text-sm font-medium">{doc.title}</span>
                              <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shared Resources</CardTitle>
                  <CardDescription>Download resources shared by admins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Internship Handbook.pdf</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Company Guidelines.docx</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <Button 
                onClick={() => {
                  setEditingProfile(true);
                  setProfileData({...currentIntern});
                }}
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p>{currentIntern.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p>{currentIntern.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p>{currentIntern.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">University</Label>
                    <p>{currentIntern.university}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Program</Label>
                    <p>{currentIntern.program}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Internship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>
                      <Badge variant={currentIntern.status === 'active' ? 'default' : 'secondary'}>
                        {currentIntern.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p>{new Date(currentIntern.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <p>{new Date(currentIntern.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-1">
                      {currentIntern.skills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={profileData?.name || ''}
                      onChange={(e) => profileData && setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={profileData?.email || ''}
                      onChange={(e) => profileData && setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profileData?.phone || ''}
                      onChange={(e) => profileData && setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>University</Label>
                    <Input
                      value={profileData?.university || ''}
                      onChange={(e) => profileData && setProfileData({...profileData, university: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Input
                      value={profileData?.program || ''}
                      onChange={(e) => profileData && setProfileData({...profileData, program: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Skills (comma separated)</Label>
                    <Input
                      value={profileData?.skills?.join(', ') || ''}
                      onChange={(e) => profileData && setProfileData({
                        ...profileData, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                      })}
                    />
                  </div>
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternDashboard;

// AdminDashboard.tsx - Fixed to query Supabase directly
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Users, Mail, Palette, BarChart3, Download, AlertCircle, RefreshCw } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  experience_level: string;
  interests: string[];
  referral_source: string;
  newsletter_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  experience: string;
  createdAt: string;
}

interface Subscriber {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  subscribedAt: string;
}

export function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [students, setStudents] = useState<Record<string, Student[]>>({});
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interests = ['Drawing', 'Painting', 'Digital Art', 'Sculpture', 'Photography', 'Printmaking', 'Mixed Media', 'Ceramics'];

  // Initialize Supabase client
  const supabase = createClient(
    'https://zpgvjrmupplqqwlnmfiy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZ3Zqcm11cHBscXF3bG5tZml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTI3MjYsImV4cCI6MjA3NTQyODcyNn0.TtZLtRnnKnC8vtsyEsc41MISK0aRwF8UfUDSmULzFjQ' // Replace with your actual anon key
  );

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all profiles from Supabase
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      setProfiles(profilesData || []);

      // Organize students by interest
      const studentsData: Record<string, Student[]> = {};
      
      // Initialize all interests with empty arrays
      interests.forEach(interest => {
        studentsData[interest] = [];
      });

      // Populate students by their interests
      (profilesData || []).forEach((profile) => {
        if (profile.interests && Array.isArray(profile.interests)) {
          profile.interests.forEach((interest: string) => {
            if (studentsData[interest]) {
              studentsData[interest].push({
                id: profile.id,
                name: `${profile.first_name} ${profile.last_name}`,
                email: profile.email,
                experience: profile.experience_level,
                createdAt: profile.created_at
              });
            }
          });
        }
      });

      setStudents(studentsData);

      // Get newsletter subscribers (those who opted in)
      const subscribersList: Subscriber[] = (profilesData || [])
        .filter(profile => profile.newsletter_opt_in)
        .map(profile => ({
          userId: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          subscribedAt: profile.created_at
        }));

      setSubscribers(subscribersList);

      if (profilesData && profilesData.length === 0) {
        setError('No signups found. Create test accounts using the signup form to see data here.');
      }

    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const getTotalStudents = () => {
    return profiles.length;
  };

  const getUniqueStudents = () => {
    return profiles.length;
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gallagher Art School</h1>
            <p className="text-muted-foreground">Student Management Dashboard</p>
          </div>
          <Button onClick={loadDashboardData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalStudents()}</div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interests</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(students).reduce((total, studentList) => total + studentList.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Interest selections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribers.length}</div>
              <p className="text-xs text-muted-foreground">
                Active email subscribers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="interests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="interests">Students by Interest</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter Subscribers</TabsTrigger>
            <TabsTrigger value="all">All Profiles</TabsTrigger>
          </TabsList>

          <TabsContent value="interests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Students by Art Interest</h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  const allStudents = Object.values(students).flat();
                  exportToCSV(allStudents, 'students-by-interest.csv');
                }}
                disabled={getTotalStudents() === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interests.map((interest) => (
                <Card key={interest}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {interest}
                      <Badge variant="secondary">
                        {students[interest]?.length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {students[interest]?.length > 0 ? (
                        students[interest].slice(0, 5).map((student) => (
                          <div key={student.id} className="text-sm border-b pb-2 last:border-0">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {student.email}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {student.experience} • {new Date(student.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No students yet
                        </div>
                      )}
                      {students[interest]?.length > 5 && (
                        <div className="text-xs text-muted-foreground pt-2">
                          +{students[interest].length - 5} more students
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Newsletter Subscribers</h2>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(subscribers, 'newsletter-subscribers.csv')}
                disabled={subscribers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardDescription>
                  Students who opted in to receive updates about classes and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscribers.length > 0 ? (
                  <div className="space-y-3">
                    {subscribers.map((subscriber, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <div className="font-medium">
                            {subscriber.firstName} {subscriber.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscriber.email}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No newsletter subscribers yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Profiles</h2>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(profiles, 'all-profiles.csv')}
                disabled={profiles.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                {profiles.length > 0 ? (
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{profile.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p>{profile.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Experience</p>
                            <p>{profile.experience_level}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Interests</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {profile.interests.map((interest, idx) => (
                                <Badge key={idx} variant="secondary">{interest}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Newsletter</p>
                            <Badge variant={profile.newsletter_opt_in ? "default" : "outline"}>
                              {profile.newsletter_opt_in ? "Subscribed" : "Not subscribed"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Signed up</p>
                            <p className="text-sm">{new Date(profile.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No profiles yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
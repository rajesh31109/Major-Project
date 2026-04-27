import { useEffect, useState } from "react";
import {
  Heart,
  FileText,
  LogOut,
  Building,
  BarChart3,
  School,
  Activity,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAdminDashboardData, logoutUser, AdminDashboardData } from "@/lib/app-data";

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await getAdminDashboardData();
        setData(dashboardData);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load admin dashboard.";
        toast.error(message);
        navigate("/login/admin");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully.");
    navigate("/login/admin");
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin">
              <Heart className="w-8 h-8 text-health-green mx-auto mb-4" />
            </div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">
                Student Digital Health Profile
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{data.adminName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {data.stats.map((stat) => (
            <Card key={stat.label} variant="health">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="phcs" className="gap-2">
              <School className="w-4 h-4" />
              PHC Distribution
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-health-green" />
                    Consultation Trends
                  </CardTitle>
                  <CardDescription>Live consultation types based on stored records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.consultationTypes.length > 0 ? (
                      data.consultationTypes.map((item) => (
                        <div key={item.type} className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div>
                            <p className="font-medium text-foreground">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.count} recorded consultations</p>
                          </div>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No consultation data has been recorded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-health-blue" />
                    Summary
                  </CardTitle>
                  <CardDescription>Counts generated from your Supabase tables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p><strong>Students table:</strong> live count of registered students</p>
                  <p><strong>Medical officers table:</strong> active staff count</p>
                  <p><strong>Health records table:</strong> total consultations logged</p>
                  <p><strong>Reports table:</strong> latest generated reports and their status</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="phcs">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Student Distribution by PHC</CardTitle>
                <CardDescription>Top PHCs by registered student count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPhcs.length > 0 ? (
                    data.topPhcs.map((phc) => (
                      <div key={phc.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium text-foreground">{phc.name}</p>
                          <p className="text-sm text-muted-foreground">Students linked to this PHC</p>
                        </div>
                        <Badge variant="outline">{phc.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No PHC-linked students found yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Latest Reports</CardTitle>
                <CardDescription>Recent rows from the reports table</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.latestReports.length > 0 ? (
                    data.latestReports.map((report) => (
                      <div key={report.id} className="rounded-lg border border-border p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{report.title || "Untitled Report"}</p>
                            <p className="text-sm text-muted-foreground">
                              {report.reportType} • Created {formatDate(report.createdAt)}
                            </p>
                          </div>
                          <Badge variant="outline">{report.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No reports are available yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

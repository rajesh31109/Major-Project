import { useEffect, useState } from "react";
import {
  Heart,
  User,
  LogOut,
  Calendar,
  FileText,
  Stethoscope,
  ClipboardList,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getStudentDashboardData, logoutUser, StudentDashboardData } from "@/lib/app-data";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "Not available";

const renderList = (value: unknown) => {
  if (!Array.isArray(value) || value.length === 0) {
    return "None";
  }

  return value.join(", ");
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const dashboardData = await getStudentDashboardData();
        setData(dashboardData);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load student profile.";
        toast.error(message);
        navigate("/login/student");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully.");
    navigate("/login/student");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin">
                <Heart className="w-8 h-8 text-health-blue mx-auto mb-4" />
              </div>
              <p className="text-muted-foreground">Loading your health profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-foreground text-center">Unable to load student data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestRecord = data.records[0];

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
                <User className="w-4 h-4" />
                <span>{data.profile.fullName}</span>
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
        <Card variant="elevated" className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-health-blue/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-health-blue" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{data.profile.fullName}</h1>
                  <p className="text-muted-foreground">
                    {data.profile.department || "Department not provided"} • {data.profile.schoolCode || "School code not provided"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    DOB: {formatDate(data.profile.dateOfBirth)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-2">
                <Badge variant="outline" className="text-lg font-mono px-4 py-2">
                  ID: {data.profile.uniqueStudentId}
                </Badge>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Latest consultation: {latestRecord ? formatDate(latestRecord.consultationDate) : "No consultations yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card variant="health">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-health-teal" />
                <div>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <p className="text-2xl font-bold text-foreground">{data.records.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="health">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-health-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Parent Phone</p>
                  <p className="text-lg font-semibold text-foreground">{data.profile.parentPhone || "Not available"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="health">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-health-green" />
                <div>
                  <p className="text-sm text-muted-foreground">PHC</p>
                  <p className="text-lg font-semibold text-foreground">{data.profile.phcName || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-health-blue" />
                Student Details
              </CardTitle>
              <CardDescription>Stored student profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Email:</strong> {data.profile.email || "Not available"}</p>
              <p><strong>Phone:</strong> {data.profile.phone || "Not available"}</p>
              <p><strong>Roll Number:</strong> {data.profile.rollNumber || "Not available"}</p>
              <p><strong>District Code:</strong> {data.profile.districtCode || "Not available"}</p>
              <p><strong>State Code:</strong> {data.profile.stateCode || "Not available"}</p>
              <p><strong>Address:</strong> {data.profile.address || "Not available"}</p>
              <p><strong>Parent Name:</strong> {data.profile.parentName || "Not available"}</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-health-orange" />
                Latest Consultation
              </CardTitle>
              <CardDescription>Most recent medical entry from your PHC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {latestRecord ? (
                <>
                  <p><strong>Date:</strong> {formatDate(latestRecord.consultationDate)}</p>
                  <p><strong>Type:</strong> {latestRecord.consultationType || "Not specified"}</p>
                  <p><strong>Diagnosis:</strong> {latestRecord.diagnosis || "Not recorded"}</p>
                  <p><strong>Prescription:</strong> {latestRecord.prescription || "Not recorded"}</p>
                  <p><strong>Follow Up:</strong> {formatDate(latestRecord.followUpDate)}</p>
                  <p><strong>Medical Officer:</strong> {latestRecord.medicalOfficerName}</p>
                </>
              ) : (
                <p className="text-muted-foreground">No consultation has been recorded for this student yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-health-blue" />
              Consultation History
            </CardTitle>
            <CardDescription>All recorded medical consultations linked to your student ID</CardDescription>
          </CardHeader>
          <CardContent>
            {data.records.length > 0 ? (
              <div className="space-y-4">
                {data.records.map((record) => (
                  <div key={record.id} className="rounded-lg border border-border p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{record.consultationType || "Consultation"}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(record.consultationDate)} • {record.medicalOfficerName}
                        </p>
                      </div>
                      <Badge variant="outline">{record.followUpDate ? "Follow-up scheduled" : "Completed"}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <p><strong>Symptoms:</strong> {record.symptoms || "Not recorded"}</p>
                      <p><strong>Diagnosis:</strong> {record.diagnosis || "Not recorded"}</p>
                      <p><strong>Description:</strong> {record.description || "Not recorded"}</p>
                      <p><strong>Prescription:</strong> {record.prescription || "Not recorded"}</p>
                      <p><strong>Medications:</strong> {renderList(record.medications)}</p>
                      <p><strong>Lab Tests:</strong> {renderList(record.labTests)}</p>
                      <p><strong>Notes:</strong> {record.notes || "Not recorded"}</p>
                      <p><strong>Follow-up Notes:</strong> {record.followUpNotes || "Not recorded"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No consultation records are available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;

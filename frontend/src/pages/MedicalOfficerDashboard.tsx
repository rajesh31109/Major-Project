import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Search,
  Plus,
  LogOut,
  User,
  ClipboardList,
  Calendar,
  FileText,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getMedicalOfficerDashboardData,
  logoutUser,
  registerStudent,
  saveHealthRecord,
  searchMedicalOfficerStudents,
  MedicalOfficerDashboardData,
  RecentStudentRecord,
  StudentRegistrationInput,
  HealthRecordInput,
} from "@/lib/app-data";

const emptyStudentForm: StudentRegistrationInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  rollNumber: "",
  department: "",
  dateOfBirth: "",
  address: "",
  phcName: "",
  phcCode: "",
  schoolCode: "",
  districtCode: "",
  stateCode: "",
  parentName: "",
  parentPhone: "",
};

const emptyHealthForm: HealthRecordInput = {
  uniqueStudentId: "",
  consultationType: "",
  consultationDate: "",
  symptoms: "",
  diagnosis: "",
  description: "",
  prescription: "",
  medications: "",
  labTests: "",
  notes: "",
  followUpDate: "",
  followUpNotes: "",
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const MedicalOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState<MedicalOfficerDashboardData | null>(null);
  const [searchResults, setSearchResults] = useState<RecentStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentRegistrationInput>(emptyStudentForm);
  const [healthForm, setHealthForm] = useState<HealthRecordInput>({
    ...emptyHealthForm,
    consultationDate: new Date().toISOString().slice(0, 16),
  });
  const [registrationCard, setRegistrationCard] = useState<{
    fullName: string;
    uniqueStudentId: string;
    expiresAt: number;
  } | null>(null);

  const registrationCountdown = useMemo(() => {
    if (!registrationCard) {
      return 0;
    }

    return Math.max(0, Math.ceil((registrationCard.expiresAt - Date.now()) / 1000));
  }, [registrationCard]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await getMedicalOfficerDashboardData();
      setDashboardData(data);
      setSearchResults(data.recentStudents);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load medical officer dashboard.";
      toast.error(message);
      navigate("/login/medical-officer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!registrationCard) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (Date.now() >= registrationCard.expiresAt) {
        setRegistrationCard(null);
      } else {
        setRegistrationCard((current) => (current ? { ...current } : current));
      }
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      setRegistrationCard(null);
    }, 20000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [registrationCard]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully.");
    navigate("/login/medical-officer");
  };

  const handleStudentRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingStudent(true);

    try {
      const student = await registerStudent(studentForm);
      const fullName = [student.first_name, student.last_name].filter(Boolean).join(" ");
      setRegistrationCard({
        fullName,
        uniqueStudentId: student.unique_student_id,
        expiresAt: Date.now() + 20000,
      });
      setStudentForm(emptyStudentForm);
      toast.success("Student registered successfully.");
      await loadDashboard();
      setActiveTab("register");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Student registration failed.";
      toast.error(message);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleCopyStudentId = async () => {
    if (!registrationCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(registrationCard.uniqueStudentId);
      toast.success("Student ID copied.");
    } catch {
      toast.error("Could not copy the student ID.");
    }
  };

  const handleHealthDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRecord(true);

    try {
      await saveHealthRecord(healthForm);
      toast.success("Consultation saved successfully.");
      setHealthForm({
        ...emptyHealthForm,
        consultationDate: new Date().toISOString().slice(0, 16),
      });
      await loadDashboard();
      setActiveTab("search");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save consultation.";
      toast.error(message);
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const results = await searchMedicalOfficerStudents(searchQuery);
      setSearchResults(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not search students.";
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin">
              <Heart className="w-8 h-8 text-health-teal mx-auto mb-4" />
            </div>
            <p className="text-muted-foreground">Loading medical officer dashboard...</p>
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
                <User className="w-4 h-4" />
                <span>{dashboardData.officerName}</span>
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
          {dashboardData.stats.map((stat) => (
            <Card key={stat.label} variant="health">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {registrationCard && (
          <Card className="mb-8 border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Student registered successfully</p>
                    <p className="text-sm text-muted-foreground">
                      {registrationCard.fullName} is now saved in Supabase.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Unique Student ID</p>
                    <p className="text-2xl font-mono font-bold text-foreground">
                      {registrationCard.uniqueStudentId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This card will stay visible for {registrationCountdown} more seconds.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleCopyStudentId}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy ID
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="register" className="gap-2">
              <Plus className="w-4 h-4" />
              Register Student
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Add Consultation
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              Search Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Student Registration</CardTitle>
                <CardDescription>Register a new student and generate a unique student ID</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentRegistration} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={studentForm.firstName}
                        onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={studentForm.lastName}
                        onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={studentForm.dateOfBirth}
                        onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Roll Number</Label>
                      <Input
                        value={studentForm.rollNumber}
                        onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={studentForm.department}
                        onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PHC Name</Label>
                      <Input
                        value={studentForm.phcName}
                        onChange={(e) => setStudentForm({ ...studentForm, phcName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PHC Code</Label>
                      <Input
                        value={studentForm.phcCode}
                        onChange={(e) => setStudentForm({ ...studentForm, phcCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>School Code</Label>
                      <Input
                        value={studentForm.schoolCode}
                        onChange={(e) => setStudentForm({ ...studentForm, schoolCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>District Code</Label>
                      <Input
                        value={studentForm.districtCode}
                        onChange={(e) => setStudentForm({ ...studentForm, districtCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State Code</Label>
                      <Input
                        value={studentForm.stateCode}
                        onChange={(e) => setStudentForm({ ...studentForm, stateCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Name</Label>
                      <Input
                        value={studentForm.parentName}
                        onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Phone</Label>
                      <Input
                        value={studentForm.parentPhone}
                        onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2 lg:col-span-1">
                      <Label>Address</Label>
                      <Textarea
                        value={studentForm.address}
                        onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" disabled={isSubmittingStudent}>
                    <Plus className="w-4 h-4 mr-2" />
                    {isSubmittingStudent ? "Registering..." : "Register Student"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Add Consultation Record</CardTitle>
                <CardDescription>Save medical consultation details for an existing student ID</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHealthDataSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unique Student ID *</Label>
                      <Input
                        value={healthForm.uniqueStudentId}
                        onChange={(e) => setHealthForm({ ...healthForm, uniqueStudentId: e.target.value.toUpperCase() })}
                        placeholder="STU-2026-000001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Type</Label>
                      <Input
                        value={healthForm.consultationType}
                        onChange={(e) => setHealthForm({ ...healthForm, consultationType: e.target.value })}
                        placeholder="General, Vision, Dental..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Date *</Label>
                      <Input
                        type="datetime-local"
                        value={healthForm.consultationDate}
                        onChange={(e) => setHealthForm({ ...healthForm, consultationDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up Date</Label>
                      <Input
                        type="date"
                        value={healthForm.followUpDate}
                        onChange={(e) => setHealthForm({ ...healthForm, followUpDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Symptoms</Label>
                      <Textarea
                        value={healthForm.symptoms}
                        onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diagnosis</Label>
                      <Textarea
                        value={healthForm.diagnosis}
                        onChange={(e) => setHealthForm({ ...healthForm, diagnosis: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={healthForm.description}
                        onChange={(e) => setHealthForm({ ...healthForm, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prescription</Label>
                      <Textarea
                        value={healthForm.prescription}
                        onChange={(e) => setHealthForm({ ...healthForm, prescription: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medications</Label>
                      <Input
                        value={healthForm.medications}
                        onChange={(e) => setHealthForm({ ...healthForm, medications: e.target.value })}
                        placeholder="Comma separated values"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lab Tests</Label>
                      <Input
                        value={healthForm.labTests}
                        onChange={(e) => setHealthForm({ ...healthForm, labTests: e.target.value })}
                        placeholder="Comma separated values"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={healthForm.notes}
                        onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up Notes</Label>
                      <Textarea
                        value={healthForm.followUpNotes}
                        onChange={(e) => setHealthForm({ ...healthForm, followUpNotes: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmittingRecord}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    {isSubmittingRecord ? "Saving..." : "Save Consultation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Search Students</CardTitle>
                <CardDescription>Search by unique student ID, first name, last name, or roll number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student records"
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      <Search className="w-4 h-4 mr-2" />
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {searchResults.length > 0 ? (
                      searchResults.map((student) => (
                        <Card key={student.id} className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="font-semibold text-foreground">{student.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.uniqueStudentId} • {student.rollNumber || "No roll number"} • {student.department || "No department"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {student.phcName || "PHC not assigned"} • Registered {formatDate(student.createdAt)}
                              </p>
                            </div>
                            <Badge variant="outline">Stored in Supabase</Badge>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No students matched your search.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MedicalOfficerDashboard;

import { useState } from "react";
import { GraduationCap, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loginStudent } from "@/lib/app-data";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentId, setStudentId] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginStudent(studentId);
      toast.success("Student ID verified.");
      navigate("/dashboard/student");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Student login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login options
          </Link>

          <div className="max-w-md mx-auto">
            <Card variant="elevated" className="animate-fade-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-health-blue/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-health-blue" />
                </div>
                <CardTitle className="text-2xl">Student Login</CardTitle>
                <CardDescription>Enter your unique student ID to view your health profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Unique Student ID</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                        placeholder="Enter your student ID"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Opening Health Profile..." : "View My Health Records"}
                  </Button>
                </form>

                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Student Access</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Use the unique student ID shared at registration</li>
                    <li>View consultation history entered by your medical officer</li>
                    <li>Read-only access to your health profile data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentLogin;

import { useState } from "react";
import { Stethoscope, Lock, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loginMedicalOfficer } from "@/lib/app-data";

const MedicalOfficerLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginMedicalOfficer(email, password);
      toast.success("Login successful.");
      navigate("/dashboard/medical-officer");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="gradient-hero min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login options
          </Link>

          <div className="mx-auto max-w-md">
            <Card variant="elevated" className="animate-fade-up">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-health-teal/10">
                  <Stethoscope className="h-8 w-8 text-health-teal" />
                </div>
                <CardTitle className="text-2xl">Medical Officer Login</CardTitle>
                <CardDescription>Sign in to register students and record consultations</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your medical officer email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Login to Dashboard"}
                  </Button>
                </form>

                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Medical Officer Access Includes:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Register students and generate unique student IDs</li>
                    <li>Search registered students by unique ID or roll number</li>
                    <li>Add consultation history and follow-up notes</li>
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

export default MedicalOfficerLogin;

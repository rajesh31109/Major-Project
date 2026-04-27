import { useState } from "react";
import { Building2, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loginAdmin } from "@/lib/app-data";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      toast.success("Login successful.");
      navigate("/dashboard/admin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Admin login failed.";
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
                <div className="w-16 h-16 rounded-2xl bg-health-green/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-health-green" />
                </div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>District Medical Health Officer access</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your admin email"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Admin Access Includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>View live student and consultation counts</li>
                    <li>Monitor PHC-wise student registration distribution</li>
                    <li>Review consultation trends and generated reports</li>
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

export default AdminLogin;

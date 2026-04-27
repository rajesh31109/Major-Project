import { useMemo } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DebugPage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const checks = useMemo(
    () => [
      {
        label: "Supabase URL",
        value: supabaseUrl || "Missing",
        ok: Boolean(supabaseUrl),
      },
      {
        label: "Supabase anon key",
        value: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 24)}...` : "Missing",
        ok: Boolean(supabaseAnonKey),
      },
      {
        label: "Custom auth SQL functions required",
        value: "medical_officer_login, admin_login, register_student_with_unique_id",
        ok: true,
      },
    ],
    [supabaseAnonKey, supabaseUrl],
  );

  const allGood = checks.every((check) => check.ok);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8">
              <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>

              <div className="space-y-4">
                {checks.map((check) => (
                  <div key={check.label} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    {check.ok ? (
                      <CheckCircle className="mt-0.5 w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="mt-0.5 w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{check.label}</p>
                      <p className="text-sm text-muted-foreground break-all">{check.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                {allGood ? (
                  <p>The frontend environment is configured. The remaining requirement is to apply the SQL functions and policies in Supabase so custom password-hash login and student ID generation can run safely.</p>
                ) : (
                  <p>One or more Supabase environment variables are missing. Add them to the root `.env` file and restart the Vite dev server.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DebugPage;

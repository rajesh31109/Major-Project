import { Stethoscope, GraduationCap, Building2 } from "lucide-react";
import LoginCard from "./LoginCard";

const loginOptions = [
  {
    icon: Stethoscope,
    title: "Medical Officer",
    description: "Primary Health Center medical staff login",
    buttonText: "Medical Officer Login",
    href: "/login/medical-officer",
    features: [
      "Email & password sign in",
      "Register new students",
      "Generate unique student IDs",
      "Record consultation history",
    ],
    color: "teal" as const,
  },
  {
    icon: GraduationCap,
    title: "Student",
    description: "View your personal health records",
    buttonText: "Student Login",
    href: "/login/student",
    features: [
      "Login with Unique Student ID",
      "View personal health records",
      "See consultation history",
      "Read-only access to data",
    ],
    color: "blue" as const,
  },
  {
    icon: Building2,
    title: "Admin (DMHO)",
    description: "District Medical Health Officer access",
    buttonText: "Admin Login",
    href: "/login/admin",
    features: [
      "Email & password sign in",
      "View live district-wide counts",
      "Review consultation trends",
      "Monitor generated reports",
    ],
    color: "green" as const,
  },
];

const LoginOptions = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Login Options
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your role to access the Digital Health Profile portal
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {loginOptions.map((option, index) => (
            <div
              key={option.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LoginCard {...option} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginOptions;

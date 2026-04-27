import { 
  UserCircle, 
  Stethoscope, 
  ShieldCheck, 
  ClipboardList,
  Eye,
  Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Stethoscope,
    title: "Medical Officer Portal",
    description: "Register students, generate unique student IDs, and record consultation details directly into Supabase.",
    color: "health-teal",
  },
  {
    icon: UserCircle,
    title: "Student Portal",
    description: "Students can view their own consultation history using the unique student ID created at registration.",
    color: "health-blue",
  },
  {
    icon: Building2,
    title: "Admin Dashboard",
    description: "DMHO and authorized team members can monitor live counts, PHC distribution, and report activity.",
    color: "health-green",
  },
  {
    icon: ClipboardList,
    title: "Comprehensive Records",
    description: "Track consultation type, symptoms, diagnosis, prescriptions, lab tests, and follow-up plans.",
    color: "health-teal",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Read-Only",
    description: "Records are stored centrally in Supabase and shown in role-specific dashboards.",
    color: "health-blue",
  },
  {
    icon: Eye,
    title: "Easy Access",
    description: "Medical officers and admins sign in with email and password, while students use their unique student ID.",
    color: "health-green",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Complete Health Tracking System
          </h2>
          <p className="text-lg text-muted-foreground">
            A unified platform connecting Medical Officers, Students, and Administrators 
            for comprehensive health monitoring.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="health"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

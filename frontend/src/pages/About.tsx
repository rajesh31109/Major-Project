import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Shield, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              About <span className="text-gradient">Digital Health Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A government initiative to digitize and streamline student health 
              tracking across schools in the district.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card variant="health" className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-health-teal/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-health-teal" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground">
                  To create a comprehensive digital health record system for every 
                  school-going child, ensuring timely health monitoring, early 
                  detection of health issues, and providing accessible health 
                  information to students, parents, and healthcare providers.
                </p>
              </Card>

              <Card variant="health" className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-health-blue/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-health-blue" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground">
                  A healthier future for every child. We envision a system where 
                  comprehensive health data enables better healthcare decisions, 
                  nutrition guidance, and preventive care for the next generation.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              Key System Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Secure Data",
                  description: "All health records are securely stored with read-only access",
                },
                {
                  icon: Users,
                  title: "Multi-User",
                  description: "Separate portals for officers, students, and administrators",
                },
                {
                  icon: Heart,
                  title: "Comprehensive",
                  description: "Tracks vitals, conditions, quarterly checkups, and nutrition",
                },
                {
                  icon: Target,
                  title: "Accessible",
                  description: "Students can view their records anytime using Health ID",
                },
              ].map((feature) => (
                <Card key={feature.title} variant="default" className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Health Data Tracked */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-4">
              Health Data Tracked
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Comprehensive health information is collected and monitored for each student
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card variant="outline" className="p-6">
                <CardContent className="p-0">
                  <h3 className="font-display font-semibold text-foreground mb-4">Vital Signs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Blood Group</li>
                    <li>• Heart Rate</li>
                    <li>• Pulse Rate</li>
                    <li>• Blood Pressure</li>
                    <li>• Temperature</li>
                    <li>• Hemoglobin (Hb%)</li>
                    <li>• Vision (Left & Right Eye)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="outline" className="p-6">
                <CardContent className="p-0">
                  <h3 className="font-display font-semibold text-foreground mb-4">Medical Conditions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Hearing & Speech</li>
                    <li>• Heart Diseases</li>
                    <li>• Diabetes & Deficiencies</li>
                    <li>• Skin & ENT Diseases</li>
                    <li>• Neurological Disorders</li>
                    <li>• Allergies & Anaemia</li>
                    <li>• Congenital/Birth Defects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="outline" className="p-6">
                <CardContent className="p-0">
                  <h3 className="font-display font-semibold text-foreground mb-4">Quarterly Checkups</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Date of Medical Camp</li>
                    <li>• Signs & Symptoms</li>
                    <li>• Height & Weight</li>
                    <li>• Diagnosis</li>
                    <li>• Treatment Given</li>
                    <li>• Referrals Made</li>
                    <li>• Nutrition Advice</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

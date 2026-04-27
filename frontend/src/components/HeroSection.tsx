import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useState, useEffect } from "react";
import { getHomepageStats, HomepageStats } from "@/lib/app-data";

const HeroSection = () => {
  const [stats, setStats] = useState<HomepageStats>({
    totalStudents: 0,
    totalSchools: 0,
    totalPHCs: 0,
    totalHealthRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getHomepageStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load homepage statistics:", error);
        setStats({
          totalStudents: 0,
          totalSchools: 0,
          totalPHCs: 0,
          totalHealthRecords: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);
  return (
    <section className="relative min-h-screen gradient-hero pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-health-blue/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Government Health Initiative</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Digital{" "}
              <span className="text-gradient">Health Profile</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground">
                Student Health Management System
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              A comprehensive digital health tracking system for school students, 
              ensuring every child's health is monitored, recorded, and accessible 
              to medical officers, students, and administrators.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/login">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline-light" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">
                  {loading ? '...' : `${(stats.totalStudents / 100000).toFixed(1)}L+`}
                </div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">
                  {loading ? '...' : `${stats.totalSchools}+`}
                </div>
                <div className="text-sm text-muted-foreground">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">
                  {loading ? '...' : `${stats.totalPHCs}+`}
                </div>
                <div className="text-sm text-muted-foreground">PHCs</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            className="relative animate-fade-up lg:order-last" 
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="School children with medical professional"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-6 top-1/4 bg-card rounded-xl p-4 shadow-lg border border-border/50 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-health-green/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-health-green" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Health Records</div>
                  <div className="text-sm font-semibold text-foreground">Updated Daily</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-1/4 bg-card rounded-xl p-4 shadow-lg border border-border/50 animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-health-blue/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-health-blue" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Medical Officers</div>
                  <div className="text-sm font-semibold text-foreground">Active Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

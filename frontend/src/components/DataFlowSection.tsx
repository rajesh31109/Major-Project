import { ArrowRight, Stethoscope, GraduationCap, Building2, Database } from "lucide-react";

const DataFlowSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple and secure data flow ensuring student health records are 
            properly managed and accessible.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Medical Officer */}
            <div className="text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-20 h-20 rounded-2xl bg-health-teal/10 flex items-center justify-center mx-auto mb-3 shadow-card">
                <Stethoscope className="w-10 h-10 text-health-teal" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-1">Medical Officer</h4>
              <p className="text-sm text-muted-foreground">Enters & Submits Data</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>

            {/* Database */}
            <div className="text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Database className="w-10 h-10 text-primary-foreground" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-1">Secure Database</h4>
              <p className="text-sm text-muted-foreground">Permanent Storage</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>

            {/* Access Points */}
            <div className="animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-card border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-health-blue/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-health-blue" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Student</div>
                    <div className="text-xs text-muted-foreground">View own data</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-card border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-health-green/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-health-green" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Admin</div>
                    <div className="text-xs text-muted-foreground">Monitor & analyze</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="text-3xl font-display font-bold text-primary mb-2">1</div>
              <h4 className="font-semibold text-foreground mb-2">Data Entry</h4>
              <p className="text-sm text-muted-foreground">
                Medical officers register students and enter comprehensive health data
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="text-3xl font-display font-bold text-primary mb-2">2</div>
              <h4 className="font-semibold text-foreground mb-2">Secure Storage</h4>
              <p className="text-sm text-muted-foreground">
                Data is permanently stored with no edit or delete options
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="text-3xl font-display font-bold text-primary mb-2">3</div>
              <h4 className="font-semibold text-foreground mb-2">Read-Only Access</h4>
              <p className="text-sm text-muted-foreground">
                Students and admins can view data for monitoring and review
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataFlowSection;

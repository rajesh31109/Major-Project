import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  features: string[];
  color: "teal" | "blue" | "green";
}

const colorClasses = {
  teal: {
    bg: "bg-health-teal/10",
    text: "text-health-teal",
    border: "hover:border-health-teal/30",
  },
  blue: {
    bg: "bg-health-blue/10",
    text: "text-health-blue",
    border: "hover:border-health-blue/30",
  },
  green: {
    bg: "bg-health-green/10",
    text: "text-health-green",
    border: "hover:border-health-green/30",
  },
};

const LoginCard = ({ icon: Icon, title, description, buttonText, href, features, color }: LoginCardProps) => {
  const colors = colorClasses[color];

  return (
    <Card variant="interactive" className={`h-full ${colors.border}`}>
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${colors.text}`} />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace("/10", "")} mt-2`} />
              {feature}
            </li>
          ))}
        </ul>
        <Button variant="default" size="lg" className="w-full" asChild>
          <Link to={href}>
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginCard;

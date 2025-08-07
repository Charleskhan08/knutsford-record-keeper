import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, FileText, BarChart3, Shield, DollarSign } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
  };

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Student Management",
      description: "Comprehensive student record management with easy registration and updates."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-secondary" />,
      title: "Fee Management",
      description: "Track fee payments, generate receipts, and manage outstanding balances in GHS."
    },
    {
      icon: <FileText className="h-8 w-8 text-accent" />,
      title: "Report Generation",
      description: "Generate detailed reports with period-based filtering and PDF downloads."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Analytics Dashboard",
      description: "Real-time insights and statistics about student enrollment and payments."
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Secure Access",
      description: "Admin-only access with secure authentication for data protection."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-20 w-20" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              SRC Student Management System
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              A comprehensive platform for managing student records, fee payments, 
              and generating detailed reports with advanced analytics.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 transition-smooth"
              onClick={handleLogin}
            >
              Access Admin Panel
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage student records and fee payments efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card transition-smooth hover:shadow-elevated">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
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

      {/* Stats Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted System</h2>
            <p className="text-muted-foreground">
              Built for educational institutions to streamline administrative processes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Secure Data Management</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">GHS</div>
              <p className="text-muted-foreground">Local Currency Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <p className="text-muted-foreground">System Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access the admin panel to start managing student records and fee payments
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-primary transition-smooth"
            onClick={handleLogin}
          >
            Login to Admin Panel
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">SRC Student Management System</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 SRC Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
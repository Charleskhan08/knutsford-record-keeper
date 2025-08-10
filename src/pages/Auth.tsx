import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import collegeBackground from "@/assets/knutsford-college-bg.jpg";

export default function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const CREDENTIALS = {
    admin: {
      username: "admin",
      password: "admin123"
    },
    student: {
      username: "student",
      password: "student123"
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      const credentials = CREDENTIALS[formData.role as keyof typeof CREDENTIALS];
      
      if (formData.username === credentials.username && 
          formData.password === credentials.password) {
        
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", formData.role);
        
        toast({
          title: "Login Successful",
          description: `Welcome to SRC Student Management System`,
        });
        
        navigate(formData.role === "admin" ? "/dashboard" : "/fee-payment");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${collegeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-6">
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Access the SRC Student Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <Label>Login as</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong><br />
                Admin - Username: admin, Password: admin123<br />
                Student - Username: student, Password: student123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
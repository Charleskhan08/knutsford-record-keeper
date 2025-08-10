import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DollarSign, CreditCard, Receipt } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FeePayment() {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    email: "",
    phone: "",
    feeType: "",
    amount: "",
    term: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const feeTypes = [
    { value: "tuition", label: "Tuition Fee" },
    { value: "accommodation", label: "Accommodation Fee" },
    { value: "registration", label: "Registration Fee" },
    { value: "library", label: "Library Fee" },
    { value: "sports", label: "Sports Fee" },
    { value: "lab", label: "Laboratory Fee" }
  ];

  const terms = [
    { value: "2024-1", label: "2024 - Term 1" },
    { value: "2024-2", label: "2024 - Term 2" },
    { value: "2024-3", label: "2024 - Term 3" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendPaymentPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate form
    if (!formData.studentId || !formData.studentName || !formData.phone || !formData.feeType || !formData.amount || !formData.term) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Simulate sending payment prompt to mobile
    setTimeout(() => {
      setPaymentSent(true);
      setIsProcessing(false);
      toast({
        title: "Payment Prompt Sent",
        description: `Payment request for GHS ${formData.amount} has been sent to ${formData.phone}`,
      });
    }, 2000);
  };

  const simulatePaymentCompletion = () => {
    toast({
      title: "Payment Completed",
      description: "Payment successful! Receipt has been sent via SMS and email.",
    });
    
    // Reset form after successful payment
    setFormData({
      studentId: "",
      studentName: "",
      email: "",
      phone: "",
      feeType: "",
      amount: "",
      term: ""
    });
    setPaymentSent(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Fee Payment</CardTitle>
            <CardDescription>
              Enter student details to process fee payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!paymentSent ? (
              <form onSubmit={handleSendPaymentPrompt} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="Enter student ID"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Full Name *</Label>
                    <Input
                      id="studentName"
                      type="text"
                      placeholder="Enter full name"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feeType">Fee Type *</Label>
                    <Select value={formData.feeType} onValueChange={(value) => handleInputChange("feeType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term">Academic Term *</Label>
                    <Select value={formData.term} onValueChange={(value) => handleInputChange("term", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (GHS) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount in GHS"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary transition-smooth"
                  disabled={isProcessing}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isProcessing ? "Sending Payment Prompt..." : "Send Payment Prompt to Mobile"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Alert className="border-secondary bg-secondary/10">
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    Payment prompt has been sent to <strong>{formData.phone}</strong> for GHS {formData.amount}.
                    Student will receive a mobile notification to complete payment.
                  </AlertDescription>
                </Alert>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">Payment Details:</h3>
                  <p><strong>Student:</strong> {formData.studentName} ({formData.studentId})</p>
                  <p><strong>Fee Type:</strong> {feeTypes.find(f => f.value === formData.feeType)?.label}</p>
                  <p><strong>Term:</strong> {terms.find(t => t.value === formData.term)?.label}</p>
                  <p><strong>Amount:</strong> GHS {formData.amount}</p>
                  <p><strong>Status:</strong> <span className="text-accent font-medium">Pending Payment</span></p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={simulatePaymentCompletion}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Simulate Payment Completion
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setPaymentSent(false)}
                    className="flex-1"
                  >
                    Send Another Payment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
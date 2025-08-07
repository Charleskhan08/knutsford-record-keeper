import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Filter, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodFilterProps {
  onFilterChange: (startDate: string, endDate: string, semester: string) => void;
  onGenerateReport: () => void;
}

export function PeriodFilter({ onFilterChange, onGenerateReport }: PeriodFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const handleApplyFilter = () => {
    onFilterChange(startDate, endDate, selectedSemester);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedSemester("all");
    onFilterChange("", "", "all");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
        <CardDescription>
          Filter reports by date range and academic term
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Academic Term</Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="2024-1">2024 - First Semester</SelectItem>
              <SelectItem value="2024-2">2024 - Second Semester</SelectItem>
              <SelectItem value="2025-1">2025 - First Semester</SelectItem>
              <SelectItem value="2025-2">2025 - Second Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleApplyFilter} className="flex-1">
            Apply Filter
          </Button>
          <Button variant="outline" onClick={handleClearFilter} className="flex-1">
            Clear Filter
          </Button>
          <Button 
            onClick={onGenerateReport} 
            className="bg-gradient-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  imageUrl: string;
}

const Employees = () => {
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      position: "Senior Developer",
      department: "Engineering",
      email: "john.doe@company.com",
      phone: "+1 234 567 890",
      location: "New York, USA",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: "2",
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      email: "jane.smith@company.com",
      phone: "+1 234 567 891",
      location: "San Francisco, USA",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      id: "3",
      name: "Bob Johnson",
      position: "HR Specialist",
      department: "Human Resources",
      email: "bob.johnson@company.com",
      phone: "+1 234 567 892",
      location: "Chicago, USA",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  ]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employee Directory</h1>
            <p className="text-gray-600 mt-1">Manage and view employee information</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={employee.imageUrl}
                  alt={employee.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-sm text-gray-500">{employee.department}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {employee.location}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Employees;
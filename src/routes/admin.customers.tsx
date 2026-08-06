import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag,
  Download
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/customers')({
  component: CustomerManagement,
})

function CustomerManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-green-600 mt-1">+19% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-green-600 mt-1">+23% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$285.42</div>
            <p className="text-xs text-green-600 mt-1">+8% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Repeat Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-green-600 mt-1">+5% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Customer</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Contact</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Location</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Orders</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Total Spent</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {customer.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm">
                        <ShoppingBag className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.orders}
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.totalSpent}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        customer.status === 'active' ? 'bg-green-100 text-green-700' :
                        customer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const customers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0100',
    location: 'Los Angeles, CA',
    orders: 23,
    totalSpent: '4,521.00',
    status: 'vip',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0101',
    location: 'New York, NY',
    orders: 18,
    totalSpent: '3,892.00',
    status: 'active',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'm.brown@email.com',
    phone: '+1-555-0102',
    location: 'Chicago, IL',
    orders: 15,
    totalSpent: '3,245.00',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1-555-0103',
    location: 'Houston, TX',
    orders: 14,
    totalSpent: '2,987.00',
    status: 'active',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'd.wilson@email.com',
    phone: '+1-555-0104',
    location: 'Phoenix, AZ',
    orders: 12,
    totalSpent: '2,654.00',
    status: 'active',
  },
]

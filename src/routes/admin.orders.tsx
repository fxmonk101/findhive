import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/orders')({
  component: OrderManagement,
})

function OrderManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89</div>
            <p className="text-xs text-muted-foreground mt-1">Being prepared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-600" />
              Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1,234</div>
            <p className="text-xs text-muted-foreground mt-1">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">982</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by number, customer, or email..."
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

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Order</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Customer</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Items</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Total</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Payment</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.number}</p>
                        {order.tracking && (
                          <p className="text-xs text-gray-500">Tracking: {order.tracking}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{order.date}</td>
                    <td className="p-4 text-sm">{order.items} items</td>
                    <td className="p-4 font-medium">{order.total}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={
                        order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Add Tracking
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
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

const orders = [
  {
    id: '1',
    number: '#ORD-1234',
    customer: 'John Smith',
    email: 'john@email.com',
    date: '2024-01-15',
    items: 3,
    total: '$234.50',
    paymentStatus: 'paid',
    status: 'shipped',
    tracking: '1Z999AA10123456784',
  },
  {
    id: '2',
    number: '#ORD-1233',
    customer: 'Sarah Johnson',
    email: 'sarah@email.com',
    date: '2024-01-15',
    items: 1,
    total: '$89.99',
    paymentStatus: 'paid',
    status: 'processing',
    tracking: null,
  },
  {
    id: '3',
    number: '#ORD-1232',
    customer: 'Michael Brown',
    email: 'michael@email.com',
    date: '2024-01-14',
    items: 5,
    total: '$1,299.00',
    paymentStatus: 'pending',
    status: 'pending',
    tracking: null,
  },
  {
    id: '4',
    number: '#ORD-1231',
    customer: 'Emily Davis',
    email: 'emily@email.com',
    date: '2024-01-14',
    items: 2,
    total: '$45.00',
    paymentStatus: 'paid',
    status: 'delivered',
    tracking: '1Z999AA10123456783',
  },
  {
    id: '5',
    number: '#ORD-1230',
    customer: 'David Wilson',
    email: 'david@email.com',
    date: '2024-01-13',
    items: 4,
    total: '$567.00',
    paymentStatus: 'paid',
    status: 'shipped',
    tracking: '1Z999AA10123456782',
  },
]

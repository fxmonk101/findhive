import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Send,
  Bell,
  Mail,
  MessageSquare,
  Check,
  X,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/notifications')({
  component: NotificationManagement,
})

function NotificationManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage notifications for admins and customers</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-green-600 mt-1">+15% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,234</div>
            <p className="text-xs text-muted-foreground mt-1">Email notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              In-App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,111</div>
            <p className="text-xs text-muted-foreground mt-1">In-app notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600 mt-1">+2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    template.type === 'email' ? 'bg-blue-50' :
                    template.type === 'in_app' ? 'bg-purple-50' :
                    'bg-green-50'
                  }`}>
                    {template.type === 'email' ? <Mail className="h-5 w-5 text-blue-600" /> :
                     template.type === 'in_app' ? <MessageSquare className="h-5 w-5 text-purple-600" /> :
                     <Bell className="h-5 w-5 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{template.type}</Badge>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'email' ? 'bg-blue-100' :
                        notification.type === 'in_app' ? 'bg-purple-100' :
                        'bg-green-100'
                      }`}>
                        {notification.type === 'email' ? <Mail className="h-5 w-5 text-blue-600" /> :
                         notification.type === 'in_app' ? <MessageSquare className="h-5 w-5 text-purple-600" /> :
                         <Bell className="h-5 w-5 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.recipients}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.sentAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" />
                        {notification.delivered}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      notification.status === 'sent' ? 'bg-green-100 text-green-700' :
                      notification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {notification.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Resend
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const templates = [
  { id: '1', name: 'Order Confirmation', description: 'Sent when customer places an order', type: 'email' },
  { id: '2', name: 'Shipping Update', description: 'Sent when order ships', type: 'email' },
  { id: '3', name: 'Welcome Email', description: 'Sent to new customers', type: 'email' },
  { id: '4', name: 'Promotional Alert', description: 'In-app promotional notifications', type: 'in_app' },
  { id: '5', name: 'Order Status', description: 'Real-time order status updates', type: 'in_app' },
  { id: '6', name: 'Low Stock Alert', description: 'Alert admins for low inventory', type: 'push' },
]

const notifications = [
  {
    id: '1',
    title: 'Order #1234 Shipped',
    recipients: 'john@email.com',
    message: 'Your order has been shipped and is on its way! Tracking number: 1Z999AA10123456784',
    type: 'email',
    sentAt: '2024-01-15 10:30 AM',
    delivered: 'Delivered',
    status: 'sent',
  },
  {
    id: '2',
    title: 'Welcome to FindHive!',
    recipients: 'sarah@email.com',
    message: 'Thank you for signing up! Here\'s a 15% discount code for your first order: WELCOME15',
    type: 'email',
    sentAt: '2024-01-15 09:15 AM',
    delivered: 'Delivered',
    status: 'sent',
  },
  {
    id: '3',
    title: 'Flash Sale - 50% Off!',
    recipients: 'All customers',
    message: 'Limited time offer: Get 50% off on selected items. Use code FLASH50 at checkout.',
    type: 'in_app',
    sentAt: '2024-01-14 08:00 AM',
    delivered: '4,234/5,000',
    status: 'sent',
  },
  {
    id: '4',
    title: 'Low Stock: Charizard VMAX',
    recipients: 'Admins',
    message: 'Product "Charizard VMAX Rainbow Rare PSA 10" is running low on stock (2 units remaining)',
    type: 'push',
    sentAt: '2024-01-14 02:30 PM',
    delivered: 'Delivered',
    status: 'sent',
  },
  {
    id: '5',
    title: 'Order #1233 Delivered',
    recipients: 'michael@email.com',
    message: 'Your order has been delivered successfully. Thank you for shopping with FindHive!',
    type: 'email',
    sentAt: '2024-01-13 04:45 PM',
    delivered: 'Delivered',
    status: 'sent',
  },
]

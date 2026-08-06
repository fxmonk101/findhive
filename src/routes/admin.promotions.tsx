import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  Copy,
  Percent,
  Tag,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/promotions')({
  component: PromotionManagement,
})

function PromotionManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600 mt-1">Manage discounts, coupons, and promotional campaigns</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Promotion Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Active Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-green-600 mt-1">+15% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Discount Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground mt-1">Total given</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-green-600 mt-1">+8% this month</p>
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
                placeholder="Search promotions by name or code..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Promotion</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Code</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Type</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Value</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Period</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Usage</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{promo.name}</p>
                      <p className="text-sm text-gray-500">{promo.description}</p>
                    </td>
                    <td className="p-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{promo.code}</code>
                    </td>
                    <td className="p-4 text-sm">{promo.type}</td>
                    <td className="p-4 font-medium">{promo.value}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {promo.period}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        {promo.usage}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        promo.status === 'active' ? 'bg-green-100 text-green-700' :
                        promo.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        promo.status === 'expired' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

const promotions = [
  {
    id: '1',
    name: 'New Year Sale',
    description: '20% off all products',
    code: 'NEWYEAR20',
    type: 'Percentage',
    value: '20%',
    period: 'Jan 1 - Jan 31',
    usage: '234/500',
    status: 'active',
  },
  {
    id: '2',
    name: 'Free Shipping',
    description: 'Free shipping on orders over $50',
    code: 'FREESHIP50',
    type: 'Free Shipping',
    value: '$0',
    period: 'Jan 15 - Feb 15',
    usage: '456/1000',
    status: 'active',
  },
  {
    id: '3',
    name: 'Valentine\'s Special',
    description: '$10 off orders over $100',
    code: 'LOVE10',
    type: 'Fixed Amount',
    value: '$10',
    period: 'Feb 1 - Feb 14',
    usage: '0/200',
    status: 'scheduled',
  },
  {
    id: '4',
    name: 'Flash Sale',
    description: '50% off select items',
    code: 'FLASH50',
    type: 'Percentage',
    value: '50%',
    period: 'Dec 25 - Dec 31',
    usage: '567/100',
    status: 'expired',
  },
  {
    id: '5',
    name: 'Welcome Offer',
    description: '15% off first order',
    code: 'WELCOME15',
    type: 'Percentage',
    value: '15%',
    period: 'Unlimited',
    usage: '89/5000',
    status: 'active',
  },
]

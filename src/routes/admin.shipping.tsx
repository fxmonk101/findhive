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
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/shipping')({
  component: ShippingManagement,
})

function ShippingManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping</h1>
          <p className="text-gray-600 mt-1">Manage shipping methods, carriers, and zones</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Method
        </Button>
      </div>

      {/* Shipping Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Shipping options</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground mt-1">Active shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Coverage areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg. Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-green-600 mt-1">-0.5 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search shipping methods..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <div key={method.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.carrier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      method.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }>
                      {method.status}
                    </Badge>
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
                          <MapPin className="h-4 w-4 mr-2" />
                          Manage Zones
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">{method.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery:</span>
                    <span className="ml-2 font-medium">{method.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Free over:</span>
                    <span className="ml-2 font-medium">{method.freeOver}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-gray-500">{zone.countries}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{zone.methods} methods</Badge>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const shippingMethods = [
  {
    id: '1',
    name: 'Standard Shipping',
    carrier: 'USPS',
    price: '$5.99',
    deliveryTime: '5-7 business days',
    freeOver: '$50',
    status: 'active',
  },
  {
    id: '2',
    name: 'Express Shipping',
    carrier: 'FedEx',
    price: '$12.99',
    deliveryTime: '2-3 business days',
    freeOver: '$100',
    status: 'active',
  },
  {
    id: '3',
    name: 'Priority Shipping',
    carrier: 'UPS',
    price: '$19.99',
    deliveryTime: '1-2 business days',
    freeOver: '$150',
    status: 'active',
  },
  {
    id: '4',
    name: 'International Shipping',
    carrier: 'DHL',
    price: '$24.99',
    deliveryTime: '7-14 business days',
    freeOver: '$200',
    status: 'active',
  },
  {
    id: '5',
    name: 'Local Pickup',
    carrier: 'In-Store',
    price: 'Free',
    deliveryTime: 'Same day',
    freeOver: 'N/A',
    status: 'active',
  },
]

const zones = [
  { id: '1', name: 'United States', countries: 'US', methods: 5 },
  { id: '2', name: 'Canada', countries: 'CA', methods: 3 },
  { id: '3', name: 'Europe', countries: 'UK, DE, FR, ES, IT', methods: 2 },
  { id: '4', name: 'Asia Pacific', countries: 'AU, JP, SG, HK', methods: 2 },
]

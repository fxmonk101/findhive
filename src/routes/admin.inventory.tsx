import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle,
  Package,
  Warehouse,
  TrendingUp,
  Download
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/inventory')({
  component: InventoryManagement,
})

function InventoryManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage warehouse stock and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground mt-1">In catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Total Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground mt-1">Units in warehouse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$284,521</div>
            <p className="text-xs text-muted-foreground mt-1">Total inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-red-600">{item.stock} units</p>
                    <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Product</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">SKU</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Warehouse</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Location</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Quantity</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Last Counted</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <p className="font-medium">{item.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.sku}</td>
                    <td className="p-4 text-sm">{item.warehouse}</td>
                    <td className="p-4 text-sm text-gray-600">{item.location}</td>
                    <td className="p-4 font-medium">{item.quantity}</td>
                    <td className="p-4">
                      <Badge className={
                        item.status === 'in_stock' ? 'bg-green-100 text-green-700' :
                        item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {item.status === 'in_stock' ? 'In Stock' :
                         item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.lastCounted}</td>
                    <td className="p-4">
                      <Button size="sm" variant="outline">
                        Adjust
                      </Button>
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

const lowStockItems = [
  {
    id: '1',
    name: 'Charizard VMAX Rainbow Rare PSA 10',
    sku: 'PKM-CHAR-PSA10',
    image: 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=100&auto=format&fit=crop',
    stock: 2,
    minStock: 5,
  },
  {
    id: '2',
    name: 'Elite Trainer Box - Paldea Evolved',
    sku: 'PKM-ETB-PE-001',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=100&auto=format&fit=crop',
    stock: 8,
    minStock: 15,
  },
  {
    id: '3',
    name: 'PSA Grading Submission Prep Kit',
    sku: 'ACC-PSA-PREP-001',
    image: 'https://images.unsplash.com/photo-1595079676339-1534801b6740?w=100&auto=format&fit=crop',
    stock: 12,
    minStock: 20,
  },
]

const inventory = [
  {
    id: '1',
    name: 'Pokémon TCG Scarlet & Violet Booster Box',
    sku: 'PKM-SV-BB-001',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=100&auto=format&fit=crop',
    warehouse: 'Main Warehouse',
    location: 'A-12-3',
    quantity: 45,
    status: 'in_stock',
    lastCounted: '2024-01-15',
  },
  {
    id: '2',
    name: 'Charizard VMAX Rainbow Rare PSA 10',
    sku: 'PKM-CHAR-PSA10',
    image: 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=100&auto=format&fit=crop',
    warehouse: 'Main Warehouse',
    location: 'B-01-1',
    quantity: 2,
    status: 'low_stock',
    lastCounted: '2024-01-14',
  },
  {
    id: '3',
    name: 'Elite Trainer Box - Paldea Evolved',
    sku: 'PKM-ETB-PE-001',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=100&auto=format&fit=crop',
    warehouse: 'Main Warehouse',
    location: 'A-15-2',
    quantity: 8,
    status: 'low_stock',
    lastCounted: '2024-01-13',
  },
  {
    id: '4',
    name: 'Apple Watch Series 10 46mm GPS',
    sku: 'APL-WCH-S10-46',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop',
    warehouse: 'Main Warehouse',
    location: 'C-08-4',
    quantity: 23,
    status: 'in_stock',
    lastCounted: '2024-01-12',
  },
  {
    id: '5',
    name: 'YETI Rambler 20oz Tumbler',
    sku: 'YET-RAM-20-001',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&auto=format&fit=crop',
    warehouse: 'Main Warehouse',
    location: 'D-20-1',
    quantity: 156,
    status: 'in_stock',
    lastCounted: '2024-01-10',
  },
]

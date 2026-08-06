import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  Download,
  Upload
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/products')({
  component: ProductManagement,
})

function ProductManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or barcode..."
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products (573)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Product</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">SKU</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Category</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Price</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Stock</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.pokemonSet && (
                            <p className="text-xs text-gray-500">{product.pokemonSet}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="p-4">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="p-4 font-medium">${product.price}</td>
                    <td className="p-4">
                      <span className={`text-sm ${
                        product.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {product.status}
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

const products = [
  {
    id: '1',
    name: 'Pokémon TCG Scarlet & Violet Booster Box',
    sku: 'PKM-SV-BB-001',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=100&auto=format&fit=crop',
    category: 'Trading Cards',
    pokemonSet: 'Scarlet & Violet',
    price: '143.99',
    stock: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Charizard VMAX Rainbow Rare PSA 10',
    sku: 'PKM-CHAR-PSA10',
    image: 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=100&auto=format&fit=crop',
    category: 'Trading Cards',
    pokemonSet: 'Champion Path',
    price: '899.00',
    stock: 2,
    status: 'active',
  },
  {
    id: '3',
    name: 'Elite Trainer Box - Paldea Evolved',
    sku: 'PKM-ETB-PE-001',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=100&auto=format&fit=crop',
    category: 'Trading Cards',
    pokemonSet: 'Paldea Evolved',
    price: '49.95',
    stock: 8,
    status: 'active',
  },
  {
    id: '4',
    name: 'Apple Watch Series 10 46mm GPS',
    sku: 'APL-WCH-S10-46',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop',
    category: 'Watches',
    pokemonSet: null,
    price: '399.00',
    stock: 23,
    status: 'active',
  },
  {
    id: '5',
    name: 'YETI Rambler 20oz Tumbler',
    sku: 'YET-RAM-20-001',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&auto=format&fit=crop',
    category: 'Outdoor & Fitness',
    pokemonSet: null,
    price: '35.00',
    stock: 156,
    status: 'active',
  },
]

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  X,
  Package,
  User,
  ShoppingBag,
  FileText
} from 'lucide-react'

export const Route = createFileRoute('/admin/search')({
  component: SearchSystem,
})

function SearchSystem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-1">Search across all admin data with advanced filters</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products, customers, orders, and more..."
              className="pl-12 h-12 text-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              Products
            </Button>
            <Button variant="outline" size="sm">
              Customers
            </Button>
            <Button variant="outline" size="sm">
              Orders
            </Button>
            <Button variant="outline" size="sm">
              Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm">Category: Pokémon TCG</span>
              <X className="h-4 w-4 cursor-pointer text-gray-500" />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm">Price: $50 - $200</span>
              <X className="h-4 w-4 cursor-pointer text-gray-500" />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm">Status: In Stock</span>
              <X className="h-4 w-4 cursor-pointer text-gray-500" />
            </div>
            <Button variant="ghost" size="sm" className="text-red-600">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Search Results (156 found)</h2>
        
        {/* Product Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products (45)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productResults.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sku} • {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.price}</p>
                    <p className="text-sm text-gray-500">{product.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Customers (23)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerResults.map((customer) => (
                <div key={customer.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{customer.orders} orders</p>
                    <p className="text-sm text-gray-500">{customer.spent} total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders (12)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderResults.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content & Pages (8)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentResults.map((content) => (
                <div key={content.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-gray-500">{content.type} • {content.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{content.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const productResults = [
  {
    id: '1',
    name: 'Charizard VMAX Rainbow Rare PSA 10',
    sku: 'PKM-001',
    category: 'Pokémon TCG',
    price: '$499.99',
    stock: '2',
    image: 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=100&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Pokémon TCG Scarlet & Violet Booster Box',
    sku: 'PKM-002',
    category: 'Pokémon TCG',
    price: '$129.99',
    stock: '15',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=100&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Elite Trainer Box - Paldea Evolved',
    sku: 'PKM-003',
    category: 'Pokémon TCG',
    price: '$49.99',
    stock: '8',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=100&auto=format&fit=crop',
  },
]

const customerResults = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@email.com',
    orders: 12,
    spent: '$1,234.56',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    orders: 8,
    spent: '$876.43',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@email.com',
    orders: 5,
    spent: '$567.89',
  },
]

const orderResults = [
  {
    id: '1',
    orderNumber: '#ORD-1234',
    customer: 'John Smith',
    date: '2024-01-15',
    total: '$234.56',
    status: 'Shipped',
  },
  {
    id: '2',
    orderNumber: '#ORD-1233',
    customer: 'Sarah Johnson',
    date: '2024-01-14',
    total: '$123.45',
    status: 'Processing',
  },
  {
    id: '3',
    orderNumber: '#ORD-1232',
    customer: 'Michael Brown',
    date: '2024-01-13',
    total: '$89.99',
    status: 'Delivered',
  },
]

const contentResults = [
  {
    id: '1',
    title: 'Home Page',
    type: 'Page',
    url: '/',
    status: 'Published',
  },
  {
    id: '2',
    title: 'About Us',
    type: 'Page',
    url: '/about',
    status: 'Published',
  },
  {
    id: '3',
    title: 'Top 10 Pokémon Cards 2024',
    type: 'Blog Post',
    url: '/blog/top-10-pokemon-cards',
    status: 'Published',
  },
]

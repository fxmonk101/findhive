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
  Eye,
  FileText,
  Layout,
  Image as ImageIcon,
  Code
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/content')({
  component: ContentManagement,
})

function ContentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage pages, banners, and site content</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Published pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Banners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Active banners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Media Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Images & assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Code className="h-4 w-4" />
              Custom Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Reusable components</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search content..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Types Tabs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">{page.title}</p>
                    <p className="text-sm text-gray-500">{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      page.status === 'published' ? 'bg-green-100 text-green-700' :
                      page.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {page.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Banners */}
        <Card>
          <CardHeader>
            <CardTitle>Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {banners.map((banner) => (
                <div key={banner.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-16 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{banner.title}</p>
                      <p className="text-sm text-gray-500">{banner.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }>
                      {banner.isActive ? 'Active' : 'Inactive'}
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
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Content Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {customBlocks.map((block) => (
              <div key={block.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{block.name}</p>
                  </div>
                  <Badge variant="outline">{block.type}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{block.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Used {block.usageCount} times</span>
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

const pages = [
  { id: '1', title: 'Home', slug: '/', status: 'published' },
  { id: '2', title: 'About Us', slug: '/about', status: 'published' },
  { id: '3', title: 'Contact', slug: '/contact', status: 'published' },
  { id: '4', title: 'Shipping Policy', slug: '/shipping', status: 'published' },
  { id: '5', title: 'Returns Policy', slug: '/returns', status: 'draft' },
  { id: '6', title: 'FAQ', slug: '/faq', status: 'published' },
]

const banners = [
  {
    id: '1',
    title: 'New Arrivals Banner',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=200&auto=format&fit=crop',
    location: 'Homepage Hero',
    isActive: true,
  },
  {
    id: '2',
    title: 'Sale Banner',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=200&auto=format&fit=crop',
    location: 'Homepage Section',
    isActive: true,
  },
  {
    id: '3',
    title: 'Collection Banner',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&auto=format&fit=crop',
    location: 'Category Page',
    isActive: false,
  },
]

const customBlocks = [
  { id: '1', name: 'Product Grid', type: 'Component', description: 'Reusable product grid layout', usageCount: 12 },
  { id: '2', name: 'Testimonial Slider', type: 'Component', description: 'Customer testimonials carousel', usageCount: 5 },
  { id: '3', name: 'Feature Cards', type: 'Section', description: 'Feature highlights section', usageCount: 8 },
]

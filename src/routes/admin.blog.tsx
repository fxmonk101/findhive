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
  Calendar,
  MessageSquare,
  TrendingUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/blog')({
  component: BlogManagement,
})

function BlogManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">Manage blog posts and content</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Blog Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,456</div>
            <p className="text-xs text-green-600 mt-1">+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground mt-1">Total comments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">New posts</p>
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
                placeholder="Search posts by title, author, or content..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-20 h-14 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-500">{post.excerpt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      post.status === 'published' ? 'bg-green-100 text-green-700' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {post.status}
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
                        <DropdownMenuItem>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
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

const blogPosts = [
  {
    id: '1',
    title: 'Top 10 Most Valuable Pokémon Cards of 2024',
    excerpt: 'Discover the rarest and most sought-after Pokémon cards that collectors are hunting for this year.',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=200&auto=format&fit=crop',
    date: '2024-01-15',
    comments: 23,
    views: 1234,
    status: 'published',
  },
  {
    id: '2',
    title: 'How to Properly Grade Your Pokémon Cards',
    excerpt: 'A comprehensive guide to understanding card grading and protecting your collection.',
    image: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=200&auto=format&fit=crop',
    date: '2024-01-10',
    comments: 45,
    views: 2345,
    status: 'published',
  },
  {
    id: '3',
    title: 'Best Practices for Card Storage',
    excerpt: 'Learn the best ways to store and display your valuable trading card collection.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&auto=format&fit=crop',
    date: '2024-01-05',
    comments: 12,
    views: 876,
    status: 'published',
  },
  {
    id: '4',
    title: 'Upcoming Pokémon TCG Releases',
    excerpt: 'Everything you need to know about the new sets coming out this quarter.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop',
    date: '2024-01-12',
    comments: 8,
    views: 567,
    status: 'draft',
  },
  {
    id: '5',
    title: 'Building Your First Collection',
    excerpt: 'Tips and tricks for beginners starting their Pokémon card collection journey.',
    image: 'https://images.unsplash.com/photo-1595079676339-1534801b6740?w=200&auto=format&fit=crop',
    date: '2024-01-08',
    comments: 34,
    views: 1890,
    status: 'published',
  },
]

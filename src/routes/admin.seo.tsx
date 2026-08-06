import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Globe, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/seo')({
  component: SEODashboard,
})

function SEODashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-gray-600 mt-1">Optimize your store for search engines</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            Run Audit
          </Button>
        </div>
      </div>

      {/* SEO Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Indexed Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Organic Traffic
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
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Issues Found
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
              <CheckCircle className="h-4 w-4 text-green-600" />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87/100</div>
            <p className="text-xs text-green-600 mt-1">+5 points</p>
          </CardContent>
        </Card>
      </div>

      {/* SEO Issues */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            SEO Issues Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {seoIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-sm text-gray-500">{issue.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {issue.severity}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Fix
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags by Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metaTags.map((page) => (
              <div key={page.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{page.page}</p>
                    <p className="text-sm text-gray-500">{page.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      page.status === 'optimized' ? 'bg-green-100 text-green-700' :
                      page.status === 'needs_review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {page.status === 'optimized' ? 'Optimized' :
                       page.status === 'needs_review' ? 'Needs Review' : 'Missing'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Title:</span>
                    <p className="text-gray-700">{page.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Description:</span>
                    <p className="text-gray-700">{page.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sitemap & Robots */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Generated</p>
                  <p className="text-sm text-gray-500">2024-01-15 10:30 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">URLs Included</p>
                  <p className="text-sm text-gray-500">456 pages</p>
                </div>
                <Button size="sm">
                  Regenerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Robots.txt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-gray-500">2024-01-10 02:15 PM</p>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
                <Button size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const seoIssues = [
  {
    id: '1',
    title: 'Missing Meta Descriptions',
    description: '23 pages are missing meta descriptions',
    severity: 'high',
  },
  {
    id: '2',
    title: 'Duplicate Title Tags',
    description: '5 pages have duplicate title tags',
    severity: 'medium',
  },
  {
    id: '3',
    title: 'Broken Internal Links',
    description: '12 broken internal links detected',
    severity: 'medium',
  },
  {
    id: '4',
    title: 'Slow Page Load Times',
    description: '8 pages load in over 3 seconds',
    severity: 'low',
  },
]

const metaTags = [
  {
    id: '1',
    page: 'Home Page',
    url: '/',
    title: 'FindHive - Premium Pokémon TCG & Collectibles Store',
    description: 'Discover rare Pokémon cards, graded collectibles, and premium accessories at FindHive. Your trusted source for authentic trading cards.',
    status: 'optimized',
  },
  {
    id: '2',
    page: 'Products Page',
    url: '/products',
    title: 'Products - FindHive',
    description: 'Browse our extensive collection of Pokémon TCG products, watches, jewelry, and more.',
    status: 'optimized',
  },
  {
    id: '3',
    page: 'About Us',
    url: '/about',
    title: 'About Us',
    description: 'Learn more about FindHive and our commitment to quality collectibles.',
    status: 'needs_review',
  },
  {
    id: '4',
    page: 'Contact',
    url: '/contact',
    title: 'Contact',
    description: '',
    status: 'missing',
  },
]

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Search, 
  MoreVertical, 
  Download, 
  Trash2,
  Image as ImageIcon,
  File,
  Folder,
  HardDrive
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/admin/media')({
  component: MediaLibrary,
})

function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage images, videos, and media assets</p>
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Media Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground mt-1">of 10 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground mt-1">Total images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <File className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground mt-1">Total files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Organized folders</p>
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
                placeholder="Search media by name or type..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Folders */}
      <Card>
        <CardHeader>
          <CardTitle>Folders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {folders.map((folder) => (
              <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Folder className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{folder.name}</p>
                    <p className="text-sm text-gray-500">{folder.items} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={item.url} 
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const folders = [
  { id: '1', name: 'Products', items: 456 },
  { id: '2', name: 'Banners', items: 23 },
  { id: '3', name: 'Blog', items: 89 },
  { id: '4', name: 'Logos', items: 12 },
]

const mediaItems = [
  {
    id: '1',
    name: 'charizard-vmax.jpg',
    url: 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=200&auto=format&fit=crop',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'booster-box.jpg',
    url: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=200&auto=format&fit=crop',
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'etb-paldea.jpg',
    url: 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=200&auto=format&fit=crop',
    size: '3.2 MB',
  },
  {
    id: '4',
    name: 'apple-watch.jpg',
    url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&auto=format&fit=crop',
    size: '2.1 MB',
  },
  {
    id: '5',
    name: 'yeti-tumbler.jpg',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop',
    size: '1.5 MB',
  },
  {
    id: '6',
    name: 'banner-hero.jpg',
    url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&auto=format&fit=crop',
    size: '4.5 MB',
  },
]

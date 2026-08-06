import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Download,
  Shield,
  User,
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/admin/audit')({
  component: AuditLogs,
})

function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track all admin activities and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Audit Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-muted-foreground mt-1">Need review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Events today</p>
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
                placeholder="Search logs by user, action, or resource..."
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

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Timestamp</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">User</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Action</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Resource</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">IP Address</th>
                  <th className="text-left p-4 font-medium text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                          {log.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{log.user}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{log.action}</td>
                    <td className="p-4 text-sm text-gray-600">{log.resource}</td>
                    <td className="p-4 text-sm text-gray-500 font-mono">{log.ip}</td>
                    <td className="p-4">
                      <Badge className={
                        log.status === 'success' ? 'bg-green-100 text-green-700' :
                        log.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        log.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{alert.time}</span>
                  <Badge className={
                    alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const auditLogs = [
  {
    id: '1',
    timestamp: '2024-01-15 10:30:45',
    user: 'Admin User',
    action: 'Updated product',
    resource: 'Charizard VMAX (ID: 123)',
    ip: '192.168.1.100',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2024-01-15 10:28:12',
    user: 'Admin User',
    action: 'Deleted category',
    resource: 'Bags (ID: 45)',
    ip: '192.168.1.100',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2024-01-15 10:25:33',
    user: 'Manager User',
    action: 'Approved review',
    resource: 'Review #789',
    ip: '192.168.1.105',
    status: 'success',
  },
  {
    id: '4',
    timestamp: '2024-01-15 10:22:18',
    user: 'Admin User',
    action: 'Failed login attempt',
    resource: 'Authentication',
    ip: '203.45.67.89',
    status: 'warning',
  },
  {
    id: '5',
    timestamp: '2024-01-15 10:20:05',
    user: 'Editor User',
    action: 'Created blog post',
    resource: 'Blog Post #456',
    ip: '192.168.1.110',
    status: 'success',
  },
  {
    id: '6',
    timestamp: '2024-01-15 10:15:42',
    user: 'Admin User',
    action: 'Modified settings',
    resource: 'Site Settings',
    ip: '192.168.1.100',
    status: 'success',
  },
  {
    id: '7',
    timestamp: '2024-01-15 10:10:30',
    user: 'Unknown',
    action: 'Unauthorized access attempt',
    resource: '/admin/users',
    ip: '45.33.32.156',
    status: 'error',
  },
]

const securityAlerts = [
  {
    id: '1',
    title: 'Multiple Failed Login Attempts',
    description: '5 failed login attempts from IP 203.45.67.89 in the last hour',
    time: '10:22 AM',
    severity: 'high',
  },
  {
    id: '2',
    title: 'Unauthorized Access Attempt',
    description: 'Attempt to access /admin/users from unknown IP',
    time: '10:10 AM',
    severity: 'high',
  },
  {
    id: '3',
    title: 'Password Reset Request',
    description: 'Password reset requested for admin account',
    time: '09:45 AM',
    severity: 'medium',
  },
]

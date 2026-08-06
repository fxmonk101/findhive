import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  BarChart3
} from 'lucide-react'

export const Route = createFileRoute('/admin/reports')({
  component: ReportingSystem,
})

function ReportingSystem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and export business reports</p>
        </div>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Report Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Download className="h-4 w-4" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground mt-1">Report downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Auto-generated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">Generation success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    report.color === 'blue' ? 'bg-blue-50' :
                    report.color === 'green' ? 'bg-green-50' :
                    report.color === 'purple' ? 'bg-purple-50' :
                    report.color === 'orange' ? 'bg-orange-50' :
                    'bg-gray-50'
                  }`}>
                    {report.icon}
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.date} • {report.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{report.size}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.schedule} • Next: {report.nextRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{report.recipients} recipients</span>
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

const quickReports = [
  {
    id: '1',
    title: 'Sales Report',
    description: 'Daily, weekly, or monthly sales data',
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
    color: 'green',
  },
  {
    id: '2',
    title: 'Inventory Report',
    description: 'Stock levels and low stock alerts',
    icon: <ShoppingBag className="h-5 w-5 text-blue-600" />,
    color: 'blue',
  },
  {
    id: '3',
    title: 'Customer Report',
    description: 'Customer analytics and insights',
    icon: <Users className="h-5 w-5 text-purple-600" />,
    color: 'purple',
  },
  {
    id: '4',
    title: 'Order Report',
    description: 'Order status and fulfillment data',
    icon: <ShoppingBag className="h-5 w-5 text-orange-600" />,
    color: 'orange',
  },
  {
    id: '5',
    title: 'Product Performance',
    description: 'Top-selling products and trends',
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
    color: 'green',
  },
  {
    id: '6',
    title: 'Revenue Analytics',
    description: 'Revenue breakdown and forecasts',
    icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
    color: 'blue',
  },
]

const recentReports = [
  { id: '1', name: 'Monthly Sales Report - January 2024', date: '2024-01-15', type: 'PDF', size: '2.4 MB' },
  { id: '2', name: 'Inventory Status Report', date: '2024-01-14', type: 'CSV', size: '1.2 MB' },
  { id: '3', name: 'Customer Analytics Q4 2023', date: '2024-01-13', type: 'PDF', size: '3.8 MB' },
  { id: '4', name: 'Order Fulfillment Report', date: '2024-01-12', type: 'Excel', size: '1.5 MB' },
  { id: '5', name: 'Product Performance Report', date: '2024-01-11', type: 'PDF', size: '2.1 MB' },
]

const scheduledReports = [
  { id: '1', name: 'Weekly Sales Summary', schedule: 'Every Monday 9:00 AM', nextRun: '2024-01-22', recipients: 5 },
  { id: '2', name: 'Monthly Inventory Report', schedule: '1st of every month', nextRun: '2024-02-01', recipients: 3 },
  { id: '3', name: 'Daily Revenue Report', schedule: 'Every day 6:00 PM', nextRun: '2024-01-16', recipients: 8 },
  { id: '4', name: 'Quarterly Customer Analysis', schedule: 'Every quarter end', nextRun: '2024-03-31', recipients: 4 },
]

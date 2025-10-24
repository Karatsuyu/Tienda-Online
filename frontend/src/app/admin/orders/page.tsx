import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Fulfilled', total: '$250.00' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Fulfilled', total: '$150.00' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Pending', total: '$350.00' },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Fulfilled', total: '$450.00' },
    { id: 'ORD005', customer: 'Ava Jones', date: '2023-11-19', status: 'Cancelled', total: '$550.00' },
];

export default function AdminOrdersPage() {
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Orders</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>A list of recent orders from your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={
                                                order.status === 'Fulfilled' ? 'default' : 
                                                order.status === 'Pending' ? 'secondary' : 'destructive'
                                            }
                                            className={
                                                order.status === 'Fulfilled' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
                                                order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : ''
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{order.total}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

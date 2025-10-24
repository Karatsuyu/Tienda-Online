import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1% from last month" },
        { title: "Subscriptions", value: "+2350", icon: Users, change: "+180.1% from last month" },
        { title: "Sales", value: "+12,234", icon: ShoppingCart, change: "+19% from last month" },
        { title: "Active Now", value: "+573", icon: Activity, change: "+201 since last hour" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You made 265 sales this month.</p>
                        {/* Placeholder for recent sales list */}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Sales Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Chart placeholder</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

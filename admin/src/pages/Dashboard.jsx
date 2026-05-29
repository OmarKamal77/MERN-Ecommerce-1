import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from "../App"; 
import { toast } from 'react-toastify';

let cachedOrders = null;
let cachedProductsCount = 0;
let cachedTotalEarnings = 0;

const Dashboard = ({ token }) => {
    const currency = "$";

    const [orders, setOrders] = useState(cachedOrders || []);
    const [productsCount, setProductsCount] = useState(cachedProductsCount || 0);
    const [totalEarnings, setTotalEarnings] = useState(cachedTotalEarnings || 0);
    
    const [loading, setLoading] = useState(!cachedOrders); 
    const [filterType, setFilterType] = useState('lastWeek'); 

    const fetchDashboardData = async () => {
        try {
            const res = await axios.post(`${backendUrl}/api/order/dashboard-analytics`, {}, { headers: { token } });

            if (res.data.success) {
                const fetchedOrders = res.data.orders;
                const fetchedProductsCount = res.data.productsCount;
                const earnings = fetchedOrders.reduce((sum, order) => sum + order.amount, 0);

                cachedOrders = fetchedOrders;
                cachedProductsCount = fetchedProductsCount;
                cachedTotalEarnings = earnings;

                setOrders(fetchedOrders);
                setProductsCount(fetchedProductsCount);
                setTotalEarnings(earnings);
            } else {
                toast.error("Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const getBusinessInsights = () => {
        const categorySales = { Men: 0, Women: 0, Kids: 0 };
        const statusCounts = { Placed: 0, Shipped: 0, Delivered: 0 };

        orders.forEach(order => {
            const status = order.status ? order.status.toLowerCase() : "";
            if (status.includes("delivered")) statusCounts.Delivered++;
            else if (status.includes("shipped")) statusCounts.Shipped++;
            else statusCounts.Placed++;

            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const cat = item.category ? item.category.toLowerCase() : "";
                    const itemTotal = (item.price * (item.quantity || 1));
                    
                    if (cat.includes("men") && !cat.includes("women")) categorySales.Men += itemTotal;
                    else if (cat.includes("women")) categorySales.Women += itemTotal;
                    else if (cat.includes("kid") || cat.includes("boy") || cat.includes("girl")) categorySales.Kids += itemTotal;
                });
            }
        });

        return { categorySales, statusCounts };
    };

    const { categorySales, statusCounts } = getBusinessInsights();
    const totalCategoryVolume = categorySales.Men + categorySales.Women + categorySales.Kids || 1;

    const getChartData = () => {
        const today = new Date();

        if (filterType === 'lastWeek') {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return {
                    label: daysOfWeek[d.getDay()],
                    dateStr: d.toDateString(),
                    total: 0
                };
            }).reverse();

            orders.forEach(order => {
                const orderDate = new Date(order.date).toDateString();
                const matchedDay = last7Days.find(day => day.dateStr === orderDate);
                if (matchedDay) {
                    matchedDay.total += order.amount;
                }
            });
            return last7Days;

        } else if (filterType === 'lastMonth') {
            const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
                return {
                    label: `Week ${4 - i}`,
                    startDay: i * 7,
                    endDay: (i + 1) * 7,
                    total: 0
                };
            }).reverse();

            orders.forEach(order => {
                const orderDate = new Date(order.date);
                const diffTime = today - orderDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays < 28) {
                    const matchedWeek = last4Weeks.find(w => diffDays >= w.startDay && diffDays < w.endDay);
                    if (matchedWeek) {
                        matchedWeek.total += order.amount;
                    }
                }
            });
            return last4Weeks;

        } else {
            const last8Weeks = Array.from({ length: 8 }).map((_, i) => {
                return {
                    label: `W ${8 - i}`,
                    startDay: i * 7,
                    endDay: (i + 1) * 7,
                    total: 0
                };
            }).reverse();

            orders.forEach(order => {
                const orderDate = new Date(order.date);
                const diffTime = today - orderDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays < 56) {
                    const matchedWeek = last8Weeks.find(w => diffDays >= w.startDay && diffDays < w.endDay);
                    if (matchedWeek) {
                        matchedWeek.total += order.amount;
                    }
                }
            });
            return last8Weeks;
        }
    };

    const chartData = getChartData();
    const maxSalesValue = Math.max(...chartData.map(d => d.total), 1);

    const svgWidth = 800;
    const svgHeight = 260;
    const paddingX = 60;
    const paddingY = 40;

    const points = chartData.map((data, index) => {
        const x = paddingX + (index * (svgWidth - 2 * paddingX)) / (chartData.length - 1);
        const y = svgHeight - paddingY - (data.total / maxSalesValue) * (svgHeight - 2 * paddingY);
        return { x, y, ...data };
    });

    const linePath = points.reduce((path, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
        : "";

    if (loading) {
        return (
            <div className="p-6 w-full max-w-7xl mx-auto space-y-6 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-80 bg-gray-200 rounded-xl lg:col-span-2"></div>
                    <div className="h-80 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                <p className="text-xs text-gray-400 mt-0.5">Real-time business intelligence and sales projection analytics.</p>
            </div>
            
            {/* 🌟 Widgets Section: رجعنا الألوان الحية (الأخضر، الأزرق، الموف) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{currency}{totalEarnings.toLocaleString()}</h3>
                    </div>
                    {/* الأخضر للأرباح */}
                    <div className="p-3 bg-green-50 rounded-lg text-green-500 border border-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
                    </div>
                    {/* الأزرق للطلبات */}
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-500 border border-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{productsCount}</h3>
                    </div>
                    {/* الموف للمنتجات */}
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-500 border border-purple-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-base font-semibold text-gray-700">Sales Analytics Trend</h4>
                            <p className="text-xs text-gray-400">Dynamic native SVG charts with advanced tooltips.</p>
                        </div>
                        
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            className="border border-gray-200 text-xs rounded-lg p-2 bg-gray-50 text-gray-700 font-bold outline-none cursor-pointer focus:border-black transition-all"
                        >
                            <option value="lastWeek">Last Week (7 Days)</option>
                            <option value="lastMonth">Last Month (4 Weeks)</option>
                            <option value="last2Months">Last 2 Months (8 Weeks)</option>
                        </select>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {/* حزام الأمان للحقول الفاضية هيفضل موجود لضمان الأداء */}
                        {orders.length === 0 ? (
                            <div className="h-[180px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <span className="text-xl">📈</span>
                                <p className="text-xs font-medium mt-1">Ready for the first order! Sales trends will appear here.</p>
                            </div>
                        ) : (
                            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[600px]">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                    const yPos = paddingY + ratio * (svgHeight - 2 * paddingY);
                                    return (
                                        <line 
                                            key={i} 
                                            x1={paddingX} 
                                            y1={yPos} 
                                            x2={svgWidth - paddingX} 
                                            y2={yPos} 
                                            stroke="#f3f4f6" 
                                            strokeWidth="1.5"
                                        />
                                    );
                                })}

                                {linePath && <path d={areaPath} fill="url(#chartGradient)" />}

                                {linePath && (
                                    <path 
                                        d={linePath} 
                                        fill="none" 
                                        stroke="#2563eb" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                )}

                                {points.map((p, index) => (
                                    <g key={index} className="group cursor-pointer">
                                        <line 
                                            x1={p.x} 
                                            y1={paddingY} 
                                            x2={p.x} 
                                            y2={svgHeight - paddingY} 
                                            stroke="#2563eb" 
                                            strokeWidth="1.2" 
                                            strokeDasharray="3 3" 
                                            className="opacity-0 group-hover:opacity-20 transition-opacity"
                                        />

                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r={p.total > 0 ? "4.5" : "3"} 
                                            fill={p.total > 0 ? "#2563eb" : "#d1d5db"} 
                                            stroke="#ffffff" 
                                            strokeWidth="2"
                                            className="transition-all duration-200 group-hover:fill-gray-700"
                                        />

                                        <circle cx={p.x} cy={p.y} r="15" fill="transparent" />

                                        <text 
                                            x={p.x} 
                                            y={svgHeight - paddingY + 20} 
                                            textAnchor="middle" 
                                            className="text-[10px] fill-gray-400 font-bold uppercase tracking-wider"
                                        >
                                            {p.label}
                                        </text>

                                        {/* Tooltip المطور العائم الفخم فوق النقاط */}
                                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                                            <rect x={p.x - 45} y={p.y - 32} width="90" height="22" rx="6" fill="#111827" />
                                            <text x={p.x} y={p.y - 17} textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold tracking-tight">
                                                {currency}{p.total.toLocaleString()}
                                            </text>
                                        </g>
                                    </g>
                                ))}
                            </svg>
                        )}
                    </div>
                </div>

                {/* الجوانب الإحصائية والشريط الحركي الدائري */}
                <div className="space-y-6 flex flex-col justify-between">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Category Volume Share</h4>
                        <div className="space-y-4">
                            {/* 🌟 رجعنا الأشرطة الملونة الأصلية (أسود، موف، أزرق) */}
                            {[
                                { name: "Men Clothing", amount: categorySales.Men, color: "bg-black" },
                                { name: "Women Fashion", amount: categorySales.Women, color: "bg-purple-500" },
                                { name: "Kids & Babies", amount: categorySales.Kids, color: "bg-blue-400" }
                            ].map((cat) => {
                                const percentage = Math.round((cat.amount / totalCategoryVolume) * 100) || 0;
                                return (
                                    <div key={cat.name} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                                            <span>{cat.name}</span>
                                            <span className="font-bold text-gray-900">{percentage}% ({currency}{cat.amount.toLocaleString()})</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className={`${cat.color} h-full transition-all duration-700`} style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 🌟 رجعنا ألوان حالات الطلب (برتقالي، أزرق، أخضر) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Status Fulfillment</h4>
                        <div className="grid grid-cols-3 gap-2 text-center mt-1">
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Placed</p>
                                <p className="text-xl font-bold text-amber-800 mt-1">{statusCounts.Placed}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Shipped</p>
                                <p className="text-xl font-bold text-blue-800 mt-1">{statusCounts.Shipped}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Delivered</p>
                                <p className="text-xl font-bold text-green-800 mt-1">{statusCounts.Delivered}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
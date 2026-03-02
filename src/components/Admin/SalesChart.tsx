'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface SalesVelocityProps {
    data: { date: string; sales: number }[];
    height?: number; // Optional height prop
}

export function SalesVelocityChart({ data, height = 350 }: SalesVelocityProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center text-neutral-400 font-mono text-xs tracking-widest uppercase" style={{ height: `${height}px` }}>
                No sales data available
            </div>
        );
    }

    return (
        <div className="w-full mt-4" style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FDE047" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FDE047" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#171717',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#FDE047', fontWeight: 'bold' }}
                        labelStyle={{ color: '#A3A3A3', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#EAB308"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        activeDot={{ r: 8, fill: '#EAB308', stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

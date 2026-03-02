'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface InventoryStatsProps {
    data: { name: string; sold: number; available: number }[];
}

export function InventoryDonut({ data }: InventoryStatsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-neutral-400 font-mono text-xs tracking-widest uppercase">
                No inventory data available
            </div>
        );
    }

    // Colors matching the brand palette
    const COLORS = ['#171717', '#EAB308', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];

    // Add total label in the center
    const totalSold = data.reduce((sum, item) => sum + item.sold, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-charcoal text-white p-4 rounded-xl shadow-2xl border border-neutral-800">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.name}</p>
                    <p className="text-2xl font-black font-mono">
                        {item.sold} <span className="text-xs text-neutral-500 font-normal">sold</span>
                    </p>
                    <p className="text-[10px] font-mono mt-2 text-yellow-400">
                        {item.available} remaining
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="sold"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
                <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-neutral-400">Total Sold</span>
                <span className="text-4xl font-chicle text-charcoal">{totalSold}</span>
            </div>
        </div>
    );
}

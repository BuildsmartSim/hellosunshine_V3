import React from 'react';
import EventForm from '../EventForm';
import Link from 'next/link';

export const revalidate = 0;

export default function NewEventPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Create New Event</h1>
                    <p className="text-neutral-500 mt-1">Configure event details, locations, and ticket tiers with inventory limits.</p>
                </div>
                <Link href="/admin" className="text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <EventForm />
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { StandardSection } from './StandardSection';
import { LayeredPencil } from './LayeredPencil';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from './Button';
import { Polaroid } from './Polaroid';

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        const result = await submitContactForm(data);

        if (result.success) {
            setStatus('success');
            (e.target as HTMLFormElement).reset();
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Something went wrong.');
        }
        setIsSubmitting(false);
    };

    return (
        <StandardSection id="contact" variant="naturalPaper" className="overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                {/* Left Column: Visuals & Text */}
                <div className="flex flex-col gap-8 md:pt-12">
                    <div className="flex flex-col space-y-4">
                        <LayeredPencil
                            text="Say Hello"
                            size="80px"
                            hatchClass="hatch-aesthetic-yellow-bold"
                            as="h2"
                        />
                        <p className="font-body text-charcoal/70 leading-relaxed max-w-md text-lg">
                            Whether you're looking to book a private sanctuary, inquire about a festival, or just want to chat about the steam, we're here. Drop us a line below.
                        </p>
                    </div>

                    <div className="hidden md:block mt-8 -ml-8 -rotate-3 scale-90 opacity-90 transition-transform hover:scale-100 hover:rotate-0 hover:z-50 duration-500">
                        <Polaroid
                            src="/optimized/polaroids/webp/night-fire-pit-heart-decor-chairs.webp"
                            label="Warm greetings."
                            rotation="rotate-[4deg]"
                            size="w-64"
                        />
                    </div>
                </div>

                {/* Right Column: The Form */}
                <div className="bg-white/60 backdrop-blur-sm p-8 md:p-12 border border-charcoal/10 shadow-sm relative z-10" style={{ borderRadius: 'var(--hss-radius-card)' }}>
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center h-full space-y-4 py-12">
                            <div className="w-16 h-16 rounded-full bg-[#f8c630]/20 flex items-center justify-center mb-4 text-[#f8c630]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="font-modern text-2xl text-charcoal font-bold">Message Sent</h3>
                            <p className="font-body text-charcoal/60">We've received your note and will be in touch shortly.</p>
                            <Button onClick={() => setStatus('idle')} className="mt-8 px-8 border border-charcoal/10 rounded-full bg-white hover:bg-neutral-50 text-charcoal text-sm font-bold tracking-widest uppercase">Send Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-600 rounded text-sm border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-body text-sm font-bold uppercase tracking-widest text-charcoal/60">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="px-4 py-3 bg-white border border-charcoal/20 rounded focus:border-[#f8c630] focus:ring-1 focus:ring-[#f8c630] outline-none transition-all font-body"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="font-body text-sm font-bold uppercase tracking-widest text-charcoal/60">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="px-4 py-3 bg-white border border-charcoal/20 rounded focus:border-[#f8c630] focus:ring-1 focus:ring-[#f8c630] outline-none transition-all font-body"
                                    placeholder="hello@example.com"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="font-body text-sm font-bold uppercase tracking-widest text-charcoal/60">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    className="px-4 py-3 bg-white border border-charcoal/20 rounded focus:border-[#f8c630] focus:ring-1 focus:ring-[#f8c630] outline-none transition-all font-body resize-y"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full justify-center rounded-full py-4 mt-2 font-bold tracking-widest uppercase text-sm border-0 bg-[#f8c630] hover:bg-opacity-90 text-charcoal transition-all shadow-sm hover:-translate-y-1 hover:shadow-md"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </StandardSection>
    );
}

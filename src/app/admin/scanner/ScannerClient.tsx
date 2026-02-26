'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { checkInTicketAction } from '@/app/actions/tickets';

type ScanStatus = 'idle' | 'success' | 'error' | 'warning';

export function ScannerClient() {
    const [status, setStatus] = useState<ScanStatus>('idle');
    const [message, setMessage] = useState('');
    const [guestName, setGuestName] = useState('');
    const [productName, setProductName] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Initialize the scanner
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        return () => {
            if (scanner.isScanning) {
                scanner.stop();
            }
        };
    }, []);

    const startScanner = async () => {
        if (!scannerRef.current) return;
        setIsScanning(true);
        setStatus('idle');
        setMessage('');

        try {
            await scannerRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanFailure
            );
        } catch (err) {
            console.error("Failed to start scanner:", err);
            setMessage("Failed to access camera.");
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop();
            setIsScanning(false);
        }
    };

    async function onScanSuccess(decodedText: string) {
        // Play subtle success chime (optional, could be added)
        if (navigator.vibrate) navigator.vibrate(50);

        // Pause scanning while processing
        await stopScanner();

        setStatus('idle');
        setMessage('Validating ticket...');

        try {
            // Check if the decoded text is a URL and extract the ID
            let ticketId = decodedText;
            if (decodedText.includes('/tickets/')) {
                const parts = decodedText.split('/');
                ticketId = parts[parts.length - 1];
            }

            const res = await checkInTicketAction(ticketId);

            if (res.success) {
                setStatus('success');
                setGuestName(res.guestName || 'Guest');
                setProductName(res.productName || 'Ticket');
                setMessage('CHECK-IN SUCCESS');
            } else {
                if (res.error?.includes('ALREADY SCANNED')) {
                    setStatus('warning');
                    setGuestName(res.guestName || 'Previously Scanned');
                    setMessage(res.error);
                } else {
                    setStatus('error');
                    setMessage(res.error || 'Invalid Ticket');
                }
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error during check-in.');
        }

        // Auto-reset after 3 seconds to allow next scan
        setTimeout(() => {
            setStatus('idle');
            setGuestName('');
            setProductName('');
            setMessage('');
            startScanner();
        }, 3500);
    }

    function onScanFailure(error: any) {
        // Silently ignore scan failures (they happen constantly while looking)
    }

    const getStatusStyles = () => {
        switch (status) {
            case 'success': return 'bg-green-600 text-white border-green-400';
            case 'error': return 'bg-red-600 text-white border-red-400';
            case 'warning': return 'bg-yellow-500 text-white border-yellow-300';
            default: return 'bg-white text-neutral-800 border-neutral-200';
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-lg mx-auto overflow-hidden">
            {/* Camera Viewport Container */}
            <div className={`relative flex-1 rounded-3xl overflow-hidden border-4 transition-all duration-500 shadow-2xl ${getStatusStyles()}`}>

                {/* QR Reader Element */}
                <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:h-full border-none"></div>

                {/* Status Overlays */}
                {(status !== 'idle' || !isScanning) && (
                    <div className="absolute inset-0 bg-inherit flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                        {status === 'success' && (
                            <svg className="w-24 h-24 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                        )}
                        {status === 'error' && (
                            <svg className="w-24 h-24 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                        )}
                        {status === 'warning' && (
                            <svg className="w-24 h-24 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>
                        )}

                        <h2 className="text-2xl lg:text-3xl font-black mb-2 uppercase font-mono tracking-tighter">
                            {message || (isScanning ? "" : "Scanner Ready")}
                        </h2>
                        {guestName && <p className="text-lg lg:text-xl font-bold font-mono opacity-90 uppercase tracking-widest">{guestName}</p>}
                        {productName && <p className="text-[10px] lg:text-sm font-mono opacity-70 mt-3 border-t border-current pt-3 border-dashed">{productName}</p>}

                        {!isScanning && (
                            <button
                                onClick={startScanner}
                                className="mt-8 px-10 py-4 bg-neutral-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] font-mono shadow-xl hover:scale-105 transition-all"
                            >
                                Open Camera
                            </button>
                        )}
                    </div>
                )}

                {/* Scanning HUD */}
                {isScanning && status === 'idle' && (
                    <div className="absolute inset-0 pointer-events-none border-t-[10vh] border-b-[10vh] border-l-[10vw] border-r-[10vw] border-black/40 flex items-center justify-center">
                        <div className="w-[250px] h-[250px] relative">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                            {/* Scanning Animation Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-scan shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="mt-8 flex gap-4">
                <div className="flex-1 bg-neutral-900 rounded-2xl p-6 text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-1">Status</h4>
                        <p className="text-xs font-mono lowercase italic text-neutral-300">
                            {isScanning ? "live: position qr in focus square" : "camera inactive: ready to engage"}
                        </p>
                    </div>
                </div>
                {isScanning && (
                    <button
                        onClick={stopScanner}
                        className="bg-red-50 text-red-600 px-6 rounded-2xl font-black text-[10px] uppercase font-mono tracking-widest border border-red-100"
                    >
                        Stop
                    </button>
                )}
            </div>

            <p className="text-center text-[10px] text-neutral-400 font-mono uppercase tracking-[0.25em] mt-8 opacity-50">
                hello sunshine access control v1.0
            </p>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 250px; }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 3s infinite linear;
                }
                #reader > div {
                    display: none !important;
                }
                #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
            `}</style>
        </div>
    );
}

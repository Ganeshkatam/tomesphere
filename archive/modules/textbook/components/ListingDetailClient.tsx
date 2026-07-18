'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveListing, makeOffer } from '@/modules/textbook/actions/textbook';
import { showError, showSuccess } from '@/lib/toast';
import { ArrowLeft, Book, Heart, User } from 'lucide-react';

interface ListingDetailClientProps { listingId: string; initialListing: any | null; }

export default function ListingDetailClient({ listingId, initialListing }: ListingDetailClientProps) {
    const router = useRouter();
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState(initialListing?.price?.toString() || '');
    const [offerMessage, setOfferMessage] = useState('');

    const condColor = (c: string) => ({ new: 'text-green-400 bg-green-600/20', 'like-new': 'text-blue-400 bg-blue-600/20', good: 'text-yellow-400 bg-yellow-600/20', fair: 'text-orange-400 bg-orange-600/20' }[c] || 'text-slate-400 bg-slate-600/20');

    const handleSave = async () => {
        const res = await saveListing(listingId);
        if (res.success) showSuccess('Listing saved!');
        else if (res.error === 'Unauthorized') router.push('/login');
        else showError(res.error || 'Failed to save');
    };

    const handleMakeOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await makeOffer(listingId, parseFloat(offerPrice), offerMessage);
        if (res.success) { showSuccess('Offer sent!'); setShowOfferModal(false); setOfferMessage(''); }
        else if (res.error === 'Unauthorized') router.push('/login');
        else showError(res.error || 'Failed to send offer');
    };

    if (!initialListing) {
        return (<div className="min-h-screen bg-gradient-page flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-4">Listing not found</h2><button onClick={() => router.push('/textbook-exchange')} className="text-green-400 hover:underline">Go back</button></div></div>);
    }

    const listing = initialListing;

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => router.push('/textbook-exchange')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"><ArrowLeft size={20} /> Back to Marketplace</button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="glass-strong rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${condColor(listing.condition)}`}>{listing.condition}</span>
                                <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-lg transition-all"><Heart size={24} className="text-red-400" /></button>
                            </div>
                            <div className="flex items-center gap-4 mb-6"><Book size={64} className="text-green-400" /><div><h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1><p className="text-xl text-slate-300">{listing.author}</p></div></div>
                            <div className="space-y-4 mb-8">
                                {listing.isbn && <div><p className="text-sm text-slate-400">ISBN</p><p className="text-white">{listing.isbn}</p></div>}
                                {listing.edition && <div><p className="text-sm text-slate-400">Edition</p><p className="text-white">{listing.edition}</p></div>}
                                {listing.description && <div><p className="text-sm text-slate-400 mb-2">Description</p><p className="text-white">{listing.description}</p></div>}
                            </div>
                            <div className="border-t border-white/10 pt-6"><p className="text-sm text-slate-400 mb-1">Listed on</p><p className="text-white">{new Date(listing.created_at).toLocaleDateString()}</p></div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="glass-strong rounded-2xl p-6 sticky top-6">
                            <div className="mb-8"><p className="text-sm text-slate-400 mb-1">Price</p><p className="text-5xl font-bold text-green-400">${listing.price}</p></div>
                            {listing.status === 'available' && (<div className="mb-6"><button onClick={() => showSuccess('Seller will be notified!')} className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-medium text-lg">Contact Seller</button><p className="text-xs text-slate-400 mt-2 text-center">Seller contact details will be shared after confirmation</p></div>)}
                            <div className="glass-strong rounded-xl p-4 mb-6"><h3 className="text-sm font-semibold text-white mb-2">💳 Payment</h3><p className="text-xs text-slate-400">Payment is peer-to-peer. Common methods: Venmo, Zelle, PayPal, or cash.</p></div>
                            <div className="space-y-3">
                                <button onClick={() => setShowOfferModal(true)} className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-medium">Make an Offer</button>
                                <button onClick={handleSave} className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2"><Heart size={20} /> Save Listing</button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center"><User size={20} className="text-white" /></div><div><p className="text-sm text-slate-400">Seller</p><p className="text-white font-medium">Student</p></div></div></div>
                        </div>
                    </div>
                </div>
                {showOfferModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-white mb-6">Make an Offer</h2>
                            <form onSubmit={handleMakeOffer} className="space-y-4">
                                <div><label className="block text-sm font-medium text-white mb-2">Your Offer ($)</label><input type="number" step="0.01" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50" required /></div>
                                <div><label className="block text-sm font-medium text-white mb-2">Message (Optional)</label><textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50" placeholder="Add a message to the seller..." /></div>
                                <div className="flex gap-3"><button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">Cancel</button><button type="submit" className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all">Send Offer</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTextbookListing, markListingSold } from '@/modules/textbook/actions/textbook';
import { showError, showSuccess } from '@/lib/toast';
import { ArrowLeft, Eye, Trash2, DollarSign } from 'lucide-react';

interface MyListingsClientProps { initialListings: any[]; }

export default function MyListingsClient({ initialListings }: MyListingsClientProps) {
    const router = useRouter();
    const [listings, setListings] = useState(initialListings);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this listing?')) return;
        const res = await deleteTextbookListing(id);
        if (res.success) { showSuccess('Deleted'); setListings(p => p.filter(l => l.id !== id)); }
        else showError(res.error || 'Failed');
    };

    const handleMarkSold = async (id: string) => {
        const res = await markListingSold(id);
        if (res.success) { showSuccess('Marked sold'); setListings(p => p.map(l => l.id === id ? { ...l, status: 'sold' } : l)); }
        else showError(res.error || 'Failed');
    };

    const condColor = (c: string) => ({ new: 'text-green-400 bg-green-600/20', 'like-new': 'text-blue-400 bg-blue-600/20', good: 'text-yellow-400 bg-yellow-600/20', fair: 'text-orange-400 bg-orange-600/20' }[c] || 'text-slate-400 bg-slate-600/20');
    const statColor = (s: string) => ({ available: 'text-green-400 bg-green-600/20', sold: 'text-slate-400 bg-slate-600/20', pending: 'text-yellow-400 bg-yellow-600/20' }[s] || 'text-slate-400 bg-slate-600/20');

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => router.push('/textbook-exchange')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"><ArrowLeft size={20} /> Back to Marketplace</button>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center"><DollarSign size={32} className="text-white" /></div>
                            <div><h1 className="text-4xl font-bold text-white mb-1">My Listings</h1><p className="text-slate-400">Manage your textbook listings</p></div>
                        </div>
                    </div>
                    <button onClick={() => router.push('/textbook-exchange/create')} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all">Add New Listing</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-strong rounded-2xl p-6"><p className="text-sm text-slate-400 mb-1">Total</p><p className="text-3xl font-bold text-white">{listings.length}</p></div>
                    <div className="glass-strong rounded-2xl p-6"><p className="text-sm text-slate-400 mb-1">Available</p><p className="text-3xl font-bold text-green-400">{listings.filter(l => l.status === 'available').length}</p></div>
                    <div className="glass-strong rounded-2xl p-6"><p className="text-sm text-slate-400 mb-1">Sold</p><p className="text-3xl font-bold text-slate-400">{listings.filter(l => l.status === 'sold').length}</p></div>
                </div>
                {listings.length === 0 ? (
                    <div className="glass-strong rounded-2xl p-12 text-center"><div className="text-6xl mb-4">📚</div><h3 className="text-2xl font-bold text-white mb-2">No listings yet</h3><p className="text-slate-400 mb-6">Start selling!</p><button onClick={() => router.push('/textbook-exchange/create')} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all">Create First Listing</button></div>
                ) : (
                    <div className="space-y-4">{listings.map(l => (
                        <div key={l.id} className="glass-strong rounded-2xl p-6"><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center gap-3 mb-2"><h3 className="text-xl font-bold text-white">{l.title}</h3><span className={`px-3 py-1 rounded-lg text-xs capitalize ${statColor(l.status)}`}>{l.status}</span><span className={`px-3 py-1 rounded-lg text-xs capitalize ${condColor(l.condition)}`}>{l.condition}</span></div><p className="text-slate-400 mb-3">{l.author}</p><div className="flex items-center gap-6 text-sm"><div><span className="text-slate-500">Price: </span><span className="text-green-400 font-bold text-lg">${l.price}</span></div><div><span className="text-slate-500">Listed: </span><span className="text-white">{new Date(l.created_at).toLocaleDateString()}</span></div></div></div><div className="flex gap-2"><button onClick={() => router.push(`/textbook-exchange/${l.id}`)} className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all" title="View"><Eye size={18} /></button>{l.status === 'available' && (<><button onClick={() => handleMarkSold(l.id)} className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all text-sm">Mark Sold</button><button onClick={() => handleDelete(l.id)} className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button></>)}</div></div></div>
                    ))}</div>
                )}
            </div>
        </div>
    );
}

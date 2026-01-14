import { toast } from 'react-hot-toast';
import Image from 'next/image';


/**
 * Card component for a single book in the "Currently Reading" shelf.
 * Handles progress updates with validation, optimistic UI and toast feedback.
 */
export default function CurrentlyReadingCard({ book, userProgress, onProgressChange }) {
    const [input, setInput] = useState(userProgress ?? 0);
    const [updating, setUpdating] = useState(false);
    const [imgSrc, setImgSrc] = useState(book.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=random&size=300`);
    const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=random&size=300`;

    const percent = Math.round((userProgress / book.pages) * 100);

    const handleKeyDown = async (e) => {
        if (e.key !== 'Enter') return;
        const pages = Math.max(0, Math.min(book.pages, Number(input)));
        if (pages === userProgress) {
            // No change
            return;
        }
        setUpdating(true);
        try {
            await onProgressChange(book._id, pages);
            toast.success('Progress updated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update progress');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="glass p-6 rounded-2xl flex flex-col">
            <div className="flex space-x-4 mb-6">
                <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                        src={imgSrc}
                        alt={`${book.title} cover`}
                        fill
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AKp24P6GgAAAABJRU5ErkJggg=="
                        onError={() => setImgSrc(fallbackSrc)}
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-bold line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-xs text-primary mt-2 font-bold uppercase tracking-wider">
                        {book.pages} Pages Total
                    </p>
                </div>
            </div>
            <div className="mt-auto space-y-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="number"
                        min={0}
                        max={book.pages}
                        className="w-20 bg-black/20 border border-white/10 rounded-lg p-2 text-sm focus:border-primary focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={updating}
                    />
                    <span className="text-xs text-muted-foreground">/ {book.pages}</span>
                    {updating && <svg className="w-4 h-4 animate-spin text-primary" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>}
                </div>
            </div>
        </div>
    );
}

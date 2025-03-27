import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SearchBar.css';

const SearchBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-input"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">بحث</button>
        </form>
    );
};

export default SearchBar;

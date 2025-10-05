// frontend/src/pages/SearchPage.jsx

import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import styles from './SearchPage.module.css';
import btnStyles from '../components/Button.module.css';

// --- Empty State Component ---
// Yeh component tab dikhega jab koi search nahi ho raha ho
const EmptyState = () => (
    <div className={styles.emptyStateContainer}>
        <svg className={styles.emptyStateIcon} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><circle cx="10.5" cy="14.5" r="2.5"></circle><path d="M12.24 16.24 15 19"></path></svg>
        <h3 className={styles.emptyStateTitle}>Search Your Resumes</h3>
        <p className={styles.emptyStateText}>Your search results will appear here once you ask a question.</p>
        <p className={styles.emptyStateText}>Make sure you have uploaded some valid resumes first!</p>
    </div>
);


const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            toast.error('Please enter a search query.');
            return;
        }
        setIsLoading(true);
        setResults(null);
        try {
            const response = await api.post('/resumes/ask', { query }, {
                headers: { 'Idempotency-Key': uuidv4() }
            });
            setResults(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || 'Search failed.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Search & Ask</h1>
            <p className={styles.subtitle}>Ask a question across all the resumes you've uploaded.</p>
            <form onSubmit={handleSearch} className={styles.form}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Who has experience with React and Node.js?"
                    className={styles.input} />
                <button type="submit" disabled={isLoading} className={`${btnStyles.btn} ${btnStyles.btnPrimary}`}>
                    {isLoading ? 'Searching...' : 'Ask AI'}
                </button>
            </form>

            {isLoading && (
                <div className={styles.loadingContainer}>
                    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className={styles.loadingText}>Thinking...</span>
                </div>
            )}
            
            {!isLoading && !results && <EmptyState />}

            {!isLoading && results && (
                <div className={styles.resultsContainer}>
                    <div className={styles.answerCard}>
                        <h3 className={styles.cardTitle}>Answer:</h3>
                        <p className={styles.answerText}>{results.answer}</p>
                    </div>

                    {results.sources && results.sources.length > 0 && (
                        <div>
                           <h3 className={styles.cardTitle}>Sources from Resumes:</h3>
                            <div className={styles.sourcesContainer}>
                                {results.sources.map((source, index) => (
                                    <div key={index} className={styles.sourceCard} style={{ animationDelay: `${index * 100}ms` }}>
                                        <div className={styles.sourceHeader}>
                                          <span>Resume ID: <span className={styles.resumeId}>{source.resumeId}</span></span>
                                          <span className={styles.matchScore}>Match Score: {(source.score * 100).toFixed(2)}%</span>
                                        </div>
                                        <blockquote className={styles.snippet}>
                                            "{source.textSnippet.substring(0, 350)}..."
                                        </blockquote>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
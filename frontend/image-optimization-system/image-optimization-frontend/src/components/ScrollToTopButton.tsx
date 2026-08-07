import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button 
            className="scroll-to-top-btn" 
            onClick={scrollToTop} 
            title="Scroll to top"
            aria-label="Scroll to top"
        >
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}

export default ScrollToTopButton;

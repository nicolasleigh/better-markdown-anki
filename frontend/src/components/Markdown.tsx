import { TypographyStylesProvider } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    oneDark,
    oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
    const entityMap = {
        '&#x27;': "'",
        '&#39;': "'",
        '&apos;': "'",
        '&quot;': '"',
        '&#x22;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&#x2F;': '/',
        '&#x5C;': '\\',
        '&#x60;': '`',
        '&#x3D;': '=',
        '&#35;': '#',
        '&#x23;': '#',
    };

    // Replace named and numeric entities
    let decoded = text;
    Object.entries(entityMap).forEach(([entity, char]) => {
        decoded = decoded.replace(new RegExp(entity, 'g'), char);
    });

    // Handle any remaining numeric entities (decimal)
    decoded = decoded.replace(/&#(\d+);/g, (_match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
    });

    // Handle any remaining numeric entities (hexadecimal)
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });

    return decoded;
};

const Markdown = ({
    children,
    className = '',
    theme = 'dark',
}) => {
    const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

    // Decode HTML entities before processing
    const processedContent = decodeHtmlEntities(children);

    const inlineCodeStyles = {
        backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc',
        color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
        padding: '2px 4px',
        borderRadius: '4px',
        fontSize: '0.875em',
        fontFamily: 'monospace',
    };

    const syntaxHighlighterCustomStyle = {
        borderRadius: '4px',
        fontSize: '11px',
        padding: '8px',
        marginTop: '0.5em',
        marginBottom: '0.5em',
    };

    return (
        <TypographyStylesProvider className={`${className} markdown-content`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    code: ({
                        // inline,
                        className: codeClassName,
                        children: codeChildren,
                        ...props
                    }) => {
                        const match = /language-(\w+)/.exec(codeClassName || '');
                        return match ? (
                            <SyntaxHighlighter
                                style={syntaxTheme}
                                language={match[1]}
                                PreTag="div"
                                customStyle={syntaxHighlighterCustomStyle}
                                wrapLines
                                {...props}
                            >
                                {String(codeChildren).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code style={inlineCodeStyles} {...props}>
                                {codeChildren}
                            </code>
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </TypographyStylesProvider>
    );
};

export default Markdown;
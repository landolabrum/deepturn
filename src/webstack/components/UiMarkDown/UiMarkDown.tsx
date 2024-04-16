import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface UiMarkdownProps {
  text: string;
  color?: string; // Optional prop for text color
  jsx?: string; // Optional prop for text color
}

const UiMarkdown: React.FC<UiMarkdownProps> = ({ text, color, jsx }) => {
  // Style object for text color
  const plug: any = rehypeRaw;
  const markdownStyle = {
    color: color, // Use the textColor prop
  };
  return (<>
    <div style={markdownStyle}> {/* Apply the style to a div that wraps ReactMarkdown */}
      {jsx && <style jsx>{jsx}</style>}
      <ReactMarkdown
        
        rehypePlugins={[plug]}
        components={{
          // Keep the paragraph as block-level element, potentially changing only text-related properties
          p: ({ node, ...props }) => <div style={{ color: color }} {...props} />
        }}
        >
        {text}
      </ReactMarkdown>
    </div>
    </>
  );
};

export default UiMarkdown;

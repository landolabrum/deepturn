import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface UiMarkdownProps {
  text: string;
  color?: string; // Optional prop for text color
}

const UiMarkdown: React.FC<UiMarkdownProps> = ({ text, color }) => {
  // Style object for text color
  const plug: any = rehypeRaw;
  const markdownStyle = {
    color: color, // Use the textColor prop
  };

  return (
    <div style={markdownStyle}> {/* Apply the style to a div that wraps ReactMarkdown */}
      <ReactMarkdown
        rehypePlugins={[plug]}
        components={{
          // Customize the rendering of paragraph elements
          p: ({ node, ...props }) => <span {...props} />
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default UiMarkdown;

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

LongText.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  maxLines: PropTypes.number,
  style: PropTypes.object,
  noExpand: PropTypes.bool,
  readMoreColor: PropTypes.string
};

export default function LongText({
  style,
  className,
  cleanString,
  children,
  maxLines = 10,
  noExpand,
  readMoreColor = Color.blue()
}) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(children || '');
  const [fullText, setFullText] = useState(false);
  const [more, setMore] = useState(false);
  const truncated = useRef(false);
  const lengthRef = useRef(0);
  const ContainerRef = useRef(null);
  const TextRef = useRef(null);

  useEffect(() => {
    setFullText(false);
    setMore(false);
  }, [children]);

  useEffect(() => {
    if (ContainerRef.current?.clientWidth) {
      if (!truncated.current) {
        truncateText({
          container: ContainerRef.current,
          originalText: children || '',
          maxWidth: ContainerRef.current.clientWidth
        });
      }
      setLoading(false);
    } else {
      setLoading(true);
    }

    function truncateText({ container, originalText, maxWidth }) {
      const canvas = document.createElement('canvas').getContext('2d');
      const computedStyle = window.getComputedStyle(container);
      const font = `${computedStyle['font-weight']} ${computedStyle['font-style']} ${computedStyle['font-size']} ${computedStyle['font-family']}`;
      canvas.font = font;
      let line = '';
      let numLines = 0;
      let trimmedText = '';
      for (let i = 0; i < originalText.length; i++) {
        line += originalText[i];
        if (
          originalText[i] === '\n' ||
          canvas.measureText(line).width > maxWidth
        ) {
          numLines++;
          trimmedText += line;
          line = '';
        }
        if (numLines === maxLines && i < originalText.length - 1) {
          const remainingText = originalText.slice(i + 1);
          let more = true;
          if (
            !remainingText.includes('\n') &&
            canvas.measureText(remainingText).width < maxWidth
          ) {
            trimmedText += remainingText;
            more = false;
          }
          setText(trimmedText);
          setMore(more);
          if (trimmedText.length < lengthRef.current) {
            truncated.current = true;
          }
          lengthRef.current = trimmedText.length;
          return;
        }
      }
      setText(trimmedText + line || line);
      setMore(!fullText && (trimmedText + line).length < originalText.length);
    }
  }, [children, fullText, maxLines, more]);

  return (
    <div ref={ContainerRef} style={style} className={className}>
      {loading ? null : (
        <p ref={TextRef}>
          {fullText ? (
            <span
              dangerouslySetInnerHTML={{
                __html: limitBrs(
                  cleanString
                    ? children
                    : processedStringWithURL(children || '')
                )
              }}
            />
          ) : (
            <>
              <span
                dangerouslySetInnerHTML={{
                  __html: limitBrs(
                    cleanString ? text : processedStringWithURL(text)
                  )
                }}
              />
              {more && (
                <>
                  {'... '}
                  {!noExpand && (
                    <a
                      style={{ cursor: 'pointer', color: readMoreColor }}
                      onClick={() => setFullText(true)}
                    >
                      Read More
                    </a>
                  )}
                </>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}

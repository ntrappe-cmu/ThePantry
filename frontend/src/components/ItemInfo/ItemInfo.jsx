/**
 * ItemInfo Component
 *
 * Reusable, composable item info row with dot-notation subcomponents:
 * - ItemInfo.Image
 * - ItemInfo.Content
 * - ItemInfo.Title
 * - ItemInfo.Description
 * - ItemInfo.Quantity
 */

function ItemInfo({ children }) {
  return <div className="itemInfo">{children}</div>;
}

function Image({ src, alt }) {
  return (
    <div className="itemInfo__imageWrapper">
      <img className="itemInfo__image" src={src} alt={alt} />
    </div>
  );
}

function Content({ children }) {
  return <div className="itemInfo__content">{children}</div>;
}

function Title({ children }) {
  const titleAttr = typeof children === 'string' ? children : undefined;
  return (
    <div className="itemInfo__title" title={titleAttr}>
      {children}
    </div>
  );
}

function Description({ children, maxLength = 50 }) {
  if (typeof children !== 'string') {
    return <div className="itemInfo__description">{children}</div>;
  }

  const safeMaxLength = Number.isFinite(maxLength) && maxLength >= 0 ? maxLength : 50;
  const isTruncated = children.length > safeMaxLength;
  const displayText = isTruncated
    ? `${children.slice(0, safeMaxLength).trimEnd()}...`
    : children;

  return <div className="itemInfo__description">{displayText}</div>;
}

function Quantity({ value }) {
  return <div className="itemInfo__quantity">{`Qty. ${value}`}</div>;
}

ItemInfo.Image = Image;
ItemInfo.Content = Content;
ItemInfo.Title = Title;
ItemInfo.Description = Description;
ItemInfo.Quantity = Quantity;

export default ItemInfo;


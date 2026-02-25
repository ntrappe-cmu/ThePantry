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

import styled from 'styled-components';

const StyledItemInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1 1 auto;
  gap: var(--item-info-gap);
`;

const StyledItemInfoImageWrapper = styled.div`
  width: var(--item-info-image-size);
  height: var(--item-info-image-size);
  flex: 0 0 auto;
  border-radius: var(--item-info-image-radius);
  overflow: hidden;
  background-color: var(--bg-color-secondary);
`;

const StyledItemInfoImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const StyledItemInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  gap: var(--item-info-content-gap);
`;

const StyledItemInfoTitle = styled.div`
  font-weight: 600;
  color: var(--fg-color-primary);
  overflow: hidden;
  white-space: nowrap;
`;

const StyledItemInfoDescription = styled.div`
  color: var(--fg-color-secondary);
  font-size: 0.85em;
  font-weight: 400;
  letter-spacing: 0.05px;
`;

const StyledItemInfoQuantity = styled.div`
  color: var(--fg-color-tertiary);
  font-size: 0.8em;
  font-weight: 500;
`;

function ItemInfo({ children }) {
  return <StyledItemInfoWrapper>{children}</StyledItemInfoWrapper>;
}

function Image({ src, alt }) {
  return (
    <StyledItemInfoImageWrapper>
      <StyledItemInfoImage src={src} alt={alt} />
    </StyledItemInfoImageWrapper>
  );
}

function Content({ children }) {
  return <StyledItemInfoContent>{children}</StyledItemInfoContent>;
}

function Title({ children }) {
  const titleAttr = typeof children === 'string' ? children : undefined;
  return (
    <StyledItemInfoTitle title={titleAttr}>
      {children}
    </StyledItemInfoTitle>
  );
}

function Description({ children, maxLength = 50 }) {
  if (typeof children !== 'string') {
    return <StyledItemInfoDescription>{children}</StyledItemInfoDescription>;
  }

  const safeMaxLength = Number.isFinite(maxLength) && maxLength >= 0 ? maxLength : 50;
  const isTruncated = children.length > safeMaxLength;
  const displayText = isTruncated
    ? `${children.slice(0, safeMaxLength).trimEnd()}...`
    : children;

  return <StyledItemInfoDescription>{displayText}</StyledItemInfoDescription>;
}

function Quantity({ value }) {
  return <StyledItemInfoQuantity>{`Qty. ${value}`}</StyledItemInfoQuantity>;
}

ItemInfo.Image = Image;
ItemInfo.Content = Content;
ItemInfo.Title = Title;
ItemInfo.Description = Description;
ItemInfo.Quantity = Quantity;

export default ItemInfo;


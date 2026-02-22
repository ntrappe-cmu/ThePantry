
import ItemInfo from '../components/ItemInfo/ItemInfo';
import pantryIcon from '../assets/icons/pantry.svg';

function OrdersView() {
  return (
    // itemInfo component example implementation starts here
    <div>
      <h2>Orders</h2>

      <ItemInfo>
        <ItemInfo.Image src={pantryIcon} alt="Pantry item preview" />
        <ItemInfo.Content>
          <ItemInfo.Title>
            Extra-long item title that should truncate naturally in a single line when it overflows the container
          </ItemInfo.Title>
          <ItemInfo.Description maxLength={50}>
            This is a long description that will truncate after a hundred characters and add an ellipsis.
          </ItemInfo.Description>
          <ItemInfo.Quantity value={12} />
        </ItemInfo.Content>
      </ItemInfo>
    </div>
    //itemInfo component example implementation ends here
  );
}

export default OrdersView;
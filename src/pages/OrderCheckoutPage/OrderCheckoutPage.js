import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  CheckoutListContainer,
  CheckoutList,
  CheckoutListTitle,
  PaymentInfoBoxContainer,
} from './OrderCheckoutPage.styles';
import { CONFIRM_MESSAGE, ROUTE, SCHEMA } from '../../constants';
import { useServerAPI } from '../../hooks';
import { numberWithCommas } from '../../shared/utils';
import { Header, PaymentInfoBox, RowProductItem } from '../../components';
import ScreenContainer from '../../shared/styles/ScreenContainer';
import { updateShoppingCartItemsAsync } from '../../redux/action';

const OrderCheckoutPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { myShoppingCartId, myShoppingCartProductIds } = useSelector(state => ({
    myShoppingCartId: state.myShoppingCartReducer.myShoppingCart.id,
    myShoppingCartProductIds: state.myShoppingCartReducer.myShoppingCart.productIdList,
  }));

  const checkedItemList = location.state?.checkedItemList;
  const checkedIdList = checkedItemList.map(item => item.id);
  const expectedPrice = checkedItemList.reduce((acc, item) => {
    const { price, amount } = item;

    return acc + price * amount;
  }, 0);

  const { postData: createOrder } = useServerAPI([], SCHEMA.ORDER);

  const onClickPaymentButton = () => {
    if (!window.confirm(CONFIRM_MESSAGE.PURCHASE)) return;

    const newContent = {
      productIdList: myShoppingCartProductIds.filter(productId => !checkedIdList.includes(productId)),
    };
    dispatch(updateShoppingCartItemsAsync(SCHEMA.SHOPPING_CART, myShoppingCartId, newContent));

    const content = {
      orderedProductList: checkedItemList.map(({ id, amount }) => ({ id, amount })),
    };

    createOrder(content);

    history.push({
      pathname: ROUTE.ORDER_LIST,
    });
  };

  return (
    <ScreenContainer route={location.pathname}>
      <Header>주문/결제</Header>

      <Container>
        <CheckoutListContainer>
          <CheckoutListTitle>{`주문 상품 ( ${checkedItemList.length}건 )`}</CheckoutListTitle>

          <CheckoutList>
            {checkedItemList.map(({ id, img, name, amount }) => (
              <RowProductItem key={id} imgSrc={img} name={name} amount={amount} />
            ))}
          </CheckoutList>
        </CheckoutListContainer>

        <PaymentInfoBoxContainer>
          <PaymentInfoBox
            title="결제금액"
            detailText="총 결제금액"
            price={expectedPrice}
            buttonText={`${numberWithCommas(expectedPrice)}원 결제하기`}
            onClick={onClickPaymentButton}
          />
        </PaymentInfoBoxContainer>
      </Container>
    </ScreenContainer>
  );
};

export default OrderCheckoutPage;

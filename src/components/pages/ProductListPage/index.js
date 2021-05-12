import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UNIT } from '../../../constants/appInfo';
import PALETTE from '../../../constants/palette';
import { addToCart } from '../../../redux/Cart/actions';
import { getProducts, resetProducts } from '../../../redux/Products/actions';
import Button from '../../common/Button';
import ShoppingCart from '../../common/Icon/ShoppingCart';
import Main from '../../Main';
import Product from '../../shared/Product';
import * as Styled from './style';
import Snackbar from '../../common/Snackbar';

const ProductListPage = () => {
  const { products, cart, errorMessage } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());

    return () => {
      dispatch(resetProducts());
    };
  }, []);

  const onAddToCart = ({ target }) => {
    const selectedProductId = target.closest('li[data-product-id]').dataset.productId;

    if (cart.findIndex((product) => product.id === selectedProductId) >= 0) return;

    const selectedProduct = products.find((product) => product.id === selectedProductId);
    dispatch(addToCart({ ...selectedProduct, amount: 1, isChecked: false }));
  };

  return (
    <Main>
      <Styled.ProductList>
        {products.map((product) => (
          <li data-product-id={product.id} key={product.id}>
            <Product
              product={product}
              productDetail={{
                text: `${Number(product.price).toLocaleString()} ${UNIT.MONEY}`,
                fontSize: '1.5rem',
              }}
              direction="column"
              size="17.5rem"
            >
              {!cart.some(({ id }) => product.id === id) && (
                <Button hoverAnimation={'scale'} backgroundColor="transparent" onClick={onAddToCart}>
                  <ShoppingCart width="2rem" color={PALETTE.BLACK} />
                </Button>
              )}
            </Product>
          </li>
        ))}
      </Styled.ProductList>
    </Main>
  );
};

export default React.memo(ProductListPage);

import * as productAPI from "../api";
import { LOAD_ITEM_AMOUNT } from "../constants";
import createReducer from "./createReducer";

const GET_PRODUCTS = "products/GET_PRODUCTS";
const GET_PRODUCT = "product/GET_PRODUCT";

const GET_PRODUCT_SUCCESS = "product/GET_PRODUCT_SUCCESS";
const GET_PRODUCTS_SUCCESS = "products/GET_PRODUCTS_SUCCESS";

const GET_PRODUCT_ERROR = "product/GET_PRODUCT_ERROR";
const GET_PRODUCTS_ERROR = "products/GET_PRODUCTS_ERROR";
const GET_PRODUCTS_END = "products/GET_PRODUCTS_END";

const initialState = {
  product: {
    loading: false,
    data: {},
    error: null,
  },
  products: {
    loading: false,
    data: [],
    error: null,
    isEnd: false,
    page: 1,
  },
};

export const getProductsByPage = () => async (dispatch, getState) => {
  const {
    products: { loading, page },
  } = getState();

  if (loading) return;

  dispatch({ type: GET_PRODUCTS });

  try {
    const products = await productAPI.getProductsByPage(page);

    if (products.data.length < LOAD_ITEM_AMOUNT) {
      return dispatch({ type: GET_PRODUCTS_END, products: products.data });
    }
    dispatch({ type: GET_PRODUCTS_SUCCESS, products: products.data });
  } catch (error) {
    dispatch({ type: GET_PRODUCTS_ERROR, error });
  }
};

export const getProductById = (id) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT });
  try {
    const product = await productAPI.getProductById(id);
    dispatch({ type: GET_PRODUCT_SUCCESS, product: product.data });
  } catch (error) {
    dispatch({ type: GET_PRODUCT_ERROR, error });
  }
};

const getProducts = (productsState) => ({
  ...productsState,
  loading: true,
  error: null,
});

const getProductsSuccess = (productsState, action) => ({
  loading: false,
  data: productsState.data.concat(action.products),
  error: null,
  isEnd: false,
  page: productsState.page + 1,
});

const getProductsError = (productsState, action) => ({
  ...productsState,
  loading: false,
  data: null,
  error: action.error,
});

const getProductsEnd = (productsState, action) => ({
  ...productsState,
  data: productsState.data.concat(action.products),
  loading: false,
  isEnd: true,
});

const getProduct = () => ({
  loading: true,
  data: {},
  error: null,
});

const getProductSuccess = (_, action) => ({
  loading: false,
  data: action.product,
  error: null,
});

const getProductError = () => ({
  loading: false,
  data: {},
  error: null,
});

const productsReducer = createReducer(
  {},
  {
    [GET_PRODUCTS]: getProducts,
    [GET_PRODUCTS_SUCCESS]: getProductsSuccess,
    [GET_PRODUCTS_ERROR]: getProductsError,
    [GET_PRODUCTS_END]: getProductsEnd,
  }
);

const productReducer = createReducer(
  {},
  {
    [GET_PRODUCT]: getProduct,
    [GET_PRODUCT_SUCCESS]: getProductSuccess,
    [GET_PRODUCT_ERROR]: getProductError,
  }
);

export default function appReducer(state = initialState, action = {}) {
  return {
    products: productsReducer(state.products, action),
    product: productReducer(state.product, action),
  };
}

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder, detailsOrder, payOrder } from '../actions/orderActions';
import PaypalButton from '../components/PaypalButton';
function OrderScreen(props) {

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successPay) {
      props.history.push("/profile");
    } else {
      dispatch(detailsOrder(props.match.params.id));
    }
    return () => {
    };
  }, [successPay]);

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  }

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, order, error } = orderDetails;

  return loading ? <div>Cargando ...</div> : error ? <div>{error}</div> :

    <div>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>
              Envio
          </h3>
            <div>
              {order.shipping.address}, {order.shipping.city},
          {order.shipping.postalCode}, {order.shipping.country},
          </div>
            <div>
              {order.isDelivered ? "Entregado en: " + order.deliveredAt : "No entregado."}
            </div>
          </div>
          <div>
            <h3>Pago</h3>
            <div>
              Metodo de pago: {order.payment.paymentMethod}
            </div>
            <div>
              {order.isPaid ? "Pagado en " + order.paidAt : "No pagado."}
            </div>
          </div>
          <div>
            <ul className="cart-list-container">
              <li>
                <h3>
                  Carro de compras
          </h3>
                <div>
                  Precio
          </div>
              </li>
              {
                order.orderItems.length === 0 ?
                  <div>
                    Carro esta vacio
          </div>
                  :
                  order.orderItems.map(item =>
                    <li key={item._id}>
                      <div className="cart-image">
                        <img src={item.image} alt="product" />
                      </div>
                      &nbsp;
                      <div className="cart-name">
                        <div>
                          <Link to={"/product/" + item.product}>
                            {item.name}
                          </Link>

                        </div>
                        <div>
                          Cantidad: {item.qty}
                        </div>
                      </div>
                      <div className="cart-price">
                        Q. {item.price}
                      </div>
                    </li>
                  )
              }
            </ul>
          </div>


        </div>
        <div className="placeorder-action">
          <ul>
            <li className="placeorder-actions-payment">
              {loadingPay && <div>Finalizando pago...</div>}
              {!order.isPaid &&
                <PaypalButton
                  amount={order.totalPrice}
                  onSuccess={handleSuccessPayment} />
              }
            </li>
            <li>
              <h3>Resumen de orden</h3>
            </li>
            <li>
              <div>Articulos</div>
              <div>Q. {order.itemsPrice}</div>
            </li>
            <li>
              <div>Costo de envio</div>
              <div>Q. {order.shippingPrice}</div>
            </li>
            <li>
              <div>IVA</div>
              <div>Q. {order.taxPrice}</div>
            </li>
            <li>
              <div>TOTAL</div>
              <div>Q. {order.totalPrice}</div>
            </li>
          </ul>



        </div>

      </div>
    </div>

}

export default OrderScreen;
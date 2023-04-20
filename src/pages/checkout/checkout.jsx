import { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { classNames, formatMoney, getDistrictById, getProvinceById, getTotalPrice, getTotalWeight } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchingDataGHN } from '../../redux/middleware';
import { getCart, getDistricts, getProvinces, getWards } from '../../redux/selector';
import { APIClient } from '../../helper/api_helper';
import { fetchDistricts, fetchWards } from '../../redux/GHN.slice';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provinces = useSelector(getProvinces);
  const districts = useSelector(getDistricts);
  const wards = useSelector(getWards);
  const cart = useSelector(getCart);

  // console.log('cart :: ', cart);
  const [shippingInfomation, setShippingInfomation] = useState({
    name: '',
    phone: '',
    fee: '',
    provinceId: '',
    province: '',
    districtId: '',
    district: '',
    ward: '',
    line: '',
  });

  const [payment, setPayment] = useState({ gateway: 'CASH', amount: 0 });

  useEffect(() => {
    dispatch(fetchingDataGHN());
  }, []);

  useEffect(() => {
    if (shippingInfomation.provinceId) {
      new APIClient()
        .getWithToken(`${process.env.REACT_APP_API_URL}/ghn/districts?province_id=${shippingInfomation.provinceId}`)
        .then((res) => {
          dispatch(fetchDistricts(res));
        })
        .catch((e) => console.log('e:: ', e));
    }
    if (shippingInfomation.districtId) {
      new APIClient()
        .getWithToken(`${process.env.REACT_APP_API_URL}/ghn/wards?district_id=${shippingInfomation.districtId}`)
        .then((res) => {
          dispatch(fetchWards(res));
        })
        .catch((e) => console.log('e ::', e));
    }
    if (shippingInfomation.provinceId && shippingInfomation.districtId && shippingInfomation.ward) {
      new APIClient()
        .createWithToken(`${process.env.REACT_APP_API_URL}/ghn/shipping-fee`, {
          to_district: shippingInfomation.district,
          to_ward: shippingInfomation.ward,
          weight: getTotalWeight(cart),
        })
        .then((res) => {
          setShippingInfomation({ ...shippingInfomation, fee: res.total });
        })
        .catch((e) => console.log('e ::', e));
    }
    return;
  }, [shippingInfomation.provinceId, shippingInfomation.district, shippingInfomation.ward]);

  const handleCreateOrder = () => {
    const order_items = cart.map((x) => {
      return {
        variant_id: x.variant_id,
        quantity: x.quantity,
        unit_price: x.unit_price,
      };
    });

    const data = {
      order_items,
      payment: {
        gateway: payment.gateway,
        amount: getTotalPrice(cart),
      },
      shipping_information: {
        carrier: 'GHN',
        customer_name: shippingInfomation.name,
        customer_phone: shippingInfomation.phone,
        fee: shippingInfomation.fee,
        province: shippingInfomation.province,
        district: shippingInfomation.district,
        ward: shippingInfomation.ward,
        line: shippingInfomation.line,
      },
    };

    new APIClient()
      .createWithToken(`${process.env.REACT_APP_API_URL}/orders`, data)
      .then((res) => {
        if (data.payment.gateway === 'CASH') {
          alert('Bạn đã đặt hàng thành công');
          navigate('/order');
        } else if (data.payment.gateway === 'VNPAY') {
          const order_code = res.code;
          console.log('order_code ::', order_code);
          new APIClient()
            .createWithToken(`${process.env.REACT_APP_API_URL}/vnpay/payment-url`, { order_code })
            .then((res) => {
              // navigate(res.url);
              // window.open(res.url, '_blank');
              window.location.replace(res.url);
            })
            .catch((e) => console.log('err :'));
        }
      })
      .catch((e) => console.log('err : ', e));
  };
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateOrder();
          }}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div className="border-gray-200 ">
              <h2 className="text-lg font-medium text-gray-900">Thông Tin Giao Hàng</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {/* Họ Tên */}
                <div className="sm:col-span-2">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Họ Tên
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="name"
                      onChange={(e) => {
                        setShippingInfomation({ ...shippingInfomation, [e.target.name]: e.target.value });
                      }}
                      autoComplete="given-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                {/* Số Điện Thoại */}
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Số Điện Thoại
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      onChange={(e) => {
                        setShippingInfomation({ ...shippingInfomation, [e.target.name]: e.target.value });
                      }}
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Tỉnh Thành Phố */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Tỉnh / Thành Phố
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="provinceId"
                      autoComplete="country-name"
                      value={shippingInfomation.provinceId}
                      onChange={(e) => {
                        const provinceNameCurr = getProvinceById(provinces, e.target.value);
                        setShippingInfomation({
                          ...shippingInfomation,
                          [e.target.name]: e.target.value,
                          districtId: '',
                          ward: '',
                          district: '',
                          province: provinceNameCurr,
                        });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option className="hidden" value={''}>
                        Chọn Thành Phố
                      </option>
                      {provinces?.map((x, index) => (
                        <option key={index} value={x.province_id}>
                          {x.province_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quận Huyện */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Quận / Huyện
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="districtId"
                      value={shippingInfomation.districtId}
                      onChange={(e) => {
                        const districtNameCurr = getDistrictById(districts, e.target.value);
                        setShippingInfomation({
                          ...shippingInfomation,
                          [e.target.name]: e.target.value,
                          district: districtNameCurr,
                          ward: '',
                        });
                      }}
                      autoComplete="country-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={''} className="hidden">
                        Chọn Quận Huyện
                      </option>

                      {districts?.map((x, index) => (
                        <option key={index} value={x.district_id}>
                          {x.district_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Phường Xã */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Phường / Xã
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="ward"
                      autoComplete="country-name"
                      value={shippingInfomation.ward}
                      onChange={(e) => {
                        setShippingInfomation({ ...shippingInfomation, [e.target.name]: e.target.value });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={''} className="hidden">
                        Chọn Phường / Xã
                      </option>

                      {wards?.map((x, index) => (
                        <option key={index} value={x.ward_name}>
                          {x.ward_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Line */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Số Nhà
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="line"
                      id="line"
                      onChange={(e) => {
                        setShippingInfomation({ ...shippingInfomation, [e.target.name]: e.target.value });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Giao Hangf */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroup>
                <RadioGroup.Label className="text-lg font-medium text-gray-900">Phương Thức Giào Hàng</RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <RadioGroup.Option className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-transparent ring-2 ring-indigo-500">
                    <>
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                            Giao Hàng Nhanh
                          </RadioGroup.Label>
                          <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                            4 - 10 ngày
                          </RadioGroup.Description>
                          {/* <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                {deliveryMethod.price}
                              </RadioGroup.Description> */}
                        </span>
                      </span>
                      <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                      <span
                        className={classNames(
                          'border',
                          'border-indigo-500',
                          'pointer-events-none absolute -inset-px rounded-lg'
                        )}
                        aria-hidden="true"
                      />
                    </>
                  </RadioGroup.Option>
                </div>
              </RadioGroup>
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Phương Thức Thanh Toán</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Loại Thanh Toán</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      name="gateway"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      value="CASH"
                      onChange={(e) => {
                        setPayment({ ...payment, [e.target.name]: e.target.value });
                      }}
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700 mr-5">
                      Thanh Toán Khi Nhận Hàng
                    </label>

                    <input
                      name="gateway"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      value="VNPAY"
                      onChange={(e) => {
                        setPayment({ ...payment, [e.target.name]: e.target.value });
                      }}
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">VNPAY</label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Thông Tin Đơn Hàng</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Sản Phẩm Trong Giỏ Hàng</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.map((x, index) => (
                  <li key={index} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img src={x.thumbnail} alt="#Error_Picture" className="w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <span className="font-medium text-gray-700 hover:text-gray-800">{x.name}</span>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{x.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{x.size}</p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">{formatMoney(x.unit_price)}</p>

                        <div className="ml-4">
                          <label htmlFor="quantity" className="sr-only">
                            Quantity
                          </label>
                          <span className="mr-1">x {x.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Tiền Sản Phẩm</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatMoney(getTotalPrice(cart))}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatMoney(shippingInfomation.fee)}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Tổng</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatMoney(getTotalPrice(cart) + shippingInfomation.fee)}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Đặt Hàng
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
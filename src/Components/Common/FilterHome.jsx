import { Fragment, useEffect, useState } from 'react';
import { Dialog, Disclosure, Menu, Popover, Transition, Listbox } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../utils';
import { APIClient } from '../../helper/api_helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchingCategory } from '../../redux/middleware';
import { getCategory } from '../../redux/selector';
import _ from 'lodash';

const sortOptions = [
  { name: 'Default', value: {} },
  { name: 'Thời Gian Tạo (Giảm Dần)', value: { sort_by: 'created_at', order: 'desc' } },
  { name: 'Giá Tiền (Giảm Dần)', value: { sort_by: 'base_cost', order: 'desc' } },
  { name: 'Thời Gian Tạo (Tăng Dần)', value: { sort_by: 'created_at', order: 'asc' } },
  { name: 'Giá Tiền (Tăng Dần)', value: { sort_by: 'base_cost', order: 'asc' } },
];

export default function FilterHome({ params, setParams }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { search, category, order } = params;
  const [currCategory, setCurrCategory] = useState('Phân Loại');
  const [currSort, setCurrSort] = useState('Sắp Xếp');
  const reduxCategory = useSelector(getCategory);
  const formatCategory = [{ id: '', name: 'Default' }, ...reduxCategory.map((x) => ({ id: x.id, name: x.name }))];

  useEffect(() => {
    dispatch(fetchingCategory());
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-2 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="py-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Xin Chào </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
            Hãy bỏ ưu tư phiền muộn và sản phẩm vào giỏ hàng để chúng tôi xử lý chúng nhé
            {/* <img className="w-10 h-10 object-contain" src={require('../../asset/image/cloud.png')} alt="" /> */}
          </p>
        </div>

        <section aria-labelledby="filter-heading" className="border-t border-gray-200 py-6">
          <div className="flex items-center justify-between">
            {/* filter name */}
            <div className="shadow-md rounded-lg">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="default-search"
                  name="name"
                  onChange={(e) => {
                    setParams({ ...params, name: e.target.value });
                  }}
                  className="block w-full px-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus-visible:border-gray-400 focus-visible:ring-white "
                  placeholder="Tìm Sản Phẩm"
                  // required
                />
              </div>
            </div>

            {/* category */}
            <div className="w-[150px] z-10">
              <Listbox
                value={currCategory}
                onChange={(e) => {
                  setParams({ ...params, category_id: e.id });
                  setCurrCategory(e.name);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{currCategory}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {formatCategory.map((x, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={x}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate text-left ${selected ? 'font-medium' : 'font-normal'}`}>
                                {x.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* sort by */}
            <div className="w-72 z-10">
              <Listbox
                value={currSort}
                onChange={(e) => {
                  setParams({ ...params, ...e.value });
                  setCurrSort(e.name);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{currSort}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className=" absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {sortOptions.map((x, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4  ${
                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={x}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block text-left truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {x.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
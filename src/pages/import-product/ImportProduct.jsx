import { SearchOutlined } from '@mui/icons-material';
import { Button, Image, Input, Space, Steps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import BillDetail from '../../Components/Admin/import/BillDetail';
import ProductStep from '../../Components/Admin/import/ProductStep';
import SupplierStep from '../../Components/Admin/import/SupplierStep';
import VariantModal from '../../Components/Admin/import/VariantModal';
import { fetchingProductVariant, fetchingProducts, fetchingSupplier } from '../../redux/middleware';
import { getProductVariant, getProducts, getSuppliers } from '../../redux/selector';

const ImportProduct = () => {
  const [activeStep, setActiveStep] = useState(0);
  // redux data: suppliers, products
  const suppliers = useSelector(getSuppliers).suppliers;
  const products = useSelector(getProducts).products;

  const productVariant = useSelector(getProductVariant);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [selectedVariantList, setSelectedVariantList] = useState([]);

  // Search
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResetStep = () => {
    setActiveStep(0);
    setSelectedVariantList([]);
  };

  // Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleResetFilter = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined fontSize="14" />}
            size="small"
            style={{
              width: 90,
              backgroundColor: '#1677ff',
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleResetFilter(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa hết
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  // Handle Select
  const handleSelectSupplier = (item) => {
    setSelectedSupplier(item);
    handleNext();
  };

  const handleSelectProduct = (item) => {
    dispatch(fetchingProductVariant(item.id));
    toggleVariantModal(true);
  };

  // Toggle Modal
  const toggleVariantModal = (show) => {
    setIsVariantModalOpen(show);
  };

  const handleChangeSelectedVariantList = (newVariantList) => {
    setSelectedVariantList(newVariantList);
  };

  // Column Table
  const supplierColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      render: (item) => (
        <Button type="primary" style={{ backgroundColor: '#1677ff' }} onClick={() => handleSelectSupplier(item)}>
          Chọn
        </Button>
      ),
    },
  ];

  const productColumn = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Giá',
      dataIndex: 'base_cost',
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
    },
    {
      title: 'Ảnh sản phẩm',
      render: (item) => <Image width={100} src={item.thumbnail} preview={false} />,
    },
    {
      title: 'Action',
      render: (item) => (
        <Button type="primary" style={{ backgroundColor: '#1677ff' }} onClick={() => handleSelectProduct(item)}>
          Chọn
        </Button>
      ),
    },
  ];

  const variantColumn = [
    {
      title: 'Size',
      key: 'size',
      render: (item) => {
        return item.variant_attributes[0].value;
      },
      sorter: (a, b) => a.variant_attributes[0].value.localeCompare(b.variant_attributes[0].value),
    },
    {
      title: 'Màu',
      key: 'color',
      render: (item) => {
        return item.variant_attributes[1].value;
      },
      sorter: (a, b) => a.variant_attributes[1].value.localeCompare(b.variant_attributes[1].value),
    },
    {
      title: 'Giá',
      key: 'price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trọng lượng',
      key: 'weight',
      dataIndex: 'weight',
    },
    {
      title: 'Hàng tồn kho',
      key: 'inventory',
      dataIndex: 'inventory',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchingSupplier());
    dispatch(fetchingProducts());
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Steps
        current={activeStep}
        items={[
          {
            title: 'Chọn nhà cung cấp',
          },
          {
            title: 'Chọn sản phẩm',
          },
          {
            title: 'Chi tiết đơn hàng',
          },
        ]}
        style={{ marginBottom: '20px' }}
      />
      {activeStep === 0 ? (
        <SupplierStep columns={supplierColumn} dataSource={suppliers} />
      ) : activeStep === 1 ? (
        <ProductStep
          columns={productColumn}
          dataSource={products}
          handleBack={handleBack}
          handleNext={handleNext}
          selectedVariantList={selectedVariantList}
        />
      ) : (
        <BillDetail
          handleBack={handleBack}
          selectedVariantList={selectedVariantList}
          handleChangeSelectedVariantList={handleChangeSelectedVariantList}
          selectedSupplier={selectedSupplier}
          resetStep={handleResetStep}
        />
      )}
      <VariantModal
        isOpen={isVariantModalOpen}
        toggleModal={toggleVariantModal}
        productVariant={productVariant}
        selectedVariantList={selectedVariantList}
        handleChangeSelectedVariantList={handleChangeSelectedVariantList}
      />
    </div>
  );
};

export default ImportProduct;

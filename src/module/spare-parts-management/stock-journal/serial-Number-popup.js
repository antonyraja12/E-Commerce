import {
  Button,
  Form,
  Modal,
  Row,
  Col,
  Select,
  Table,
  Typography,
  Space,
  Input,
} from "antd";
import { withForm } from "../../../utils/with-form";
import PageForm from "../../../utils/page/page-form";
import { Component } from "react";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
const { Option } = Select;
const { Text } = Typography;

class SerialNumberPopup extends PageForm {
  service = new InventoryConfigurationService();
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {}
  componentDidUpdate(prevState, prevProps) {
    if (this.props.form && this.props.uniquePrices) {
      this.props.form.setFieldsValue({
        price: this.props.uniquePrices[0],
      });
    }
    if (this.props.selectedData !== prevProps.selectedData) {
      this.updateSelectedRowKeys();
    }
  }
  updateSelectedRowKeys = () => {
    if (this.props.selectedData) {
      const serialNumbers = this.props.selectedData.map(
        (item) => item.serialNumber
      );
      this.setState({
        selectedRowKeys: serialNumbers,
      });
    }
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Modal
        destroyOnClose
        centered
        title={"Select Serial Number"}
        open={this.props.openModal}
        width={450}
        onCancel={this.props.onCancel}
        footer={[
          <Row justify={"space-between"} key="footer">
            <Button onClick={this.props.onCancel}>Cancel</Button>

            <Button
              disabled={this.props.DispatchPopupMode === "View"}
              type="primary"
              htmlType="submit"
              onClick={() =>
                this.props.okModalSave(
                  selectedRowKeys,
                  this.props.form.getFieldValue("price")
                )
              }
            >
              Save
            </Button>
          </Row>,
        ]}
      >
        {/* <Form layout="horizontal" colon={true}>
          <Form.Item label="Spare Name">
            <Input readOnly>
              {this.props.data[0]?.sparePart?.sparePartName}
            </Input>
          </Form.Item>
        </Form> */}
        <Form
          layout="horizontal"
          disabled={this.props.DispatchPopupMode === "View"}
          DispatchPopupModecolon={false}
          form={this.props.form}
        >
          {/* <Row>
            <Space>
              <Text>Spare Name : </Text>

              <Text>{this.props.data[0]?.sparePart?.sparePartName}</Text>
            </Space>
            <Space>
              <Text>Selected Count : </Text>

              <Text>{selectedRowKeys.length}</Text>
            </Space>
            <Space>
              <Text>Selected Count : </Text>

              <Text>{selectedRowKeys.length}</Text>
            </Space>
          </Row> */}
          <Row gutter={[10, 10]}>
            <Col lg={24}>
              <Form.Item label="Spare Name">
                <Input readOnly value={this.props?.sparePartName} />
              </Form.Item>
            </Col>
            <Col lg={12}>
              {this.props.mode && (
                <Form.Item label="Pending QTY">
                  <Input readOnly value={this.props.pendingQuantity} />
                </Form.Item>
              )}
            </Col>
            <Col lg={12}>
              <Form.Item label="Selected Rows">
                <Input readOnly value={selectedRowKeys.length} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item
            label="Price"
            name="price"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Select
              onSelect={this.props.onSelectPrice}
              placeholder="Sort by price"
            >
              {this.props.uniquePrices &&
                this.props.uniquePrices.map((price) => (
                  <Option key={price} value={price}>
                    {price}
                  </Option>
                ))}
            </Select>
          </Form.Item> */}
          <div style={{ marginTop: "10px" }}>
            <Table
              rowKey={"serialNumber"}
              rowSelection={rowSelection}
              columns={this.props.columns}
              dataSource={this.props.data}
              size="small"
            />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default withForm(SerialNumberPopup);

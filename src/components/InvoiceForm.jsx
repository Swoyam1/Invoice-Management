import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addInvoiceData,
  selectInvoiceDataList,
  updateInvoiceData,
} from "../redux/invoiceDataSlice";

const InvoiceForm = () => {
  const invoiceList = useSelector(selectInvoiceDataList);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isEditInvoice = location.pathname.includes("edit-invoice");
  const isCopyInvoice = location.pathname.includes("copy-invoice");

  const getEditInvoiceData = (invoiceId) => {
    //console.log(invoiceId);
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === invoiceId.toString()
      ) || null
    );
  };

  const generateRandomId = () => {
    const randomNumber = Math.floor(Math.random() * 100);

    return randomNumber;
  };

  const [formData, setFormData] = useState(
    isEditInvoice
      ? getEditInvoiceData(params.id)
      : isCopyInvoice && params.id
      ? {
          ...getEditInvoiceData(params.id),
          id: generateRandomId(),
          invoiceNumber: invoiceList.length + 1,
        }
      : {
          id: generateRandomId(),
          currency: "$",
          currentDate: "",
          invoiceNumber: invoiceList?.length + 1 || 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          items: [
            {
              id: 0,
              name: "",
              description: "",
              price: "1.00",
              quantity: 1,
            },
          ],
        }
  );

  useEffect(() => {
    setFormData({ ...formData, currentDate: new Date().toLocaleDateString() });
    handleCalculateTotal();
  }, []);

  const handleRowDel = (item) => {
    const filteredItems = formData.items.filter((i) => i.id !== item.id);
    setFormData({ ...formData, items: filteredItems });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;
      prevFormData.items.forEach((item) => {
        subTotal += parseFloat(item.price) * parseInt(item.quantity);
      });

      const calculatedSubTotal = subTotal.toFixed(2);
      const calculatedTaxAmount = (
        calculatedSubTotal *
        (prevFormData.taxRate / 100)
      ).toFixed(2);
      const calculatedDiscountAmount = (
        calculatedSubTotal *
        (prevFormData.discountRate / 100)
      ).toFixed(2);

      const calculatedTotal = (
        parseFloat(calculatedSubTotal) -
        parseFloat(calculatedDiscountAmount) +
        parseFloat(calculatedTaxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal,
        taxAmount: calculatedTaxAmount,
        discountAmount: calculatedDiscountAmount,
        total: calculatedTotal,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const { name, value } = evt.target;
    const updatedItems = formData.items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const editField = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (option) => {
    setFormData({ ...formData, currency: option.currency });
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleInvoiceAdd = () => {
    if (isEditInvoice) {
      console.log(typeof params.id);
      dispatch(
        updateInvoiceData({
          id: parseInt(params.id),
          updatedInvoiceData: formData,
        })
      );
    } else if (isCopyInvoice) {
      dispatch(addInvoiceData({ ...formData }));
    } else {
      dispatch(addInvoiceData(formData));
    }
    navigate("/");
  };

  const handleViewAllInvoices = () => {
    navigate("/");
  };

  return (
    <Form onSubmit={openModal}>
      <Button
        onClick={handleViewAllInvoices}
        variant="info"
        type="submit"
        className="d-block w-20 mt-3 mb-3"
      >
        View All Invoices
      </Button>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={editField}
                    style={{ maxWidth: "150px" }}
                    required="required"
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData.invoiceNumber}
                  name="invoiceNumber"
                  onChange={editField}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required="required"
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice to?"}
                  rows={3}
                  value={formData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={editField}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control
                  placeholder={"Email address"}
                  value={formData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={editField}
                  autoComplete="email"
                  required="required"
                />
                <Form.Control
                  placeholder={"Billing address"}
                  value={formData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={editField}
                  required="required"
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice from?"}
                  rows={3}
                  value={formData.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={editField}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control
                  placeholder={"Email address"}
                  value={formData.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={editField}
                  autoComplete="email"
                  required="required"
                />
                <Form.Control
                  placeholder={"Billing address"}
                  value={formData.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={editField}
                  required="required"
                />
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData.currency}
              items={formData.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {formData.currency}
                    {formData.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData.discountRate || 0}%)
                    </span>
                    {formData.currency}
                    {formData.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>
                    {formData.currency}
                    {formData.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {formData.currency}
                    {formData.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={editField}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <Button
              onClick={handleInvoiceAdd}
              variant="success"
              type="submit"
              className="d-block w-100 mt-3 mb-3"
            >
              {isEditInvoice ? "Update Invoice" : "Save Invoice"}
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
            />

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  onCurrencyChange({ currency: event.target.value })
                }
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Signapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={editField}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={editField}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;

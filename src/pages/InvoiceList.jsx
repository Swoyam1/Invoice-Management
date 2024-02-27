import React, { useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus, FaCopy } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // assuming you use React Router for navigation
import {
  addInvoiceData,
  deleteInvoiceData,
  selectInvoiceDataList,
} from "../redux/invoiceDataSlice";
import InvoiceModal from "../components/InvoiceModal";

const InvoiceList = () => {
  const navigate = useNavigate();
  const invoiceList = useSelector(selectInvoiceDataList);
  const dispatch = useDispatch();
  let invoiceListLength = invoiceList?.length;

  return (
    <Container>
      <h1>List of Invoices</h1>
      {!invoiceList || invoiceListLength === 0 ? (
        <div className="text-center my-4">
          <p>No invoices found.</p>
          <Button as={Link} to="/create-invoice" variant="primary">
            <FaPlus className="me-1" />
            Create Invoice
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-3 text-end">
            <Button as={Link} to="/create-invoice" variant="primary">
              <FaPlus className="me-1" />
              Create Invoice
            </Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Invoice No.</th>
                <th className="text-center">Item Name</th>
                <th className="text-center">Billing From</th>
                <th className="text-center">Billing To</th>
                <th className="text-center">Due Date</th>
                <th className="text-center">Total</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice) => (
                <InvoiceRowData
                  key={invoice.id}
                  invoice={invoice}
                  navigate={navigate}
                />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

const InvoiceRowData = ({ invoice, navigate }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleInvoiceEdit = () => {
    navigate(`/edit-invoice/${invoice.id}`);
  };

  const handleInvoiceDelete = (invoiceId) => {
    dispatch(deleteInvoiceData({ invoiceId }));
  };

  const handleInvoiceCopy = () => {
    navigate(`/copy-invoice/${invoice.id}`);
  };

  return (
    <tr>
      <td className="align-middle text-center">{invoice.invoiceNumber}</td>
      <td className="align-middle text-center">{invoice.items[0].name}</td>
      <td className="align-middle text-center">{invoice.billFrom}</td>
      <td className="align-middle text-center">{invoice.billTo}</td>
      <td className="align-middle text-center">{invoice.dateOfIssue}</td>
      <td className="align-middle text-center">
        {invoice.currency} {invoice.total}
      </td>
      <td>
        <div className="d-flex justify-content-center align-items-center">
          <Button variant="info" onClick={openModal} className="mx-1">
            <FaEye />
          </Button>
          <Button
            variant="warning"
            onClick={handleInvoiceEdit}
            className="mx-1"
          >
            <FaEdit />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleInvoiceDelete(invoice.id)}
            className="mx-1"
          >
            <FaTrash />
          </Button>
          <Button
            variant="primary"
            onClick={() => handleInvoiceCopy(invoice.id)}
            className="mx-1"
          >
            <FaCopy />
          </Button>
        </div>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
      />
    </tr>
  );
};
export default InvoiceList;

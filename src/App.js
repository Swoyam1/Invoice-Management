import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import InvoiceForm from "./components/InvoiceForm";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";

const App = () => {
  return (
    <Router>
      <div className="App d-flex flex-column align-items-center justify-content-center w-100">
        <Container>
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/edit-invoice/:id" element={<CreateInvoice />} />
            <Route path="/copy-invoice/:id" element={<CreateInvoice />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;

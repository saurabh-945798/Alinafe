import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Copy } from "lucide-react";
import Swal from "sweetalert2";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const plan = params.get("plan") || "Selected Plan";
  const amount = params.get("amount") || "";
  const period = params.get("period") || "per week";

  const bankDetails = {
    bank: "Punjab & Sindh Bank",
    branch:
      "12 A, Ahinsa Khand, Jaipuria Sunrise Green, Indirapuram Ghaziabad - 201010",
    accountNo: "08831000635465",
    ifsc: "PSIB0000883",
    email: "support@alinafe.in",
    phone: "+91 8920679937",
  };

  const copyText = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      Swal.fire({
        title: `${label} copied`,
        icon: "success",
        timer: 1100,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: "Copy failed",
        text: "Please copy manually",
        icon: "error",
      });
    }
  };

  return (
    <section className="min-h-screen pt-28 pb-16 px-5 bg-gradient-to-br from-[#ECFEFF] via-white to-[#F2FEFB] text-base md:text-lg">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#0F766E] font-semibold mb-5"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-3xl border border-[#0F766E]/15 shadow-xl p-6 md:p-8">
          <h1 className="text-4xl font-bold text-[#0F766E]">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete payment using bank transfer and share receipt on support email.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#0F766E]/5 border border-[#0F766E]/15">
            <p className="text-base text-gray-600">Selected plan</p>
            <h2 className="text-2xl font-semibold text-[#0F766E] capitalize">{plan}</h2>
            <p className="text-base text-gray-700">
              {amount ? `${amount} ${period}` : "Amount as per selected plan"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Bank"
              value={bankDetails.bank}
              onCopy={() => copyText("Bank", bankDetails.bank)}
            />
            <DetailRow
              label="Branch"
              value={bankDetails.branch}
              onCopy={() => copyText("Branch", bankDetails.branch)}
            />
            <DetailRow
              label="A/c No."
              value={bankDetails.accountNo}
              onCopy={() => copyText("Account number", bankDetails.accountNo)}
            />
            <DetailRow
              label="IFSC Code"
              value={bankDetails.ifsc}
              onCopy={() => copyText("IFSC Code", bankDetails.ifsc)}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#0F766E]/15 p-4 bg-white">
              <p className="text-sm text-gray-500 mb-1">Support Email</p>
              <p className="font-semibold text-[#0F766E] flex items-center gap-2">
                <Mail size={16} /> {bankDetails.email}
              </p>
            </div>
            <div className="rounded-2xl border border-[#0F766E]/15 p-4 bg-white">
              <p className="text-sm text-gray-500 mb-1">WHATSAPP </p>
              <p className="font-semibold text-[#0F766E] flex items-center gap-2">
                <Phone size={16} /> {bankDetails.phone}
              </p>
            </div>
          </div>

          <div className="mt-7 text-base text-gray-600 bg-[#F8FFFD] border border-[#0F766E]/10 rounded-2xl p-4">
            <p className="font-semibold text-[#0F766E] mb-2">Payment steps</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Transfer plan amount to the bank account above.</li>
              <li>Email payment screenshot/receipt to support@alinafe.in.</li>
              <li>Include your registered email and selected plan name.</li>
              <li>Our team will activate your premium plan after verification.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({ label, value, onCopy }) => (
  <div className="rounded-2xl border border-[#0F766E]/15 p-4 bg-white flex items-start justify-between gap-3">
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-[#0B4F4A] font-semibold break-words">{value}</p>
    </div>
    <button
      onClick={onCopy}
      className="shrink-0 p-2 rounded-xl bg-[#0F766E]/10 hover:bg-[#0F766E]/20 text-[#0F766E]"
      title={`Copy ${label}`}
    >
      <Copy size={16} />
    </button>
  </div>
);

export default Checkout;

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, HandCoins, MessageSquare, ShieldCheck, UserCheck } from "lucide-react";

const coreTips = [
  {
    title: "Meet in Public Places",
    desc: "Always meet in busy places like cafes, malls, or metro stations. Prefer daytime meetings and avoid isolated locations.",
    icon: ShieldCheck,
  },
  {
    title: "Use In-App Chat First",
    desc: "Keep conversation on Alinafe chat until trust is established. Avoid sharing personal details too early.",
    icon: MessageSquare,
  },
  {
    title: "Inspect Before Payment",
    desc: "Do not pay advance without verification. Check product condition, accessories, and ownership proof before paying.",
    icon: HandCoins,
  },
  {
    title: "Verify Seller or Buyer",
    desc: "Confirm profile details, ask relevant questions, and trust your judgement if anything looks suspicious.",
    icon: UserCheck,
  },
  {
    title: "Avoid Unsafe Payment Requests",
    desc: "Never share UPI PIN, OTP, card details, or remote access app permissions with anyone.",
    icon: AlertTriangle,
  },
];

const extraTips = [
  "For expensive items, take a friend with you.",
  "Test electronics and vehicle documents before final payment.",
  "Prefer digital transfer after physical verification.",
  "Report suspicious users or ads immediately.",
  "Keep transaction proof and chat history for reference.",
];

const SafetyTipsPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFC] to-[#ECFEFF] font-[Poppins]">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0E3C57]">
            Alinafe Safety Tips
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Use these safety guidelines for secure buying, selling, and chatting on Alinafe.
            Smart checks before every transaction prevent most risks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {coreTips.map((tip, idx) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl border border-[#0F766E]/15 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#E6F6F4] text-[#0F766E]">
                  <tip.icon size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#0E3C57]">{tip.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#0F766E]/15 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#0E3C57] mb-4">Quick Safety Checklist</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {extraTips.map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#14B8A6]" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyTipsPage;

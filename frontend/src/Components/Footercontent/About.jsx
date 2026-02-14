import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Globe,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const About = () => {
  return (
    <div
      className="pt-24"
      style={{
        fontFamily: 'Bahnschrift, "Segoe UI", Tahoma, Arial, sans-serif',
        fontSize: "18px",
      }}

    >

{/* ================= FOUNDER MESSAGE ================= */}
<section className="max-w-6xl mx-auto px-6 py-20">
  <div className="grid md:grid-cols-2 gap-12 items-stretch">

    {/* LEFT – IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center"
    >
      <div className="relative w-[320px] h-[320px]">
        <div className="absolute -bottom-6 left-1/2 h-16 w-56 -translate-x-1/2 rounded-full bg-[#0E9F9F]/20 blur-xl" />
        <img
          src="https://res.cloudinary.com/dxah12xl4/image/upload/v1768720593/WhatsApp_Image_2026-01-14_at_22.06.19_y2f5ow.jpg"
          alt="Founder of ALINAFE India"
          className="w-full h-full rounded-full shadow-lg object-cover"
        />
      <div className="mt-4 text-center">
        <p className="text-base font-bold text-[#1F2370] whitespace-nowrap">
          <span className="uppercase">Dinesh Chhabra</span> - Founder & CEO of Alinafe
        </p>
      </div>

      </div>
    </motion.div>

    {/* RIGHT – TEXT */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-[450px] flex flex-col justify-start max-w-[540px]"
    >
      <h4 className="text-lg md:text-xl uppercase tracking-widest text-gray-500 mb-2">
        Message from the Founder
      </h4>


      <h2 className="text-3xl font-bold text-[#0F766E] mb-4 leading-tight">
        A mission to empower communities through innovative solutions.
      </h2>

      <p className="text-gray-600 leading-relaxed mb-4 text-balance">
        Founded in 2025, ALINAFE India serves as a vital online marketplace
        for Indians, enabling MSMEs and individuals to list products and
        services while expanding their market reach.
      </p>

      <p className="text-gray-600 leading-relaxed mb-4 text-balance">
        At ALINAFE India, we believe in the power of innovation and
        collaboration to drive meaningful change. Since our inception,
        we have focused on building solutions that not only support
        buyer–seller needs but also uplift the communities we serve.
      </p>

      <p className="text-gray-600 leading-relaxed text-balance">
        By leveraging technology and strategic partnerships, our goal is
        to create a sustainable ecosystem that delivers long-term value
        for individuals, businesses, and society as a whole.
      </p>
    </motion.div>

  </div>
</section>



      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-[#ECFEFF] via-white to-[#E6FFFA] py-20 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0E9F9F]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-[#0F766E] mb-6 tracking-tight"
          >
            About ALINAFE India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-gray-600 text-lg max-w-4xl leading-relaxed text-left mx-auto"
          >
            ALINAFE India is a leading online classifieds platform enabling users
            across India to buy and sell new and used goods and services across
            multiple categories with ease, trust, and confidence.
          </motion.p>
        </div>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="text-2xl font-semibold text-[#0F766E] mb-4">
              India’s Growing Classifieds Marketplace
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              ALINAFE India is one of India’s fastest-growing networks of online
              trading platforms for buying and selling goods and services such
              as electronics, fashion items, furniture, household goods, cars,
              and bikes.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4">
              Consumers and dealers come to ALINAFE India — India’s rapidly
              expanding classifieds platform — to buy and sell used and new
              products across categories like Auto, Real Estate,
              Mobiles/Electronics, Furniture, and more.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Sellers can list multiple products and upload advertisements with
              images, short videos, titles, descriptions, and expected selling
              prices. Buyers can browse listings, contact sellers directly,
              negotiate, and complete purchases with confidence.
            </p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-[#0E9F9F]/10 text-left"
          >
            <h3 className="text-xl font-semibold text-[#0F766E] mb-4">
              What Makes ALINAFE India Unique
            </h3>

            <ul className="space-y-3 text-gray-600">
              {[
                "Strong and trusted brand presence",
                "Cutting-edge marketplace technology",
                "Huge organic traffic and reach",
                "Direct buyer–seller communication",
                "Support for individuals, dealers, and businesses",
                "Safe and easy trading experience",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#14B8A6] mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="bg-[#ECFEFF] py-16">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-[#0F766E] mb-4"
          >
            Our Mission
          </motion.h2>

          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
            At ALINAFE India, our mission is to make online buying and selling
            accessible to every Indian — irrespective of their location,
            background, or level of technical expertise.
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#0F766E] text-left mb-12">
          Our Values
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <ShieldCheck size={28} />,
              title: "Trust & Safety",
              desc: "We promote secure, transparent, and respectful trading.",
            },
            {
              icon: <Globe size={28} />,
              title: "Accessibility",
              desc: "Anyone, anywhere in India can trade with ease.",
            },
            {
              icon: <Lightbulb size={28} />,
              title: "Innovation",
              desc: "We use technology to make commerce faster and simpler.",
            },
            {
              icon: <Users size={28} />,
              title: "Community Impact",
              desc: "We support local businesses and livelihoods.",
            },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 text-left border border-[#0E9F9F]/10"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-[#0E9F9F]/15 text-[#0E9F9F]">
                {v.icon}
              </div>
              <h3 className="font-semibold mb-2 text-[#0F766E]">
                {v.title}
              </h3>
              <p className="text-gray-600 text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY ALINAFE ================= */}
      <section className="bg-gradient-to-r from-[#0E9F9F] to-[#14B8A6] text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <h2 className="text-3xl font-bold mb-6">
            Why Choose Alinafe.in?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Simple to use",
              "Affordable & accessible",
              "Wider market reach for sellers",
              "Convenient buying for customers",
              "Built for the Indian market",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-white mt-1" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg font-medium">
            Whether you’re clearing unused items, starting a business, farming,
            or searching for great deals — Alinafe.in is your marketplace.
          </p>

         <p className="mt-[45px] text-xl font-semibold italic text-center">
  SHAPE YOUR FUTURE AT ALINAFE INDIA !
</p>

        </div>
      </section>

      {/* ================= CONNECT ================= */}
      <section className="bg-[#ECFEFF] py-16">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <h2 className="text-3xl font-bold text-[#0F766E] mb-4">
            Connect With Us
          </h2>

          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
            Your insights and feedback make us better. Engage with us through
            comments, suggest topics you’re interested in, or simply share your
            stories with ALINAFE India. Let’s explore the future of classifieds
            together.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;

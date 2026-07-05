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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-left"
        >
          <h4 className="mb-2 text-lg uppercase tracking-widest text-gray-500 md:text-xl">
            Message from the Founder
          </h4>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-[#0F766E]">
            A mission to empower communities through innovative solutions.
          </h2>

          <p className="mb-4 text-balance leading-relaxed text-gray-600">
            Founded in 2025, ALINAFE India serves as a vital online marketplace
            for Indians, enabling MSMEs and individuals to list products and
            services while expanding their market reach.
          </p>

          <p className="mb-4 text-balance leading-relaxed text-gray-600">
            At ALINAFE India, we believe in the power of innovation and
            collaboration to drive meaningful change. Since our inception, we
            have focused on building solutions that not only support
            buyer-seller needs but also uplift the communities we serve.
          </p>

          <p className="text-balance leading-relaxed text-gray-600">
            By leveraging technology and strategic partnerships, our goal is to
            create a sustainable ecosystem that delivers long-term value for
            individuals, businesses, and society as a whole.
          </p>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFEFF] via-white to-[#E6FFFA] py-20">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#14B8A6]/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#0E9F9F]/20 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 text-4xl font-bold tracking-tight text-[#0F766E] md:text-5xl"
          >
            About ALINAFE India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mx-auto max-w-4xl text-left text-lg leading-relaxed text-gray-600"
          >
            ALINAFE India is a leading online classifieds platform enabling users
            across India to buy and sell new and used goods and services across
            multiple categories with ease, trust, and confidence.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="mb-4 text-2xl font-semibold text-[#0F766E]">
              India’s Growing Classifieds Marketplace
            </h2>

            <p className="mb-4 leading-relaxed text-gray-600">
              ALINAFE India is one of India’s fastest-growing networks of online
              trading platforms for buying and selling goods and services such
              as electronics, fashion items, furniture, household goods, cars,
              and bikes.
            </p>

            <p className="mb-4 leading-relaxed text-gray-600">
              Consumers and dealers come to ALINAFE India, India’s rapidly
              expanding classifieds platform, to buy and sell used and new
              products across categories like Auto, Real Estate,
              Mobiles/Electronics, Furniture, and more.
            </p>

            <p className="leading-relaxed text-gray-600">
              Sellers can list multiple products and upload advertisements with
              images, short videos, titles, descriptions, and expected selling
              prices. Buyers can browse listings, contact sellers directly,
              negotiate, and complete purchases with confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#0E9F9F]/10 bg-white p-8 text-left shadow-lg"
          >
            <h3 className="mb-4 text-xl font-semibold text-[#0F766E]">
              What Makes ALINAFE India Unique
            </h3>

            <ul className="space-y-3 text-gray-600">
              {[
                "Strong and trusted brand presence",
                "Cutting-edge marketplace technology",
                "Huge organic traffic and reach",
                "Direct buyer-seller communication",
                "Support for individuals, dealers, and businesses",
                "Safe and easy trading experience",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-1 text-[#14B8A6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#ECFEFF] py-16">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold text-[#0F766E]"
          >
            Our Mission
          </motion.h2>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
            At ALINAFE India, our mission is to make online buying and selling
            accessible to every Indian, irrespective of their location,
            background, or level of technical expertise.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="mb-12 text-left text-3xl font-bold text-[#0F766E]">
          Our Values
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              className="rounded-xl border border-[#0E9F9F]/10 bg-white p-6 text-left shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0E9F9F]/15 text-[#0E9F9F]">
                {v.icon}
              </div>
              <h3 className="mb-2 font-semibold text-[#0F766E]">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0E9F9F] to-[#14B8A6] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <h2 className="mb-6 text-3xl font-bold">Why Choose Alinafe.in?</h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Simple to use",
              "Affordable & accessible",
              "Wider market reach for sellers",
              "Convenient buying for customers",
              "Built for the Indian market",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-1 text-white" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg font-medium">
            Whether you’re clearing unused items, starting a business, farming,
            or searching for great deals, Alinafe.in is your marketplace.
          </p>

          <p className="mt-[45px] text-center text-xl font-semibold italic">
            SHAPE YOUR FUTURE AT ALINAFE INDIA !
          </p>
        </div>
      </section>

      <section className="bg-[#ECFEFF] py-16">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <h2 className="mb-4 text-3xl font-bold text-[#0F766E]">
            Connect With Us
          </h2>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
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

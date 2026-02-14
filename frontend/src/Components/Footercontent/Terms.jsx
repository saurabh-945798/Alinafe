import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div
      className="bg-[#ECFEFF] pt-24"
      style={{
        fontFamily: 'Bahnschrift, "Segoe UI", Tahoma, Arial, sans-serif',
        fontSize: "18px",
      }}
    >
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-white via-[#ECFEFF] to-[#E6FFFA] py-20 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2DD4BF]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#0F766E] mb-6"
          >
            Terms & Conditions
          </motion.h1>

          <p className="text-gray-600 text-lg max-w-4xl mx-auto">
            For Merchants, Service Providers and Sellers using ALINAFE India
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        {/* INTRO */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-[#0F766E]">
            TERMS AND CONDITIONS FOR MERCHANTS, SERVICE PROVIDERS AND SELLERS
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Welcome to <strong>ALINAFE India</strong>. These Terms of Use describe the terms and
            conditions applicable to your access and use of the website, mobile
            site, mobile application and other portals owned, operated, branded
            or made available by ALINAFE India(defined below) from time to time
            which relate to the ALINAFE India. This document is a legally
            binding agreement between you as the merchant or seller of products
            or service provider (referred to as “you”, “your” or “User”
            hereinafter) and the ALINAFE India entity determined in accordance
            with clause 2.1 below (referred to as “we”, “our” or “ALINAFE.in
            hereinafter).
          </p>
        </div>

    {/* ARTICLE 1 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    1. Application and Acceptance of the Terms
  </h2>

  <ol className="list-decimal pl-6 space-y-3 text-gray-700">
    <li>
      <span className="font-medium">Your access to and use of the ALINAFE India services, application, mobile site and website</span>{" "}
      in selling, advertising or listing your products and services is subject
      to the terms and conditions contained in this document. Listing, selling
      and advertising of products and services should be in line with the laws
      of the land guiding business transactions, whether online or offline, as
      expounded below.
      <br /><br />
      This document and such other rules and policies of the Sites are
      collectively referred to as the <strong>“Terms”</strong>. By accessing and
      using the Sites and Services, you agree to accept and be bound by the
      Terms. Please do not access or use the Services or the Sites if you do not
      accept all of the Terms.
    </li>
  </ol>
</div>


{/* ARTICLE 2 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    2. Provision of Services
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        To offer any kind of services on ALINAFE’s online platforms
      </span>{" "}
      you (whether an individual or an entity) must be registered as a
      merchant, seller or service provider on ALINAFE India marketing
      platforms including the Application, Mobile Site and Website.
      However, this shall not be a limiting factor, as your items or
      services may also be listed online on your behalf, subject to
      applicable agreements and approvals.
    </li>

    <li>
      You must register as a member on the Sites in order to access and
      use certain Services. Further, ALINAFE India reserves the right,
      without prior notice, to restrict access to or use of certain
      Services (or any features within the Services) to paying Users or
      subject such access to additional conditions, limitations or
      requirements as ALINAFE India may determine at its sole discretion.
    </li>
  </ol>
</div>


   {/* ARTICLE 3 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    3. Users Generally
  </h2>

  {/* 3.1 */}
  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        As a condition of your access to and use of the Sites or Services
      </span>{" "}
      you agree that you will comply with all applicable laws and regulations
      when accessing or using the Sites or Services by not listing the following
      products and services on ALINAFE India online marketing platforms.
    </li>
  </ol>

  {/* 3.2 */}
  <h3 className="font-semibold text-gray-800 mt-6">
    3.2 Illegal Drugs and Other Unregulated Medical Products
  </h3>

  <ol className="list-decimal pl-10 space-y-3 text-gray-700">
    <li>
      ALINAFE India vehemently forbids any and all listing or sale of narcotics,
      tranquilizers, psychotropic drugs, natural drugs, synthetic drugs,
      steroids and other controlled substances (including all drugs) prohibited
      by the laws of the Republic of India.
    </li>

    <li>
      The listing or sale of all drug substances is hereby prohibited on this
      online marketing platform.
    </li>

    <li>
      Drug paraphernalia, including all items that are primarily intended or
      designed for use in manufacturing, concealing, or using a controlled
      substance, are strictly forbidden on the Sites. Such items include, but
      are not limited to items used for the ingestion of illicit substances,
      including pipes such as water pipes, carburetor pipes, chamber pipes,
      ice pipes, bongs, and similar equipment.
    </li>

    <li>
      The listing or sale of packaging materials which may be utilized to
      contain controlled substances, materials conducive to smuggling, storing,
      trafficking, transporting or manufacturing illicit drugs (for example,
      marijuana grow lights), publications and other media providing information
      related to the production of illicit drugs is strictly prohibited.
    </li>
  </ol>

  {/* 3.3 */}
  <h3 className="font-semibold text-gray-800 mt-6">
    3.3 Illicit Firearms, Weapons and Ammunition
  </h3>

  <ol className="list-decimal pl-10 space-y-3 text-gray-700">
    <li>
      ALINAFE India prohibits the listing, selling or advertising of firearms,
      ammunition and other related weapons that are likely to cause physical
      harm or death. Trading of such items is strictly prohibited on this
      marketing platform. This prohibition also extends to advertising places,
      links or websites where such items may be accessed.
    </li>

    <li>
      No seller shall be allowed to list or sell any product or service which
      is suspicious in nature or whose legality cannot be clearly established
      or traced.
    </li>
  </ol>

  {/* 3.4 */}
  <h3 className="font-semibold text-gray-800 mt-6">
    3.4 Adult and Obscene Content
  </h3>

  <ol className="list-decimal pl-10 space-y-3 text-gray-700">
    <li>
      ALINAFE India will never allow, under any circumstances, the listing or
      posting of items or services that may be deemed obscene in any manner.
      Such products or services shall never be permitted on any ALINAFE India
      platform.
    </li>
  </ol>
</div>


      {/* ARTICLE 4 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    4. Transactions Between Buyers and Sellers
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        ALINAFE India marketing platform provides sellers, service providers and
        advertisers
      </span>{" "}
      the ability to conduct transactions through its website and mobile
      applications using approved payment methods, including but not limited to
      card-based payments and mobile money payments. However, where items are
      sold on behalf of companies, individuals or service providers, such
      transactions shall be governed by separate sales agreements which may
      include special terms and conditions applicable to the items or services
      being sold.
    </li>

    <li>
      Any sale-on-behalf contracts shall be duly executed between you (the
      merchant or service provider) and ALINAFE India, and where applicable, a
      third party, to ensure the smooth execution and fulfillment of
      contractual obligations relating to the purchase and sale of such items
      or services.
    </li>
  </ol>
</div>


     {/* ARTICLE 5 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    5. Commission
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        A commission shall be agreed upon
      </span>{" "}
      between ALINAFE India and the merchant or service provider at the time the
      product or service is being sold or listed, pursuant to the applicable
      sale or service agreement. Such commission may vary depending upon the
      nature, category and pricing structure of the product or service, and
      shall be calculated in accordance with the mutually agreed terms.
    </li>
  </ol>
</div>


      {/* ARTICLE 6 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    6. Termination
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        Unless terminated in accordance with the provisions of this Agreement,
      </span>{" "}
      the Agreement with the Merchant shall remain in full force and effect
      until the expiry of the applicable Contract Period.
    </li>

    <li>
      Either party may terminate this Agreement under the following
      circumstances:
      <ol className="list-decimal pl-6 mt-3 space-y-3">
        <li>
          The contract may be terminated if the products listed on the online
          shopping platform have run out of stock.
        </li>

        <li>
          The contract may also be terminated in the event that the products
          have been sold using means other than those agreed upon with
          ALINAFE India.
        </li>

        <li>
          The contract shall further be liable to termination upon the expiry
          of the agreed advertising period.
        </li>
      </ol>
    </li>
  </ol>
</div>


      {/* ARTICLE 7 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    7. Failure or Malfunction of Equipment
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        ALINAFE India shall not be responsible for any loss, damage or liability
      </span>{" "}
      arising from any failure, malfunction or delay of or in any mobile
      network, mobile phone, equipment, the internet, terminals or any
      supporting or shared networks, where such failure or malfunction results
      from circumstances beyond the reasonable control of ALINAFE India.
    </li>
  </ol>
</div>

{/* ARTICLE 8 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    8. General
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        This Agreement constitutes the entire agreement between the Parties
      </span>{" "}
      and supersedes any previous agreement or relationship of whatever nature
      between the Parties in respect of the Merchant Services.
    </li>

    <li>
      Except where this Agreement provides otherwise, the rights and remedies
      contained herein are cumulative and not exclusive of any rights or
      remedies provided by law. Any failure or delay by either Party to enforce
      any provision of this Agreement shall not constitute a waiver of such
      provision or any right arising therefrom.
    </li>

    <li>
      If any provision of this Agreement is declared by any judicial or other
      competent authority, or by an arbitrator appointed hereunder, to be void,
      voidable, illegal or otherwise unenforceable, the Parties shall amend such
      provision in a reasonable manner so as to give effect to the intention of
      the Parties. Failing such amendment, the offending provision shall be
      severed from this Agreement without affecting the validity or
      enforceability of the remaining provisions, which shall continue in full
      force and effect.
    </li>

    <li>
      Either Party shall be responsible for paying all expenses incurred by the
      other Party in recovering any amounts owed under this Agreement,
      including but not limited to legal fees, collection costs and tracing
      fees.
    </li>
  </ol>
</div>


       {/* ARTICLE 9 */}
<div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
  <h2 className="text-2xl font-semibold text-[#0F766E]">
    9. Jurisdiction and Arbitration
  </h2>

  <ol className="list-decimal pl-6 space-y-4 text-gray-700">
    <li>
      <span className="font-medium">
        This Agreement shall be governed by and construed in accordance with
        the laws of India.
      </span>
    </li>

    <li>
      Any dispute or disagreement arising between the Parties in relation to
      this Agreement shall, upon the request of one Party to the other, be
      referred to a senior manager of each Party. Such senior managers shall
      meet within fourteen (14) days of such notice, in good faith, to determine
      whether the matter is capable of resolution and, if so, to resolve the
      matter amicably.
    </li>

    <li>
      In the event that the senior managers fail to reach an agreement within
      a reasonable time and, in any event, within seven (7) days of their first
      meeting, the dispute shall be referred to a senior executive of each of
      the Parties. Such senior executives shall meet in good faith within
      fourteen (14) days of the dispute being referred to them, in order to
      determine whether the matter is capable of resolution and, if so, to
      resolve the dispute.
    </li>

    <li>
      This Clause and any discussions held between senior personnel pursuant to
      it shall not prejudice or restrict any right or remedy which any Party
      may ultimately have under applicable law or otherwise.
    </li>

    <li>
      If any dispute or disagreement cannot be settled in accordance with the
      foregoing provisions of this Clause, such dispute may, at the election of
      either Party, be referred to arbitration by issuance of a written notice
      of arbitration (“Notice of Arbitration”). The arbitration shall be
      conducted by a single arbitrator appointed by mutual agreement of the
      Parties, or failing such agreement, within thirty (30) days of service of
      the Notice of Arbitration, upon the application of either Party.
    </li>
  </ol>
</div>

      </section>
    </div>
  );
};

export default Terms;
